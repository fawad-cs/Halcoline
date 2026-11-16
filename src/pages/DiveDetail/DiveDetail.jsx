import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import PageShell from '../../components/layout/PageShell';
import Footer from '../../components/layout/Footer';
import LineReveal from '../../components/animations/LineReveal';
import Button from '../../components/ui/Button';
import NotFound from '../NotFound/NotFound';
import { sceneStore } from '../../three/sceneStore';
import { DIVES, getDive, getRelatedDives, formatDepth } from '../../data/dives';
import styles from './DiveDetail.module.css';

export default function DiveDetail() {
  const { slug } = useParams();
  const dive = getDive(slug);

  // Park the 3D scene in this dive's stratum.
  useEffect(() => {
    if (!dive) return undefined;
    const i = DIVES.findIndex((d) => d.slug === dive.slug);
    sceneStore.override = (i + 0.5) / DIVES.length;
    sceneStore.meters = Math.round((dive.depth.from + dive.depth.to) / 2);
    return () => {
      sceneStore.override = null;
      sceneStore.meters = null;
    };
  }, [dive]);

  if (!dive) return <NotFound />;

  const related = getRelatedDives(dive.slug, 2);

  return (
    <PageShell title={dive.name}>
      <div style={{ '--accent': dive.accent }} className={styles.page}>
        <header className={styles.hero}>
          <Link to="/explore" className={`${styles.back} mono`}>
            <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" />
            All destinations
          </Link>
          <p className={`${styles.meta} mono`}>
            {String(dive.index).padStart(2, '0')} / {String(DIVES.length).padStart(2, '0')} ·{' '}
            {dive.stratum} · {formatDepth(dive.depth)}
          </p>
          <LineReveal as="h1" className={`display ${styles.name}`} text={dive.name} delay={0.5} />
          <p className={styles.tagline}>{dive.tagline}</p>
          <p className="mono mono--xs">{dive.coordinates}</p>
        </header>

        <section className={styles.stats} aria-label="Dive data">
          <dl>
            {dive.stats.map((s) => (
              <div key={s.label}>
                <dt className="mono mono--xs">{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={styles.story}>
          <h2 className="eyebrow">The dive</h2>
          <div className={styles.text}>
            {dive.description.map((p, i) => (
              <p key={i} className={i === 0 ? 'body-lg' : 'body'}>
                {p}
              </p>
            ))}
          </div>
        </section>

        <section className={styles.cols}>
          <div>
            <h2 className="eyebrow">Species logged</h2>
            <ul className={styles.species}>
              {dive.species.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="eyebrow">Dive log</h2>
            <ol className={styles.log}>
              {dive.log.map((entry) => (
                <li key={entry.time}>
                  <span className="mono tnum">{entry.time}</span>
                  <span>{entry.note}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className={styles.related} aria-label="Related dives">
          <h2 className="eyebrow">Continue the descent</h2>
          <ul>
            {related.map((r) => (
              <li key={r.slug}>
                <Link to={`/explore/${r.slug}`} className={styles.next} style={{ '--next': r.accent }}>
                  <span className="mono mono--xs">
                    {r.stratum} · {formatDepth(r.depth)}
                  </span>
                  <span className={styles.nextName}>{r.name}</span>
                  <ArrowUpRight size={22} strokeWidth={1.5} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          <Button to="/contact" variant="ghost">
            Join an expedition
          </Button>
        </section>
      </div>
      <Footer />
    </PageShell>
  );
}