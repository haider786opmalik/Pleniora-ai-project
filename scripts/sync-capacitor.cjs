const { spawnSync } = require('node:child_process');
const path = require('node:path');

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'inherit',
    shell: process.platform === 'win32'
  });
  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }
  if (result.status !== 0) process.exit(result.status || 1);
}

const platform = process.argv[2];
if (platform && !['android', 'ios'].includes(platform)) {
  console.error('Usage: node scripts/sync-capacitor.cjs [android|ios]');
  process.exit(2);
}

run(process.execPath, [path.join(__dirname, 'build-mobile-web.cjs')]);
run(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['cap', 'sync', ...(platform ? [platform] : [])]);
