import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { ScrollProvider } from '../context/ScrollContext';
import Preloader from '../components/animations/Preloader';
import Header from '../components/layout/Header';
import DepthGauge from '../components/navigation/DepthGauge';
import CustomCursor from '../components/effects/CustomCursor';
import RouteAnnouncer from '../components/effects/RouteAnnouncer';
import ErrorBoundary from '../components/effects/ErrorBoundary';
import AppRoutes from './router';
import GrainOverlay from '../components/layout/GrainOverlay';

// The whole 3D scene is its own lazy chunk.
const SceneRoot = lazy(() => import('../three/scenes/SceneRoot.jsx'));

// Shown if WebGL is unavailable: a plain depth gradient.
const fallbackStyle = {
  position: 'fixed',
  inset: 0,
  zIndex: 0,
  background:
    'radial-gradient(100% 80% at 50% 20%, #0f3a40 0%, #06141d 55%, #03090c 100%)',
};

// True once fonts and the window load event have finished.
function useAssetsReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fonts = document.fonts?.ready ?? Promise.resolve();
    const loaded =
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise((resolve) =>
            window.addEventListener('load', resolve, { once: true })
          );

    Promise.all([fonts, loaded]).then(() => {
      if (!cancelled) setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return ready;
}

export default function App() {
  const assetsReady = useAssetsReady();
  const [sceneReady, setSceneReady] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);

  const markSceneReady = useCallback(() => setSceneReady(true), []);
  const handleDone = useCallback(() => setShowPreloader(false), []);

  // Safety net: never let the preloader hang if the scene is slow.
  useEffect(() => {
    const id = window.setTimeout(markSceneReady, 8000);
    return () => window.clearTimeout(id);
  }, [markSceneReady]);

  return (
    <BrowserRouter>
      <ScrollProvider>
        <a className="skip-link" href="#main">
          Skip to content
        </a>

        <ErrorBoundary
          onError={markSceneReady}
          fallback={<div style={fallbackStyle} aria-hidden="true" />}
        >
          <Suspense fallback={null}>
            <SceneRoot onReady={markSceneReady} />
          </Suspense>
        </ErrorBoundary>
        <RouteAnnouncer />
        <Header />
        <DepthGauge />
        <AppRoutes />
        <CustomCursor />
        <GrainOverlay />

        <AnimatePresence>
          {showPreloader && (
            <Preloader
              key="preloader"
              ready={assetsReady && sceneReady}
              onDone={handleDone}
            />
          )}
        </AnimatePresence>
      </ScrollProvider>
    </BrowserRouter>
  );
}