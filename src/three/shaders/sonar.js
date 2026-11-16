// Sonar terrain: displaced grid + contour lines + an expanding ping ring.
export const sonarVertex = /* glsl */ `
  varying vec2 vXZ;
  varying float vH;

  float terrain(vec2 p) {
    return sin(p.x * 0.6) * 0.35 + cos(p.y * 0.5) * 0.3 + sin((p.x + p.y) * 0.9) * 0.15;
  }

  void main() {
    // plane is rotated -90deg on X: local y = -world z, local z = world y
    vec2 xz = vec2(position.x, -position.y);
    float h = terrain(xz);
    vXZ = xz;
    vH = h;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, h, 1.0);
  }
`;

export const sonarFragment = /* glsl */ `
  uniform float uTime;
  uniform float uStart;
  uniform vec3 uPing;
  uniform vec3 uColor;
  uniform vec3 uAccent;
  varying vec2 vXZ;
  varying float vH;

  void main() {
    vec2 g = abs(fract(vXZ - 0.5) - 0.5) / fwidth(vXZ);
    float grid = 1.0 - min(min(g.x, g.y), 1.0);

    float hh = vH * 5.0;
    float c = abs(fract(hh) - 0.5) / max(fwidth(hh), 0.0001);
    float contour = 1.0 - min(c, 1.0);

    float t = (uTime - uStart) / 3.2;
    float d = length(vXZ - uPing.xz);
    float ring = 0.0;
    if (t >= 0.0 && t <= 1.0) {
      float x = (d - t * 9.0) * 1.8;
      ring = exp(-x * x) * (1.0 - t);
    }

    float fade = smoothstep(7.0, 2.5, length(vXZ * vec2(0.75, 1.1)));
    vec3 col = uColor * (grid * 0.5 + contour * 0.35) + uAccent * ring * 1.6;
    float a = (grid * 0.35 + contour * 0.3 + ring * 0.9) * fade;

    gl_FragColor = vec4(col, a);
    #include <colorspace_fragment>
  }
`;