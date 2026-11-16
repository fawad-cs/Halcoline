import PageShell from '../../components/layout/PageShell';
import Button from '../../components/ui/Button';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <PageShell title="Signal lost">
      <section className={styles.wrap}>
        <div className={styles.rings} aria-hidden="true">
          <span />
          <span />
          <span />
          <i className={styles.blip} />
        </div>

        <p className="eyebrow">Error 404</p>
        <h1 className={`display ${styles.title}`}>
          Signal <em>lost</em>
        </h1>
        <p className="body-lg">
          Our sonar swept the whole trench and found nothing at this address. The page may have
          moved, or never existed.
        </p>
        <div className={styles.actions}>
          <Button to="/">Back to the surface</Button>
          <Button to="/explore" variant="ghost">
            Open the map
          </Button>
        </div>
      </section>
    </PageShell>
  );
}