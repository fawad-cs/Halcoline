import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, Color } from 'three';
import { snowVertex, snowFragment } from '../shaders/snow';

const BOX = [24, 20, 16];

// Small seeded random so particles are identical on every render.
function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function MarineSnow({ input, count = 4000, reduced = false }) {
  const mat = useRef(null);
  const timeRef = useRef(0);

  const { positions, seeds } = useMemo(() => {
    const rand = mulberry32(1337);
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * BOX[0];
      positions[i * 3 + 1] = (rand() - 0.5) * BOX[1];
      positions[i * 3 + 2] = -10 + rand() * 15; // z from -10 to 5
      seeds[i] = rand();
    }
    return { positions, seeds };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uScale: { value: 1000 },
      uBox: { value: BOX },
      uColor: { value: new Color('#ece6d8') },
    }),
    []
  );

  useFrame((state, dt) => {
    if (!mat.current) return;
    timeRef.current += dt * (reduced ? 0.2 : 1);
    const u = mat.current.uniforms;
    u.uTime.value = timeRef.current;
    u.uScroll.value = input.current.scroll;
    // pixels per world unit at distance 1 (fov 45)
    u.uScale.value = state.size.height * state.gl.getPixelRatio() * 1.207;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
        vertexShader={snowVertex}
        fragmentShader={snowFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}