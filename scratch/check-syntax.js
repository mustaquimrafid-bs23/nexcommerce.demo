const fs = require('fs');
const path = require('path');
const vm = require('vm');

const jsDir = path.resolve(__dirname, '../js');
const files = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));
let hasErr = false;

for (const file of files) {
  const filePath = path.join(jsDir, file);
  const code = fs.readFileSync(filePath, 'utf8');

  try {
    new vm.Script(code, { filename: file });
    console.log(`✅ PASS (Script): ${file}`);
  } catch (err) {
    // If it fails due to import/export, check as module
    try {
      new vm.SourceTextModule(code, { identifier: file });
      console.log(`✅ PASS (Module): ${file}`);
    } catch (modErr) {
      hasErr = true;
      console.error(`❌ FAIL: ${file}`);
      console.error(modErr.message);
    }
  }
}

if (!hasErr) {
  console.log('\n✨ ALL JS FILES ARE 100% VALID JAVASCRIPT WITH ZERO SYNTAX ERRORS!');
} else {
  process.exit(1);
}
