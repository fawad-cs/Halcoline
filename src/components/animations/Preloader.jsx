import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import useReducedMotion from '../../hooks/useReducedMotion';
import { useScrollContext } from '../../context/ScrollContext';
import { EASE_OUT, EASE_IN_OUT } from '../../utils/easing';
import styles from './Preloader.module.css';

const LETTERS = 'HALOCLINE'.split('');
const MAX_DEPTH = 11000;

// `ready`  -> true once real assets (fonts, window load) are ready.
// `onDone` -> called after the counter reaches 100%.
export default function Preloader({ ready, onDone }) {
  const reduced = useReducedMotion();
  const { lenis } = useScrollContext();
  const [progress, setProgress] = useState(0);
  const readyRef = useRef(ready);

  useEffect(() => {
    readyRef.current = ready;
  }, [ready]);

  // Lock scrolling while the preloader is on screen.
  useEffect(() => {
    document.documentElement.classList.add('is-locked');
    if (lenis) lenis.stop();
    return () => {
      document.documentElement.classList.remove('is-locked');
      if (lenis) lenis.start();
    };
  }, [lenis]);

  // Smooth counter: eases toward 88% until assets are ready, then to 100%.
  useEffect(() => {
    const minMs = reduced ? 600 : 2200;
    const start = performance.now();
    let value = 0;
    let frame = 0;
    let timer = 0;

    const tick = (now) => {
      const elapsed = now - start;
      const target =
        readyRef.current && elapsed >= minMs
          ? 100
          : Math.min(88, (elapsed / minMs) * 88);

      value += (target - value) * 0.08;
      if (target === 100 && value > 99.5) value = 100;
      setProgress(Math.round(value));

      if (value >= 100) {
        timer = window.setTimeout(onDone, reduced ? 150 : 450);
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [reduced, onDone]);

  const depth = Math.round((progress / 100) * MAX_DEPTH);

  return (
    <motion.div
      className={styles.preloader}
      initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      exit={
        reduced
          ? { opacity: 0, transition: { duration: 0.3 } }
          : {
              clipPath: 'inset(0% 0% 100% 0%)',
              transition: { duration: 1.1, ease: EASE_IN_OUT },
            }
      }
      role="progressbar"
      aria-label="Loading HALOCLINE"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
    >
      <div className={styles.top}>
        <span className="mono mono--xs">Expedition 01</span>
        <span className="mono mono--xs">Station 11.3733° N · 142.5917° E</span>
      </div>

      <h1 className={styles.word} aria-label="HALOCLINE">
        {LETTERS.map((letter, i) => (
          <span key={i} className={styles.mask} aria-hidden="true">
            <motion.span
              className={styles.letter}
              initial={reduced ? { opacity: 0 } : { y: '110%' }}
              animate={reduced ? { opacity: 1 } : { y: '0%' }}
              transition={{
                duration: reduced ? 0.3 : 1.1,
                delay: reduced ? 0 : 0.2 + i * 0.07,
                ease: EASE_OUT,
              }}
            >
              {letter}
            </motion.span>
          </span>
        ))}
      </h1>

      <div className={styles.bottom}>
        <div className={styles.readout}>
          <span className={`${styles.percent} tnum`}>
            {String(progress).padStart(3, '0')}
          </span>
          <span className="mono mono--accent">%</span>
        </div>
        <div className={styles.depth}>
          <span className="mono mono--xs">Depth</span>
          <span className="mono mono--biolume tnum">
            {String(depth).padStart(5, '0')} M
          </span>
        </div>
        <div className={styles.track} aria-hidden="true">
          <div className={styles.bar} style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
      </div>
    </motion.div>
  );
}