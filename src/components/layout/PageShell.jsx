import { useEffect } from 'react';
import styles from './PageShell.module.css';

const SITE = 'HALOCLINE';

// Wraps every page: <main> landmark (skip-link target) + document title.
export default function PageShell({ title, className = '', children }) {
  useEffect(() => {
    document.title = title
      ? `${title} — ${SITE}`
      : `${SITE} — A Descent Through Five Strata`;
  }, [title]);

  return (
    <main id="main" tabIndex={-1} className={`${styles.shell} ${className}`}>
      {children}
    </main>
  );
}