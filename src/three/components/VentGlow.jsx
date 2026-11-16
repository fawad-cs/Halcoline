import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, Color } from 'three';
import { ventVertex, ventFragment, emberVertex, emberFragment } from '../shaders/strata';
import { stratumWeight } from '../../utils/strata';
import { mulberry32 } from '../../utils/random';

const FLOOR_Y = -4.2;

// A glowing fissure near the bottom of the view, with embers rising from it.
export default function VentGlow({ input, count = 140, reduced }) {
  const group = useRef(null);
  const timeRef = useRef(0);

  const { positions, seeds } = useMemo(() => {
    const rand = mulberry32(9001);
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() + rand() - 1) * 8; // clustered near the centre
      positions[i * 3 + 1] = FLOOR_Y;
      positions[i * 3 + 2] = -6 + rand() * 5;
      seeds[i] = rand();
    }
    return { positions, seeds };
  }, [count]);

  const glowUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uColor: { value: new Color('#ff4a2e') },
    }),
    []
  );

  const emberUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uScale: { value: 1000 },
      uColor: { value: new Color('#ff7a3d') },
    }),
    []
  );

  useFrame((state, dt) => {
    timeRef.current += dt * (reduced ? 0.25 : 1);
    const w = stratumWeight(input.current.scroll, 4);
    const t = timeRef.current;

    glowUniforms.uTime.value = t;
    glowUniforms.uOpacity.value = w;
    emberUniforms.uTime.value = t;
    emberUniforms.uOpacity.value = w;
    emberUniforms.uScale.value = state.size.height * state.gl.getPixelRatio() * 1.207;

    if (group.current) group.current.visible = w > 0.01;
  });

  return (
    <group ref={group}>
      <mesh position={[0, FLOOR_Y, -4]} frustumCulled={false}>
        <planeGeometry args={[28, 12]} />
        <shaderMaterial
          vertexShader={ventVertex}
          fragmentShader={ventFragment}
          uniforms={glowUniforms}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>

      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={emberVertex}
          fragmentShader={emberFragment}
          uniforms={emberUniforms}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>
    </group>
  );
}