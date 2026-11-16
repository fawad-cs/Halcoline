import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import LineReveal from '../../components/animations/LineReveal';
import ErrorBoundary from '../../components/effects/ErrorBoundary';
import useReducedMotion from '../../hooks/useReducedMotion';
import { SPECIMENS } from '../../data/specimens';
import { EASE_OUT } from '../../utils/easing';
import styles from './SpecimenShowcase.module.css';

// Second, small canvas: lazy-loaded and only rendering while on screen.
const SpecimenViewer = lazy(() => import('../../three/components/SpecimenViewer.jsx'));

export default function SpecimenShowcase() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [inView, setInView] = useState(false);
  const stageRef = useRef(null);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: '100px',
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const s = SPECIMENS[index];

  const infoMotion = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
        exit: { opacity: 0, transition: { duration: 0.2 } },
      };

  return (
    <section className={styles.section} style={{ '--accent': s.color }} aria-label="Specimens">
      <header className={styles.head}>
        <p className="eyebrow">Specimen archive</p>
        <LineReveal as="h2" className="h2" text="Meet the *residents.*" />
      </header>

      <div className={styles.grid}>
        <ol className={styles.list}>
          {SPECIMENS.map((item, i) => (
            <li key={item.id}>
              <button
                type="button"
                className={`${styles.item} ${i === index ? styles.current : ''}`}
                onClick={() => setIndex(i)}
                aria-pressed={i === index}
                style={{ '--dot': item.color }}
              >
                <span className="mono mono--xs tnum">{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.itemName}>{item.name}</span>
                <span className={`${styles.itemStratum} mono mono--xs`}>{item.stratum}</span>
              </button>
            </li>
          ))}
        </ol>

        <div ref={stageRef} className={styles.stage} data-cursor>
          <ErrorBoundary fallback={<p className="mono mono--xs">3D viewer unavailable</p>}>
            <Suspense fallback={<p className="mono mono--xs">Loading specimen…</p>}>
              <SpecimenViewer shape={s.shape} color={s.color} active={inView} reduced={reduced} />
            </Suspense>
          </ErrorBoundary>
          <p className={`${styles.hint} mono mono--xs`}>Move your pointer to tilt</p>
        </div>

        <div className={styles.info}>
          <AnimatePresence mode="wait">
            <motion.div key={s.id} className={styles.card} {...infoMotion}>
              <p className="mono mono--xs">
                {s.stratum} · {s.depth}
              </p>
              <h3 className={`h2 ${styles.name}`}>{s.name}</h3>
              <p className={styles.latin}>{s.latin}</p>
              <p className="body">{s.trait}</p>
              <p className={styles.fact}>{s.fact}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}