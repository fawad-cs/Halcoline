import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Color, MathUtils } from 'three';
import useDeviceTier from '../../hooks/useDeviceTier';
import useReducedMotion from '../../hooks/useReducedMotion';
import useSceneInput from '../hooks/useSceneInput';
import { sceneStore } from '../sceneStore';
import LumenCore from '../components/LumenCore';
import MarineSnow from '../components/MarineSnow';
import LightShafts from '../components/LightShafts';
import CausticLayer from '../components/CausticLayer';
import TwilightSwarm from '../components/TwilightSwarm';
import LanternField from '../components/LanternField';
import PulseColony from '../components/PulseColony';
import VentGlow from '../components/VentGlow';
import styles from './SceneRoot.module.css';

// Scene colour at each stratum (Surface -> Hadal). Interpolated by depth.
const STRATA_COLORS = ['#0f3a40', '#0a2a3a', '#06141d', '#03090c', '#16080a'].map(
  (c) => new Color(c)
);
const mix = new Color();

// Object counts per device tier.
const COUNTS = {
  low: { swarm: 90, lanterns: 60, embers: 60 },
  mid: { swarm: 170, lanterns: 110, embers: 110 },
  high: { swarm: 260, lanterns: 160, embers: 160 },
};

// Smooths scroll + pointer once per frame, and drives the camera.
//   s.scroll = depth (0..1). Follows sceneStore.override when a page sets it.
//   s.page   = real page scroll (0..1), used for the Lumen Core glide.
function Rig({ input, reduced }) {
  const camera = useThree((s) => s.camera);

  useFrame((_, dt) => {
    const s = input.current;
    const depthTarget = sceneStore.override ?? s.scrollTarget;
    s.scroll = MathUtils.damp(s.scroll, depthTarget, 4, dt);
    s.page = MathUtils.damp(s.page ?? 0, s.scrollTarget, 4, dt);
    s.px = MathUtils.damp(s.px, s.pxT, 3, dt);
    s.py = MathUtils.damp(s.py, s.pyT, 3, dt);

    const follow = reduced ? 0 : 1;
    camera.position.x = s.px * 0.4 * follow;
    camera.position.y = s.py * 0.25 * follow;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Background colour and fog density follow the depth.
function Atmosphere({ input }) {
  const bg = useRef(null);
  const fog = useRef(null);

  useFrame(() => {
    const p = input.current.scroll;
    const f = p * (STRATA_COLORS.length - 1);
    const i = Math.min(STRATA_COLORS.length - 2, Math.floor(f));
    mix.copy(STRATA_COLORS[i]).lerp(STRATA_COLORS[i + 1], f - i);

    if (bg.current) bg.current.copy(mix);
    if (fog.current) {
      fog.current.color.copy(mix);
      fog.current.density = MathUtils.lerp(0.035, 0.06, p);
    }
  });

  return (
    <>
      <color ref={bg} attach="background" args={['#0f3a40']} />
      <fogExp2 ref={fog} attach="fog" args={['#0f3a40', 0.035]} />
    </>
  );
}

// The one persistent canvas behind the whole app.
export default function SceneRoot({ onReady }) {
  const tier = useDeviceTier();
  const reduced = useReducedMotion();
  const input = useSceneInput();
  const [visible, setVisible] = useState(() => !document.hidden);
  const counts = COUNTS[tier.tier] ?? COUNTS.mid;

  // Pause rendering completely while the tab is hidden.
  useEffect(() => {
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  return (
    <div className={styles.wrap} aria-hidden="true">
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={tier.dpr}
        camera={{ position: [0, 0, 9], fov: 45, near: 0.1, far: 60 }}
        gl={{
          antialias: tier.tier !== 'low',
          alpha: false,
          powerPreference: 'high-performance',
        }}
        onCreated={() => {
          window.setTimeout(() => onReady?.(), 300);
        }}
      >
        <Atmosphere input={input} />
        <Rig input={input} reduced={reduced} />

        {tier.tier !== 'low' && <CausticLayer input={input} reduced={reduced} />}
        <LightShafts input={input} reduced={reduced} />
        <TwilightSwarm input={input} count={counts.swarm} reduced={reduced} />
        <LanternField input={input} count={counts.lanterns} reduced={reduced} />
        <PulseColony input={input} reduced={reduced} />
        <VentGlow input={input} count={counts.embers} reduced={reduced} />

        <LumenCore
          input={input}
          reduced={reduced}
          isMobile={tier.isMobile}
          quality={tier.tier}
        />
        <MarineSnow input={input} count={tier.particleCount} reduced={reduced} />
      </Canvas>
    </div>
  );
}