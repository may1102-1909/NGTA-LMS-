// CRT Renderer — Raw WebGL + Canvas 2D composite
// Manages GL context, shaders, textures, geometry, and per-frame rendering

import { CRT_VERTEX, CRT_FRAGMENT } from "./crtShaders";
import { CRT_SCREENS, type CrtVariant } from "./crtScreens";

export { CRT_SCREENS };
export type { CrtVariant };

// ── Variant visual presets ──────────────────────────────────────────
export interface CrtPreset {
  curvature: number;
  chromatic: number;
  scanlineIntensity: number;
  scanlineCount: number;
  vignette: number;
  flicker: number;
  grain: number;
  rollingBar: number;
  brightness: number;
  monochrome: number;
  tint: [number, number, number];
  background: string;
}

const PRESETS: Record<CrtVariant, CrtPreset> = {
  terminal: {
    curvature: 0.08,
    chromatic: 1.2,
    scanlineIntensity: 0.35,
    scanlineCount: 300,
    vignette: 0.6,
    flicker: 0.6,
    grain: 0.4,
    rollingBar: 0.2,
    brightness: 1.1,
    monochrome: 0.95,
    tint: [0.2, 1.0, 0.3],
    background: "#040804",
  },
  cinematic: {
    curvature: 0.06,
    chromatic: 0.8,
    scanlineIntensity: 0.5,
    scanlineCount: 240,
    vignette: 0.8,
    flicker: 1.0,
    grain: 0.8,
    rollingBar: 0.5,
    brightness: 0.9,
    monochrome: 1.0,
    tint: [0.9, 0.85, 0.75],
    background: "#060504",
  },
  bluescreen: {
    curvature: 0.05,
    chromatic: 2.0,
    scanlineIntensity: 0.3,
    scanlineCount: 260,
    vignette: 0.5,
    flicker: 1.5,
    grain: 1.0,
    rollingBar: 1.0,
    brightness: 1.0,
    monochrome: 0.0,
    tint: [0.3, 0.4, 1.0],
    background: "#000208",
  },
  nintendo: {
    curvature: 0.1,
    chromatic: 0.5,
    scanlineIntensity: 0.25,
    scanlineCount: 180,
    vignette: 0.5,
    flicker: 0.3,
    grain: 0.2,
    rollingBar: 0.0,
    brightness: 1.2,
    monochrome: 0.0,
    tint: [1.0, 1.0, 1.0],
    background: "#020204",
  },
};

// ── Public options ──────────────────────────────────────────────────
export interface CrtOptions {
  variant: CrtVariant;
  speed: number;
  motion: number;
  hue: number;
  saturation: number;
  brightness: number;
  opacity: number;
}

export const CRT_DEFAULTS: CrtOptions = {
  variant: "terminal",
  speed: 1,
  motion: 1,
  hue: 0,
  saturation: 1,
  brightness: 1,
  opacity: 1,
};

export function crtStyle(variant: CrtVariant) {
  return { background: PRESETS[variant].background };
}

// ── Renderer factory ────────────────────────────────────────────────
export interface CrtRenderer {
  resize(): void;
  render(now: number): void;
  dispose(): void;
}

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const s = gl.createShader(type);
  if (!s) throw new Error("Failed to create shader");
  gl.shaderSource(s, src.trim());
  gl.compileShader(s);
  const status = gl.getShaderParameter(s, gl.COMPILE_STATUS);
  if (!status) {
    const info = gl.getShaderInfoLog(s) || "Driver failed to provide error log";
    gl.deleteShader(s);
    throw new Error(`Shader compile error: ${info}`);
  }
  return s;
}

function initCanvas2DRenderer(
  host: HTMLElement,
  canvas: HTMLCanvasElement,
  getOptions: () => CrtOptions
): CrtRenderer {
  const ctx = canvas.getContext("2d");
  let startTime = 0;
  let canvasW = 0;
  let canvasH = 0;
  let disposed = false;

  function resize() {
    if (disposed) return;
    const rect = host.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.min(Math.round(rect.width * dpr), 1920);
    const h = Math.min(Math.round(rect.height * dpr), 1920);
    if (w === canvasW && h === canvasH) return;
    canvasW = w;
    canvasH = h;
    canvas.width = w;
    canvas.height = h;
  }

  function render(now: number) {
    if (disposed || !ctx) return;
    if (!startTime) startTime = now;

    const opts = getOptions();
    const seconds = ((now - startTime) / 1000) * opts.speed;
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    const screenDraw = CRT_SCREENS[opts.variant];
    if (screenDraw) {
      screenDraw(ctx, canvasW, canvasH, reducedMotion ? 999 : seconds);
    }
  }

  function dispose() {
    disposed = true;
  }

  return { resize, render, dispose };
}

