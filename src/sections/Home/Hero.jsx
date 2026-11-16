import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import Button from '../../components/ui/Button';
import LineReveal from '../../components/animations/LineReveal';
import useReducedMotion from '../../hooks/useReducedMotion';
import { useScrollContext } from '../../context/ScrollContext';
import { ABOUT_FACTS } from '../../data/timeline';
import { EASE_OUT } from '../../utils/easing';
import styles from './Hero.module.css';

// Seconds to wait so the intro plays after the preloader wipes away.
const INTRO = 1.5;

export default function Hero() {
  const reduced = useReducedMotion();
  const { lenis } = useScrollContext();

  const fade = (delay) =>
    reduced
      ? {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.4, delay: 0.2 },
        }
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1.2, ease: EASE_OUT, delay },
        };

  const scrollDown = () => {
    const top = window.innerHeight;
    if (lenis) lenis.scrollTo(top, { duration: 1.8 });
    else window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <motion.div className={styles.top} {...fade(INTRO)}>
        <p className="eyebrow">Expedition 01 · Station 11</p>
        <p className="mono mono--xs">Five strata · 11,000 metres</p>
      </motion.div>

      <div className={styles.main}>
        <LineReveal
          as="h1"
          className={`display ${styles.title}`}
          text="Descend through the *living* dark."
          delay={INTRO}
          stagger={0.08}
        />

        <div className={styles.side}>
          <motion.p className="body-lg" {...fade(INTRO + 0.9)}>
            A slow, cinematic dive from sunlit shallows to the glowing floor of the deepest
            trench on Earth. Scroll, and the ocean does the rest.
          </motion.p>
          <motion.div className={styles.actions} {...fade(INTRO + 1.1)}>
            <Button to="/explore">Begin the dive</Button>
            <Button to="/about" variant="ghost">
              The expedition
            </Button>
          </motion.div>
        </div>
      </div>

      <motion.div className={styles.bottom} {...fade(INTRO + 1.3)}>
        <dl className={styles.facts}>
          {ABOUT_FACTS.slice(0, 3).map((fact) => (
            <div key={fact.label} className={styles.fact}>
              <dt className="mono mono--xs">{fact.label}</dt>
              <dd className={styles.value}>{fact.value}</dd>
            </div>
          ))}
        </dl>

        <button type="button" className={styles.scroll} onClick={scrollDown}>
          <span className="mono mono--xs">Scroll to dive</span>
          <span className={styles.line} aria-hidden="true" />
          <ChevronDown size={14} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </motion.div>
    </section>
  );
}