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

const candidates = [path.join(localBin, 'build-storybook'), path.join(localBin, 'storybook')];

const found = candidates.find((p) => fs.existsSync(p));

if (found) {
  const args = process.argv.slice(2);
  // If 'storybook' binary exists (v7), call with 'build'
  if (found.endsWith('storybook')) {
    run(found, ['build', ...(args || [])]);
  } else {
    run(found, args);
  }
} else {
  console.error('\nStorybook build binary not found in this project.');
  console.error('Please install Storybook devDependencies first:');
  console.error('\n  npm install -D @storybook/react @storybook/addon-essentials');
  console.error('\nOr, for Next.js App Router + Storybook 7+:');
  console.error('\n  npm install -D @storybook/nextjs @storybook/addon-essentials');
  console.error('\nAfter installing, run `npm run build-storybook` again.');
  process.exit(1);
}
