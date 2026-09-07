const { execSync } = require('child_process');
const assert = require('assert');
const fs = require('fs');

console.log('Testing Next.js TypeScript Compilation and Build...');

try {
  const result = execSync('npx next build', { encoding: 'utf8' });
  console.log(result);
  assert(fs.existsSync('.next'), '.next build folder should exist');
  console.log('PASS: Next.js 15 build succeeded without errors.');
} catch (err) {
  console.error('FAIL: Next.js build failed:');
  if (err.stdout) console.error(err.stdout.toString());
  if (err.stderr) console.error(err.stderr.toString());
  process.exit(1);
}