function initWebGLRenderer(
  host: HTMLElement,
  canvas: HTMLCanvasElement,
  getOptions: () => CrtOptions
): CrtRenderer {
  // GL setup
  const glContext =
    canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      premultipliedAlpha: false,
    }) ||
    canvas.getContext("experimental-webgl");

  if (!glContext) throw new Error("WebGL not available");
  const gl = glContext as WebGLRenderingContext;
  if (gl.isContextLost()) throw new Error("WebGL context lost");

  // Offscreen canvas for screen content
  const textCanvas = document.createElement("canvas");
  const textCtx = textCanvas.getContext("2d", { willReadFrequently: false })!;

  // Compile program
  const vs = compileShader(gl, gl.VERTEX_SHADER, CRT_VERTEX);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, CRT_FRAGMENT);
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    const linkInfo = gl.getProgramInfoLog(prog);
    console.error("Program link log:", linkInfo);
    throw new Error(`Program link error: ${linkInfo}`);
  }
  gl.useProgram(prog);

  // Fullscreen triangle geometry (3 vertices cover entire viewport)
  const posLoc = gl.getAttribLocation(prog, "a_position");
  const posBuf = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW
  );
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  // Screen texture
  const tex = gl.createTexture()!;
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  // Uniform locations
  const uScreen = gl.getUniformLocation(prog, "u_screen");
  const uTime = gl.getUniformLocation(prog, "u_time");
  const uResolution = gl.getUniformLocation(prog, "u_resolution");
  const uCurvature = gl.getUniformLocation(prog, "u_curvature");
  const uChromatic = gl.getUniformLocation(prog, "u_chromatic");
  const uScanlineIntensity = gl.getUniformLocation(prog, "u_scanlineIntensity");
  const uScanlineCount = gl.getUniformLocation(prog, "u_scanlineCount");
  const uVignette = gl.getUniformLocation(prog, "u_vignette");
  const uFlicker = gl.getUniformLocation(prog, "u_flicker");
  const uGrain = gl.getUniformLocation(prog, "u_grain");
  const uRollingBar = gl.getUniformLocation(prog, "u_rollingBar");
  const uBrightness = gl.getUniformLocation(prog, "u_brightness");
  const uMonochrome = gl.getUniformLocation(prog, "u_monochrome");
  const uTint = gl.getUniformLocation(prog, "u_tint");

  gl.uniform1i(uScreen, 0);

  // State
  let startTime = 0;
  let canvasW = 0;
  let canvasH = 0;
  let disposed = false;

  // Handle WebGL context loss
  const handleContextLost = (e: Event) => { e.preventDefault(); };
  const handleContextRestored = () => { /* splash page — no re-init needed */ };
  canvas.addEventListener("webglcontextlost", handleContextLost);
  canvas.addEventListener("webglcontextrestored", handleContextRestored);

  function resize() {
    if (disposed) return;
    const rect = host.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.min(Math.round(rect.width * dpr), 1920);
    const h = Math.min(Math.round(rect.height * dpr), 1920);
    if (w === canvasW && h === canvasH) return;
    canvasW = w;
    canvasH = h;
    canvas.width = w;
    canvas.height = h;
    textCanvas.width = w;
    textCanvas.height = h;
    gl.viewport(0, 0, w, h);
  }

  function render(now: number) {
    if (disposed || gl.isContextLost()) return;
    if (!startTime) startTime = now;

    const opts = getOptions();
    const preset = PRESETS[opts.variant];
    const seconds = ((now - startTime) / 1000) * opts.speed;
    const motion = opts.motion;

    // Check reduced-motion preference
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    // Draw screen content onto offscreen canvas
    const screenDraw = CRT_SCREENS[opts.variant];
    if (screenDraw) {
      screenDraw(textCtx, canvasW, canvasH, reducedMotion ? 999 : seconds);
    }

    // Upload texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);

    // Set uniforms
    gl.uniform1f(uTime, reducedMotion ? 0 : seconds * motion);
    gl.uniform2f(uResolution, canvasW, canvasH);
    gl.uniform1f(uCurvature, preset.curvature);
    gl.uniform1f(uChromatic, preset.chromatic);
    gl.uniform1f(uScanlineIntensity, preset.scanlineIntensity);
    // Pin scanline count to CSS pixels so look survives DPR scaling
    const cssH = host.getBoundingClientRect().height;
    gl.uniform1f(uScanlineCount, preset.scanlineCount * (canvasH / cssH));
    gl.uniform1f(uVignette, preset.vignette);
    gl.uniform1f(uFlicker, reducedMotion ? 0 : preset.flicker * motion);
    gl.uniform1f(uGrain, reducedMotion ? 0 : preset.grain * motion);
    gl.uniform1f(uRollingBar, reducedMotion ? 0 : preset.rollingBar * motion);
    gl.uniform1f(uBrightness, preset.brightness);
    gl.uniform1f(uMonochrome, preset.monochrome);
    gl.uniform3f(uTint, preset.tint[0], preset.tint[1], preset.tint[2]);

    // Draw fullscreen triangle
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    canvas.removeEventListener("webglcontextlost", handleContextLost);
    canvas.removeEventListener("webglcontextrestored", handleContextRestored);
    gl.deleteTexture(tex);
    gl.deleteBuffer(posBuf);
    gl.deleteProgram(prog);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    // Lose context
    const ext = gl.getExtension("WEBGL_lose_context");
    if (ext) ext.loseContext();
  }

  return { resize, render, dispose };
}

export function createCrtRenderer(
  host: HTMLElement,
  canvas: HTMLCanvasElement,
  getOptions: () => CrtOptions
): CrtRenderer {
  try {
    return initWebGLRenderer(host, canvas, getOptions);
  } catch (err) {
    console.warn("CRT WebGL renderer initialization failed; falling back to 2D Canvas:", err);
    return initCanvas2DRenderer(host, canvas, getOptions);
  }
}
