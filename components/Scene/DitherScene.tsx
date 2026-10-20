"use client";

import {
  centreOf,
  THEME_SWAP_EVENT,
  THEME_SWAP_MS,
  useThemeToggle,
} from "@/lib/theme-toggle";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import styles from "./scene.module.css";

/*
 * The south coast of Sri Lanka, drawn in dots.
 *
 * A leaning palm and a younger one beside it, an oruwa (the outrigger canoe)
 * pulled up on the sand, rocks at the water's edge, a pair of dolphins
 * leaping now and then, as they do off Mirissa, a sail on the horizon
 * and the Galle lighthouse on its headland, lit after dark.
 *
 * Everything sits on a 3px grid. Each shape is a field, and every grid cell
 * decides whether to draw a dot by comparing that field against a 4 × 4
 * Bayer matrix: ordered dithering. Edges therefore thin out into scattered
 * dots instead of ending in a line.
 *
 * Kept deliberately quiet: muted colours, and motion limited to a slow drift,
 * a faint shimmer and the wash at the shore, redrawn at 12 frames a second
 * and not at all while off screen or under reduced motion.
 *
 * Day and night are the light and dark themes. The sun (or moon) is a real
 * button laid over the drawing. Switching sets the sun behind the sea and
 * brings the moon up from the left, through golden hour and dusk, and
 * switching back brings the morning the same way.
 */

const P = 3;
const FPS = 12;

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(
  (value) => (value + 0.5) / 16,
);
/** The dither threshold for a grid cell, in (0, 1). */
const bayer = (x: number, y: number) =>
  BAYER[((Math.round(y / P) & 3) << 2) + (Math.round(x / P) & 3)];

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));
const smooth = (t: number) => t * t * (3 - 2 * t);
const snap = (value: number) => Math.round(value / P) * P;

const COLOUR_KEYS = {
  skyTop: "sky-top",
  skyMid: "sky-mid",
  skyLow: "sky-low",
  seaBase: "sea-base",
  sunCore: "sun-core",
  sunEdge: "sun-edge",
  halo: "halo",
  moon: "moon",
  cloud: "cloud",
  star: "star",
  seaFar: "sea-far",
  seaNear: "sea-near",
  sparkle: "sparkle",
  foam: "foam",
  sand: "sand",
  sandShade: "sand-shade",
  silhouette: "silhouette",
  leaf: "leaf",
  land: "land",
  landShade: "land-shade",
  tower: "tower",
  lantern: "lantern",
  boat: "boat",
  dolphin: "dolphin",
  rock: "rock",
} as const;

const NUMBER_KEYS = {
  cloudAlpha: "cloud-alpha",
  starAlpha: "star-alpha",
  night: "night",
} as const;

type ColourKey = keyof typeof COLOUR_KEYS;
type NumberKey = keyof typeof NUMBER_KEYS;
type Palette = Record<ColourKey, string> & Record<NumberKey, number>;

type Rgb = readonly [number, number, number];

/**
 * The four palettes in the stylesheet and where each sits between day (0)
 * and night (1). Golden hour and dusk only name the colours that change, so
 * any of their values can be missing.
 */
const STAGES = [
  { name: "day", at: 0 },
  { name: "golden", at: 0.3 },
  { name: "dusk", at: 0.55 },
  { name: "night", at: 1 },
] as const;

type Stage = {
  at: number;
  colours: Partial<Record<ColourKey, Rgb>>;
  numbers: Partial<Record<NumberKey, number>>;
};

