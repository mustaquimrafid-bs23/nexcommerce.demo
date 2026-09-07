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

console.log('🧪 Running Feature 02: Search by Photo 100% Parity Verification Suite...\n');

// 1. Component Verification
console.log('1. Verifying VisualSearchModal.tsx structure & IDs...');
const modalPath = path.resolve(process.cwd(), 'components/modals/VisualSearchModal.tsx');
assert('VisualSearchModal.tsx exists', fs.existsSync(modalPath));

const modalContent = fs.readFileSync(modalPath, 'utf8');

// Header & IDs
assert('Backdrop has id #nexVisualSearchBackdrop', modalContent.includes('id="nexVisualSearchBackdrop"'));
assert('Dialog has id #nexVisualSearchDialog', modalContent.includes('id="nexVisualSearchDialog"'));
assert('File input has id #nexVisualFileInput', modalContent.includes('id="nexVisualFileInput"'));
assert('Close button has id #nexVisualCloseBtn', modalContent.includes('id="nexVisualCloseBtn"'));

// Copy parity with feature/storefront-elevation
assert('Title is "Shop by Photo"', modalContent.includes('Shop by Photo'));
assert('Subtitle is "Upload a photo to find similar clothes in our store."', modalContent.includes('Upload a photo to find similar clothes in our store.'));

// Dropzone & Initial State
assert('Dropzone has id #nexVisualDropzonePrompt', modalContent.includes('id="nexVisualDropzonePrompt"'));
assert('Dropzone prompt has "Click or drop any photo here"', modalContent.includes('Click or drop any photo here'));
assert('Dropzone has #nexVisualBrowseBtn with "Browse Photos"', modalContent.includes('id="nexVisualBrowseBtn"') && modalContent.includes('Browse Photos'));
assert('Dropzone has #nexVisualDemoBtn with "✨ Try Demo"', modalContent.includes('id="nexVisualDemoBtn"') && modalContent.includes('✨ Try Demo'));

// Lens Bar & Active Results State
assert('Active lens bar has id #nexVisualLensBar', modalContent.includes('id="nexVisualLensBar"'));
assert('Active chip has id #nexVisualActiveChip', modalContent.includes('id="nexVisualActiveChip"'));
assert('Lens status has id #nexVisualLensStatus', modalContent.includes('id="nexVisualLensStatus"'));
assert('Change photo button has id #nexVisualUploadTrigger', modalContent.includes('id="nexVisualUploadTrigger"') && modalContent.includes('Change Photo'));
assert('Results grid has id #nexVisualResultsGrid', modalContent.includes('id="nexVisualResultsGrid"'));
assert('Results cards have class nex-visual-result-card', modalContent.includes('nex-visual-result-card'));
assert('Results cards have MATCH confidence badge', modalContent.includes('MATCH'));
assert('Results cards have + Add to Bag button with quick add', modalContent.includes('nex-visual-card-add-btn') && modalContent.includes('+ Add to Bag'));
assert('Modal uses createPortal to escape stacking traps', modalContent.includes('createPortal('));

// 2. Zustand Store Verification
console.log('\n2. Verifying useVisualSearchStore.ts API...');
const storePath = path.resolve(process.cwd(), 'store/useVisualSearchStore.ts');
assert('useVisualSearchStore.ts exists', fs.existsSync(storePath));
const storeContent = fs.readFileSync(storePath, 'utf8');
assert('Store defines isOpen, activePreset, activeImage', storeContent.includes('isOpen') && storeContent.includes('activePreset') && storeContent.includes('activeImage'));
assert('Store provides openVisualSearch and closeVisualSearch', storeContent.includes('openVisualSearch') && storeContent.includes('closeVisualSearch'));
assert('Store provides resetToDropzone', storeContent.includes('resetToDropzone'));

// 3. Page & Layout Triggers Verification
console.log('\n3. Verifying Storefront Triggers...');
const discoveryPath = path.resolve(process.cwd(), 'app/discovery/page.tsx');
assert('app/discovery/page.tsx exists', fs.existsSync(discoveryPath));
const discoveryContent = fs.readFileSync(discoveryPath, 'utf8');
assert('Discovery page has camera button with id #discoveryVisualSearchBtn', discoveryContent.includes('id="discoveryVisualSearchBtn"'));
assert('Discovery page auto-opens visual search on mode=visual', discoveryContent.includes("mode === 'visual'"));

const searchOverlayPath = path.resolve(process.cwd(), 'components/search/SearchOverlay.tsx');
const searchOverlayContent = fs.readFileSync(searchOverlayPath, 'utf8');
assert('SearchOverlay has camera button with id #globalVisualSearchTrigger', searchOverlayContent.includes('id="globalVisualSearchTrigger"'));
assert('SearchOverlay camera button calls openVisualSearch', searchOverlayContent.includes('openVisualSearch()'));

const tourModalPath = path.resolve(process.cwd(), 'components/tour/FeatureTourModal.tsx');
const tourModalContent = fs.readFileSync(tourModalPath, 'utf8');
assert('FeatureTourModal defines Feature 02 Search by Photo', tourModalContent.includes('num: \'02\'') && tourModalContent.includes('Search by Photo'));
assert('FeatureTourModal Feature 02 triggers visual-search', tourModalContent.includes('actionType: \'visual-search\''));

const headerPath = path.resolve(process.cwd(), 'components/layout/Header.tsx');
const headerContent = fs.readFileSync(headerPath, 'utf8');
assert('Header mounts VisualSearchModal', headerContent.includes('<VisualSearchModal'));
assert('Header includes #globalVisualSearchTrigger', headerContent.includes('id="globalVisualSearchTrigger"'));

// 4. CSS Design Tokens Verification
console.log('\n4. Verifying CSS Design Tokens in globals.css...');
const cssPath = path.resolve(process.cwd(), 'app/globals.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');
assert('globals.css includes .nex-visual-modal-backdrop', cssContent.includes('.nex-visual-modal-backdrop'));
assert('globals.css includes .nex-visual-modal-dialog.nex-visual-v2-dialog', cssContent.includes('.nex-visual-modal-dialog.nex-visual-v2-dialog'));
assert('globals.css includes .nex-visual-lens-bar', cssContent.includes('.nex-visual-lens-bar'));
assert('globals.css includes .nex-visual-initial-prompt', cssContent.includes('.nex-visual-initial-prompt'));
assert('globals.css includes .nex-visual-demo-btn', cssContent.includes('.nex-visual-demo-btn'));
assert('globals.css includes .nex-visual-result-card', cssContent.includes('.nex-visual-result-card'));
assert('globals.css includes .nex-visual-card-add-btn', cssContent.includes('.nex-visual-card-add-btn'));

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
