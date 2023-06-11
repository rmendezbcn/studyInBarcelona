import fs from 'fs-extra';
import path from 'path';

async function build() {
  try {
    // Resolve the absolute path to the index.html file
    const indexPath = new URL('../public/index.html', import.meta.url).pathname;

    // Read the index.html file
    let html = await fs.readFile(indexPath, 'utf-8');

    // Get the list of files in the dist/assets directory
    const distPath = path.join(process.cwd(), 'dist/assets');
    const files = await fs.readdir(distPath);

    // Find the main JavaScript file
    const mainJsFile = files.find((file) => file.startsWith('main-'));
    const mainJsPath = mainJsFile ? `/assets/${mainJsFile}` : '/assets/main.js';

    // Replace the placeholder with the correct file path
    html = html.replace('{{mainJs}}', mainJsPath);

    // Resolve the absolute path to the modified index.html file
    const outputIndexPath = path.resolve('./dist/index.html');

    // Write the modified index.html file
    await fs.writeFile(outputIndexPath, html);

    console.log('Build completed successfully.');
  } catch (error) {
    console.error('An error occurred during the build:', error);
  }
}

build();
