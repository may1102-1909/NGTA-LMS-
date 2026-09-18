"use client";

import { useEffect, useRef, useCallback } from "react";
import { createCrtRenderer, crtStyle, CRT_DEFAULTS, type CrtOptions } from "./crtRenderer";
import { CRT_VARIANTS, type CrtVariant } from "./crtScreens";

export { CRT_VARIANTS };
export type { CrtVariant };
export type CrtBackgroundProps = Partial<CrtOptions> & {
  className?: string;
  /** Called when the boot sequence animation is considered "complete" */
  onBootComplete?: () => void;
  /** Duration in seconds before firing onBootComplete (default: 2.8) */
  bootDuration?: number;
};

export function CrtBackground({
  className = "",
  onBootComplete,
  bootDuration = 2.8,
  ...props
}: CrtBackgroundProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const optionsRef = useRef<CrtOptions>({ ...CRT_DEFAULTS, ...props });
  const bootFiredRef = useRef(false);
  const startTimeRef = useRef(0);

  optionsRef.current = { ...CRT_DEFAULTS, ...props };

  const handleBootCheck = useCallback(
    (now: number) => {
      if (bootFiredRef.current || !onBootComplete) return;
      if (!startTimeRef.current) startTimeRef.current = now;
      const elapsed = (now - startTimeRef.current) / 1000;
      if (elapsed >= bootDuration) {
        bootFiredRef.current = true;
        onBootComplete();
      }
    },
    [onBootComplete, bootDuration]
  );

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return undefined;

    let renderer: ReturnType<typeof createCrtRenderer>;
    try {
      renderer = createCrtRenderer(host, canvas, () => optionsRef.current);
    } catch (err) {
      console.warn("CRT initialization error:", err);
      if (onBootComplete) onBootComplete();
      return undefined;
    }

    let frame = 0;
    let visible = true;

    const resize = () => {
      try {
        renderer.resize();
        renderer.render(performance.now());
      } catch (err) {
        console.warn("CRT resize/render error:", err);
      }
    };

    const tick = (now: number) => {
      try {
        renderer.render(now);
      } catch (err) {
        console.warn("CRT render tick error:", err);
      }
      handleBootCheck(now);
      frame = visible && !document.hidden ? requestAnimationFrame(tick) : 0;
    };

    const resizeObserver = new ResizeObserver(resize);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (visible && !frame) frame = requestAnimationFrame(tick);
      if (!visible && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });

    resizeObserver.observe(host);
    intersection.observe(host);
    resize();
    frame = requestAnimationFrame(tick);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      try {
        renderer.dispose();
      } catch {
        // ignore disposal errors
      }
    };
  }, [handleBootCheck, onBootComplete]);

  const options = optionsRef.current;

  return (
    <div
      ref={hostRef}
      className={`crt-background crt-${options.variant}${className ? ` ${className}` : ""}`}
      style={{
        background: crtStyle(options.variant).background,
        opacity: options.opacity,
        filter: `hue-rotate(${options.hue}deg) saturate(${options.saturation}) brightness(${options.brightness})`,
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
