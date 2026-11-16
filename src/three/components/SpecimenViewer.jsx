import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { AdditiveBlending, MathUtils } from 'three';
import { mulberry32 } from '../../utils/random';

// Each specimen is a cloud of points shaped procedurally.
function buildShape(shape) {
  const rand = mulberry32(99);
  const pts = [];
  const push = (x, y, z) => pts.push(x, y, z);

  const shell = (cx, cy, cz, r, n) => {
    for (let i = 0; i < n; i++) {
      const a = rand() * Math.PI * 2;
      const c = rand() * 2 - 1;
      const s = Math.sqrt(1 - c * c);
      push(cx + r * s * Math.cos(a), cy + r * c, cz + r * s * Math.sin(a));
    }
  };

  switch (shape) {
    case 'bell': {
      for (let i = 0; i < 900; i++) {
        const a = rand() * Math.PI * 2;
        const polar = rand() * Math.PI * 0.5;
        push(
          1.5 * Math.sin(polar) * Math.cos(a),
          0.4 + 1.3 * Math.cos(polar),
          1.5 * Math.sin(polar) * Math.sin(a)
        );
      }
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * Math.PI * 2;
        for (let i = 0; i < 40; i++) {
          const t = i / 39;
          push(
            Math.cos(a) * (1.3 - t * 0.6) + Math.sin(t * 6 + k) * 0.1,
            0.4 - t * 2.6,
            Math.sin(a) * (1.3 - t * 0.6) + Math.cos(t * 6 + k) * 0.1
          );
        }
      }
      break;
    }
    case 'ribbon': {
      for (let i = 0; i < 1400; i++) {
        const t = rand() * 2 - 1;
        push(t * 3.2, Math.sin(t * 5) * 0.7 + (rand() - 0.5) * 0.05, (rand() - 0.5) * 0.7 * (1 - Math.abs(t) * 0.5));
      }
      break;
    }
    case 'lantern': {
      shell(0, -0.3, 0, 0.8, 600);
      for (let i = 0; i < 90; i++) {
        const t = i / 89;
        push(Math.sin(t * 2.4) * 0.5, 0.4 + t * 2, 0);
      }
      shell(Math.sin(2.4) * 0.5, 2.5, 0, 0.22, 80);
      break;
    }
    case 'colony': {
      for (let n = 0; n < 7; n++) {
        const x = -3 + n;
        const y = Math.sin(n * 0.9) * 0.6;
        shell(x, y, 0, 0.42, 130);
        if (n < 6) {
          for (let i = 0; i < 30; i++) {
            const t = i / 29;
            push(x + t, y + (Math.sin((n + 1) * 0.9) * 0.6 - y) * t, 0);
          }
        }
      }
      break;
    }
    default: {
      for (let i = 0; i < 1000; i++) {
        push((rand() + rand() - 1) * 3, -1 + Math.pow(rand(), 2) * 2.6, (rand() + rand() - 1) * 1.6);
      }
    }
  }
  return new Float32Array(pts);
}

function Specimen({ shape, color, reduced }) {
  const ref = useRef(null);
  const positions = useMemo(() => buildShape(shape), [shape]);

  useFrame((state, dt) => {
    const obj = ref.current;
    if (!obj) return;
    obj.rotation.y += dt * (reduced ? 0.04 : 0.28);
    obj.rotation.x = MathUtils.damp(obj.rotation.x, reduced ? 0 : -state.pointer.y * 0.45, 3, dt);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}

// Renders only while `active` (scrolled into view).
export default function SpecimenViewer({ shape, color, active, reduced }) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 7], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Specimen key={shape} shape={shape} color={color} reduced={reduced} />
    </Canvas>
  );
}