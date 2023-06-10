// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  // Other configuration options...
  build: {
    rollupOptions: {
      input: '/src/client/index.js',
    },
  },
});