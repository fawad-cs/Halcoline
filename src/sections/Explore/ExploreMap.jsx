import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Button from '../../components/ui/Button';
import ErrorBoundary from '../../components/effects/ErrorBoundary';
import useReducedMotion from '../../hooks/useReducedMotion';
import { DIVES, formatDepth } from '../../data/dives';
import { EASE_OUT } from '../../utils/easing';
import styles from './ExploreMap.module.css';

const SonarMap = lazy(() => import('../../three/components/SonarMap.jsx'));

export default function ExploreMap() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [inView, setInView] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    const el = mapRef.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      rootMargin: '100px',
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const d = DIVES[index];

  const panelMotion = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
        exit: { opacity: 0, transition: { duration: 0.2 } },
      };

  return (
    <section className={styles.section} style={{ '--accent': d.accent }} aria-label="Dive map">
      <div className={styles.layout}>
        <div ref={mapRef} className={styles.map} data-cursor>
          <ErrorBoundary fallback={<p className="mono mono--xs">Map unavailable. Use the list below.</p>}>
            <Suspense fallback={<p className="mono mono--xs">Loading sonar…</p>}>
              <SonarMap dives={DIVES} index={index} onSelect={setIndex} active={inView} reduced={reduced} />
            </Suspense>
          </ErrorBoundary>
          <p className={`${styles.hint} mono mono--xs`}>Hover or tap a beacon</p>
          <p className={`${styles.coords} mono mono--xs`}>{d.coordinates}</p>
        </div>

        <aside className={styles.panel} aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div key={d.slug} className={styles.card} {...panelMotion}>
              <p className="mono mono--xs">
                {String(d.index).padStart(2, '0')} · {d.stratum} · {formatDepth(d.depth)}
              </p>
              <h2 className="h2">{d.name}</h2>
              <p className={styles.tagline}>{d.tagline}</p>
              <p className="body">{d.summary}</p>
              <dl className={styles.stats}>
                {d.stats.map((s) => (
                  <div key={s.label}>
                    <dt className="mono mono--xs">{s.label}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
              </dl>
              <Button to={`/explore/${d.slug}`}>Open dive log</Button>
            </motion.div>
          </AnimatePresence>
        </aside>
      </div>

      <ol className={styles.list}>
        {DIVES.map((item, i) => (
          <li key={item.slug}>
            <button
              type="button"
              className={`${styles.item} ${i === index ? styles.current : ''}`}
              style={{ '--dot': item.accent }}
              onClick={() => setIndex(i)}
              aria-pressed={i === index}
            >
              <span className="mono mono--xs tnum">{String(i + 1).padStart(2, '0')}</span>
              <span className={styles.itemName}>{item.name}</span>
              <span className="mono mono--xs">{item.stratum}</span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}