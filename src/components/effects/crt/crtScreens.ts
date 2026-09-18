// CRT Screen Content Renderers — Canvas 2D
// Each variant draws its own screen content onto an offscreen canvas

export type CrtVariant = "terminal" | "cinematic" | "bluescreen" | "nintendo";
export const CRT_VARIANTS: CrtVariant[] = ["terminal", "cinematic", "bluescreen", "nintendo"];

// ── 5x7 Pixel Font Bitmap ──────────────────────────────────────────
// Hand-authored monospace font, each char is 5 columns × 7 rows
// Stored as 7 numbers per glyph (each number's low 5 bits = pixel row)
const FONT: Record<string, number[]> = {};

function defChar(ch: string, rows: number[]) { FONT[ch] = rows; }

// Letters
defChar("A", [0b01110, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001]);
defChar("B", [0b11110, 0b10001, 0b10001, 0b11110, 0b10001, 0b10001, 0b11110]);
defChar("C", [0b01110, 0b10001, 0b10000, 0b10000, 0b10000, 0b10001, 0b01110]);
defChar("D", [0b11100, 0b10010, 0b10001, 0b10001, 0b10001, 0b10010, 0b11100]);
defChar("E", [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b11111]);
defChar("F", [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b10000]);
defChar("G", [0b01110, 0b10001, 0b10000, 0b10111, 0b10001, 0b10001, 0b01111]);
defChar("H", [0b10001, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001]);
defChar("I", [0b01110, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b01110]);
defChar("J", [0b00111, 0b00010, 0b00010, 0b00010, 0b00010, 0b10010, 0b01100]);
defChar("K", [0b10001, 0b10010, 0b10100, 0b11000, 0b10100, 0b10010, 0b10001]);
defChar("L", [0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b11111]);
defChar("M", [0b10001, 0b11011, 0b10101, 0b10101, 0b10001, 0b10001, 0b10001]);
defChar("N", [0b10001, 0b10001, 0b11001, 0b10101, 0b10011, 0b10001, 0b10001]);
defChar("O", [0b01110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110]);
defChar("P", [0b11110, 0b10001, 0b10001, 0b11110, 0b10000, 0b10000, 0b10000]);
defChar("Q", [0b01110, 0b10001, 0b10001, 0b10001, 0b10101, 0b10010, 0b01101]);
defChar("R", [0b11110, 0b10001, 0b10001, 0b11110, 0b10100, 0b10010, 0b10001]);
defChar("S", [0b01111, 0b10000, 0b10000, 0b01110, 0b00001, 0b00001, 0b11110]);
defChar("T", [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100]);
defChar("U", [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110]);
defChar("V", [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01010, 0b00100]);
defChar("W", [0b10001, 0b10001, 0b10001, 0b10101, 0b10101, 0b10101, 0b01010]);
defChar("X", [0b10001, 0b10001, 0b01010, 0b00100, 0b01010, 0b10001, 0b10001]);
defChar("Y", [0b10001, 0b10001, 0b01010, 0b00100, 0b00100, 0b00100, 0b00100]);
defChar("Z", [0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b10000, 0b11111]);

// Numbers
defChar("0", [0b01110, 0b10011, 0b10101, 0b10101, 0b10101, 0b11001, 0b01110]);
defChar("1", [0b00100, 0b01100, 0b00100, 0b00100, 0b00100, 0b00100, 0b01110]);
defChar("2", [0b01110, 0b10001, 0b00001, 0b00010, 0b00100, 0b01000, 0b11111]);
defChar("3", [0b11111, 0b00010, 0b00100, 0b00010, 0b00001, 0b10001, 0b01110]);
defChar("4", [0b00010, 0b00110, 0b01010, 0b10010, 0b11111, 0b00010, 0b00010]);
defChar("5", [0b11111, 0b10000, 0b11110, 0b00001, 0b00001, 0b10001, 0b01110]);
defChar("6", [0b00110, 0b01000, 0b10000, 0b11110, 0b10001, 0b10001, 0b01110]);
defChar("7", [0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b01000, 0b01000]);
defChar("8", [0b01110, 0b10001, 0b10001, 0b01110, 0b10001, 0b10001, 0b01110]);
defChar("9", [0b01110, 0b10001, 0b10001, 0b01111, 0b00001, 0b00010, 0b01100]);