function parseHex(value: string): Rgb | undefined {
  const hex = value.trim().replace(/^#/, "");
  const full =
    hex.length === 3 ? [...hex].map((digit) => digit + digit).join("") : hex;
  if (!/^[0-9a-f]{6}$/i.test(full)) return undefined;
  const n = Number.parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function readStages(element: Element): Stage[] {
  const style = getComputedStyle(element);
  return STAGES.map(({ name, at }) => {
    const stage: Stage = { at, colours: {}, numbers: {} };
    for (const [key, suffix] of Object.entries(COLOUR_KEYS)) {
      const rgb = parseHex(style.getPropertyValue(`--${name}-${suffix}`));
      if (rgb) stage.colours[key as ColourKey] = rgb;
    }
    for (const [key, suffix] of Object.entries(NUMBER_KEYS)) {
      const raw = style.getPropertyValue(`--${name}-${suffix}`).trim();
      if (raw) stage.numbers[key as NumberKey] = Number.parseFloat(raw);
    }
    return stage;
  });
}

/** The two stages either side of `phase` that both define a value. */
function bracket<T>(
  stages: readonly Stage[],
  phase: number,
  pick: (stage: Stage) => T | undefined,
): [T, T, number] | undefined {
  let below: Stage | undefined;
  let above: Stage | undefined;
  for (const stage of stages) {
    if (pick(stage) === undefined) continue;
    if (stage.at <= phase) below = stage;
    if (stage.at >= phase && !above) above = stage;
  }
  below ??= above;
  above ??= below;
  if (!below || !above) return undefined;
  const span = above.at - below.at;
  const t = span > 0 ? (phase - below.at) / span : 0;
  return [pick(below) as T, pick(above) as T, t];
}

/** The scene's colours at a point between day (0) and night (1). */
function paletteAt(stages: readonly Stage[], phase: number): Palette {
  const palette = {} as Palette;
  for (const key of Object.keys(COLOUR_KEYS) as ColourKey[]) {
    const pair = bracket(stages, phase, (stage) => stage.colours[key]);
    if (!pair) {
      palette[key] = "transparent";
      continue;
    }
    const [a, b, t] = pair;
    const mix = (i: number) => Math.round(a[i] + (b[i] - a[i]) * t);
    palette[key] = `rgb(${mix(0)} ${mix(1)} ${mix(2)})`;
  }
  for (const key of Object.keys(NUMBER_KEYS) as NumberKey[]) {
    const pair = bracket(stages, phase, (stage) => stage.numbers[key]);
    palette[key] = pair ? pair[0] + (pair[1] - pair[0]) * pair[2] : 0;
  }
  return palette;
}

/**
 * How long a full sunset or sunrise takes, in seconds: the same as the
 * theme's own reveal, so the two happen together. It runs at an even pace
 * rather than on the reveal's fast-out curve, which would have the sun gone
 * before anyone saw it set.
 */
const CROSSING = THEME_SWAP_MS / 1000;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ---- Shapes ------------------------------------------------------------- */

type Cell = readonly [number, number];
type Point = readonly [number, number];

/** Every grid cell a thick polyline passes through. */
function strokeCells(
  points: readonly Point[],
  width: (t: number) => number,
  into: Set<string>,
) {
  const segments = points.length - 1;
  for (let i = 0; i < segments; i++) {
    const [ax, ay] = points[i];
    const [bx, by] = points[i + 1];
    const steps = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / 1.5));
    for (let s = 0; s <= steps; s++) {
      const t = (i + s / steps) / segments;
      const x = ax + ((bx - ax) * s) / steps;
      const y = ay + ((by - ay) * s) / steps;
      const r = width(t) / 2;
      for (let gx = snap(x - r); gx <= x + r; gx += P) {
        for (let gy = snap(y - r); gy <= y + r; gy += P) {
          if (Math.hypot(gx - x, gy - y) <= r + P * 0.5) {
            into.add(`${gx},${gy}`);
          }
        }
      }
    }
  }
}

function quadratic(a: Point, c: Point, b: Point, count = 24): Point[] {
  return Array.from({ length: count + 1 }, (_, index) => {
    const t = index / count;
    const u = 1 - t;
    return [
      u * u * a[0] + 2 * u * t * c[0] + t * t * b[0],
      u * u * a[1] + 2 * u * t * c[1] + t * t * b[1],
    ] as const;
  });
}

/** A text sprite placed on the grid, one list of cells per character. */
function stamp(
  rows: readonly string[],
  x: number,
  y: number,
  flip = false,
  pitch = P,
): Record<string, Cell[]> {
  const out: Record<string, Cell[]> = {};
  const ox = Math.round(x / pitch) * pitch;
  const oy = Math.round(y / pitch) * pitch;
  rows.forEach((row, ry) => {
    [...row].forEach((char, rx) => {
      if (char === " ") return;
      const gx = ox + (flip ? -rx : rx) * pitch;
      (out[char] ??= []).push([gx, oy + ry * pitch]);
    });
  });
  return out;
}


const toCells = (set: Set<string>): Cell[] =>
  [...set].map((key) => {
    const [x, y] = key.split(",").map(Number);
    return [x, y] as const;
  });

/* ---- Sprites ------------------------------------------------------------ */


const SAIL = ["  s  ", "  ss ", "  sss", "hhhhh", " hhh "];

// The oruwa: the hull in front, the outrigger float behind it, and the two
// booms that join them.
const ORUWA = [
  "       ffffffffff       ",
  "        b       b       ",
  "         b       b      ",
  "h         b       b    h",
  "hh         b       b  hh",
  "hhhhhhhhhhhhhhhhhhhhhhhh",
  " hhhhhhhhhhhhhhhhhhhhhh ",
  "   hhhhhhhhhhhhhhhhhh   ",
];

/* ---- Layout ------------------------------------------------------------- */

type Layout = {
  w: number;
  h: number;
  horizon: number;
  sun: { x: number; y: number; r: number };
  shore: (x: number) => number;
  landStart: number;
  landTop: (x: number) => number;
  clouds: { x: number; y: number; s: number }[];
  stars: { x: number; y: number; phase: number }[];
  trunks: Cell[];
  leaves: Cell[];
  dolphins: { x0: number; water: number; length: number; height: number } | null;
  sail: Record<string, Cell[]>;
  oruwa: Record<string, Cell[]>;
  rocks: { x: number; y: number; rx: number; ry: number }[];
  tower: Cell[];
  lantern: Cell[];
  cap: Cell[];
  lamp: { x: number; y: number };
  treeline: Cell[];
  birds: Cell[];
};

