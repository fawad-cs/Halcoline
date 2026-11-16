// GLSL for the Lumen Core: a breathing bell with fresnel rim + glowing veins,
// and thin ribbon rings with a travelling comet of light.

export const bellVertex = /* glsl */ `
  uniform float uTime;
  uniform float uBreath;
  varying vec3 vNormalV;
  varying vec3 vViewPos;
  varying vec3 vLocal;

  void main() {
    vec3 p = position;
    float k = sin(uTime * 1.1 - p.y * 1.6) * 0.05 * uBreath;
    p.xz *= 1.0 + k + 0.04 * sin(p.y * 4.0 + uTime * 0.8);
    p.y *= 1.0 + 0.04 * sin(uTime * 1.1) * uBreath;

    vLocal = p;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vViewPos = mv.xyz;
    vNormalV = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * mv;
  }
`;

export const bellFragment = /* glsl */ `
  uniform float uTime;
  uniform float uHover;
  uniform vec3 uBase;
  uniform vec3 uGlow;
  varying vec3 vNormalV;
  varying vec3 vViewPos;
  varying vec3 vLocal;

  void main() {
    vec3 n = normalize(vNormalV);
    vec3 v = normalize(-vViewPos);
    float fres = pow(1.0 - abs(dot(n, v)), 2.2);

    float ang = atan(vLocal.z, vLocal.x);
    float lines = sin(ang * 16.0 + sin(vLocal.y * 5.0 - uTime * 0.6) * 1.8);
    float veins = smoothstep(0.93, 1.0, lines) * smoothstep(-0.6, 1.2, vLocal.y);
    float pulse = smoothstep(0.0, 0.5, sin(vLocal.y * 3.0 - uTime * 1.2) * 0.5 + 0.5);

    float glow = fres * (0.7 + uHover * 0.8) + veins * (0.6 + pulse * 0.9);
    vec3 col = mix(uBase, uGlow, clamp(glow, 0.0, 1.0));
    float alpha = clamp(0.08 + fres * 0.55 + veins * 0.7 * (0.5 + pulse), 0.0, 0.95);

    gl_FragColor = vec4(col * (0.6 + glow), alpha);
    #include <colorspace_fragment>
  }
`;

export const ribbonVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const ribbonFragment = /* glsl */ `
  uniform float uTime;
  uniform float uSeed;
  uniform vec3 uColor;
  varying vec2 vUv;

  void main() {
    float head = fract(vUv.x * 2.0 - uTime * 0.12 + uSeed);
    float comet = pow(head, 6.0);
    float base = 0.12 + 0.1 * sin(vUv.x * 60.0 + uTime + uSeed * 6.28);
    float a = clamp(base + comet * 0.9, 0.0, 1.0);

    gl_FragColor = vec4(uColor * (0.6 + comet * 1.4), a);
    #include <colorspace_fragment>
  }
`;