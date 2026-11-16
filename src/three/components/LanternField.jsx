import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, Color } from 'three';
import { lanternVertex, lanternFragment } from '../shaders/strata';
import { stratumWeight } from '../../utils/strata';
import { mulberry32 } from '../../utils/random';

// Amber lanterns hanging in the dark, each flashing on its own rhythm.
export default function LanternField({ input, count = 120, reduced }) {
  const points = useRef(null);
  const timeRef = useRef(0);

  const { positions, seeds } = useMemo(() => {
    const rand = mulberry32(777);
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * 22;
      positions[i * 3 + 1] = (rand() - 0.5) * 13;
      positions[i * 3 + 2] = -10 + rand() * 11.5; // -10 .. 1.5
      seeds[i] = rand();
    }
    return { positions, seeds };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uScale: { value: 1000 },
      uColor: { value: new Color('#ff9b2f') },
    }),
    []
  );

  useFrame((state, dt) => {
    timeRef.current += dt * (reduced ? 0.2 : 1);
    const w = stratumWeight(input.current.scroll, 2);
    uniforms.uTime.value = timeRef.current;
    uniforms.uOpacity.value = w;
    uniforms.uScale.value = state.size.height * state.gl.getPixelRatio() * 1.207;
    if (points.current) points.current.visible = w > 0.01;
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={lanternVertex}
        fragmentShader={lanternFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}