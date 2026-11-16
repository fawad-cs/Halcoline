import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import Button from '../ui/Button';
import LineReveal from '../animations/LineReveal';
import { useScrollContext } from '../../context/ScrollContext';
import { NAV_LINKS, CONTACT_EMAIL } from '../../data/navigation';
import { SOCIALS } from '../../data/socials';
import styles from './Footer.module.css';

export default function Footer() {
  const { lenis } = useScrollContext();

  const backToSurface = () => {
    if (lenis) lenis.scrollTo(0, { duration: 2.2 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <p className="eyebrow">Next expedition</p>
        <LineReveal as="h2" className={`h1 ${styles.cta}`} text="Ready to *descend?*" />
        <Button to="/contact">Send a signal</Button>
      </div>

      <div className={styles.columns}>
        <nav aria-label="Footer">
          <h3 className="mono mono--xs">Navigate</h3>
          <ul className={styles.list}>
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className={styles.link}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="mono mono--xs">Follow</h3>
          <ul className={styles.list}>
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a href={s.href} className={styles.link} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mono mono--xs">Contact</h3>
          <ul className={styles.list}>
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className={styles.link}>
                {CONTACT_EMAIL}
              </a>
            </li>
            <li className="mono mono--xs">11.3733° N · 142.5917° E</li>
          </ul>
        </div>

        <button type="button" className={styles.surface} onClick={backToSurface}>
          <span className="mono">Back to surface</span>
          <ArrowUp size={16} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      <p className={styles.wordmark} aria-hidden="true">
        HALOCLINE
      </p>

      <div className={styles.legal}>
        <span className="mono mono--xs">© {new Date().getFullYear()} Halocline Expeditions</span>
        <span className="mono mono--xs">Depth 11,000 m</span>
      </div>
    </footer>
  );
}