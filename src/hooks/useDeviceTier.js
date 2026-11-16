import { useEffect, useState } from 'react';

// Classifies the device so 3D quality can scale.
// tier: 'low' | 'mid' | 'high'

function detect() {
  if (typeof window === 'undefined') {
    return {
      tier: 'mid',
      isMobile: false,
      isTouch: false,
      dpr: [1, 1.5],
      particleCount: 4000,
    };
  }

  const width = window.innerWidth;
  const isMobile = width <= 768;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4; // not available in all browsers

  let tier = 'high';
  if (isMobile || cores <= 4 || memory <= 4) tier = 'mid';
  if ((isMobile && (cores <= 4 || memory <= 2)) || cores <= 2) tier = 'low';

  const config = {
    low: { dpr: [1, 1], particleCount: 1200 },
    mid: { dpr: [1, 1.5], particleCount: isMobile ? 2000 : 4000 },
    high: { dpr: [1, 1.75], particleCount: 6000 },
  }[tier];

  return { tier, isMobile, isTouch, ...config };
}

export default function useDeviceTier() {
  const [info, setInfo] = useState(detect);

  useEffect(() => {
    let frame = 0;
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next = detect();
        // Only update state if something meaningful changed.
        setInfo((prev) =>
          prev.tier === next.tier &&
          prev.isMobile === next.isMobile &&
          prev.isTouch === next.isTouch
            ? prev
            : next
        );
      });
    };

    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return info;
}