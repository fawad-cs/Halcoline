// Navigation + strata data. Edit copy here, not inside components.

export const NAV_LINKS = [
  { label: 'Home', to: '/', note: 'Surface · 0 m' },
  { label: 'Explore', to: '/explore', note: 'Five destinations' },
  { label: 'Experience', to: '/experience', note: 'Six chapters' },
  { label: 'About', to: '/about', note: 'The expedition' },
  { label: 'Contact', to: '/contact', note: 'Send a signal' },
];

// Placeholder address: change it to your real one.
export const CONTACT_EMAIL = 'hello@halocline.studio';

export const MAX_DEPTH = 11000;

// Five strata. Scroll progress 0..1 is split into five equal bands.
export const STRATA = [
  { id: 'surface', name: 'Surface', tint: '#7fb8b4' },
  { id: 'twilight', name: 'Twilight', tint: '#0e3a4a' },
  { id: 'midnight', name: 'Midnight', tint: '#071722' },
  { id: 'abyss', name: 'Abyss', tint: '#04080c' },
  { id: 'hadal', name: 'Hadal', tint: '#1a0807' },
];