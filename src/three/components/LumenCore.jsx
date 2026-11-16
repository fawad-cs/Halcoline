import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, Color, DoubleSide, MathUtils } from 'three';
import {
  bellVertex,
  bellFragment,
  ribbonVertex,
  ribbonFragment,
} from '../shaders/lumen';

const smooth = (t) => t * t * (3 - 2 * t);

const RINGS = [
  { radius: 2.3, rot: [1.25, 0.1, 0], spin: 0.12, color: '#ff9b2f', seed: 0 },
  { radius: 2.9, rot: [0.35, 0.8, 0], spin: -0.09, color: '#2ee6c8', seed: 0.37 },
  { radius: 3.5, rot: [-0.9, 0.2, 0.5], spin: 0.06, color: '#ece6d8', seed: 0.71 },
];

function Ribbon({ ring, timeRef, segments }) {
  const group = useRef(null);
  const mat = useRef(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSeed: { value: ring.seed },
      uColor: { value: new Color(ring.color) },
    }),
    [ring.seed, ring.color]
  );

  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value = timeRef.current;
    if (group.current) group.current.rotation.z += dt * ring.spin;
  });

  return (
    <group rotation={ring.rot}>
      <group ref={group}>
        <mesh>
          <torusGeometry args={[ring.radius, 0.02, 6, segments]} />
          <shaderMaterial
            ref={mat}
            vertexShader={ribbonVertex}
            fragmentShader={ribbonFragment}
            uniforms={uniforms}
            transparent
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>
      </group>
    </group>
  );
}

// The hero centrepiece. `input` is the shared ref from useSceneInput.
export default function LumenCore({ input, reduced, isMobile, quality = 'high' }) {
  const root = useRef(null);
  const spin = useRef(null);
  const core = useRef(null);
  const bellMat = useRef(null);
  const timeRef = useRef(0);
  const intro = useRef(0);
  const hover = useRef(0);

  const bellUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBreath: { value: 1 },
      uHover: { value: 0 },
      uBase: { value: new Color('#0b3a3f') },
      uGlow: { value: new Color('#2ee6c8') },
    }),
    []
  );

  const low = quality === 'low';

  useFrame((_, dt) => {
    const s = input.current;
    timeRef.current += dt * (reduced ? 0.25 : 1);
    const t = timeRef.current;

    // Reveal on mount, then glide to the side (or up) as the page scrolls.
    intro.current = MathUtils.damp(intro.current, 1, 1.4, dt);
    const k = smooth(MathUtils.clamp(s.page / 0.12, 0, 1));
    const shiftX = isMobile ? 0 : 3.2;
    const shiftY = isMobile ? 2.4 : 1.1;
    const scale = intro.current * MathUtils.lerp(1, isMobile ? 0.5 : 0.62, k);

    if (root.current) {
      root.current.position.set(
        MathUtils.lerp(0, shiftX, k),
        MathUtils.lerp(0, shiftY, k) + Math.sin(t * 0.6) * 0.12,
        MathUtils.lerp(0, -2, k)
      );
      root.current.scale.setScalar(Math.max(0.0001, scale));
    }

    if (spin.current) {
      const follow = reduced ? 0 : 1;
      spin.current.rotation.y = t * 0.12 + s.px * 0.5 * follow;
      spin.current.rotation.x = s.py * 0.2 * follow;
    }

    // Glow brightens when the pointer is near the centre.
    const near = 1 - MathUtils.clamp(Math.hypot(s.px, s.py) / 0.6, 0, 1);
    hover.current = MathUtils.damp(hover.current, reduced ? 0 : near, 4, dt);

    if (bellMat.current) {
      const u = bellMat.current.uniforms;
      u.uTime.value = t;
      u.uHover.value = hover.current;
    }

    if (core.current) core.current.scale.setScalar(1 + 0.12 * Math.sin(t * 2.2));
  });

  return (
    <group ref={root}>
      <group ref={spin}>
        {/* Bell body */}
        <mesh position={[0, -0.4, 0]}>
          <sphereGeometry
            args={[1.6, low ? 48 : 96, low ? 32 : 64, 0, Math.PI * 2, 0, Math.PI * 0.62]}
          />
          <shaderMaterial
            ref={bellMat}
            vertexShader={bellVertex}
            fragmentShader={bellFragment}
            uniforms={bellUniforms}
            transparent
            depthWrite={false}
            side={DoubleSide}
            blending={AdditiveBlending}
          />
        </mesh>

        {/* Inner core + soft halo */}
        <mesh ref={core}>
          <sphereGeometry args={[0.28, 32, 32]} />
          <meshBasicMaterial color="#2ee6c8" toneMapped={false} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.9, 32, 32]} />
          <meshBasicMaterial
            color="#2ee6c8"
            transparent
            opacity={0.07}
            depthWrite={false}
            blending={AdditiveBlending}
            toneMapped={false}
          />
        </mesh>

        {/* Ribbon rings */}
        {RINGS.map((ring) => (
          <Ribbon key={ring.color} ring={ring} timeRef={timeRef} segments={low ? 120 : 240} />
        ))}
      </group>
    </group>
  );
}