function palm(
  base: Point,
  crown: Point,
  lean: number,
  scale: number,
  trunks: Set<string>,
  leaves: Set<string>,
) {
  strokeCells(
    quadratic(
      base,
      [base[0] + lean, base[1] - (base[1] - crown[1]) * 0.55],
      crown,
    ),
    (t) => (7 - t * 3.5) * scale,
    trunks,
  );
  const fronds: [number, number, number][] = [
    [-165, 52, 26],
    [-138, 46, 12],
    [-104, 34, 2],
    [-70, 42, 8],
    [-34, 54, 22],
    [-4, 52, 36],
    [26, 40, 40],
    [152, 44, 34],
  ];
  for (const [angle, length, droop] of fronds) {
    const rad = (angle * Math.PI) / 180;
    const len = length * scale;
    const tip: Point = [
      crown[0] + Math.cos(rad) * len,
      crown[1] + Math.sin(rad) * len + droop * scale,
    ];
    const control: Point = [
      crown[0] + Math.cos(rad) * len * 0.55,
      crown[1] + Math.sin(rad) * len * 0.55 - len * 0.2,
    ];
    strokeCells(
      quadratic(crown, control, tip, 16),
      (t) => (6 - t * 4.5) * scale,
      leaves,
    );
  }
  for (const [dx, dy] of [
    [-3, 6],
    [3, 6],
    [0, 9],
  ]) {
    trunks.add(`${snap(crown[0] + dx * scale)},${snap(crown[1] + dy * scale)}`);
  }
}

function buildLayout(w: number, h: number): Layout {
  const s = h / 208;
  const horizon = snap(h * 0.54);
  const sun = {
    x: snap(w * 0.68),
    y: snap(h * 0.3),
    r: Math.max(10, Math.round(h * 0.08)),
  };

  // The shore runs diagonally from the left, so the sand is a wedge in the
  // bottom-left and the sea takes the rest.
  const shoreTop = horizon + h * 0.13;
  const shoreStart = w * 0.12;
  const slope = (h - shoreTop) / (w * 0.5);
  const shore = (x: number) => shoreTop + Math.max(0, x - shoreStart) * slope;

  // The headland on the right, rising out of the sea.
  const landStart = w * 0.8;
  const landHeight = h * 0.1;
  const landTop = (x: number) => {
    if (x < landStart) return Number.POSITIVE_INFINITY;
    const e = smooth(clamp((x - landStart) / (w * 0.09)));
    return horizon - landHeight * e - 2 * Math.sin(x * 0.17) * e;
  };

  let seed = 5;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  const clouds = [
    { x: w * 0.14, y: h * 0.16, s: 0.9 * s },
    { x: w * 0.44, y: h * 0.1, s: 0.7 * s },
    { x: w * 0.86, y: h * 0.2, s: 0.85 * s },
    { x: w * 1.2, y: h * 0.13, s: 0.75 * s },
  ];

  const stars = Array.from({ length: Math.round((w * h) / 2600) }, () => ({
    x: snap(random() * w),
    y: snap(random() * horizon * 0.85),
    phase: random() * Math.PI * 2,
  }));

  // Two palms with clear air between them: an old one leaning out toward the
  // sea, and a younger one standing to its right. Both stand clear of the
  // bottom-left corner, which the display picture overlaps.
  const trunks = new Set<string>();
  const leaves = new Set<string>();
  const palmX = Math.max(w * 0.2, 120);
  const youngX = palmX + 118 * s;
  palm([palmX, h + 6], [palmX + 34 * s, h * 0.18], 4 * s, s, trunks, leaves);
  palm(
    [youngX, h + 6],
    [youngX + 10 * s, h * 0.46],
    4 * s,
    0.62 * s,
    trunks,
    leaves,
  );

  // Where the dolphins leap: open water past the young palm and short of
  // the headland. On a screen too narrow to have any, they stay under.
  const leapX = Math.max(w * 0.46, youngX + 60 * s);
  const leapLength = 76 * s;
  const dolphins =
    leapX > youngX + 40 * s && leapX + leapLength + 40 * s < landStart
      ? {
          x0: leapX,
          water: horizon + 14 * s,
          length: leapLength,
          height: 24 * s,
        }
      : null;

  const sail = stamp(SAIL, w * 0.75, horizon - 4 * P);
  // The oruwa rests on the sand between the two palms.
  const oruwa = stamp(ORUWA, palmX + 22 * s, h - 30 * s);

  const rocks = [0.5, 0.535, 0.575].map((fx, index) => {
    const x = w * fx;
    return {
      x,
      y: Math.min(h - 4, shore(x)),
      rx: (12 - index * 2) * s,
      ry: (7 - index) * s,
    };
  });

  // The Galle lighthouse: a white tower tapering up to a dark lantern room.
  const lx = snap(w * 0.9);
  const base = snap(landTop(lx));
  const towerRows = Math.round((h * 0.2) / P);
  const tower: Cell[] = [];
  for (let r = 0; r < towerRows; r++) {
    const wide = r < towerRows * 0.5;
    for (let dx = wide ? -1 : 0; dx <= 1; dx++) {
      tower.push([lx + dx * P, base - (r + 1) * P]);
    }
  }
  const lanternY = base - (towerRows + 2) * P;
  const lantern: Cell[] = [
    [lx - P, lanternY + P],
    [lx, lanternY + P],
    [lx + P, lanternY + P],
    [lx, lanternY],
  ];
  const cap: Cell[] = [[lx, lanternY - P]];

  // A ragged line of trees along the headland.
  const treeline: Cell[] = [];
  for (let x = snap(landStart + w * 0.05); x < w; x += P) {
    if (Math.abs(x - lx) < P * 3) continue;
    const top = landTop(x);
    const bump = Math.round(1 + 1.4 * (0.5 + 0.5 * Math.sin(x * 0.31)));
    for (let k = 1; k <= bump; k++) treeline.push([x, snap(top) - k * P]);
  }

  const birdSet = new Set<string>();
  for (const [bx, by] of [
    [sun.x - 70 * s, sun.y - 22 * s],
    [sun.x - 56 * s, sun.y - 16 * s],
    [sun.x - 84 * s, sun.y - 12 * s],
  ]) {
    const x = snap(bx);
    const y = snap(by);
    birdSet.add(`${x - P},${y - P}`);
    birdSet.add(`${x},${y}`);
    birdSet.add(`${x + P},${y - P}`);
  }

  return {
    w,
    h,
    horizon,
    sun,
    shore,
    landStart,
    landTop,
    clouds,
    stars,
    trunks: toCells(trunks),
    leaves: toCells(leaves),
    dolphins,
    sail,
    oruwa,
    rocks,
    tower,
    lantern,
    cap,
    lamp: { x: lx, y: lanternY + P },
    treeline,
    birds: toCells(birdSet),
  };
}

