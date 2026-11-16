import { motion } from 'motion/react';
import useMagnetic from '../../hooks/useMagnetic';

// Wrap any element to make it drift toward the pointer.
export default function Magnetic({ children, strength = 0.35, radius = 80, className = '' }) {
  const { ref, x, y } = useMagnetic({ strength, radius });

  return (
    <motion.span
      ref={ref}
      className={className}
      style={{ x, y, display: 'inline-block' }}
    >
      {children}
    </motion.span>
  );
}