// Five dives, one per stratum. Used by Explore, DiveDetail and Home.
// `map` is the beacon position on the Explore sonar map (x, z in world units).
// `accent` themes the whole detail page; `variant` picks the 3D shader look.

export const DIVES = [
  {
    slug: 'glasswater',
    index: 1,
    name: 'Glasswater',
    stratum: 'Surface',
    depth: { from: 0, to: 200 },
    coordinates: '11.3733° N · 142.5917° E',
    accent: '#7fb8b4',
    background: '#0b1f22',
    variant: 'caustic',
    map: { x: -4.2, z: 1.6 },
    tagline: 'Where the sun still writes on the sand.',
    summary:
      'The sunlit shelf above the trench. Moving light patterns sweep the seabed, and the first signs of living glow appear at dusk.',
    description: [
      'Glasswater is the only stratum where the expedition can read by sunlight. Waves bend the sun into moving nets of light that slide across the seabed, and the whole shelf looks like it is breathing.',
      'We begin here because everything below depends on it. Every particle of marine snow that drifts into the dark started life in these bright, crowded waters.',
      'At dusk the shelf changes. Tiny plankton ignite when disturbed, and each stroke of a fin leaves a trail of cold blue light behind it.',
    ],
    stats: [
      { label: 'Depth range', value: '0 – 200 m' },
      { label: 'Light remaining', value: '100 – 1 %' },
      { label: 'Water temperature', value: '27 °C' },
      { label: 'Dive time', value: '2 h 10 min' },
    ],
    species: ['Spindle plankton', 'Sail jelly', 'Glass-ribbon eel'],
    log: [
      { time: '06:12', note: 'Hull enters the water. Visibility beyond 40 metres.' },
      { time: '06:48', note: 'Caustic bands cross the shelf. Camera drift locked.' },
      { time: '08:05', note: 'First bioluminescent trail logged at 140 metres.' },
    ],
  },
  {
    slug: 'the-veil',
    index: 2,
    name: 'The Veil',
    stratum: 'Twilight',
    depth: { from: 200, to: 1000 },
    coordinates: '11.3741° N · 142.5902° E',
    accent: '#4fb3d9',
    background: '#08202b',
    variant: 'ribbon',
    map: { x: -2.1, z: -2.4 },
    tagline: 'The last blue before the dark.',
    summary:
      'Light thins to a single deep blue. Great swarms of ribbon-fish rise and fall in slow columns, following a clock set by the sun above.',
    description: [
      'Below two hundred metres the colour red disappears first, then yellow, then green. What remains is a deep, even blue that seems to come from everywhere at once.',
      'The Veil belongs to the swarms. Every night, ribbon-fish climb thousands of bodies long toward the surface to feed, and every dawn they sink back through our lights in silent columns.',
      'It is the most crowded place on the dive, and the quietest. Our hydrophones record almost nothing but our own breathing.',
    ],
    stats: [
      { label: 'Depth range', value: '200 – 1,000 m' },
      { label: 'Light remaining', value: '1 – 0.01 %' },
      { label: 'Water temperature', value: '9 °C' },
      { label: 'Dive time', value: '3 h 40 min' },
    ],
    species: ['Ribbon-fish', 'Silver lanternet', 'Blue-glass squid'],
    log: [
      { time: '09:30', note: 'Red wavelengths gone. Suit lights switched to amber.' },
      { time: '10:15', note: 'Swarm column intercepts the sub. Speed held at 0.3 knots.' },
      { time: '11:02', note: 'Thermocline crossed at 640 metres. Water drops 6 degrees.' },
    ],
  },
  {
    slug: 'lantern-fields',
    index: 3,
    name: 'Lantern Fields',
    stratum: 'Midnight',
    depth: { from: 1000, to: 4000 },
    coordinates: '11.3752° N · 142.5880° E',
    accent: '#ff9b2f',
    background: '#0a1620',
    variant: 'lantern',
    map: { x: 0.4, z: 2.8 },
    tagline: 'Ten thousand small lights, none of them for us.',
    summary:
      'No sunlight reaches here. The only light is alive. Drifting lantern organisms hang in the water like a constellation turned inside out.',
    description: [
      'Past a thousand metres the sun is gone for good. What replaces it is a scatter of amber points, each one a living lantern that hangs in the dark waiting for something to come close.',
      'Lanterns are not decoration. Each species flashes a pattern of its own, and the fields work like a slow, drifting language that we have only started to catalogue.',
      'We cut our own lights here and let the sub sit still for twenty minutes. It is the part of the dive most people remember.',
    ],
    stats: [
      { label: 'Depth range', value: '1,000 – 4,000 m' },
      { label: 'Light remaining', value: 'Only living light' },
      { label: 'Water temperature', value: '3 °C' },
      { label: 'Dive time', value: '4 h 25 min' },
    ],
    species: ['Amber lantern', 'Tether jelly', 'Hooked anglerling'],
    log: [
      { time: '12:20', note: 'Last trace of sunlight lost at 1,020 metres.' },
      { time: '13:05', note: 'Exterior lights cut. 212 lantern organisms counted in view.' },
      { time: '14:10', note: 'Flash sequence repeated 9 times. Recorded in full.' },
    ],
  },
  {
    slug: 'pulse-colony',
    index: 4,
    name: 'The Pulse Colony',
    stratum: 'Abyss',
    depth: { from: 4000, to: 6000 },
    coordinates: '11.3760° N · 142.5861° E',
    accent: '#2ee6c8',
    background: '#04100f',
    variant: 'colony',
    map: { x: 3.1, z: -1.2 },
    tagline: 'One organism, the size of a city block, breathing in light.',
    summary:
      'A single colony of linked bodies stretches across the abyssal plain. It pulses with teal light that travels end to end in slow waves.',
    description: [
      'The abyssal plain is flat, cold and almost empty, which makes the Pulse Colony impossible to mistake for anything else. It spreads across the sediment like a field of glass flowers.',
      'Every few seconds a wave of teal light runs from one end to the other. The colony does not seem to use it to hunt. We think it is how the bodies agree with each other.',
      'Pressure here is four hundred times the surface. The sub hums a half tone lower, and the crew stop talking without anyone asking them to.',
    ],
    stats: [
      { label: 'Depth range', value: '4,000 – 6,000 m' },
      { label: 'Pressure', value: '400+ atmospheres' },
      { label: 'Water temperature', value: '1.5 °C' },
      { label: 'Dive time', value: '5 h 05 min' },
    ],
    species: ['Pulse colony', 'Sediment glider', 'Pale sea-cucumber'],
    log: [
      { time: '15:40', note: 'Seabed contact at 4,380 metres. Silt cloud settles in 90 seconds.' },
      { time: '16:12', note: 'Colony edge sighted. First light wave recorded.' },
      { time: '17:00', note: 'Wave interval measured at 7.4 seconds. Steady for 40 minutes.' },
    ],
  },
  {
    slug: 'vent-cathedral',
    index: 5,
    name: 'Vent Cathedral',
    stratum: 'Hadal',
    depth: { from: 6000, to: 11000 },
    coordinates: '11.3773° N · 142.5847° E',
    accent: '#e8483a',
    background: '#1a0807',
    variant: 'vent',
    map: { x: 4.6, z: 2.4 },
    tagline: 'The floor of the world, and it is still warm.',
    summary:
      'A fissure in the trench floor glows red where the planet leaks heat. Tall chimneys rise like organ pipes around it, crowded with pale, patient life.',
    description: [
      'The hadal zone is the deepest water on Earth. The trench narrows into a canyon, and at the bottom of the canyon the floor splits open and glows.',
      'Mineral chimneys have grown around the fissure over thousands of years, and the sub has to thread between them with only a few metres to spare on either side.',
      'We call it a cathedral because of how it sounds. Every pump, every click and every low rumble from below comes back off the walls as a long, slow echo.',
    ],
    stats: [
      { label: 'Depth range', value: '6,000 – 11,000 m' },
      { label: 'Pressure', value: '1,100 atmospheres' },
      { label: 'Vent temperature', value: '340 °C' },
      { label: 'Dive time', value: '7 h 30 min' },
    ],
    species: ['Pale vent shrimp', 'Chimney worm', 'Hadal snailfish'],
    log: [
      { time: '19:05', note: 'Trench walls close in. Passage width 38 metres.' },
      { time: '20:20', note: 'Fissure glow sighted. Chimney field mapped with sonar.' },
      { time: '21:45', note: 'Deepest point reached at 10,984 metres. Ascent begins.' },
    ],
  },
];

export const getDive = (slug) => DIVES.find((d) => d.slug === slug) ?? null;

// The next dives after the current one, wrapping around the list.
export function getRelatedDives(slug, count = 2) {
  const i = DIVES.findIndex((d) => d.slug === slug);
  if (i === -1) return DIVES.slice(0, count);
  return Array.from({ length: Math.min(count, DIVES.length - 1) }, (_, k) => DIVES[(i + 1 + k) % DIVES.length]);
}

export const formatDepth = ({ from, to }) =>
  `${from.toLocaleString('en-US')} – ${to.toLocaleString('en-US')} m`;