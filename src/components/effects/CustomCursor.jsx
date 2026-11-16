import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import useReducedMotion from '../../hooks/useReducedMotion';
import styles from './CustomCursor.module.css';

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, [data-cursor]';

// Only mounts on devices with a real mouse (hover + fine pointer).
export default function CustomCursor() {
  const reduced = useReducedMotion();
  const [enabled] = useState(
    () => window.matchMedia('(hover: hover) and (pointer: fine)').matches
  );
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const spring = reduced
    ? { stiffness: 1000, damping: 60, mass: 0.1 }
    : { stiffness: 260, damping: 26, mass: 0.5 };
  const ringX = useSpring(x, spring);
  const ringY = useSpring(y, spring);

  useEffect(() => {
    if (!enabled) return undefined;
    const root = document.documentElement;
    root.classList.add('has-custom-cursor');

    const onMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const onOver = (e) => {
      setHovering(Boolean(e.target.closest?.(INTERACTIVE)));
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => setVisible(false);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    root.addEventListener('mouseleave', onLeave);

    return () => {
      root.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      root.removeEventListener('mouseleave', onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <div className={styles.root} aria-hidden="true">
      <motion.div className={styles.ring} style={{ x: ringX, y: ringY }}>
        <motion.div
          className={styles.ringInner}
          animate={{
            scale: hovering ? 1.9 : pressed ? 0.8 : 1,
            opacity: visible ? 1 : 0,
          }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>
      <motion.div
        className={styles.dot}
        style={{ x, y }}
        animate={{ opacity: visible ? 1 : 0, scale: hovering ? 0.4 : 1 }}
        transition={{ duration: 0.25 }}
      />
    </div>
  );
}