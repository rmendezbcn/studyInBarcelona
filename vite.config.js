import { defineConfig } from 'vite';
import autoprefixer from 'autoprefixer';
import postcssImport from 'postcss-import';
import path from 'path';

export default defineConfig({
  // Other configuration options...
  build: {
  // Other configuration options...
    rollupOptions: {
      input: {
        main: './src/server/server.js',
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/bootstrap')) {
            return 'bootstrap';
          }
        },
      },
    },
  },
});