/* ---- Sun and moon ------------------------------------------------------- */

type Body = { x: number; y: number; up: number };

/**
 * Where the sun and moon are at a point between day (0) and night (1).
 *
 * Over the first half the sun sinks, drifting a little to the right, until
 * it is wholly behind the water. Over the second the moon rises out of the
 * sea on the left and climbs in an arc to where the sun stood. `up` is how
 * far each is into the sky: 1 at its place, 0 once it is under the horizon.
 * Coming back, the same path runs in reverse: the moon sinks away to the
 * left and the sun comes up out of the sea.
 */
function bodiesAt(layout: Layout, phase: number): { sun: Body; moon: Body } {
  const { w, horizon, sun } = layout;
  const under = horizon + sun.r + 2 * P;
  const down = smooth(clamp(phase / 0.45));
  const rise = smooth(clamp((phase - 0.5) / 0.5));
  return {
    sun: {
      x: snap(sun.x + w * 0.03 * down),
      y: snap(lerp(sun.y, under, down)),
      up: 1 - down,
    },
    moon: {
      x: snap(lerp(w * 0.06, sun.x, rise)),
      y: snap(lerp(sun.y, under, (1 - rise) ** 2)),
      up: rise,
    },
  };
}

/* ---- Drawing ------------------------------------------------------------ */

type Ripple = { x: number; y: number; start: number };

/** The dolphins are drawn on a finer grid than the rest, for their curves. */
const D = 2;

/**
 * One dolphin, at a point in its leap.
 *
 * Drawn along its own path rather than as a fixed sprite: the body is a run
 * of discs following the arc behind the nose, thick in the middle and
 * tapering to the snout and the tail, with the dorsal fin standing off its
 * back and the flukes spread at the end. So it tilts up as it leaves the
 * water, levels at the top and noses down into the dive, all from the one
 * shape. Only what is above the surface is drawn.
 */
function dolphinCells(
  x0: number,
  water: number,
  length: number,
  height: number,
  head: number,
  scale: number,
) {
  const at = (t: number) => ({
    x: x0 + length * t,
    y: water - height * 4 * t * (1 - t),
  });
  const cells = new Set<string>();
  const add = (x: number, y: number) => {
    const gx = Math.round(x / D) * D;
    const gy = Math.round(y / D) * D;
    if (gy < water - 1) cells.add(`${gx},${gy}`);
  };

  const span = (26 * scale) / length;
  const samples = 36;
  for (let k = 0; k <= samples; k++) {
    const v = k / samples; // 0 at the tail, 1 at the nose
    const t = head - span * (1 - v);
    const { x, y } = at(t);
    // Unit tangent along the path, and the normal pointing off the back.
    const dx = length;
    const dy = -height * 4 * (1 - 2 * t);
    const len = Math.hypot(dx, dy);
    const tx = dx / len;
    const ty = dy / len;
    const ux = ty;
    const uy = -tx;

    const thick = 3.4 * scale * Math.sin(Math.PI * Math.min(1, v * 1.12)) ** 0.7;
    for (let ox = -thick; ox <= thick; ox += D * 0.75) {
      for (let oy = -thick; oy <= thick; oy += D * 0.75) {
        if (ox * ox + oy * oy <= thick * thick) add(x + ox, y + oy);
      }
    }
    // The dorsal fin, raked back.
    if (Math.abs(v - 0.55) < 0.03) {
      for (let j = 0; j <= 5 * scale; j += D * 0.6) {
        add(x + ux * (thick + j) - tx * j * 0.7, y + uy * (thick + j) - ty * j * 0.7);
      }
    }
    // The flukes, spread across the end of the tail.
    if (k === 0) {
      for (let j = -5 * scale; j <= 5 * scale; j += D * 0.6) {
        add(x + ux * j - tx * Math.abs(j) * 0.4, y + uy * j - ty * Math.abs(j) * 0.4);
      }
    }
  }
  return [...cells].map((key) => key.split(",").map(Number) as [number, number]);
}

