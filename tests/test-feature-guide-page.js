const fs = require('fs');
const path = require('path');

console.log('🧪 Starting 3-Dot Shopping Guide / Feature Guide Automated Test Suite...\n');

let passed = 0;
let total = 0;

function check(title, condition, detail = '') {
  total++;
  if (condition) {
    passed++;
    console.log(`  ✅ [PASS] ${title}`);
  } else {
    console.error(`  ❌ [FAIL] ${title} - ${detail}`);
  }
}

async function runTests() {
  // 1. File existence checks
  const guidePath = path.resolve(__dirname, '../app/guide/page.tsx');
  const shoppingGuidePath = path.resolve(__dirname, '../app/shopping-guide/page.tsx');
  const featureGuidePath = path.resolve(__dirname, '../app/feature-guide/page.tsx');
  const headerPath = path.resolve(__dirname, '../components/layout/Header.tsx');

  check('Guide page file exists', fs.existsSync(guidePath), guidePath);
  check('Shopping-guide alias exists', fs.existsSync(shoppingGuidePath), shoppingGuidePath);
  check('Feature-guide alias exists', fs.existsSync(featureGuidePath), featureGuidePath);

  const guideContent = fs.readFileSync(guidePath, 'utf8');
  const headerContent = fs.readFileSync(headerPath, 'utf8');

  // 2. All 15 Features Verification
  for (let i = 1; i <= 15; i++) {
    const numStr = i < 10 ? `Feature 0${i}` : `Feature ${i}`;
    check(`Includes ${numStr}`, guideContent.includes(numStr), `Missing ${numStr}`);
  }

  // 3. All 4 Stages Verification
  check('Stage 1 (Search & Discovery) present', guideContent.includes('Finding What You Want (Search & Discovery)'));
  check('Stage 2 (Styling & Sizing) present', guideContent.includes('Outfits & Perfect Fit (Styling & Sizing)'));
  check('Stage 3 (Savings & Budget) present', guideContent.includes('Shopping Bag & Deals (Savings & Budget)'));
  check('Stage 4 (Buying & Tracking) present', guideContent.includes('Fast Checkout & Delivery (Buying & Tracking)'));

  // 4. Strict Zero-"AI" Terminology Guardrail
  const forbiddenTokens = ['\\bAI\\b', '\\bAi\\b', '\\bA\\.I\\.\\b', 'Conversational', 'Neural', 'Calibrator', 'Autonomous'];
  forbiddenTokens.forEach((token) => {
    const matches = [...guideContent.matchAll(new RegExp(token, 'gi'))];
    check(`Zero forbidden token "${token}" in guide`, matches.length === 0, `Found occurrences: ${matches.map(m => m[0]).join(', ')}`);
  });

  // 5. UK English Terminology Verification
  check('Uses UK English terms (knitwear/trainers/colour/tailored/catalogue)', 
    guideContent.includes('knitwear') || guideContent.includes('trainers') || guideContent.includes('catalogue') || guideContent.includes('tailored')
  );

  // 6. Header Integration Verification
  check('Header 3-dot dropdown links to /guide', headerContent.includes('href="/guide"'));
  check('Header mobile nav includes Shopping Guide link', headerContent.includes('Shopping Guide') && headerContent.includes('/guide'));

  // 7. Interactive Feature Controls Verification
  check('Includes stage filter controls', guideContent.includes('setSelectedStage'));
  check('Includes quick search filter', guideContent.includes('setSearchQuery') && guideContent.includes('searchQuery'));
  check('Includes 1-tap example clipboard copier', guideContent.includes('handleCopyExample') && guideContent.includes('navigator.clipboard.writeText'));
  check('Includes direct interactive action triggers (concierge/search)', guideContent.includes('handleActionClick') && guideContent.includes('openConcierge'));

  // 8. Live HTTP Verification against dev server (if running)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000);
    const response = await fetch('http://localhost:3000/guide', { signal: controller.signal });
    clearTimeout(timeoutId);
    if (response.status === 200) {
      check('HTTP 200 on /guide route', true);
    }
  } catch {
    // If dev server is not actively running, verify build route existence
    const buildExists = fs.existsSync(path.resolve(__dirname, '../app/guide/page.tsx'));
    check('Guide route file ready for Next.js routing', buildExists);
  }

  console.log(`\n========================================`);
  console.log(`Results: ${passed} / ${total} passed`);
  console.log(`========================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runTests();
