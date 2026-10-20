"use client";

import { THEME_SWAP_EVENT } from "@/lib/theme-toggle";
import { useEffect, useRef } from "react";

/*
 * A pair of eyes that follow the pointer around the 404 page, drawn in the
 * same dots as the beach in the masthead.
 *
 * Everything sits on a 3px grid and edges are ordered-dithered against the
 * same 4 × 4 Bayer matrix: the ring of each eye is a single row of dots that
 * frays into a few scattered ones, and the pupil is a solid disc whose rim
 * breaks up the same way. Motion is held to the scene's 12 frames a second,
 * with the pupil stepping one grid cell at a time toward the pointer, and a
 * blink every few seconds. Under reduced motion the eyes simply look ahead.
 */

const P = 3;
const DOT = 2;
const FPS = 12;

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(
  (value) => (value + 0.5) / 16,
);
const bayer = (i: number, j: number) => BAYER[((j & 3) << 2) + (i & 3)];
const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

/** How far closed the lids are, frame by frame, through one blink. */
const BLINK = [0.4, 0.8, 1, 1, 0.7, 0.3];

type Palette = { ring: string; pupil: string };

function readPalette(): Palette {
  const style = getComputedStyle(document.documentElement);
  return {
    ring: style.getPropertyValue("--ink-faint").trim(),
    pupil: style.getPropertyValue("--brand").trim(),
  };
}

type EyeState = {
  canvas: HTMLCanvasElement;
  size: number;
  /** The pupil's offset from centre, in whole grid cells. */
  look: { i: number; j: number };
};

function drawEye(eye: EyeState, palette: Palette, lid: number) {
  const ctx = eye.canvas.getContext("2d");
  if (!ctx || eye.size === 0) return;
  const { size } = eye;
  const cells = Math.floor(size / P);
  const centre = Math.floor(cells / 2);
  const ringRadius = size / 2 - 12;
  const pupilRadius = size * 0.16;
  // Lids close from top and bottom toward the middle row.
  const open = ringRadius * (1 - lid) + (lid > 0 ? 0 : P);

  ctx.clearRect(0, 0, size, size);
  for (let j = 0; j < cells; j++) {
    for (let i = 0; i < cells; i++) {
      const x = (i - centre) * P;
      const y = (j - centre) * P;
      const threshold = bayer(i, j);

      // The ring: one solid row of dots, fraying for a cell either side.
      const fromRing = Math.abs(Math.hypot(x, y) - ringRadius);
      const ring = fromRing <= P / 2 ? 1 : fromRing < P * 1.6 ? 0.2 : 0;

      // The pupil: solid inside, dithered across its outermost cell or two.
      const px = x - eye.look.i * P;
      const py = y - eye.look.j * P;
      const fromPupil = pupilRadius - Math.hypot(px, py);
      const pupil = clamp(fromPupil / (P * 1.5) + 0.5);

      const lidded = lid >= 1 || Math.abs(y) > open;
      let colour: string | null = null;
      let alpha = 1;
      if (!lidded && pupil > 0 && threshold < pupil) {
        colour = palette.pupil;
      } else if (ring > 0 && threshold < ring) {
        colour = palette.ring;
        alpha = 0.55;
      } else if (lid >= 1 && Math.abs(y) < P / 2 && Math.abs(x) < ringRadius) {
        // Fully shut: the lids meet in a line across the eye.
        colour = palette.ring;
        alpha = 0.55;
      }
      if (!colour) continue;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = colour;
      ctx.fillRect(i * P + (P - DOT) / 2, j * P + (P - DOT) / 2, DOT, DOT);
    }
  }
  ctx.globalAlpha = 1;
}

function Eye({ canvasRef }: { canvasRef: (node: HTMLCanvasElement | null) => void }) {
  return (
    <div className="border-rule bg-paper relative size-24 border md:size-32">
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
    </div>
  );
}