// Punctuation & symbols
defChar(" ", [0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000]);
defChar(".", [0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00100]);
defChar(",", [0b00000, 0b00000, 0b00000, 0b00000, 0b00100, 0b00100, 0b01000]);
defChar(":", [0b00000, 0b00100, 0b00000, 0b00000, 0b00000, 0b00100, 0b00000]);
defChar(";", [0b00000, 0b00100, 0b00000, 0b00000, 0b00100, 0b00100, 0b01000]);
defChar("!", [0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00000, 0b00100]);
defChar("?", [0b01110, 0b10001, 0b00001, 0b00010, 0b00100, 0b00000, 0b00100]);
defChar("-", [0b00000, 0b00000, 0b00000, 0b11111, 0b00000, 0b00000, 0b00000]);
defChar("_", [0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b11111]);
defChar("/", [0b00001, 0b00010, 0b00010, 0b00100, 0b01000, 0b01000, 0b10000]);
defChar("\\", [0b10000, 0b01000, 0b01000, 0b00100, 0b00010, 0b00010, 0b00001]);
defChar("[", [0b01110, 0b01000, 0b01000, 0b01000, 0b01000, 0b01000, 0b01110]);
defChar("]", [0b01110, 0b00010, 0b00010, 0b00010, 0b00010, 0b00010, 0b01110]);
defChar("(", [0b00010, 0b00100, 0b01000, 0b01000, 0b01000, 0b00100, 0b00010]);
defChar(")", [0b01000, 0b00100, 0b00010, 0b00010, 0b00010, 0b00100, 0b01000]);
defChar("{", [0b00110, 0b00100, 0b00100, 0b01000, 0b00100, 0b00100, 0b00110]);
defChar("}", [0b01100, 0b00100, 0b00100, 0b00010, 0b00100, 0b00100, 0b01100]);
defChar("<", [0b00001, 0b00010, 0b00100, 0b01000, 0b00100, 0b00010, 0b00001]);
defChar(">", [0b10000, 0b01000, 0b00100, 0b00010, 0b00100, 0b01000, 0b10000]);
defChar("+", [0b00000, 0b00100, 0b00100, 0b11111, 0b00100, 0b00100, 0b00000]);
defChar("=", [0b00000, 0b00000, 0b11111, 0b00000, 0b11111, 0b00000, 0b00000]);
defChar("*", [0b00000, 0b10101, 0b01110, 0b11111, 0b01110, 0b10101, 0b00000]);
defChar("#", [0b01010, 0b01010, 0b11111, 0b01010, 0b11111, 0b01010, 0b01010]);
defChar("@", [0b01110, 0b10001, 0b10111, 0b10101, 0b10111, 0b10000, 0b01110]);
defChar("$", [0b00100, 0b01111, 0b10100, 0b01110, 0b00101, 0b11110, 0b00100]);
defChar("%", [0b11001, 0b11010, 0b00010, 0b00100, 0b01000, 0b01011, 0b10011]);
defChar("&", [0b01000, 0b10100, 0b10100, 0b01000, 0b10101, 0b10010, 0b01101]);
defChar("'", [0b00100, 0b00100, 0b01000, 0b00000, 0b00000, 0b00000, 0b00000]);
defChar("\"", [0b01010, 0b01010, 0b01010, 0b00000, 0b00000, 0b00000, 0b00000]);
defChar("^", [0b00100, 0b01010, 0b10001, 0b00000, 0b00000, 0b00000, 0b00000]);
defChar("~", [0b00000, 0b00000, 0b01000, 0b10101, 0b00010, 0b00000, 0b00000]);
defChar("|", [0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100]);
defChar("`", [0b01000, 0b00100, 0b00010, 0b00000, 0b00000, 0b00000, 0b00000]);

