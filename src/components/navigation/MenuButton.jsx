import { motion } from 'motion/react';
import useMagnetic from '../../hooks/useMagnetic';
import styles from './MenuButton.module.css';

export default function MenuButton({ open, onToggle, controlsId }) {
  const { ref, x, y } = useMagnetic({ strength: 0.3 });

  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      type="button"
      className={styles.button}
      data-open={open}
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={controlsId}
      aria-label={open ? 'Close menu' : 'Open menu'}
    >
      <span className={styles.labelMask} aria-hidden="true">
        <span className={styles.labels}>
          <span>Menu</span>
          <span>Close</span>
        </span>
      </span>
      <span className={styles.icon} aria-hidden="true">
        <span className={styles.line} />
        <span className={styles.line} />
      </span>
    </motion.button>
  );
}