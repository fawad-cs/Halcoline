import { clamp } from './easing';

// How strongly stratum `index` (0 = Surface ... 4 = Hadal) is "active"
// at scroll progress p (0..1). Returns 0..1.
// Surface stays at 1 until its centre, Hadal stays at 1 after its centre.
export function stratumWeight(p, index, count = 5) {
  const width = 1 / count;
  const centre = (index + 0.5) * width;

  if (index === 0 && p < centre) return 1;
  if (index === count - 1 && p > centre) return 1;

  const t = clamp(1 - Math.abs(p - centre) / width, 0, 1);
  return t * t * (3 - 2 * t);
}