import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { AdditiveBlending, Color, DoubleSide, MathUtils, Vector3 } from 'three';
import { sonarVertex, sonarFragment } from '../shaders/sonar';

// Must match terrain() in the vertex shader.
const height = (x, z) =>
  Math.sin(x * 0.6) * 0.35 + Math.cos(z * 0.5) * 0.3 + Math.sin((x + z) * 0.9) * 0.15;

function Terrain({ dive }) {
  const mat = useRef(null);
  const lastSlug = useRef(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uStart: { value: -10 },
      uPing: { value: new Vector3() },
      uColor: { value: new Color('#2ee6c8') },
      uAccent: { value: new Color('#ff9b2f') },
    }),
    []
  );

  useFrame(({ clock }) => {
    const u = mat.current?.uniforms;
    if (!u) return;
    u.uTime.value = clock.elapsedTime;
    if (lastSlug.current !== dive.slug) {
      lastSlug.current = dive.slug;
      u.uPing.value.set(dive.map.x, 0, dive.map.z);
      u.uAccent.value.set(dive.accent);
      u.uStart.value = clock.elapsedTime;
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} frustumCulled={false}>
      <planeGeometry args={[16, 12, 140, 100]} />
      <shaderMaterial
        ref={mat}
        vertexShader={sonarVertex}
        fragmentShader={sonarFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </mesh>
  );
}

function Beacon({ dive, index, selected, onSelect }) {
  const core = useRef(null);
  const ring = useRef(null);
  const { x, z } = dive.map;
  const y = height(x, z) + 0.35;

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (core.current) {
      core.current.scale.setScalar(selected ? 1.5 + 0.15 * Math.sin(t * 3) : 1);
    }
    if (ring.current) {
      const k = (t * 0.5 + index * 0.2) % 1;
      ring.current.scale.setScalar(1 + k * 2.2);
      ring.current.material.opacity = (1 - k) * (selected ? 0.9 : 0.45);
    }
  });

  return (
    <group position={[x, y, z]}>
      <mesh ref={core}>
        <sphereGeometry args={[0.16, 24, 24]} />
        <meshBasicMaterial color={dive.accent} toneMapped={false} />
      </mesh>
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.28, 0.31, 48]} />
        <meshBasicMaterial
          color={dive.accent}
          transparent
          depthWrite={false}
          side={DoubleSide}
          toneMapped={false}
        />
      </mesh>
      {/* Larger invisible hit area for easy hover / tap */}
      <mesh onPointerOver={() => onSelect(index)} onClick={() => onSelect(index)}>
        <sphereGeometry args={[0.6, 12, 12]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </group>
  );
}

// Camera glides toward the selected beacon.
function Rig({ dive, reduced }) {
  const look = useRef(new Vector3(0, 0, 0));

  useFrame(({ camera }, dt) => {
    const lambda = reduced ? 20 : 2.5;
    const tx = dive.map.x * 0.6;
    const tz = dive.map.z;
    camera.position.x = MathUtils.damp(camera.position.x, tx, lambda, dt);
    camera.position.y = MathUtils.damp(camera.position.y, 5.4, lambda, dt);
    camera.position.z = MathUtils.damp(camera.position.z, tz * 0.5 + 8, lambda, dt);
    look.current.x = MathUtils.damp(look.current.x, tx, lambda, dt);
    look.current.z = MathUtils.damp(look.current.z, tz * 0.6, lambda, dt);
    camera.lookAt(look.current);
  });

  return null;
}

// Renders only while `active` (scrolled into view).
export default function SonarMap({ dives, index, onSelect, active, reduced }) {
  const dive = dives[index];

  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.5]}
      camera={{ position: [0, 5.4, 9], fov: 45, near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Terrain dive={dive} />
      {dives.map((d, i) => (
        <Beacon key={d.slug} dive={d} index={i} selected={i === index} onSelect={onSelect} />
      ))}
      <Rig dive={dive} reduced={reduced} />
    </Canvas>
  );
}