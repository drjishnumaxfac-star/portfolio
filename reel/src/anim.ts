import {Easing, interpolate, spring, SpringConfig} from 'remotion';
import {FPS} from './theme';

/** Snappy spring with overshoot: the default "pop" of the reel. */
export const POP: Partial<SpringConfig> = {damping: 11, stiffness: 170, mass: 0.7};
/** Softer settle used for big layout moves (slow-in / slow-out). */
export const GLIDE: Partial<SpringConfig> = {damping: 20, stiffness: 90, mass: 1};
/** Rubbery, cartoon bounce for landings. */
export const BOUNCE: Partial<SpringConfig> = {damping: 7, stiffness: 150, mass: 0.8};

export const sp = (frame: number, delay = 0, config: Partial<SpringConfig> = POP, durationInFrames?: number) =>
  spring({frame: frame - delay, fps: FPS, config, durationInFrames});

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export const ease = (frame: number, start: number, end: number, from = 0, to = 1, easing = Easing.bezier(0.22, 1, 0.36, 1)) =>
  interpolate(frame, [start, end], [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing});

/**
 * Disney-style squash & stretch derived from spring velocity:
 * stretches along the motion while travelling, squashes when the overshoot reverses.
 */
export const squash = (frame: number, delay = 0, config: Partial<SpringConfig> = BOUNCE, k = 4) => {
  const p = sp(frame, delay, config);
  const v = p - sp(frame - 1, delay, config);
  const d = Math.max(-0.32, Math.min(0.32, v * k));
  return {p, sx: 1 - d * 0.55, sy: 1 + d};
};

/** Anticipation: a small wind-up (dip) before the main move. Returns a scale multiplier. */
export const anticipate = (frame: number, at: number, depth = 0.08, lead = 6) =>
  1 - depth * Math.sin(Math.PI * clamp01((frame - (at - lead)) / lead)) * (frame < at ? 1 : 0);

/** Decaying camera shake for impacts. */
export const shake = (frame: number, at: number, amp = 18, decay = 0.22) => {
  const t = frame - at;
  if (t < 0 || t > 24) return {x: 0, y: 0, r: 0};
  const a = amp * Math.exp(-t * decay);
  return {x: Math.sin(t * 2.7) * a, y: Math.cos(t * 3.3) * a * 0.7, r: Math.sin(t * 2.1) * a * 0.04};
};

/** Deterministic pseudo random in [0,1). */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** Exit helper: 1 while visible, eases to 0 over the last `len` frames of a scene. */
export const exitOut = (frame: number, duration: number, len = 8) =>
  interpolate(frame, [duration - len, duration], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
