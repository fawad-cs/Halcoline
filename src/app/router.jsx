import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import PageTransition from '../components/animations/PageTransition';

// Pages are lazy-loaded so each route is its own chunk.
const Home = lazy(() => import('../pages/Home/Home.jsx'));
const Explore = lazy(() => import('../pages/Explore/Explore.jsx'));
const DiveDetail = lazy(() => import('../pages/DiveDetail/DiveDetail.jsx'));
const Experience = lazy(() => import('../pages/Experience/Experience.jsx'));
const About = lazy(() => import('../pages/About/About.jsx'));
const Contact = lazy(() => import('../pages/Contact/Contact.jsx'));
const NotFound = lazy(() => import('../pages/NotFound/NotFound.jsx'));

function Page({ children }) {
  return (
    <PageTransition>
      <Suspense fallback={null}>{children}</Suspense>
    </PageTransition>
  );
}

export default function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Page><Home /></Page>} />
        <Route path="/explore" element={<Page><Explore /></Page>} />
        <Route path="/explore/:slug" element={<Page><DiveDetail /></Page>} />
        <Route path="/experience" element={<Page><Experience /></Page>} />
        <Route path="/about" element={<Page><About /></Page>} />
        <Route path="/contact" element={<Page><Contact /></Page>} />
        <Route path="*" element={<Page><NotFound /></Page>} />
      </Routes>
    </AnimatePresence>
  );
}