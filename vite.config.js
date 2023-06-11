// vite.config.js
import { defineConfig } from 'vite';
import replacePlugin from './vite-plugin-replace';

export default defineConfig({
  // Other configuration options...
  build: {
    outDir: 'dist', // Set the output directory to 'dist'
    rollupOptions: {
      input: {
        main: './src/server/server.js', // Set the entry point to 'server.js'
      },
    },
    chunkSizeWarningLimit: 1000, // Adjust the chunk size limit as needed
    assetsInlineLimit: 0, // Disable asset inline limit
  },
});
