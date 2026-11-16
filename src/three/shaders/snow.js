// Marine snow: GPU-driven drifting particles. No per-frame JS on the points.

export const snowVertex = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  uniform float uScale;
  uniform vec3 uBox;
  attribute float aSeed;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    float speed = 0.15 + aSeed * 0.25;

    // Fall slowly, and rise as the page scrolls (the camera is descending).
    p.y = mod(p.y - uTime * speed + uScroll * uBox.y * 1.5 + uBox.y * 0.5, uBox.y) - uBox.y * 0.5;
    p.x += sin(uTime * 0.3 + aSeed * 20.0) * 0.25;
    p.z += cos(uTime * 0.25 + aSeed * 13.0) * 0.25;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = 0.03 + aSeed * 0.07;
    gl_PointSize = max(1.0, size * uScale / -mv.z);

    float distFade = clamp(1.0 - (-mv.z) / 20.0, 0.0, 1.0);
    vAlpha = (0.25 + 0.75 * aSeed) * distFade;
  }
`;

export const snowFragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uColor, a * a * vAlpha);
    #include <colorspace_fragment>
  }
`;