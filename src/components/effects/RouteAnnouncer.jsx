import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function RouteAnnouncer() {
  const { pathname } = useLocation();
  const first = useRef(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Skip the very first load: the preloader handles that.
    if (first.current) {
      first.current = false;
      return undefined;
    }
    const id = window.setTimeout(() => {
      setMessage(`Navigated to ${document.title}`);
      document.getElementById('main')?.focus({ preventScroll: true });
    }, 1300);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return (
    <div className="sr-only" role="status" aria-live="polite">
      {message}
    </div>
  );
}