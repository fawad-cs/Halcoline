import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import useReducedMotion from '../../hooks/useReducedMotion';
import { useScrollContext } from '../../context/ScrollContext';
import { sceneStore } from '../../three/sceneStore';
import { DIVES, formatDepth } from '../../data/dives';
import { clamp, EASE_OUT } from '../../utils/easing';
import styles from './DescentStory.module.css';

// A tall section with a sticky 100vh stage inside.
// Scrolling through it steps through the five dives, and drives the 3D depth.
export default function DescentStory() {
  const reduced = useReducedMotion();
  const { lenis } = useScrollContext();
  const sectionRef = useRef(null);
  const depthRef = useRef(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const apply = (raw) => {
    const p = clamp(Number.isFinite(raw) ? raw : 0, 0, 1);
    const scaled = p * DIVES.length;
    const index = Math.min(DIVES.length - 1, Math.floor(scaled));
    const local = clamp(scaled - index, 0, 1);
    const { from, to } = DIVES[index].depth;

    // Steer the 3D scene: strata now match the chapters exactly.
        sceneStore.override = p;
        sceneStore.meters = Math.round(from + (to - from) * local);

    setActive(index);
    if (depthRef.current) {
      depthRef.current.textContent = Math.round(from + (to - from) * local).toLocaleString('en-US');
    }
  };

  useMotionValueEvent(scrollYProgress, 'change', apply);

  // Take control of the 3D depth while this section exists.
  useEffect(() => {
    apply(scrollYProgress.get());
    return () => {
      sceneStore.override = null;
      sceneStore.meters = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const jumpTo = (index) => {
    const el = sectionRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    const target = top + ((index + 0.5) / DIVES.length) * travel;
    if (lenis) lenis.scrollTo(target, { duration: 1.6 });
    else window.scrollTo({ top: target, behavior: 'smooth' });
  };

  const dive = DIVES[active];

  const chapterMotion = reduced
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.2 } },
      }
    : {
        initial: { opacity: 0, y: 48 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT } },
        exit: { opacity: 0, y: -32, transition: { duration: 0.35 } },
      };

  return (
    <section
      ref={sectionRef}
      className={styles.story}
      style={{ '--chapters': DIVES.length }}
      aria-label="The descent, five dives"
    >
      <div className={styles.sticky} style={{ '--accent': dive.accent }}>
        <header className={styles.head}>
          <p className="eyebrow">The descent</p>
          <p className={styles.depth}>
            <span className="mono mono--xs">Depth</span>
            <span className={`${styles.number} tnum`}>
              <span ref={depthRef}>0</span>
              <span className="mono mono--xs"> M</span>
            </span>
          </p>
        </header>

        <div className={styles.stage}>
          <AnimatePresence mode="wait">
            <motion.article key={dive.slug} className={styles.chapter} {...chapterMotion}>
              <p className={`${styles.index} mono tnum`}>
                {String(dive.index).padStart(2, '0')} / {String(DIVES.length).padStart(2, '0')} ·{' '}
                {dive.stratum}
              </p>
              <h2 className={`h1 ${styles.name}`}>{dive.name}</h2>
              <p className={styles.tagline}>{dive.tagline}</p>
              <p className="body">{dive.summary}</p>
              <p className={`${styles.range} mono mono--xs`}>{formatDepth(dive.depth)}</p>
              <Link to={`/explore/${dive.slug}`} className={`${styles.more} mono`}>
                Dive details
                <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
              </Link>
            </motion.article>
          </AnimatePresence>
        </div>

        <ol className={styles.rail}>
          {DIVES.map((d, i) => (
            <li key={d.slug}>
              <button
                type="button"
                className={`${styles.tick} ${i === active ? styles.current : ''}`}
                style={{ '--tick': d.accent }}
                onClick={() => jumpTo(i)}
                aria-current={i === active ? 'step' : undefined}
                aria-label={`Go to ${d.name}`}
              >
                <span className={styles.bar} aria-hidden="true" />
                <span className="mono mono--xs tnum">{String(i + 1).padStart(2, '0')}</span>
                <span className={`${styles.tickName} mono mono--xs`}>{d.stratum}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}