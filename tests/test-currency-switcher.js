const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function assert(desc, condition) {
  if (condition) {
    console.log(`  ✓ ${desc}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${desc}`);
    failed++;
  }
}

console.log('🧪 Testing Dual Currency Switcher (EUR / BDT)...');

const storePath = path.resolve(process.cwd(), 'store/useCurrencyStore.ts');
assert('store/useCurrencyStore.ts exists', fs.existsSync(storePath));

const headerPath = path.resolve(process.cwd(), 'components/layout/Header.tsx');
assert('components/layout/Header.tsx exists', fs.existsSync(headerPath));

const utilsPath = path.resolve(process.cwd(), 'lib/utils.ts');
assert('lib/utils.ts exists', fs.existsSync(utilsPath));

if (fs.existsSync(storePath)) {
  const content = fs.readFileSync(storePath, 'utf8');
  assert('useCurrencyStore supports EUR and BDT', content.includes('EUR') && content.includes('BDT'));
  assert('useCurrencyStore persists to localStorage', content.includes('nex_currency'));
  assert('useCurrencyStore provides formatPrice or convertPrice', content.includes('formatPrice') || content.includes('format'));
}

if (fs.existsSync(headerPath)) {
  const headerContent = fs.readFileSync(headerPath, 'utf8');
  assert('Header includes currency switcher trigger', headerContent.includes('currencyToggle') || headerContent.includes('useCurrencyStore') || headerContent.includes('setCurrency'));
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
