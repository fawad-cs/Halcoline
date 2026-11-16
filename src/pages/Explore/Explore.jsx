import PageShell from '../../components/layout/PageShell';
import Footer from '../../components/layout/Footer';
import LineReveal from '../../components/animations/LineReveal';
import ExploreMap from '../../sections/Explore/ExploreMap';
import styles from './Explore.module.css';

export default function Explore() {
  return (
    <PageShell title="Explore">
      <header className={styles.intro}>
        <p className="eyebrow">Sonar map · Station 11</p>
        <LineReveal as="h1" className="display" text="Five places. *One* trench." delay={0.6} />
        <p className="body-lg">
          Every beacon is a dive we have logged. Hover one to send a sonar ping, then open its log.
        </p>
      </header>
      <ExploreMap />
      <Footer />
    </PageShell>
  );
}