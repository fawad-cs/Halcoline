// Easing curves (for Motion) and tiny math helpers.

// Cubic-bezier arrays: Motion accepts these directly as `ease`.
export const EASE_OUT = [0.22, 1, 0.36, 1];
export const EASE_IN_OUT = [0.76, 0, 0.24, 1];
export const EASE_SOFT = [0.33, 1, 0.68, 1];

// Durations in seconds (match the CSS tokens).
export const DUR = {
  fast: 0.35,
  base: 0.8,
  slow: 1.2,
  cinematic: 1.6,
};

// Plain-function easings (for manual / frame-loop animation).
export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
export const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
export const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

// Math helpers
export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
export const lerp = (a, b, t) => a + (b - a) * t;
export const mapRange = (value, inMin, inMax, outMin, outMax) =>
  outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);