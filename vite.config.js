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
    chunkSizeWarningLimit: 3000, // Adjust the chunk size limit as needed
    assetsInlineLimit: 0, // Disable inline limit for assets
    emptyOutDir: true, // Clear the output directory before each build
    manifest: true, // Generate manifest file for caching
    minify: true, // Enable minification
  },
});
