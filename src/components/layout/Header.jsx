import { useCallback, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import { AnimatePresence } from 'motion/react';
import MenuButton from '../navigation/MenuButton';
import FullscreenMenu from '../navigation/FullscreenMenu';
import { EASE_OUT } from '../../utils/easing';
import styles from './Header.module.css';

const MENU_ID = 'site-menu';

export default function Header() {
  const location = useLocation();
  // The menu is "open" only for the route it was opened on,
  // so any route change closes it without an effect.
  const [openAt, setOpenAt] = useState(null);
  const open = openAt === location.pathname;
  const [hidden, setHidden] = useState(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(latest > previous && latest > 160);
  });

  const close = useCallback(() => setOpenAt(null), []);
  const toggle = () => setOpenAt(open ? null : location.pathname);

  return (
    <>
      <motion.header
        className={styles.header}
        animate={{ y: hidden && !open ? '-110%' : '0%' }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
      >
        <Link to="/" className={styles.logo} aria-label="HALOCLINE — home" onClick={close}>
          <svg className={styles.mark} viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="16" cy="16" r="11" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="16" cy="16" r="2.5" fill="var(--biolume)" />
          </svg>
          <span className={styles.word}>HALOCLINE</span>
        </Link>

        <div className={styles.actions}>
          <Link to="/contact" className={`${styles.cta} mono`} onClick={close}>
            Send a signal
          </Link>
          <MenuButton open={open} onToggle={toggle} controlsId={MENU_ID} />
        </div>
      </motion.header>

      <AnimatePresence>
        {open && <FullscreenMenu key="menu" id={MENU_ID} onClose={close} />}
      </AnimatePresence>
    </>
  );
}