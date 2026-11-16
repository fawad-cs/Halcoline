// Static film grain over the whole site (pure CSS, no per-frame cost).
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const style = {
  position: 'fixed',
  inset: 0,
  zIndex: 'var(--z-grain)',
  pointerEvents: 'none',
  opacity: 0.07,
  backgroundImage: GRAIN,
  backgroundSize: '160px 160px',
  mixBlendMode: 'overlay',
};

export default function GrainOverlay() {
  return <div style={style} aria-hidden="true" />;
}