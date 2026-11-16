import { useEffect } from 'react';
import { motion } from 'motion/react';
import useReducedMotion from '../../hooks/useReducedMotion';
import { useScrollContext } from '../../context/ScrollContext';
import { EASE_IN_OUT } from '../../utils/easing';
import styles from './PageTransition.module.css';

// Three layered curtains wipe upward over every route change.
// Leading edge is amber, then trench, then abyss (final cover).
const PANELS = [
  { name: 'amber', enter: 0.26, exit: 0 },
  { name: 'trench', enter: 0.18, exit: 0.08 },
  { name: 'abyss', enter: 0.1, exit: 0.16 },
];

export default function PageTransition({ children }) {
  const reduced = useReducedMotion();
  const { lenis } = useScrollContext();

  // New page mounts while the curtain is fully closed: reset scroll silently.
  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [lenis]);

  if (reduced) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div>
      {children}
      {PANELS.map((panel) => (
        <motion.div
          key={panel.name}
          className={`${styles.panel} ${styles[panel.name]}`}
          aria-hidden="true"
          initial={{ scaleY: 1, transformOrigin: 'top' }}
          animate={{
            scaleY: 0,
            transformOrigin: 'top',
            transition: { duration: 0.9, ease: EASE_IN_OUT, delay: panel.enter },
          }}
          exit={{
            scaleY: 1,
            transformOrigin: 'bottom',
            transition: { duration: 0.8, ease: EASE_IN_OUT, delay: panel.exit },
          }}
        />
      ))}
    </motion.div>
  );
}