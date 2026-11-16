import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, Color } from 'three';
import { causticVertex, causticFragment } from '../shaders/strata';
import { stratumWeight } from '../../utils/strata';

// Moving net of light on a big plane far behind the scene.
export default function CausticLayer({ input, reduced }) {
  const mesh = useRef(null);
  const timeRef = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntensity: { value: 1 },
      uColor: { value: new Color('#9fe8dc') },
    }),
    []
  );

  useFrame((_, dt) => {
    timeRef.current += dt * (reduced ? 0.15 : 1);
    const w = stratumWeight(input.current.scroll, 0);
    uniforms.uTime.value = timeRef.current;
    uniforms.uIntensity.value = w;
    if (mesh.current) mesh.current.visible = w > 0.01;
  });

  return (
    <mesh ref={mesh} position={[0, 2, -9]} frustumCulled={false}>
      <planeGeometry args={[48, 28]} />
      <shaderMaterial
        vertexShader={causticVertex}
        fragmentShader={causticFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </mesh>
  );
}