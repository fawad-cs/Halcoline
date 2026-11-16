import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Self-hosted fonts (bundled by Vite via @fontsource)
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource-variable/inter-tight';
import '@fontsource-variable/jetbrains-mono';

// Global styles (order matters: tokens -> base -> typography)
import './styles/tokens.css';
import './styles/base.css';
import './styles/typography.css';
import './styles/utilities.css';

import App from './app/App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);