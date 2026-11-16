import { useEffect, useRef } from 'react';
import { useScroll, useMotionValueEvent } from 'motion/react';
import PageShell from '../../components/layout/PageShell';
import Footer from '../../components/layout/Footer';
import LineReveal from '../../components/animations/LineReveal';
import Parallax from '../../components/animations/Parallax';
import Button from '../../components/ui/Button';
import { sceneStore } from '../../three/sceneStore';
import { EXPERIENCES } from '../../data/experiences';
import { clamp } from '../../utils/easing';
import styles from './Experience.module.css';

function Chapter({ item, index }) {
  return (
    <article
      className={`${styles.chapter} ${index % 2 ? styles.flip : ''}`}
      style={{ '--tone': item.tone }}
      aria-label={`Chapter ${item.number}`}
    >
      <span className={styles.orb} aria-hidden="true" />

      <div className={styles.side}>
        <Parallax amount={90} className={styles.numWrap}>
          <span className={`${styles.num} tnum`} aria-hidden="true">
            {item.number}
          </span>
        </Parallax>
        <p className={`${styles.kicker} mono mono--xs`}>{item.kicker}</p>
      </div>

      <div className={styles.main}>
        <LineReveal as="h2" className={`h2 ${styles.title}`} text={item.title} />
        <div className={styles.body}>
          {item.body.map((p, i) => (
            <p key={i} className="body">
              {p}
            </p>
          ))}
        </div>
        <blockquote className={styles.quote}>{item.quote}</blockquote>
        <p className={styles.stat}>
          <span className={styles.value}>{item.stat.value}</span>
          <span className="mono mono--xs">{item.stat.label}</span>
        </p>
      </div>
    </article>
  );
}

export default function Experience() {
  const wrapRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end end'],
  });

  // The 3D scene dives as the chapters go by.
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    sceneStore.override = clamp(v, 0, 1);
  });

  useEffect(() => {
    sceneStore.override = 0;
    return () => {
      sceneStore.override = null;
      sceneStore.meters = null;
    };
  }, []);

  return (
    <PageShell title="Experience">
      <div ref={wrapRef}>
        <header className={styles.intro}>
          <p className="eyebrow">Six chapters</p>
          <LineReveal
            as="h1"
            className="display"
            text="A dive, told *slowly.*"
            delay={0.6}
          />
          <p className="body-lg">
            What it feels like to go from sunlight to the floor of the world, one chapter at a
            time. Keep scrolling: the ocean follows.
          </p>
        </header>

        {EXPERIENCES.map((item, i) => (
          <Chapter key={item.id} item={item} index={i} />
        ))}

        <section className={styles.end}>
          <p className="eyebrow">Your turn</p>
          <LineReveal as="h2" className="h1" text="Choose where to *land.*" />
          <div className={styles.actions}>
            <Button to="/explore">Open the map</Button>
            <Button to="/contact" variant="ghost">
              Join an expedition
            </Button>
          </div>
        </section>
      </div>
      <Footer />
    </PageShell>
  );
}