// ████ block character for progress bar
defChar("\u2588", [0b11111, 0b11111, 0b11111, 0b11111, 0b11111, 0b11111, 0b11111]);

// Arrow →
defChar("\u2192", [0b00000, 0b00100, 0b00010, 0b11111, 0b00010, 0b00100, 0b00000]);

// Lowercase letters (simple 5x7)
defChar("a", [0b00000, 0b00000, 0b01110, 0b00001, 0b01111, 0b10001, 0b01111]);
defChar("b", [0b10000, 0b10000, 0b10110, 0b11001, 0b10001, 0b10001, 0b11110]);
defChar("c", [0b00000, 0b00000, 0b01110, 0b10000, 0b10000, 0b10001, 0b01110]);
defChar("d", [0b00001, 0b00001, 0b01101, 0b10011, 0b10001, 0b10001, 0b01111]);
defChar("e", [0b00000, 0b00000, 0b01110, 0b10001, 0b11111, 0b10000, 0b01110]);
defChar("f", [0b00110, 0b01001, 0b01000, 0b11100, 0b01000, 0b01000, 0b01000]);
defChar("g", [0b00000, 0b01111, 0b10001, 0b10001, 0b01111, 0b00001, 0b01110]);
defChar("h", [0b10000, 0b10000, 0b10110, 0b11001, 0b10001, 0b10001, 0b10001]);
defChar("i", [0b00100, 0b00000, 0b01100, 0b00100, 0b00100, 0b00100, 0b01110]);
defChar("j", [0b00010, 0b00000, 0b00110, 0b00010, 0b00010, 0b10010, 0b01100]);
defChar("k", [0b10000, 0b10000, 0b10010, 0b10100, 0b11000, 0b10100, 0b10010]);
defChar("l", [0b01100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b01110]);
defChar("m", [0b00000, 0b00000, 0b11010, 0b10101, 0b10101, 0b10001, 0b10001]);
defChar("n", [0b00000, 0b00000, 0b10110, 0b11001, 0b10001, 0b10001, 0b10001]);
defChar("o", [0b00000, 0b00000, 0b01110, 0b10001, 0b10001, 0b10001, 0b01110]);
defChar("p", [0b00000, 0b00000, 0b11110, 0b10001, 0b11110, 0b10000, 0b10000]);
defChar("q", [0b00000, 0b00000, 0b01101, 0b10011, 0b01111, 0b00001, 0b00001]);
defChar("r", [0b00000, 0b00000, 0b10110, 0b11001, 0b10000, 0b10000, 0b10000]);
defChar("s", [0b00000, 0b00000, 0b01110, 0b10000, 0b01110, 0b00001, 0b11110]);
defChar("t", [0b01000, 0b01000, 0b11100, 0b01000, 0b01000, 0b01001, 0b00110]);
defChar("u", [0b00000, 0b00000, 0b10001, 0b10001, 0b10001, 0b10011, 0b01101]);
defChar("v", [0b00000, 0b00000, 0b10001, 0b10001, 0b10001, 0b01010, 0b00100]);
defChar("w", [0b00000, 0b00000, 0b10001, 0b10001, 0b10101, 0b10101, 0b01010]);
defChar("x", [0b00000, 0b00000, 0b10001, 0b01010, 0b00100, 0b01010, 0b10001]);
defChar("y", [0b00000, 0b00000, 0b10001, 0b10001, 0b01111, 0b00001, 0b01110]);
defChar("z", [0b00000, 0b00000, 0b11111, 0b00010, 0b00100, 0b01000, 0b11111]);

const CHAR_W = 5;
const CHAR_H = 7;

/** Draw a single character using the pixel font */
function drawPixelChar(
  ctx: CanvasRenderingContext2D,
  ch: string,
  x: number, y: number,
  scale: number,
  color: string
) {
  const glyph = FONT[ch] || FONT["?"] || FONT[" "];
  if (!glyph) return;
  ctx.fillStyle = color;
  for (let row = 0; row < CHAR_H; row++) {
    const bits = glyph[row];
    for (let col = 0; col < CHAR_W; col++) {
      if (bits & (1 << (CHAR_W - 1 - col))) {
        ctx.fillRect(
          x + col * scale,
          y + row * scale,
          scale,
          scale
        );
      }
    }
  }
}

