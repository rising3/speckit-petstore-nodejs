#!/usr/bin/env node
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(bin, args) {
  const proc = spawn(bin, args, { stdio: 'inherit', shell: false });
  proc.on('exit', (code) => process.exit(code));
}

const projectRoot = path.resolve(__dirname, '..');
const localBin = path.join(projectRoot, 'node_modules', '.bin');

const candidates = [path.join(localBin, 'storybook'), path.join(localBin, 'start-storybook')];

const found = candidates.find((p) => fs.existsSync(p));

if (found) {
  // pass through args (e.g., -p 6006)
  const args = process.argv.slice(2);
  run(found, args);
} else {
  console.error('\nStorybook binary not found in this project.');
  console.error('Please install Storybook devDependencies first:');
  console.error('\n  npm install -D @storybook/react @storybook/addon-essentials');
  console.error('\nOr, for Next.js App Router + Storybook 7+:');
  console.error('\n  npm install -D @storybook/nextjs @storybook/addon-essentials');
  console.error('\nAfter installing, run `npm run storybook` again.');
  process.exit(1);
}
