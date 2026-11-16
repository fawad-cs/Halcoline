import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, Color, DoubleSide } from 'three';
import { shaftVertex, shaftFragment } from '../shaders/strata';
import { stratumWeight } from '../../utils/strata';

// Sunlight falling through the water. Only visible near the surface.
const SHAFTS = [
  { x: -6.5, z: -5, w: 3.2, rot: 0.28 },
  { x: -2.8, z: -7, w: 2.4, rot: 0.22 },
  { x: 1.2, z: -4, w: 3.6, rot: 0.3 },
  { x: 5.0, z: -6, w: 2.6, rot: 0.2 },
  { x: 8.5, z: -5, w: 3.0, rot: 0.26 },
];

export default function LightShafts({ input, reduced }) {
  const group = useRef(null);
  const timeRef = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntensity: { value: 1 },
      uColor: { value: new Color('#bff5ea') },
    }),
    []
  );

  useFrame((_, dt) => {
    timeRef.current += dt * (reduced ? 0.15 : 1);
    const w = stratumWeight(input.current.scroll, 0);
    uniforms.uTime.value = timeRef.current;
    uniforms.uIntensity.value = w;
    if (group.current) group.current.visible = w > 0.01;
  });

  return (
    <group ref={group}>
      {SHAFTS.map((s, i) => (
        <mesh key={i} position={[s.x, 2, s.z]} rotation={[0, 0, s.rot]} frustumCulled={false}>
          <planeGeometry args={[s.w, 30]} />
          <shaderMaterial
            vertexShader={shaftVertex}
            fragmentShader={shaftFragment}
            uniforms={uniforms}
            transparent
            depthWrite={false}
            blending={AdditiveBlending}
            side={DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}