/** Draw a string using the pixel font */
function drawPixelText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number, y: number,
  scale: number,
  color: string,
  charSpacing = 1
) {
  const stepX = (CHAR_W + charSpacing) * scale;
  for (let i = 0; i < text.length; i++) {
    drawPixelChar(ctx, text[i], x + i * stepX, y, scale, color);
  }
}

/** Measure pixel text width */
function measurePixelText(text: string, scale: number, charSpacing = 1): number {
  return text.length * (CHAR_W + charSpacing) * scale - charSpacing * scale;
}

// ── Color constants ─────────────────────────────────────────────────
const GREEN   = "#33ff33";
const GREEN_DIM = "#1a9e1a";
const AMBER   = "#ffaa00";
const WHITE   = "#ffffff";
const CYAN    = "#00ffcc";

// ── NGTA Boot Terminal Screen ──────────────────────────────────────
interface BootLine {
  time: string;
  text: string;
  status: string;
  statusColor: string;
  textColor: string;
}

const BOOT_SEQUENCE: BootLine[] = [
  { time: "00.01s", text: "INITIALIZING NGTA CORE ENGINES...", status: "", statusColor: GREEN, textColor: GREEN },
  { time: "00.35s", text: "> Loading Autonomous Learning Orchestrator...........", status: "[OK]", statusColor: GREEN, textColor: GREEN_DIM },
  { time: "00.62s", text: "> Mounting Course Storefront & DRM Protection..........", status: "[OK]", statusColor: GREEN, textColor: GREEN_DIM },
  { time: "00.89s", text: "> Syncing Live Class & Consultation Calendars..........", status: "[OK]", statusColor: GREEN, textColor: GREEN_DIM },
  { time: "01.12s", text: "> Restoring Learner Gamification & Leaderboards.........", status: "[OK]", statusColor: GREEN, textColor: GREEN_DIM },
  { time: "01.45s", text: "> Verifying Automated Certificate Engine..............", status: "[OK]", statusColor: GREEN, textColor: GREEN_DIM },
  { time: "01.80s", text: "SYSTEM READY. ACCESS GRANTED.", status: "", statusColor: AMBER, textColor: AMBER },
];

const PROGRESS_BAR_FULL = "\u2588".repeat(32);

// ── Screen Renderers ────────────────────────────────────────────────

/**
 * Terminal screen — NGTA boot sequence
 * @param seconds - elapsed time in seconds
 */