function draw(
  ctx: CanvasRenderingContext2D,
  layout: Layout,
  palette: Palette,
  phase: number,
  time: number,
  ripples: Ripple[],
  still: boolean,
) {
  const { w, h, horizon, shore, landStart, landTop } = layout;
  const { r } = layout.sun;
  const bodies = bodiesAt(layout, phase);
  const n = palette.night;
  const fade = (from: number, to: number) =>
    smooth(clamp((n - from) / (to - from)));

  // The sky and the sea's base colour, under everything else.
  ctx.globalAlpha = 1;
  const sky = ctx.createLinearGradient(0, 0, 0, horizon);
  sky.addColorStop(0, palette.skyTop);
  sky.addColorStop(0.6, palette.skyMid);
  sky.addColorStop(1, palette.skyLow);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, horizon);
  ctx.fillStyle = palette.seaBase;
  ctx.fillRect(0, horizon, w, h - horizon);

  const dot = (
    x: number,
    y: number,
    size: number,
    colour: string,
    alpha = 1,
  ) => {
    if (alpha <= 0) return;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = colour;
    const offset = (P - size) / 2;
    ctx.fillRect(x + offset, y + offset, size, size);
  };
  const cells = (
    list: readonly Cell[],
    size: number,
    colour: string,
    alpha = 1,
  ) => {
    for (const [x, y] of list) dot(x, y, size, colour, alpha);
  };

  // Stars.
  if (palette.starAlpha > 0) {
    for (const star of layout.stars) {
      const twinkle = 0.55 + 0.45 * Math.sin(time * 0.8 + star.phase);
      dot(star.x, star.y, 1, palette.star, palette.starAlpha * twinkle);
    }
  }

  // The sun's rays: twelve, long and short in turn, turning very slowly.
  // They draw in as the sun gets low.
  const rays = 0.9 * smooth(clamp((bodies.sun.up - 0.55) / 0.45));
  if (rays > 0) {
    const spin = time * 0.05;
    for (let k = 0; k < 12; k++) {
      const angle = (k * Math.PI) / 6 + spin;
      const inner = r + 5;
      const outer = r + (k % 2 ? 8 : 15) * (h / 208);
      for (let d = inner; d <= outer; d += 2) {
        const gy = snap(bodies.sun.y + Math.sin(angle) * d);
        if (gy >= horizon) continue;
        dot(snap(bodies.sun.x + Math.cos(angle) * d), gy, 2, palette.sunEdge, rays);
      }
    }
  }

  // Halo, then the sun or moon: a disc dithered from its core to its edge.
  // Neither is drawn below the horizon, so each sinks behind the water, and
  // the sun's glow spreads as it nears the sea.
  const body = (at: Body, moon: boolean) => {
    if (at.up <= 0) return;
    const low = 1 - at.up;
    const glow = moon ? 1.9 : 2.3 + low * 1.1;
    const strength = moon ? 0.42 : 0.26 + low * 0.16;
    const reach = r * glow;
    for (let gx = snap(at.x - reach); gx <= at.x + reach; gx += P) {
      for (let gy = snap(at.y - reach); gy <= at.y + reach; gy += P) {
        if (gy >= horizon) break;
        const d = Math.hypot(gx - at.x, gy - at.y);
        const threshold = bayer(gx, gy);
        if (d <= r) {
          if (moon) {
            const cut = Math.hypot(
              gx - (at.x + r * 0.42),
              gy - (at.y - r * 0.3),
            );
            if (cut < r * 0.82) continue;
            dot(gx, gy, P, palette.moon, 0.95);
          } else {
            const t = d / r;
            const core = t < 0.5 || threshold > (t - 0.5) / 0.5;
            dot(gx, gy, P, core ? palette.sunCore : palette.sunEdge);
          }
        } else {
          const falloff = 1 - (d - r) / (reach - r);
          if (falloff > 0 && threshold < falloff * strength) {
            dot(gx, gy, 1, palette.halo, moon ? 0.5 : 0.7);
          }
        }
      }
    }
  };
  body(bodies.sun, false);
  body(bodies.moon, true);

  // Clouds: three lobes each, thinning to scattered dots at the edges.
  const drift = (time * 2.5) % (w + 300);
  for (const cloud of layout.clouds) {
    let x = cloud.x + drift;
    if (x > w + 150) x -= w + 300;
    const rx = 56 * cloud.s;
    const ry = 13 * cloud.s;
    const lobes = [
      [-0.5, 0.25, 0.5, 0.7],
      [0, -0.15, 0.6, 1],
      [0.5, 0.15, 0.48, 0.75],
    ] as const;
    for (let gx = snap(x - rx * 1.1); gx <= x + rx * 1.1; gx += P) {
      for (
        let gy = snap(cloud.y - ry * 1.4);
        gy <= cloud.y + ry * 1.2;
        gy += P
      ) {
        let field = 0;
        for (const [ox, oy, sx, sy] of lobes) {
          const nx = (gx - (x + ox * rx)) / (rx * sx);
          const ny = (gy - (cloud.y + oy * ry)) / (ry * sy);
          field = Math.max(field, 1 - nx * nx - ny * ny);
        }
        if (field > 0 && bayer(gx, gy) < field * 1.6) {
          dot(
            gx,
            gy,
            2,
            palette.cloud,
            palette.cloudAlpha * (0.5 + 0.5 * clamp(field * 2)),
          );
        }
      }
    }
  }

  const birds = 0.6 * (1 - fade(0, 0.45));
  if (birds > 0) cells(layout.birds, 2, palette.silhouette, birds);

  // The sea, from the horizon down to the sand.
  // The glint follows whichever light is up, and a low sun lays a longer,
  // wider path across the water.
  const light = bodies.sun.up > 0 ? bodies.sun : bodies.moon;
  const sheen = Math.sqrt(light.up);
  const widen = light === bodies.sun ? 1 + (1 - light.up) * 0.8 : 1;
  const seaDepth = h - horizon;
  for (let gy = horizon; gy < h; gy += P) {
    const depth = (gy - horizon) / seaDepth;
    const glint = (5 + depth * 26) * widen;
    for (let gx = 0; gx < w; gx += P) {
      if (gy >= shore(gx) - P) continue;
      const threshold = bayer(gx, gy);
      const fromLight = Math.abs(gx - light.x);
      if (
        sheen > 0 &&
        fromLight < glint &&
        threshold < (1 - fromLight / glint) * 0.8 * sheen
      ) {
        dot(
          gx,
          gy,
          2,
          palette.sparkle,
          0.5 + 0.25 * Math.sin(time * 2 + gy * 0.3),
        );
        continue;
      }
      const shimmer =
        0.55 + 0.2 * Math.sin(gx * 0.05 + gy * 0.45 + time * 0.9);
      dot(
        gx,
        gy,
        2,
        threshold < depth ? palette.seaNear : palette.seaFar,
        gy === horizon ? 0.85 : shimmer,
      );
    }
  }

  // A sail on the horizon.
  cells(layout.sail.s ?? [], 2, palette.tower, lerp(0.85, 0.35, n));
  cells(layout.sail.h ?? [], 2, palette.silhouette, lerp(0.6, 0.5, n));

  // The headland, its trees, and the lighthouse.
  for (let gx = snap(landStart); gx < w; gx += P) {
    const top = landTop(gx);
    for (let gy = snap(top); gy <= horizon; gy += P) {
      dot(gx, gy, P, bayer(gx, gy) < 0.25 ? palette.landShade : palette.land);
    }
  }
  cells(layout.treeline, P, palette.leaf, 0.9);
  cells(layout.tower, P, palette.tower);
  cells(layout.lantern, P, palette.lantern);
  cells(layout.cap, P, palette.silhouette);
  // The lamp comes on last, once the dusk has gone.
  const lamp = fade(0.6, 1);
  if (lamp > 0) {
    // The lamp, and its beam reaching out over the water to the left.
    const { x: lampX, y: lampY } = layout.lamp;
    for (let gx = snap(lampX - w * 0.3); gx < lampX; gx += P) {
      const along = (lampX - gx) / (w * 0.3);
      const spread = 3 + along * 16;
      for (let gy = snap(lampY - spread); gy <= lampY + spread; gy += P) {
        const across = Math.abs(gy - lampY) / spread;
        if (bayer(gx, gy) < (1 - along) * (1 - across) * 0.5) {
          dot(gx, gy, 1, palette.lantern, 0.55 * (1 - along) * lamp);
        }
      }
    }
    for (let gx = lampX - 3 * P; gx <= lampX + 3 * P; gx += P) {
      for (let gy = lampY - 3 * P; gy <= lampY + 3 * P; gy += P) {
        const d = Math.hypot(gx - lampX, gy - lampY) / (3 * P);
        if (d < 1 && bayer(gx, gy) < (1 - d) * 0.7) {
          dot(gx, gy, 1, palette.lantern, 0.8 * lamp);
        }
      }
    }
  }

  // Ripples where the sea was touched.
  for (const ripple of ripples) {
    const age = (time - ripple.start) / 1.6;
    if (age < 0 || age > 1) continue;
    const rx = 8 + age * 56;
    const ry = rx * 0.2;
    const count = Math.ceil((Math.PI * 2 * rx) / P);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const gx = snap(ripple.x + Math.cos(angle) * rx);
      const gy = snap(ripple.y + Math.sin(angle) * ry);
      if (gy < horizon || gy >= shore(gx) - P) continue;
      dot(gx, gy, 2, palette.sparkle, (1 - age) * 0.9);
    }
  }

  // Two dolphins, one just behind the other, leaping every few seconds.
  // In between, the water is still. Under reduced motion they are held at
  // the top of the leap instead.
  if (layout.dolphins) {
    const { x0, water, length, height } = layout.dolphins;
    const scale = h / 208;
    const pair = [
      { offset: 0, dx: 0 },
      // The second follows a beat later and a little behind, so the pair
      // reads as two rather than one doubled shape.
      { offset: 0.16, dx: -14 * scale },
    ];
    for (const dolphin of pair) {
      const head = still
        ? 0.62 - dolphin.offset
        : ((time / 1.7 - dolphin.offset) % (5 / 1.7)) * 1.3 - 0.1;
      if (head < -0.1 || head > 1.3) continue;
      const startX = x0 + dolphin.dx;
      for (const [cx, cy] of dolphinCells(startX, water, length, height, head, scale)) {
        ctx.globalAlpha = 0.92;
        ctx.fillStyle = palette.dolphin;
        ctx.fillRect(cx, cy, D, D);
      }
      // Spray where it breaks the surface, going up and coming down.
      for (const [edge, near] of [
        [startX, head < 0.18],
        [startX + length, head > 0.95 && head < 1.25],
      ] as const) {
        if (!near) continue;
        for (let k = -4; k <= 4; k++) {
          const sx = edge + k * D * 1.5;
          const sy = water - 2 - Math.abs(Math.sin(k * 1.7 + time * 9)) * 5 * scale;
          if (bayer(sx, sy) < 0.7) dot(Math.round(sx), Math.round(sy), 1, palette.foam, 0.85);
        }
      }
    }
  }

  // A wave forming offshore, then the wash and the sand.
  const swell = Math.sin(time * 0.7) * 2;
  for (let gx = 0; gx < w; gx += P) {
    const edge = shore(gx);
    if (edge >= h + P) continue;
    const crest = snap(edge - 9 + swell);
    if (crest > horizon && bayer(gx, crest) < 0.55) {
      dot(gx, crest, 2, palette.foam, 0.55);
    }
    for (let gy = snap(edge - P); gy < h; gy += P) {
      const threshold = bayer(gx, gy);
      if (gy < edge + P) {
        const wash = 0.5 + 0.5 * Math.sin(time * 1.1 + gx * 0.05);
        if (threshold < wash) dot(gx, gy, 2, palette.foam, 0.8);
        continue;
      }
      dot(gx, gy, P, threshold < 0.14 ? palette.sandShade : palette.sand);
    }
  }

  // Rocks at the water's edge: dark below, catching light along the top.
  for (const rock of layout.rocks) {
    for (let gx = snap(rock.x - rock.rx); gx <= rock.x + rock.rx; gx += P) {
      for (
        let gy = snap(rock.y - rock.ry);
        gy <= rock.y + rock.ry * 0.4;
        gy += P
      ) {
        const nx = (gx - rock.x) / rock.rx;
        const ny = (gy - rock.y) / rock.ry;
        const field = 1 - nx * nx - ny * ny;
        if (field <= 0 || bayer(gx, gy) > field * 2.2) continue;
        // By day the tops catch the light; it goes out as the dusk deepens.
        const lit = ny < -0.45 ? 1 - clamp(n * 2) : 0;
        dot(gx, gy, P, palette.rock, 0.95 * (1 - lit));
        if (lit > 0) dot(gx, gy, P, palette.foam, 0.5 * lit);
      }
    }
  }

  // The oruwa on the sand.
  cells(layout.oruwa.h ?? [], P, palette.boat);
  cells(layout.oruwa.f ?? [], P, palette.boat, 0.9);
  cells(layout.oruwa.b ?? [], 2, palette.boat, 0.9);

  // The palms, last, over everything.
  cells(layout.trunks, P, palette.silhouette, 0.95);
  cells(layout.leaves, P, palette.leaf, 0.95);

  ctx.globalAlpha = 1;
}

