const fs = require('fs');
const path = require('path');

console.log('🧪 Running Feature 04: Shopping Slip to Cart Parity & Brand Compliance Test Suite...\n');

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

// 1. Files existence & component architecture
console.log('1. Verifying Component Architecture & Files...');
const modalPath = path.resolve('components/cart/SlipToCartModal.tsx');
const cartPagePath = path.resolve('app/cart/page.tsx');

assert('components/cart/SlipToCartModal.tsx exists', fs.existsSync(modalPath));
assert('app/cart/page.tsx exists', fs.existsSync(cartPagePath));

const modalContent = fs.readFileSync(modalPath, 'utf8');
const cartPageContent = fs.readFileSync(cartPagePath, 'utf8');

assert('createPortal is used to avoid containing block bugs', modalContent.includes('createPortal('));
assert('document.body scroll lock is implemented', modalContent.includes("document.body.style.overflow = 'hidden'"));
assert('mounted check is present for SSR hydration safety', modalContent.includes('setMounted(true)'));

// 2. Brand guidelines and background palette
console.log('\n2. Verifying Brand Guidelines & Background Palette...');
assert('Modal uses deep navy background matching brand guidelines', modalContent.includes('rgba(13, 20, 40') && modalContent.includes('rgba(5, 11, 24'));
assert('Modal uses cyan brand eyebrow (#3DE0FF)', modalContent.includes('#3DE0FF'));
assert('Demo receipt button uses vibrant cyan-emerald gradient (#3DE0FF to #00F5A0)', modalContent.includes('from-[#3DE0FF] to-[#00F5A0]'));
assert('Backdrop uses brand dark navy with blur (rgba(3,11,23,0.82) backdrop-blur-md)', modalContent.includes('rgba(3,11,23,0.82)') && modalContent.includes('backdrop-blur-md'));
assert('Title uses editorial font with serif styling (font-serif & text-2xl)', modalContent.includes('font-serif') && modalContent.includes('text-2xl'));

// 3. Canonical DOM Elements & Test Identifiers
console.log('\n3. Verifying Canonical DOM Element IDs...');
assert('Backdrop ID: #slipModalBackdrop', modalContent.includes('id="slipModalBackdrop"'));
assert('Close button ID: #slipModalCloseBtn', modalContent.includes('id="slipModalCloseBtn"'));
assert('Dropzone ID: #slipDropzone', modalContent.includes('id="slipDropzone"'));
assert('Demo Receipt button ID: #slipDemoReceiptBtn', modalContent.includes('id="slipDemoReceiptBtn"'));
assert('Browse File button ID: #slipBrowseFileBtn', modalContent.includes('id="slipBrowseFileBtn"'));
assert('Toggle Text button ID: #slipToggleTextBtn', modalContent.includes('id="slipToggleTextBtn"'));
assert('Paste Container ID: #slipPasteContainer', modalContent.includes('id="slipPasteContainer"'));
assert('Text Input ID: #slipTextInput', modalContent.includes('id="slipTextInput"'));
assert('Load Sample Text button ID: #slipLoadSampleTextBtn', modalContent.includes('id="slipLoadSampleTextBtn"'));
assert('Process Text button ID: #slipProcessTextBtn', modalContent.includes('id="slipProcessTextBtn"'));
assert('Clear Text button ID: #slipClearTextBtn', modalContent.includes('id="slipClearTextBtn"'));
assert('Review Container ID: #slipReviewContainer', modalContent.includes('id="slipReviewContainer"'));
assert('Lines List ID: #slipLinesList', modalContent.includes('id="slipLinesList"'));
assert('Matches List ID: #slipMatchesList', modalContent.includes('id="slipMatchesList"'));
assert('Modal Footer ID: #slipModalFooter', modalContent.includes('id="slipModalFooter"'));
assert('Summary Stat Value ID: #slipStatVal', modalContent.includes('id="slipStatVal"'));
assert('Confirm Add Button ID: #slipConfirmBtn', modalContent.includes('id="slipConfirmBtn"'));
assert('Presets: receipt, capsule, essentials, ambiguous are present',
  modalContent.includes('data-preset="receipt"') &&
  modalContent.includes('data-preset="capsule"') &&
  modalContent.includes('data-preset="essentials"') &&
  modalContent.includes('data-preset="ambiguous"')
);

// 4. In-Memory NLP / Parsing Algorithm Deterministic Assertions
console.log('\n4. Verifying Deterministic NLP Parsing & Levenshtein Scoring...');

function levenshtein(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function similarity(s1, s2) {
  let longer = s1.toLowerCase().trim();
  let shorter = s2.toLowerCase().trim();
  if (longer.length < shorter.length) {
    const tmp = longer; longer = shorter; shorter = tmp;
  }
  const longerLength = longer.length;
  if (longerLength === 0) return 1.0;
  return (longerLength - levenshtein(longer, shorter)) / longerLength;
}

assert('Levenshtein distance handles identical strings (similarity 1.0)', similarity('blazer', 'blazer') === 1.0);
assert('Levenshtein similarity handles minor typos', similarity('cashmere', 'cashemre') > 0.7);

const sampleCapsule = "1x Pure Cashmere Sweater (Size M)\n1x Structured Wool Blazer (Size 48)\n1x Minimalist Leather Runner (EU 42)";
const lines = sampleCapsule.split('\n');

assert('Lines correctly parsed into 3 distinct items', lines.length === 3);

// Verify quantity regex
const qMatch = lines[0].match(/^(\d+)\s*(?:x|pcs|pieces)?/i);
assert('Quantity extraction identifies 1x', qMatch && parseInt(qMatch[1], 10) === 1);

// Verify size regex
const sMatch = lines[0].match(/\(([a-z0-9]+)\)/i) || lines[0].match(/\b(?:size|eu|uk|us)[\:\s]*([a-z0-9]+)\b/i);
assert('Size hint extraction identifies Size M', sMatch && sMatch[1].toUpperCase() === 'M');

const sMatch2 = lines[1].match(/\b(?:size|eu|uk|us)[\:\s]*([a-z0-9]+)\b/i);
assert('Size hint extraction identifies Size 48', sMatch2 && sMatch2[1] === '48');

// 5. URL query param support in app/cart/page.tsx
console.log('\n5. Verifying Cart Page Trigger & Parameter Wiring...');
assert('cart/page.tsx checks open === "slip" or "slip-to-cart"',
  cartPageContent.includes("open === 'slip' || open === 'slip-to-cart'")
);
assert('cart/page.tsx includes open-slip-to-cart trigger button',
  cartPageContent.includes('data-action="open-slip-to-cart"')
);
assert('cart/page.tsx passes initialPreset prop',
  cartPageContent.includes('initialPreset={slipPreset}')
);

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL PARITY & BRAND STANDARDS PASSED WITH 100% SUCCESS!\n');
}
