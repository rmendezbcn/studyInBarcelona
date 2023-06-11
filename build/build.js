import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { build as _build } from 'esbuild';

async function build() {
  try {
    // Read the index.html file
    let html = readFileSync('./index.html', 'utf-8');

    // Get the list of files in the dist/assets directory
    const files = readdirSync('./dist/assets');

    // Find the main JavaScript file
    const mainJsFile = files.find((file) => file.startsWith('main-'));
    const mainJsPath = mainJsFile ? `/dist/assets/${mainJsFile}` : '/dist/assets/main.js';

    // Replace the placeholder with the correct file path
    html = html.replace('{{mainJs}}', mainJsPath);

    // Write the modified index.html file
    writeFileSync('./dist/index.html', html);

    console.log('Build completed successfully.');
  } catch (error) {
    console.error('An error occurred during the build:', error);
  }
}

// Transpile and execute the build function using esbuild
_build({
  entryPoints: ['./build.js'],
  bundle: true,
  outfile: './build/build.bundle.js',
  platform: 'node',
  target: 'node12',
  format: 'cjs',
}).then(() => {
  // Execute the transpiled build function
  require('./build.bundle.js').build();
});
