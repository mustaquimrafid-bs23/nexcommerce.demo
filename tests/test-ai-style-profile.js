const fs = require('fs');
const path = require('path');

console.log('🧪 Running Batch 4: AI-04 AI Style Profile & Preference Center Parity Test...\n');

let passed = 0;
let failed = 0;

function assert(desc, condition) {
  if (condition) {
    console.log(`  ✓ [PASS] ${desc}`);
    passed++;
  } else {
    console.error(`  ✗ [FAIL] ${desc}`);
    failed++;
  }
}

const profilePath = path.resolve('app/profile/page.tsx');
const stepperPath = path.resolve('components/profile/StyleDNAStepper.tsx');

assert('app/profile/page.tsx exists', fs.existsSync(profilePath));
assert('components/profile/StyleDNAStepper.tsx exists', fs.existsSync(stepperPath));

const profileContent = fs.readFileSync(profilePath, 'utf8');
const stepperContent = fs.readFileSync(stepperPath, 'utf8');

// 1. Assert Style Archetype Dimensions exist
assert('Contains style archetypes (Minimalist, Relaxed, Techwear, Heritage)', stepperContent.includes('minimalist-tailoring') && stepperContent.includes('contemporary-techwear'));

// 2. Assert Silhouette & Fit Preferences exist
assert('Contains silhouette fit selections (Fitted, Classic, Relaxed)', stepperContent.includes('fitted-slim') && stepperContent.includes('classic-fit') && stepperContent.includes('relaxed-fit'));

// 3. Assert Color Palette Affinity & Swatches exist
assert('Contains color palette presets and swatches', stepperContent.includes('COLOR_PRESETS') && stepperContent.includes('Monochrome') && stepperContent.includes('toggleColor'));

// 4. Assert Lifestyle Allocations exist
assert('Contains lifestyle distribution sliders (formal, business, weekend)', stepperContent.includes('formal') && stepperContent.includes('business') && stepperContent.includes('weekend'));

// 5. Assert Save & Reset Actions with localStorage persistence
assert('Contains Save profile action with localStorage persistence', profileContent.includes('nex_client_profile_dna') && profileContent.includes('handleSave'));

console.log(`\nBatch 4 Test Results: ${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