export function drawTerminalScreen(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  seconds: number
): boolean {
  ctx.clearRect(0, 0, w, h);

  // Background
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, w, h);

  // Scale factor based on canvas size
  const scale = Math.max(1, Math.floor(Math.min(w / 420, h / 280)));
  const lineH = (CHAR_H + 3) * scale;
  const marginX = 12 * scale;
  let cursorY = 10 * scale;

  // Header
  drawPixelText(ctx, "NGTA MAINFRAME  v2.0.1", marginX, cursorY, scale, GREEN);
  cursorY += lineH;
  drawPixelText(ctx, "NEXTGEN TESTING ACADEMY  LMS ENGINE", marginX, cursorY, scale, GREEN_DIM);
  cursorY += lineH * 1.8;

  // Boot animation — reveal lines progressively
  // Total animation spans ~1.8 seconds of "boot time", mapped to real elapsed seconds
  // Each line reveals based on its timestamp
  const bootSpeed = 1.0; // 1:1 real-time mapping
  const elapsed = seconds * bootSpeed;
  let anyChanged = false;

  for (let i = 0; i < BOOT_SEQUENCE.length; i++) {
    const line = BOOT_SEQUENCE[i];
    const lineTime = parseFloat(line.time);

    if (elapsed < lineTime) {
      anyChanged = true;
      break; // Haven't reached this line yet
    }

    // Draw timestamp
    const timeStr = `[${line.time}]`;
    drawPixelText(ctx, timeStr, marginX, cursorY, scale, GREEN_DIM);

    // Draw text after timestamp
    const textX = marginX + measurePixelText(timeStr + " ", scale);
    drawPixelText(ctx, line.text, textX, cursorY, scale, line.textColor);

    // Draw status
    if (line.status) {
      const statusX = textX + measurePixelText(line.text + " ", scale);
      drawPixelText(ctx, line.status, statusX, cursorY, scale, line.statusColor);
    }

    cursorY += lineH;

    // If this line was just revealed, we're still animating
    if (elapsed - lineTime < 0.1) {
      anyChanged = true;
    }
  }

  // Progress bar — appears after all boot lines are done
  const allLinesDone = elapsed >= 1.8;
  if (allLinesDone) {
    cursorY += lineH * 0.5;

    // Progress fills from 0% to 100% over ~0.5 seconds after boot finishes
    const barProgress = Math.min(1, (elapsed - 1.8) / 0.5);
    const filledCount = Math.floor(barProgress * 32);
    const barStr = "\u2588".repeat(filledCount) + " ".repeat(32 - filledCount);
    const pctStr = `${Math.floor(barProgress * 100)}%`;

    drawPixelText(ctx, "[", marginX, cursorY, scale, GREEN_DIM);
    const barX = marginX + measurePixelText("[ ", scale) - measurePixelText(" ", scale);

    // Draw filled portion in bright green
    if (filledCount > 0) {
      drawPixelText(ctx, barStr.substring(0, filledCount), barX, cursorY, scale, GREEN);
    }

    const closeX = barX + measurePixelText(PROGRESS_BAR_FULL, scale);
    drawPixelText(ctx, `] ${pctStr}`, closeX, cursorY, scale, GREEN_DIM);

    if (barProgress < 1) {
      anyChanged = true;
    }

    // Blinking cursor after completion
    if (barProgress >= 1) {
      cursorY += lineH * 1.5;
      const blink = Math.floor(seconds * 2.5) % 2 === 0;
      if (blink) {
        drawPixelText(ctx, "_", marginX, cursorY, scale, GREEN);
      }
      anyChanged = true; // cursor always blinks
    }
  } else {
    anyChanged = true;
  }

  return anyChanged;
}

/**
 * Cinematic screen — monotone film leader countdown
 */
export function drawCinematicScreen(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  seconds: number
): boolean {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#050505";
  ctx.fillRect(0, 0, w, h);

  const scale = Math.max(2, Math.floor(Math.min(w / 160, h / 120)));
  const cx = w / 2;
  const cy = h / 2;

  // Countdown number
  const count = Math.max(1, 8 - Math.floor(seconds % 8));
  const numStr = count.toString();
  const numW = measurePixelText(numStr, scale * 4);
  drawPixelText(ctx, numStr, cx - numW / 2, cy - CHAR_H * scale * 2, scale * 4, "#cccccc");

  // Crosshair circle
  ctx.strokeStyle = "#666666";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, Math.min(w, h) * 0.3, 0, Math.PI * 2);
  ctx.stroke();

  // Cross lines
  ctx.beginPath();
  ctx.moveTo(cx, cy - h * 0.4);
  ctx.lineTo(cx, cy + h * 0.4);
  ctx.moveTo(cx - w * 0.4, cy);
  ctx.lineTo(cx + w * 0.4, cy);
  ctx.stroke();

  // Film frame markers
  const markerScale = Math.max(1, scale / 2);
  drawPixelText(ctx, "NGTA", 8, 8, markerScale, "#444444");
  drawPixelText(ctx, "35MM", w - measurePixelText("35MM", markerScale) - 8, 8, markerScale, "#444444");

  return true;
}

/**
 * Blue screen — signal fault with noise
 */
