import { motion } from 'motion/react';
import useReducedMotion from '../../hooks/useReducedMotion';
import { EASE_OUT } from '../../utils/easing';
import styles from './LineReveal.module.css';

// Reveals text word by word from behind a mask when it scrolls into view.
// Italic accent: wrap ONE word in asterisks, e.g. "Halo *cline*".
//   <LineReveal as="h2" className="h2" text="Dive into the *dark*" />
export default function LineReveal({
  text,
  as = 'p',
  className = '',
  delay = 0,
  stagger = 0.06,
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as] ?? motion.p;

  const words = text.split(' ').map((raw) => {
    const emphasis = raw.length > 2 && raw.startsWith('*') && raw.endsWith('*');
    return { word: emphasis ? raw.slice(1, -1) : raw, emphasis };
  });

  const plain = words.map((w) => w.word).join(' ');

  const parent = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : stagger, delayChildren: delay } },
  };

  const child = reduced
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.4 } },
      }
    : {
        hidden: { y: '110%' },
        show: { y: '0%', transition: { duration: 1.1, ease: EASE_OUT } },
      };

  return (
    <MotionTag
      className={`${styles.root} ${className}`}
      aria-label={plain}
      variants={parent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
    >
      {words.map((item, i) => (
        <span key={i} className={styles.mask} aria-hidden="true">
          <motion.span
            className={`${styles.word} ${item.emphasis ? styles.emphasis : ''}`}
            variants={child}
          >
            {item.word}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}