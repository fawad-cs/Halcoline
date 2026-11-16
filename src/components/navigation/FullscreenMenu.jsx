import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import useReducedMotion from '../../hooks/useReducedMotion';
import { useScrollContext } from '../../context/ScrollContext';
import { NAV_LINKS, CONTACT_EMAIL } from '../../data/navigation';
import { EASE_OUT, EASE_IN_OUT } from '../../utils/easing';
import styles from './FullscreenMenu.module.css';

// `onClose` must be a stable function (useCallback in Header).
export default function FullscreenMenu({ id, onClose }) {
  const reduced = useReducedMotion();
  const { lenis } = useScrollContext();
  const rootRef = useRef(null);

  // Lock scroll, move focus into the dialog, close on Escape.
  useEffect(() => {
    document.documentElement.classList.add('is-locked');
    if (lenis) lenis.stop();
    rootRef.current?.focus({ preventScroll: true });

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.classList.remove('is-locked');
      if (lenis) lenis.start();
    };
  }, [lenis, onClose]);

  const overlayMotion = reduced
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.3 },
      }
    : {
        initial: { clipPath: 'inset(0% 0% 100% 0%)' },
        animate: { clipPath: 'inset(0% 0% 0% 0%)' },
        exit: { clipPath: 'inset(0% 0% 100% 0%)' },
        transition: { duration: 0.9, ease: EASE_IN_OUT },
      };

  const lineMotion = (i) =>
    reduced
      ? {
          initial: { opacity: 0 },
          animate: { opacity: 1, transition: { duration: 0.3 } },
          exit: { opacity: 0, transition: { duration: 0.2 } },
        }
      : {
          initial: { y: '110%' },
          animate: {
            y: '0%',
            transition: { duration: 1, ease: EASE_OUT, delay: 0.45 + i * 0.08 },
          },
          exit: { y: '110%', transition: { duration: 0.4, ease: EASE_IN_OUT } },
        };

  const fadeMotion = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.8, delay: 1 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      id={id}
      ref={rootRef}
      className={styles.menu}
      role="dialog"
      aria-modal="true"
      aria-label="Main menu"
      tabIndex={-1}
      {...overlayMotion}
    >
      <nav className={styles.nav} aria-label="Main">
        <ul className={styles.list}>
          {NAV_LINKS.map((link, i) => (
            <li key={link.to} className={styles.item}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ''}`
                }
              >
                <span className={styles.mask}>
                  <motion.span className={styles.row} {...lineMotion(i)}>
                    <span className={`${styles.index} mono mono--xs tnum`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className={styles.label}>{link.label}</span>
                    <span className={`${styles.note} mono mono--xs`}>{link.note}</span>
                  </motion.span>
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <motion.div className={styles.footer} {...fadeMotion}>
        <a className="mono" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
        <span className="mono mono--xs">11.3733° N · 142.5917° E</span>
      </motion.div>
    </motion.div>
  );
}