export function NotFoundEyes() {
  const canvases = useRef<(HTMLCanvasElement | null)[]>([null, null]);

  useEffect(() => {
    const eyes: EyeState[] = canvases.current
      .filter((canvas): canvas is HTMLCanvasElement => canvas !== null)
      .map((canvas) => ({ canvas, size: 0, look: { i: 0, j: 0 } }));
    if (eyes.length === 0) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let palette = readPalette();
    let pointer: { x: number; y: number } | null = null;
    let blinkFrame = -1;
    let nextBlink = performance.now() + 2500 + Math.random() * 3000;

    const render = () => {
      const lid = blinkFrame >= 0 ? BLINK[blinkFrame] : 0;
      for (const eye of eyes) drawEye(eye, palette, lid);
    };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      for (const eye of eyes) {
        const { width } = eye.canvas.getBoundingClientRect();
        eye.size = width;
        eye.canvas.width = Math.round(width * ratio);
        eye.canvas.height = Math.round(width * ratio);
        const ctx = eye.canvas.getContext("2d");
        ctx?.setTransform(ratio, 0, 0, ratio, 0, 0);
      }
      render();
    };

    /** Moves each pupil one cell toward where it should be looking. */
    const step = () => {
      let moved = false;
      for (const eye of eyes) {
        let goal = { i: 0, j: 0 };
        if (pointer && !reduce.matches) {
          const rect = eye.canvas.getBoundingClientRect();
          const dx = pointer.x - (rect.left + rect.width / 2);
          const dy = pointer.y - (rect.top + rect.height / 2);
          const reach = Math.min(Math.hypot(dx, dy) * 0.1, rect.width * 0.16);
          const angle = Math.atan2(dy, dx);
          goal = {
            i: Math.round((Math.cos(angle) * reach) / P),
            j: Math.round((Math.sin(angle) * reach) / P),
          };
        }
        const di = Math.sign(goal.i - eye.look.i);
        const dj = Math.sign(goal.j - eye.look.j);
        if (di || dj) {
          eye.look = { i: eye.look.i + di, j: eye.look.j + dj };
          moved = true;
        }
      }
      return moved;
    };

    const tick = () => {
      if (document.hidden) return;
      let changed = step();
      if (!reduce.matches) {
        const now = performance.now();
        if (blinkFrame >= 0) {
          blinkFrame = blinkFrame + 1 < BLINK.length ? blinkFrame + 1 : -1;
          changed = true;
        } else if (now >= nextBlink) {
          blinkFrame = 0;
          nextBlink = now + 3500 + Math.random() * 4000;
          changed = true;
        }
      } else if (blinkFrame >= 0) {
        blinkFrame = -1;
        changed = true;
      }
      if (changed) render();
    };

    const onMove = (event: MouseEvent | TouchEvent) => {
      const point = "touches" in event ? event.touches[0] : event;
      if (point) pointer = { x: point.clientX, y: point.clientY };
    };

    // Repaint in the other theme's colours as soon as the theme changes,
    // including inside the toggle's view transition.
    const repaint = () => {
      palette = readPalette();
      render();
    };
    const themeObserver = new MutationObserver(repaint);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const sizeObserver = new ResizeObserver(resize);
    for (const eye of eyes) sizeObserver.observe(eye.canvas);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener(THEME_SWAP_EVENT, repaint);
    const timer = window.setInterval(tick, 1000 / FPS);

    return () => {
      window.clearInterval(timer);
      sizeObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener(THEME_SWAP_EVENT, repaint);
    };
  }, []);

  return (
    <div
      className="border-rule bg-paper mx-auto mb-8 flex w-fit items-center justify-center gap-4 border p-6 md:gap-6 md:p-8"
      aria-hidden="true"
    >
      <Eye canvasRef={(node) => void (canvases.current[0] = node)} />
      <Eye canvasRef={(node) => void (canvases.current[1] = node)} />
    </div>
  );
}
