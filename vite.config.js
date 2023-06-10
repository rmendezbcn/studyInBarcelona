// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  // Other configuration options...
  build: {
    outDir: 'dist', // Set the output directory to 'dist'
    rollupOptions: {
      input: {
        main: './src/server/server.js', // Set the entry point to 'server.js'
      },
    },
  },
});
