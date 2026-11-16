import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import useReducedMotion from './useReducedMotion';

// Creates ONE Lenis smooth-scroll instance for the whole app.
// Returns the instance (or null while disabled / reduced motion).
// Call this once, in App.jsx, then share it through ScrollContext.
export default function useLenis({ enabled = true } = {}) {
  const reduced = useReducedMotion();
  const [lenis, setLenis] = useState(null);

  useEffect(() => {
    if (!enabled || reduced) {
      setLenis(null);
      return undefined;
    }

    const instance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      autoRaf: true, // Lenis runs its own requestAnimationFrame loop
    });

    setLenis(instance);

    return () => {
      instance.destroy();
      setLenis(null);
    };
  }, [enabled, reduced]);

  return lenis;
}