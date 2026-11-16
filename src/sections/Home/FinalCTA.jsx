import Button from '../../components/ui/Button';
import LineReveal from '../../components/animations/LineReveal';
import styles from './FinalCTA.module.css';

export default function FinalCTA() {
  return (
    <section className={styles.cta} aria-labelledby="cta-title">
      <div className={styles.rings} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <p className="eyebrow">The next dive</p>
      <LineReveal
        as="h2"
        className={`display ${styles.title}`}
            text="Hold your breath. Go *deeper.*"
      />
      <p className="body-lg">
        Pick a destination, read the dive log, or send us a signal. The trench is patient.
      </p>
      <div className={styles.actions}>
        <Button to="/explore">Explore the dives</Button>
        <Button to="/experience" variant="ghost">
          Read the story
        </Button>
      </div>
    </section>
  );
}