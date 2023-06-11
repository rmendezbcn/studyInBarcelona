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
    chunkSizeWarningLimit: 1000, // Adjust the chunk size limit as needed
    output: {
      entryFileNames: `main-[hash].js`,
      chunkFileNames: `main-[hash].js`,
      assetFileNames: `main-[hash].js`
    }
  },
  plugins: [
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html.replace('{{mainJs}}', `/dist/main-${require('crypto').randomBytes(8).toString('hex')}.js`);
      }
    }
  ]
});
