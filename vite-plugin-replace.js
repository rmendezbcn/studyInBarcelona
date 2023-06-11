import { readdir } from 'fs/promises';

export default function replacePlugin() {
  return {
    name: 'replace-mainjs-plugin',
    async transformIndexHtml(html) {
      const files = await readdir('./dist/assets/');
      const mainJsFile = files.find((file) => file.startsWith('main-'));
      const mainJsPath = mainJsFile ? `/dist/assets/${mainJsFile}` : '/dist/assets/main.js';
      return html.replace('{{mainJs}}', mainJsPath);
    },
  };
}
