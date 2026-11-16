import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, Color } from 'three';
import {
  colonyPointVertex,
  colonyPointFragment,
  colonyLineVertex,
  colonyLineFragment,
} from '../shaders/strata';
import { stratumWeight } from '../../utils/strata';
import { mulberry32 } from '../../utils/random';

// A chain of linked bodies along the seabed, with small satellites growing upward.
function build() {
  const rand = mulberry32(4242);
  const MAIN = 36;
  const SAT = 4;
  const nodes = [];
  const lines = [];
  let prev = null;

  for (let i = 0; i < MAIN; i++) {
    const t = i / (MAIN - 1);
    const x = -11 + t * 22 + (rand() - 0.5) * 0.4;
    const y = -3.1 + Math.sin(x * 0.45) * 0.9 + (rand() - 0.5) * 0.3;
    const z = -5 + (rand() - 0.5) * 1.2;
    const main = [x, y, z];

    nodes.push(main);
    if (prev) lines.push(prev, main);

    for (let s = 0; s < SAT; s++) {
      const a = rand() * Math.PI * 2;
      const r = 0.5 + rand() * 1.1;
      const sat = [
        x + Math.cos(a) * r,
        y + Math.abs(Math.sin(a)) * r * 0.9,
        z + (rand() - 0.5) * 0.8,
      ];
      nodes.push(sat);
      lines.push(main, sat);
    }
    prev = main;
  }

  const nodePos = new Float32Array(nodes.length * 3);
  const nodeSeed = new Float32Array(nodes.length);
  nodes.forEach((n, i) => {
    nodePos.set(n, i * 3);
    nodeSeed[i] = rand();
  });

  const linePos = new Float32Array(lines.length * 3);
  lines.forEach((p, i) => linePos.set(p, i * 3));

  return { nodePos, nodeSeed, linePos };
}

export default function PulseColony({ input, reduced }) {
  const group = useRef(null);
  const timeRef = useRef(0);
  const { nodePos, nodeSeed, linePos } = useMemo(build, []);

  const pointUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uScale: { value: 1000 },
      uColor: { value: new Color('#2ee6c8') },
    }),
    []
  );

  const lineUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uColor: { value: new Color('#2ee6c8') },
    }),
    []
  );

  useFrame((state, dt) => {
    timeRef.current += dt * (reduced ? 0.25 : 1);
    const w = stratumWeight(input.current.scroll, 3);
    const t = timeRef.current;

    pointUniforms.uTime.value = t;
    pointUniforms.uOpacity.value = w;
    pointUniforms.uScale.value = state.size.height * state.gl.getPixelRatio() * 1.207;
    lineUniforms.uTime.value = t;
    lineUniforms.uOpacity.value = w;

    if (group.current) group.current.visible = w > 0.01;
  });

  return (
    <group ref={group}>
      <lineSegments frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePos, 3]} />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={colonyLineVertex}
          fragmentShader={colonyLineFragment}
          uniforms={lineUniforms}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </lineSegments>

      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePos, 3]} />
          <bufferAttribute attach="attributes-aSeed" args={[nodeSeed, 1]} />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={colonyPointVertex}
          fragmentShader={colonyPointFragment}
          uniforms={pointUniforms}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>
    </group>
  );
}