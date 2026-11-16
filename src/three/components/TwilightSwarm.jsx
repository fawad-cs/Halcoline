import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, Color, DoubleSide } from 'three';
import { swarmVertex, swarmFragment } from '../shaders/strata';
import { stratumWeight } from '../../utils/strata';
import { mulberry32 } from '../../utils/random';

// Ribbon-fish: one quad per fish, all movement happens in the vertex shader.
function build(count) {
  const rand = mulberry32(2026);
  const pos = new Float32Array(count * 4 * 3);
  const seed = new Float32Array(count * 4);
  const idx = new Uint32Array(count * 6);
  const corners = [-1, -1, 1, -1, 1, 1, -1, 1];

  for (let i = 0; i < count; i++) {
    const s = 1 + rand() * 99;
    for (let c = 0; c < 4; c++) {
      const v = i * 4 + c;
      pos[v * 3] = corners[c * 2];
      pos[v * 3 + 1] = corners[c * 2 + 1];
      pos[v * 3 + 2] = 0;
      seed[v] = s;
    }
    const b = i * 4;
    idx.set([b, b + 1, b + 2, b, b + 2, b + 3], i * 6);
  }
  return { pos, seed, idx };
}

export default function TwilightSwarm({ input, count = 200, reduced }) {
  const mesh = useRef(null);
  const timeRef = useRef(0);
  const { pos, seed, idx } = useMemo(() => build(count), [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uColor: { value: new Color('#bfe6ff') },
    }),
    []
  );

  useFrame((_, dt) => {
    timeRef.current += dt * (reduced ? 0.15 : 1);
    const w = stratumWeight(input.current.scroll, 1);
    uniforms.uTime.value = timeRef.current;
    uniforms.uOpacity.value = w;
    if (mesh.current) mesh.current.visible = w > 0.01;
  });

  return (
    <mesh ref={mesh} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seed, 1]} />
        <bufferAttribute attach="index" args={[idx, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={swarmVertex}
        fragmentShader={swarmFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        side={DoubleSide}
      />
    </mesh>
  );
}