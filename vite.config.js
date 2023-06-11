// vite.config.js
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';

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
  plugins: [
    createHtmlPlugin({
      inject: {
        data: {
          mainJs: `/dist/assets/main-[hash].js`, // Specify the file path with [hash] placeholder
        },
      },
    }),
  ],
});
