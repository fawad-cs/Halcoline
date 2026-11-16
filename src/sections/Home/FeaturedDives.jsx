import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import LineReveal from '../../components/animations/LineReveal';
import useReducedMotion from '../../hooks/useReducedMotion';
import { DIVES, formatDepth } from '../../data/dives';
import styles from './FeaturedDives.module.css';

// Desktop: a tall section with a sticky stage; vertical scroll slides the
// track sideways. Mobile / reduced motion: a normal swipeable strip.
export default function FeaturedDives() {
  const reduced = useReducedMotion();
  const [wide, setWide] = useState(() => window.matchMedia('(min-width: 769px)').matches);
  const pinned = wide && !reduced;

  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [metrics, setMetrics] = useState({ shift: 0, height: 0 });

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 769px)');
    const onChange = () => setWide(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  // Measure how far the track has to travel.
  useEffect(() => {
    if (!pinned) return undefined;
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      const shift = Math.max(0, track.scrollWidth - window.innerWidth);
      setMetrics({ shift, height: shift + window.innerHeight });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(trackRef.current);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [pinned]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -metrics.shift]);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      style={pinned && metrics.height ? { height: metrics.height } : undefined}
      aria-label="Featured dives"
    >
      <div className={pinned ? styles.sticky : styles.flow}>
        <header className={styles.head}>
          <div className={styles.title}>
            <p className="eyebrow">Featured dives</p>
            <LineReveal as="h2" className="h2" text="Five places *nobody* had seen." />
          </div>
          <Link to="/explore" className={`${styles.all} mono`}>
            All destinations
            <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
          </Link>
        </header>

        <div className={pinned ? styles.window : styles.scroller}>
          <motion.ul
            ref={trackRef}
            className={styles.track}
            style={pinned ? { x } : undefined}
          >
            {DIVES.map((d) => (
              <li key={d.slug} className={styles.item}>
                <Link
                  to={`/explore/${d.slug}`}
                  className={styles.panel}
                  style={{ '--accent': d.accent, '--bg': d.background }}
                  data-variant={d.variant}
                >
                  <span className={`${styles.num} tnum`} aria-hidden="true">
                    {String(d.index).padStart(2, '0')}
                  </span>
                  <span className={styles.art} aria-hidden="true" />
                  <span className={styles.info}>
                    <span className="mono mono--xs">
                      {d.stratum} · {formatDepth(d.depth)}
                    </span>
                    <span className={styles.name}>{d.name}</span>
                    <span className={styles.tagline}>{d.tagline}</span>
                  </span>
                  <ArrowUpRight className={styles.go} size={22} strokeWidth={1.5} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </motion.ul>
        </div>

        {pinned && (
          <div className={styles.progress} aria-hidden="true">
            <motion.span className={styles.progressFill} style={{ scaleX: scrollYProgress }} />
          </div>
        )}
      </div>
    </section>
  );
}