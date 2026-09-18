// CRT Shaders — Raw WebGL GLSL
// Vertex: fullscreen triangle  |  Fragment: CRT composite pass
// Written for ANGLE (Windows DirectX) compatibility

export const CRT_VERTEX = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

export const CRT_FRAGMENT = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

varying vec2 v_uv;

uniform sampler2D u_screen;
uniform float u_time;
uniform vec2 u_resolution;

uniform float u_curvature;
uniform float u_chromatic;
uniform float u_scanlineIntensity;
uniform float u_scanlineCount;
uniform float u_vignette;
uniform float u_flicker;
uniform float u_grain;
uniform float u_rollingBar;
uniform float u_brightness;
uniform float u_monochrome;
uniform vec3  u_tint;

vec2 curveUV(vec2 uv) {
  vec2 cu = uv * 2.0 - 1.0;
  vec2 off = vec2(cu.y * cu.y * cu.x, cu.x * cu.x * cu.y) * u_curvature;
  cu = cu + off;
  return cu * 0.5 + 0.5;
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 curved = curveUV(v_uv);

  float inBounds = step(0.0, curved.x) * step(curved.x, 1.0) * step(0.0, curved.y) * step(curved.y, 1.0);

  float ca = u_chromatic * 0.003;
  float r = texture2D(u_screen, curved + vec2(ca, 0.0)).r;
  float g = texture2D(u_screen, curved).g;
  float b = texture2D(u_screen, curved - vec2(ca, 0.0)).b;
  vec3 color = vec3(r, g, b);

  vec3 bloom = texture2D(u_screen, curved + vec2(0.003, 0.0)).rgb
             + texture2D(u_screen, curved - vec2(0.003, 0.0)).rgb
             + texture2D(u_screen, curved + vec2(0.0, 0.003)).rgb
             + texture2D(u_screen, curved - vec2(0.0, 0.003)).rgb;
  bloom = bloom * 0.25;
  color = color + bloom * 0.15;

  float scanVal = sin(curved.y * u_scanlineCount * 3.14159) * 0.5 + 0.5;
  scanVal = scanVal * scanVal;
  color = color * (1.0 - u_scanlineIntensity * (1.0 - scanVal));

  float bar = sin((curved.y + u_time * 0.08) * 6.28318) * 0.5 + 0.5;
  bar = bar * bar * bar * bar;
  bar = bar * bar;
  color = color + color * bar * u_rollingBar * 0.15;

  float flick = 1.0 - u_flicker * 0.03 * sin(u_time * 12.0);
  color = color * flick;

  float noise = hash(curved * u_resolution + vec2(u_time * 100.0));
  color = color + vec3((noise - 0.5) * u_grain * 0.15);

  vec2 vigUV = curved * 2.0 - 1.0;
  float vig = 1.0 - dot(vigUV, vigUV) * 0.5 * u_vignette;
  vig = max(vig, 0.0);
  color = color * vig;

  float lum = dot(color, vec3(0.299, 0.587, 0.114));
  vec3 mono = lum * u_tint;
  color = mix(color, mono, u_monochrome);

  color = color * u_brightness;

  float edgeFade = smoothstep(0.0, 0.015, curved.x) * smoothstep(0.0, 0.015, 1.0 - curved.x)
                 * smoothstep(0.0, 0.015, curved.y) * smoothstep(0.0, 0.015, 1.0 - curved.y);
  color = color * edgeFade;

  color = color * inBounds;

  gl_FragColor = vec4(color, 1.0);
}`;
