const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'mobile-web');

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });
fs.copyFileSync(path.join(root, 'app.html'), path.join(output, 'index.html'));
fs.copyFileSync(path.join(root, 'app.html'), path.join(output, 'app.html'));

for (const directory of ['css', 'js', 'icons']) {
  fs.cpSync(path.join(root, directory), path.join(output, directory), { recursive: true });
}

for (const file of ['service-worker.js', 'manifest.webmanifest', 'offline.webmanifest']) {
  fs.copyFileSync(path.join(root, file), path.join(output, file));
}

console.log(`Prepared offline mobile web files in ${path.relative(root, output)}.`);
