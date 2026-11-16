import { useEffect, useRef, useState } from 'react';
import { MAX_DEPTH, STRATA } from '../../data/navigation';
import { sceneStore } from '../../three/sceneStore';
import { clamp } from '../../utils/easing';
import styles from './DepthGauge.module.css';

// Live depth readout. Follows the page scroll, or the Descent Story
// (via sceneStore) while that section is on screen.
// Everything is written straight to the DOM: no re-render per frame.
export default function DepthGauge() {
  const valueRef = useRef(null);
  const fillRef = useRef(null);
  const [stratum, setStratum] = useState(0);

  useEffect(() => {
    let frame = 0;
    let shown = 0;
    let last = -1;

    const tick = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const page = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
      const p = sceneStore.override ?? page;
      const target = sceneStore.meters ?? p * MAX_DEPTH;

      shown += (target - shown) * 0.15;
      if (Math.abs(target - shown) < 0.5) shown = target;

      if (valueRef.current) {
        valueRef.current.textContent = String(Math.round(shown)).padStart(5, '0');
      }
      if (fillRef.current) {
        fillRef.current.style.transform = `scaleY(${clamp(shown / MAX_DEPTH, 0, 1)})`;
      }

      const index = Math.min(STRATA.length - 1, Math.floor(p * STRATA.length));
      if (index !== last) {
        last = index;
        setStratum(index);
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Tint the UI with the current depth.
  useEffect(() => {
    document.documentElement.style.setProperty('--depth-tint', STRATA[stratum].tint);
  }, [stratum]);

  return (
    <aside className={styles.gauge} aria-hidden="true">
      <div className={styles.readout}>
        <span className="mono mono--xs">Depth</span>
        <span className={styles.value}>
          <span ref={valueRef} className="tnum">00000</span>
          <span className="mono mono--xs mono--accent"> M</span>
        </span>
      </div>

      <div className={styles.scale}>
        <ul className={styles.strata}>
          {STRATA.map((s, i) => (
            <li key={s.id} className={i === stratum ? styles.current : ''}>
              <span className="mono mono--xs">{s.name}</span>
            </li>
          ))}
        </ul>
        <div className={styles.track}>
          <div ref={fillRef} className={styles.fill} style={{ transform: 'scaleY(0)' }} />
        </div>
      </div>
    </aside>
  );
}