export function drawBlueScreen(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  seconds: number
): boolean {
  ctx.clearRect(0, 0, w, h);

  // Blue background
  ctx.fillStyle = "#0000aa";
  ctx.fillRect(0, 0, w, h);

  // Noise bands
  const bandCount = 3 + Math.floor(Math.sin(seconds * 2) * 2);
  for (let i = 0; i < bandCount; i++) {
    const bandY = ((seconds * 80 + i * 120) % (h + 40)) - 20;
    const bandH = 8 + Math.random() * 20;
    ctx.fillStyle = `rgba(255, 255, 255, ${0.05 + Math.random() * 0.1})`;
    ctx.fillRect(0, bandY, w, bandH);
  }

  // Random noise pixels
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;
  const noiseAmount = 0.02;
  for (let i = 0; i < data.length; i += 4) {
    if (Math.random() < noiseAmount) {
      const v = Math.random() * 60;
      data[i] += v;
      data[i + 1] += v;
      data[i + 2] += v;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  // Error text
  const scale = Math.max(1, Math.floor(Math.min(w / 400, h / 240)));
  const marginX = 20 * scale;
  let y = h * 0.3;
  const lineH = (CHAR_H + 4) * scale;

  drawPixelText(ctx, "SIGNAL FAULT", marginX, y, scale * 2, WHITE);
  y += lineH * 3;
  drawPixelText(ctx, "NO CARRIER DETECTED", marginX, y, scale, "#aaaaff");
  y += lineH;
  drawPixelText(ctx, "CHECK INPUT SOURCE AND RETRY", marginX, y, scale, "#aaaaff");
  y += lineH * 2;

  // Blinking reconnect
  if (Math.floor(seconds * 1.5) % 2 === 0) {
    drawPixelText(ctx, "ATTEMPTING RECONNECT...", marginX, y, scale, WHITE);
  }

  return true;
}

/**
 * Nintendo / 8-bit console title screen
 */
export function drawNintendoScreen(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  seconds: number
): boolean {
  ctx.clearRect(0, 0, w, h);

  // Dark background
  ctx.fillStyle = "#000010";
  ctx.fillRect(0, 0, w, h);

  // Stars
  const starCount = 40;
  for (let i = 0; i < starCount; i++) {
    const sx = ((i * 137 + 51) % w);
    const sy = ((i * 97 + 23 + seconds * 10) % h);
    const brightness = 0.3 + 0.7 * Math.abs(Math.sin(seconds * 2 + i));
    ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
    ctx.fillRect(sx, sy, 2, 2);
  }

  const scale = Math.max(2, Math.floor(Math.min(w / 260, h / 200)));
  const cx = w / 2;

  // Title
  const title = "NGTA";
  const titleW = measurePixelText(title, scale * 3);
  const titleY = h * 0.25;

  // Rainbow color cycle for title
  const hue = (seconds * 60) % 360;
  const titleColor = `hsl(${hue}, 100%, 60%)`;
  drawPixelText(ctx, title, cx - titleW / 2, titleY, scale * 3, titleColor);

  // Subtitle
  const sub = "TESTING ACADEMY";
  const subW = measurePixelText(sub, scale);
  drawPixelText(ctx, sub, cx - subW / 2, titleY + CHAR_H * scale * 3 + scale * 6, scale, "#aaaaaa");

  // Press Start blink
  if (Math.floor(seconds * 1.8) % 2 === 0) {
    const press = "PRESS START";
    const pressW = measurePixelText(press, scale);
    drawPixelText(ctx, press, cx - pressW / 2, h * 0.7, scale, WHITE);
  }

  // Copyright line
  const copy = "(C) 2026 NGTA LMS";
  const copyW = measurePixelText(copy, scale * 0.8);
  drawPixelText(ctx, copy, cx - copyW / 2, h * 0.88, Math.max(1, Math.floor(scale * 0.8)), "#555555");

  return true;
}

// ── Screen selector ─────────────────────────────────────────────────
export const CRT_SCREENS: Record<CrtVariant, (
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  seconds: number
) => boolean> = {
  terminal: drawTerminalScreen,
  cinematic: drawCinematicScreen,
  bluescreen: drawBlueScreen,
  nintendo: drawNintendoScreen,
};
