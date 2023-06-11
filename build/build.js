import fs from 'fs-extra';
import crypto from 'crypto';

async function build() {
  try {
    // Read the index.html file
    let html = await fs.readFileSync('./index.html', 'utf-8');

    // Get the list of files in the dist/assets directory
    const files = await fs.readdirSync('./dist/assets');

    // Find the main JavaScript file
    const mainJsFile = files.find((file) => file.startsWith('main-'));
    const mainJsPath = mainJsFile ? `/dist/assets/${mainJsFile}` : '/dist/assets/main.js';

    // Replace the placeholder with the correct file path
    html = html.replace('{{mainJs}}', mainJsPath);

    // Write the modified index.html file
    await fs.writeFileSync('./dist/index.html', html);

    console.log('Build completed successfully.');
  } catch (error) {
    console.error('An error occurred during the build:', error);
  }
}

build();
