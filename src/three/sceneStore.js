// Tiny shared store so a page section can steer the 3D scene and the depth gauge.
// override: null = follow real page scroll, or 0..1 = force this depth.
// meters:   null = derive from progress, or a number of metres to display.
export const sceneStore = { override: null, meters: null };