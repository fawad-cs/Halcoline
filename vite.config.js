import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Three.js is large by nature; the 3D code is already lazy-loaded.
    chunkSizeWarningLimit: 1500,
  },
});