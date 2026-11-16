import { useEffect, useRef } from 'react';

// One shared, mutable object for the 3D scene (no React re-renders):
//   scroll / scrollTarget : page progress 0..1 (scroll = smoothed copy)
//   px / py               : pointer -1..1   (smoothed copy of pxT / pyT)
// The Rig inside SceneRoot smooths the values every frame.
export default function useSceneInput() {
  const input = useRef({
    scroll: 0,
    scrollTarget: 0,
    px: 0,
    py: 0,
    pxT: 0,
    pyT: 0,
  });

  useEffect(() => {
    const s = input.current;

    const readScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      s.scrollTarget = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };

    const onMove = (e) => {
      s.pxT = (e.clientX / window.innerWidth) * 2 - 1;
      s.pyT = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    readScroll();
    window.addEventListener('scroll', readScroll, { passive: true });
    window.addEventListener('resize', readScroll);
    window.addEventListener('pointermove', onMove, { passive: true });

    // Page height changes when a new route mounts.
    const observer = new ResizeObserver(readScroll);
    observer.observe(document.body);

    return () => {
      window.removeEventListener('scroll', readScroll);
      window.removeEventListener('resize', readScroll);
      window.removeEventListener('pointermove', onMove);
      observer.disconnect();
    };
  }, []);

  return input;
}