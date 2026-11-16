// GLSL for every stratum layer. Each layer fades with `uOpacity` / `uIntensity`.

/* ---------------- Surface: light shafts ---------------- */
export const shaftVertex = /* glsl */ `
  varying vec2 vUv;
  varying float vWx;
  void main() {
    vUv = uv;
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWx = w.x;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

export const shaftFragment = /* glsl */ `
  uniform float uTime;
  uniform float uIntensity;
  uniform vec3 uColor;
  varying vec2 vUv;
  varying float vWx;

  void main() {
    float edge = smoothstep(0.0, 0.5, vUv.x) * smoothstep(1.0, 0.5, vUv.x);
    float down = pow(clamp(vUv.y, 0.0, 1.0), 1.1);
    float flick = 0.7 + 0.3 * sin(uTime * 0.4 + vWx * 1.7);
    float a = edge * edge * down * flick * uIntensity * 0.45;
    gl_FragColor = vec4(uColor, a);
    #include <colorspace_fragment>
  }
`;

/* ---------------- Surface: caustics ---------------- */
export const causticVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const causticFragment = /* glsl */ `
  uniform float uTime;
  uniform float uIntensity;
  uniform vec3 uColor;
  varying vec2 vUv;

  float caustic(vec2 uv, float t) {
    vec2 p = mod(uv * 6.28318530718, 6.28318530718) - 250.0;
    vec2 i = p;
    float c = 1.0;
    float inten = 0.005;
    for (int n = 0; n < 4; n++) {
      float tt = t * (1.0 - (3.5 / float(n + 1)));
      i = p + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
      c += 1.0 / length(vec2(p.x / (sin(i.x + tt) / inten), p.y / (cos(i.y + tt) / inten)));
    }
    c /= 4.0;
    c = 1.17 - pow(c, 1.4);
    return pow(abs(c), 8.0);
  }

  void main() {
    vec2 uv = vUv * vec2(3.0, 1.8);
    float c = caustic(uv, uTime * 0.35);
    float fade = smoothstep(0.0, 0.7, vUv.y);
    float a = clamp(c, 0.0, 1.0) * uIntensity * 0.5 * (0.35 + 0.65 * fade);
    gl_FragColor = vec4(uColor * (0.6 + c), a);
    #include <colorspace_fragment>
  }
`;

/* ---------------- Twilight: ribbon-fish swarm ---------------- */
// Each fish is one quad (4 vertices share aSeed). The quad is billboarded in view space.
export const swarmVertex = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  attribute float aSeed;
  varying vec2 vC;
  varying float vA;

  float h(float n) { return fract(sin(n * 127.1) * 43758.5453); }

  void main() {
    float s = aSeed;
    float col = floor(h(s * 3.1) * 6.0);
    float x = (col - 2.5) * 3.4 + (h(s * 7.7) - 0.5) * 1.8 + sin(uTime * 0.5 + s * 30.0) * 0.3;
    float rise = 0.25 + 0.3 * h(s * 9.1);
    float y = mod(h(s * 5.3) * 16.0 + uTime * rise, 16.0) - 8.0;
    float z = -1.0 - h(s * 2.3) * 7.0;

    vec4 mv = viewMatrix * vec4(x, y, z, 1.0);
    mv.xy += vec2(position.x * 0.035, position.y * 0.32);
    gl_Position = projectionMatrix * mv;

    vC = position.xy;
    float edge = smoothstep(-8.0, -5.5, y) * smoothstep(8.0, 5.5, y);
    vA = edge * uOpacity * (0.35 + 0.65 * h(s * 4.4));
  }
`;

export const swarmFragment = /* glsl */ `
  uniform vec3 uColor;
  varying vec2 vC;
  varying float vA;

  void main() {
    float w = 1.0 - abs(vC.x);
    float head = smoothstep(-1.0, 1.0, vC.y);
    float a = w * w * (0.15 + 0.85 * head) * vA;
    gl_FragColor = vec4(uColor, a);
    #include <colorspace_fragment>
  }
`;

