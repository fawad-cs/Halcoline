import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import useReducedMotion from '../../hooks/useReducedMotion';

// Moves its children vertically as the block crosses the viewport.
// amount = distance in px (positive = drifts up faster than the page).
export default function Parallax({ amount = 60, className = '', children }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [0, 0] : [amount, -amount]
  );

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}