// tests/test-pdp-bundle-sticky.js
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 Testing PDP Complete the Look 3-Piece Bundle & Mobile Sticky Bar (Batch 12)...');

const bundlePath = path.resolve(process.cwd(), 'components/product/CompleteLookBundle.tsx');
const stickyPath = path.resolve(process.cwd(), 'components/product/MobileStickyBar.tsx');
const pdpPath = path.resolve(process.cwd(), 'app/product/[id]/page.tsx');

assert(fs.existsSync(bundlePath), 'components/product/CompleteLookBundle.tsx must exist');
assert(fs.existsSync(stickyPath), 'components/product/MobileStickyBar.tsx must exist');
assert(fs.existsSync(pdpPath), 'app/product/[id]/page.tsx must exist');

const bundleContent = fs.readFileSync(bundlePath, 'utf8');
const stickyContent = fs.readFileSync(stickyPath, 'utf8');
const pdpContent = fs.readFileSync(pdpPath, 'utf8');

// 1. Complete Look Section Structure & Identifiers
assert(bundleContent.includes('pdpCompleteLookSection'), 'Must include #pdpCompleteLookSection identifier');
assert(bundleContent.includes('btnAddCompleteLookBtn'), 'Must include #btnAddCompleteLookBtn bundle button ID');
assert(bundleContent.includes('SAVE 10%') || bundleContent.includes('10%'), 'Must display 10% bundle discount badge');
assert(
  bundleContent.includes('COMPLETE_LOOK_MAP') ||
  bundleContent.includes('pairingMap') ||
  bundleContent.includes('companionItems'),
  'Must support curated companion pairing'
);

// 2. Individual Companion Cards & Quick Add
assert(bundleContent.includes('QUICK ADD') || bundleContent.includes('Quick Add'), 'Must have Quick Add CTA on companion cards');
assert(bundleContent.includes('VIEW PIECE') || bundleContent.includes('View Piece') || bundleContent.includes('href='), 'Must link to companion product pages');

// 3. Simple British English Copy (Zero AI Jargon)
assert(!bundleContent.includes('Coordinated Wardrobe Ensemble'), 'Must NOT include AI phrase "Coordinated Wardrobe Ensemble"');
assert(!bundleContent.includes('Architecturally harmonized'), 'Must NOT include pseudo-academic "Architecturally harmonized"');
assert(!bundleContent.includes('Neural'), 'Must NOT include "Neural"');
assert(!bundleContent.includes('Inspect Piece'), 'Must use natural UK English "View Piece" instead of awkward "Inspect Piece"');
assert(bundleContent.includes('Complete the Look') || bundleContent.includes('Style It With'), 'Must have clean natural heading');

// 4. Mobile Sticky Bar Structure & Scroll Behavior
assert(stickyContent.includes('mobileStickyBar'), 'Must include #mobileStickyBar identifier');
assert(stickyContent.includes('stickyPriceLabel'), 'Must include #stickyPriceLabel');
assert(stickyContent.includes('stickySizeLabel'), 'Must include #stickySizeLabel');
assert(stickyContent.includes('ADD TO BAG') || stickyContent.includes('Add to Bag'), 'Must have Add to Bag button');
assert(
  stickyContent.includes('scroll') ||
  stickyContent.includes('scrollY') ||
  stickyContent.includes('isVisible') ||
  stickyContent.includes('IntersectionObserver'),
  'Must support scroll-driven visibility'
);

// 5. Motion & Animation Integration
assert(bundleContent.includes('motion.') || bundleContent.includes('AnimatePresence'), 'CompleteLookBundle must include Motion animations');
assert(stickyContent.includes('motion.') || stickyContent.includes('AnimatePresence'), 'MobileStickyBar must include Motion animations for slide-up');

// 6. PDP Integration & Uniform Background
assert(pdpContent.includes('CompleteLookBundle'), 'PDP page must import and render CompleteLookBundle');
assert(pdpContent.includes('MobileStickyBar'), 'PDP page must import and render MobileStickyBar');
assert(pdpContent.includes('radial-gradient'), 'PDP page must feature uniform luxury dark navy radial background');

console.log('✅ PASS: All PDP Complete Look Bundle & Mobile Sticky Bar tests passed successfully!');