/* ---------------- Midnight: lanterns ---------------- */
export const lanternVertex = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform float uScale;
  attribute float aSeed;
  varying float vFlash;
  varying float vA;

  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.25 + aSeed * 40.0) * 0.35;
    p.x += cos(uTime * 0.2 + aSeed * 23.0) * 0.3;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = 0.10 + 0.10 * fract(aSeed * 91.7);
    gl_PointSize = max(2.0, size * uScale / -mv.z);

    // Each lantern flashes on its own slow rhythm.
    float period = 3.0 + 4.0 * fract(aSeed * 17.3);
    float ph = fract(uTime / period + aSeed);
    vFlash = smoothstep(0.0, 0.05, ph) * (1.0 - smoothstep(0.05, 0.3, ph));

    vA = uOpacity * clamp(1.0 - (-mv.z) / 24.0, 0.0, 1.0);
  }
`;

export const lanternFragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vFlash;
  varying float vA;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = smoothstep(0.5, 0.0, d);
    float a = core * core * (0.35 + 0.65 * vFlash) * vA;
    vec3 col = mix(uColor, vec3(1.0, 0.85, 0.55), vFlash * 0.6);
    gl_FragColor = vec4(col * (0.7 + vFlash * 1.2), a);
    #include <colorspace_fragment>
  }
`;

/* ---------------- Abyss: pulse colony ---------------- */
// A wave of light sweeps from x = -13 to x = +13 every 7.4 seconds.
export const colonyPointVertex = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform float uScale;
  attribute float aSeed;
  varying float vPulse;
  varying float vA;

  void main() {
    float front = -13.0 + fract(uTime / 7.4) * 26.0;
    float d = (position.x - front) / 2.4;
    float pulse = exp(-d * d);

    vec3 p = position;
    p.y += sin(uTime * 0.5 + aSeed * 30.0) * 0.08;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = (0.16 + aSeed * 0.14) * (1.0 + pulse * 1.2);
    gl_PointSize = max(2.0, size * uScale / -mv.z);

    vPulse = pulse;
    vA = uOpacity * clamp(1.0 - (-mv.z) / 26.0, 0.0, 1.0);
  }
`;

export const colonyPointFragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vPulse;
  varying float vA;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a *= a;
    gl_FragColor = vec4(uColor * (0.35 + vPulse * 1.6), (0.25 + 0.75 * vPulse) * a * vA);
    #include <colorspace_fragment>
  }
`;

export const colonyLineVertex = /* glsl */ `
  uniform float uTime;
  varying float vPulse;

  void main() {
    float front = -13.0 + fract(uTime / 7.4) * 26.0;
    float d = (position.x - front) / 2.4;
    vPulse = exp(-d * d);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const colonyLineFragment = /* glsl */ `
  uniform float uOpacity;
  uniform vec3 uColor;
  varying float vPulse;

  void main() {
    float a = (0.06 + vPulse * 0.55) * uOpacity;
    gl_FragColor = vec4(uColor * (0.5 + vPulse * 1.5), a);
    #include <colorspace_fragment>
  }
`;

/* ---------------- Hadal: vent glow + embers ---------------- */
export const ventVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const ventFragment = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uColor;
  varying vec2 vUv;

  void main() {
    float dy = vUv.y - 0.5;
    float dx = abs(vUv.x - 0.5) * 2.0;
    float side = smoothstep(1.0, 0.15, dx);
    float flicker = 0.75 + 0.25 * sin(uTime * 1.3 + vUv.x * 11.0) + 0.1 * sin(uTime * 3.1 + vUv.x * 27.0);

    float up = max(dy, 0.0);
    float dn = max(-dy, 0.0);
    float haze = exp(-up * 7.0) * exp(-dn * dn * 900.0);
    float core = exp(-dy * dy * 9000.0);

    float g = (haze * 0.55 + core * 1.2) * side * flicker;
    gl_FragColor = vec4(uColor * (0.8 + core), clamp(g, 0.0, 1.0) * uOpacity);
    #include <colorspace_fragment>
  }
`;

export const emberVertex = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform float uScale;
  attribute float aSeed;
  varying float vA;

  void main() {
    float speed = 0.35 + 0.5 * fract(aSeed * 7.13);
    float life = fract(uTime * speed * 0.25 + aSeed * 3.7);

    vec3 p = position;
    p.y += life * 7.0;
    p.x += sin(life * 6.0 + aSeed * 20.0) * 0.4;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = 0.06 + 0.06 * fract(aSeed * 31.0);
    gl_PointSize = max(1.5, size * uScale / -mv.z);

    vA = uOpacity * (1.0 - life) * smoothstep(0.0, 0.08, life);
  }
`;

export const emberFragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vA;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uColor, a * a * vA);
    #include <colorspace_fragment>
  }
`;