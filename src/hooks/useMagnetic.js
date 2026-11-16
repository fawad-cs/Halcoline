import { useEffect, useRef } from 'react';
import { useMotionValue, useSpring } from 'motion/react';
import useReducedMotion from './useReducedMotion';

// Pulls an element toward the pointer when it gets close.
// Usage: const { ref, x, y } = useMagnetic();
//        <motion.button ref={ref} style={{ x, y }} />
export default function useMagnetic({ strength = 0.35, radius = 80 } = {}) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(rawY, { stiffness: 220, damping: 18, mass: 0.4 });

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return undefined;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return undefined;
    }

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      // Subtract the current offset so the centre does not drift while moving.
      const cx = rect.left + rect.width / 2 - x.get();
      const cy = rect.top + rect.height / 2 - y.get();
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const reach = Math.max(rect.width, rect.height) / 2 + radius;

      if (Math.hypot(dx, dy) < reach) {
        rawX.set(dx * strength);
        rawY.set(dy * strength);
      } else {
        rawX.set(0);
        rawY.set(0);
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      rawX.set(0);
      rawY.set(0);
    };
  }, [reduced, strength, radius, rawX, rawY, x, y]);

  return { ref, x, y };
}