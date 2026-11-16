import { useRef } from 'react';
import { motion, useScroll } from 'motion/react';
import PageShell from '../../components/layout/PageShell';
import Footer from '../../components/layout/Footer';
import LineReveal from '../../components/animations/LineReveal';
import Button from '../../components/ui/Button';
import useReducedMotion from '../../hooks/useReducedMotion';
import { TIMELINE, PHILOSOPHY, ABOUT_FACTS } from '../../data/timeline';
import { EASE_OUT } from '../../utils/easing';
import styles from './About.module.css';

export default function About() {
  const reduced = useReducedMotion();
  const lineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: ['start 70%', 'end 60%'],
  });

  const rise = reduced
    ? { initial: { opacity: 0 }, whileInView: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 36 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 1, ease: EASE_OUT },
      };

  return (
    <PageShell title="About">
      <header className={styles.hero}>
        <p className="eyebrow">The expedition</p>
        <LineReveal
          as="h1"
          className="display"
          text="We go down so you can *see.*"
          delay={0.6}
        />
      </header>

      <section className={styles.mission}>
        <p className={`${styles.label} mono mono--xs`}>Mission</p>
        <div className={styles.missionText}>
          <motion.p className="body-lg" {...rise} viewport={{ once: true, amount: 0.5 }}>
            HALOCLINE is a small collective of divers, engineers and writers. Since 2019 we have
            returned to one patch of ocean, Station 11, and recorded what lives from the surface to
            the floor of the trench.
          </motion.p>
          <motion.p className="body" {...rise} viewport={{ once: true, amount: 0.5 }}>
            Our aim is simple: make the deep ocean something people can feel, not only read about.
            This website is a slow dive made from our own logs, measurements and field notes.
          </motion.p>
        </div>
      </section>

      <section className={styles.facts} aria-label="In numbers">
        <dl>
          {ABOUT_FACTS.map((f) => (
            <div key={f.label}>
              <dd className={styles.factValue}>{f.value}</dd>
              <dt className="mono mono--xs">{f.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      <section className={styles.philosophy} aria-labelledby="philosophy-title">
        <p id="philosophy-title" className={`${styles.label} mono mono--xs`}>
          Philosophy
        </p>
        <ol className={styles.rules}>
          {PHILOSOPHY.map((rule, i) => (
            <motion.li
              key={rule.title}
              className={styles.rule}
              {...rise}
              viewport={{ once: true, amount: 0.6 }}
            >
              <span className="mono mono--xs tnum">{String(i + 1).padStart(2, '0')}</span>
              <h2 className={styles.ruleTitle}>{rule.title}</h2>
              <p className="body">{rule.text}</p>
            </motion.li>
          ))}
        </ol>
      </section>

      <section className={styles.timeline} aria-labelledby="timeline-title">
        <p id="timeline-title" className={`${styles.label} mono mono--xs`}>
          Timeline
        </p>
        <ol ref={lineRef} className={styles.events}>
          <span className={styles.track} aria-hidden="true">
            <motion.span className={styles.fill} style={{ scaleY: scrollYProgress }} />
          </span>
          {TIMELINE.map((e) => (
            <motion.li
              key={e.year}
              className={styles.event}
              {...rise}
              viewport={{ once: true, amount: 0.5 }}
            >
              <span className={`${styles.year} tnum`}>{e.year}</span>
              <div>
                <h3 className={styles.eventTitle}>{e.title}</h3>
                <p className="body">{e.text}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </section>

      <section className={styles.end}>
        <LineReveal as="h2" className="h1" text="Come and *dive* with us." />
        <Button to="/contact">Send a signal</Button>
      </section>
      <Footer />
    </PageShell>
  );
}