/* ---- Component ---------------------------------------------------------- */

export function DitherScene({
  className,
  leading,
}: {
  className?: string;
  /** Sits under the box's left edge, overlapping it: the display picture. */
  leading?: React.ReactNode;
}) {
  const { isDark, toggle } = useThemeToggle();
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sun, setSun] = useState<{ x: number; y: number; r: number } | null>(
    null,
  );
  const [ready, setReady] = useState(false);

  // Everything the render loop needs lives in refs, so the loop never
  // restarts on a React render.
  const layoutRef = useRef<Layout | null>(null);
  const stagesRef = useRef<Stage[] | null>(null);
  /** Where the scene is between day (0) and night (1). */
  const phaseRef = useRef(0);
  /** A sunset or sunrise under way. */
  const crossingRef = useRef<{
    from: number;
    to: number;
    start: number;
    duration: number;
  } | null>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const clockRef = useRef(0);
  const renderRef = useRef<() => void>(() => {});
  const syncRef = useRef<() => void>(() => {});

  useEffect(() => {
    const box = boxRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!box || !canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const startedAt = performance.now();
    const now = () =>
      reduce.matches ? 0 : (performance.now() - startedAt) / 1000;
    const themePhase = () =>
      document.documentElement.classList.contains("dark") ? 1 : 0;
    phaseRef.current = themePhase();

    /** The phase now, moving it along if a crossing is under way. */
    const advance = () => {
      const crossing = crossingRef.current;
      if (!crossing) return phaseRef.current;
      const t = clamp(
        (performance.now() - crossing.start) / (crossing.duration * 1000),
      );
      phaseRef.current = lerp(crossing.from, crossing.to, t);
      if (t >= 1) crossingRef.current = null;
      return phaseRef.current;
    };

    const render = () => {
      const layout = layoutRef.current;
      if (!layout) return;
      stagesRef.current ??= readStages(box);
      const phase = advance();
      clockRef.current = now();
      ripplesRef.current = ripplesRef.current.filter(
        (ripple) => clockRef.current - ripple.start < 1.7,
      );
      draw(
        ctx,
        layout,
        paletteAt(stagesRef.current, phase),
        phase,
        clockRef.current,
        ripplesRef.current,
        reduce.matches,
      );
    };
    renderRef.current = render;

    const resize = () => {
      const { width, height } = box.getBoundingClientRect();
      if (width === 0 || height === 0) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.imageSmoothingEnabled = false;
      const layout = buildLayout(width, height);
      layoutRef.current = layout;
      setSun({
        x: layout.sun.x + P / 2,
        y: layout.sun.y + P / 2,
        r: layout.sun.r,
      });
      render();
      setReady(true);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(box);

    // Only animate while on screen and visible, and never under reduced motion.
    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(box);

    /** Shows the time of day the theme calls for, at once. */
    const settle = () => {
      crossingRef.current = null;
      phaseRef.current = themePhase();
      render();
    };

    // The theme toggle announces the swap synchronously, inside the view
    // transition. With the scene in view, the sun then sets behind the water
    // (or rises out of it) while the reveal spreads across the page, the sky
    // passing through golden hour and dusk on the way. Turned round part way,
    // it heads back from wherever it has got to.
    const onSwap = () => {
      const from = advance();
      const to = themePhase();
      if (reduce.matches || !visible || document.hidden || from === to) {
        settle();
        return;
      }
      crossingRef.current = {
        from,
        to,
        start: performance.now(),
        duration: CROSSING * Math.abs(to - from),
      };
      render();
    };
    window.addEventListener(THEME_SWAP_EVENT, onSwap);

    // Any other change of theme (the stored choice restored on load, or
    // changed in another tab) just shows the new time of day.
    syncRef.current = () => {
      const to = themePhase();
      if (crossingRef.current?.to === to) return;
      if (!crossingRef.current && phaseRef.current === to) return;
      settle();
    };

    let frame = 0;
    let last = 0;
    const loop = (timestamp: number) => {
      frame = requestAnimationFrame(loop);
      if (reduce.matches || !visible || document.hidden) return;
      // Held to the scene's slow rate, except while the sun is moving: the
      // crossing is quick, and drawn at 12 frames it would only flicker.
      if (!crossingRef.current && timestamp - last < 1000 / FPS) return;
      last = timestamp;
      render();
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      io.disconnect();
      window.removeEventListener(THEME_SWAP_EVENT, onSwap);
    };
  }, []);

  useEffect(() => {
    syncRef.current();
  }, [isDark]);

  function touchSea(event: React.MouseEvent<HTMLCanvasElement>) {
    const layout = layoutRef.current;
    if (!layout) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (y < layout.horizon || y >= layout.shore(x)) return;
    ripplesRef.current.push({ x, y, start: clockRef.current });
    renderRef.current();
  }

  return (
    <div className={className}>
      <div
        ref={boxRef}
        className={cn(
          styles.scene,
          "border-rule rounded-frame h-[176px] overflow-hidden border sm:h-[208px]",
        )}
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          onClick={touchSea}
          className={cn(styles.canvas, ready && styles.ready)}
        />
        {sun && (
          <button
            type="button"
            onClick={(event) => toggle(centreOf(event.currentTarget))}
            aria-label={
              isDark
                ? "The moon: switch to the light theme"
                : "The sun: switch to the dark theme"
            }
            title={isDark ? "Switch to day" : "Switch to night"}
            className={styles.toggle}
            style={{
              left: sun.x,
              top: sun.y,
              width: sun.r * 2 + 16,
              height: sun.r * 2 + 16,
            }}
          />
        )}
      </div>

      {leading && <div className="flex items-start">{leading}</div>}
    </div>
  );
}
