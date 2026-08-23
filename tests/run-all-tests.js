const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const testsDir = __dirname;
const files = fs.readdirSync(testsDir).filter(f => f.startsWith('test-') && f.endsWith('.js'));

console.log(`Running ${files.length} test suites...\n`);
let passed = 0;
let failed = 0;

for (const file of files) {
  try {
    const filePath = path.join(testsDir, file);
    const out = execSync(`node "${filePath}"`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    console.log(`PASS: ${file}`);
    if (out.trim()) {
      console.log(out.trim().split('\n').map(l => '  ' + l).join('\n'));
    }
    passed++;
  } catch (err) {
    console.error(`FAIL: ${file}`);
    if (err.stdout) console.error(err.stdout.toString());
    if (err.stderr) console.error(err.stderr.toString());
    failed++;
  }
}

console.log(`\n========================================`);
console.log(`Results: ${passed} passed, ${failed} failed out of ${files.length} suites.`);
console.log(`========================================\n`);

if (failed > 0) process.exit(1);
