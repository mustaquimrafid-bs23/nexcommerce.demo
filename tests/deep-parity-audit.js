const fs = require('fs');
const path = require('path');

console.log('═══════════════════════════════════════════════════════════════════');
console.log('   DEEP PARITY AUDIT: feature/storefront-elevation vs ubgrade (Next.js)   ');
console.log('═══════════════════════════════════════════════════════════════════\n');

const checks = [];

function recordCheck(category, item, inPrototype, inNext, details) {
  checks.push({ category, item, inPrototype, inNext, details });
}

// 1. Pages Check
const staticPages = [
  { name: 'Home', file: 'index.html', nextRoute: 'app/page.tsx' },
  { name: 'Category PLP', file: 'pages/category.html', nextRoute: 'app/category/page.tsx' },
  { name: 'Discovery Visual & Hotspots', file: 'pages/discovery.html', nextRoute: 'app/discovery/page.tsx' },
  { name: 'Product PDP', file: 'pages/product.html', nextRoute: 'app/product/[id]/page.tsx' },
  { name: 'Cart', file: 'pages/cart.html', nextRoute: 'app/cart/page.tsx' },
  { name: 'Checkout', file: 'pages/checkout.html', nextRoute: 'app/checkout/page.tsx' },
  { name: 'Confirmation', file: 'pages/confirmation.html', nextRoute: 'app/confirmation/page.tsx' },
  { name: 'Orders History & Tracking', file: 'pages/orders.html', nextRoute: 'app/orders/page.tsx' },
  { name: 'Order Details Dynamic', file: 'pages/orders.html', nextRoute: 'app/orders/[id]/page.tsx' },
  { name: 'Courier Tracking', file: 'pages/tracking.html', nextRoute: 'app/tracking/page.tsx' },
  { name: 'Wishlist', file: 'pages/wishlist.html', nextRoute: 'app/wishlist/page.tsx' },
  { name: 'Smart List Replenishment', file: 'pages/smart-list.html', nextRoute: 'app/smart-list/page.tsx' },
  { name: 'Style DNA Profile', file: 'pages/profile.html', nextRoute: 'app/profile/page.tsx' },
  { name: 'Sign In', file: 'pages/signin.html', nextRoute: 'app/signin/page.tsx' },
  { name: 'Sign Up', file: 'pages/signup.html', nextRoute: 'app/signup/page.tsx' },
  { name: 'Size & Fit Guide', file: 'pages/size-guide.html', nextRoute: 'app/size-guide/page.tsx' },
  { name: 'Maison Heritage / About', file: 'pages/about.html', nextRoute: 'app/about/page.tsx' },
  { name: 'Client Services / Contact', file: 'pages/contact.html', nextRoute: 'app/contact/page.tsx' },
  { name: 'Help Desk Knowledgebase', file: 'pages/contact.html', nextRoute: 'app/help/page.tsx' },
  { name: 'Terms of Engagement', file: 'pages/terms.html', nextRoute: 'app/terms/page.tsx' },
  { name: 'Privacy & Data Charter', file: 'pages/privacy.html', nextRoute: 'app/privacy/page.tsx' },
  { name: 'Concierge Studio (Dedicated)', file: 'pages/concierge.html', nextRoute: 'app/concierge/page.tsx' },
  { name: 'Feature / Shopping Guide', file: 'pages/feature-guide.html', nextRoute: 'app/guide/page.tsx' },
  { name: 'Feature Showcase Portal', file: 'feature-showcase.html', nextRoute: 'app/guide/page.tsx' },
  { name: 'LinkedIn Marketing Storyboard', file: 'pages/linkedin-storyboard.html', nextRoute: null },
  { name: 'Video Production Storyboard', file: 'pages/video-storyboard.html', nextRoute: null },
  { name: 'Search Variations Playground', file: 'search-result-variations.html', nextRoute: null },
  { name: 'Visual Search Layout Variations', file: 'pages/visual-search-preview.html', nextRoute: null },
];

staticPages.forEach(p => {
  const hasPrototype = fs.existsSync(p.file);
  const hasNext = p.nextRoute ? fs.existsSync(p.nextRoute) : false;
  recordCheck(
    'Page Route',
    p.name,
    hasPrototype,
    hasNext,
    hasNext ? `Mounted at ${p.nextRoute}` : `Prototype only (${p.file}), missing in Next.js`
  );
});

// 2. Specific Feature Gaps
const featureAudits = [
  {
    name: 'Discovery: Complete Outfit Builder / Editorial Drops (#drops)',
    protoCheck: () => fs.readFileSync('pages/discovery.html', 'utf8').includes('id="drops"'),
    nextCheck: () => fs.readFileSync('app/discovery/page.tsx', 'utf8').includes('Complete Outfit Builder') || fs.readFileSync('app/discovery/page.tsx', 'utf8').includes('The Milan Evening Look'),
    desc: '3 curated multi-piece outfit drops with 1-click capsule bundle checkout'
  },
  {
    name: 'Discovery: Compare 3 Card Styles Link',
    protoCheck: () => fs.readFileSync('pages/discovery.html', 'utf8').includes('search-result-variations.html'),
    nextCheck: () => fs.readFileSync('app/discovery/page.tsx', 'utf8').includes('search-result-variations') || fs.readFileSync('app/discovery/page.tsx', 'utf8').includes('Compare 3 Card Styles'),
    desc: 'Status bar link to view 3 alternative card layout options'
  },
  {
    name: 'Home: Runway Lookbook Inspection Modal',
    protoCheck: () => fs.existsSync('js/lookbook.js'),
    nextCheck: () => {
      const homeContent = fs.readFileSync('app/page.tsx', 'utf8');
      const bannerContent = fs.readFileSync('components/home/EditorialBanner.tsx', 'utf8');
      return homeContent.includes('LookbookModal') || bannerContent.includes('LookbookModal');
    },
    desc: 'Full-screen runway lookbook modal (implemented in components/home/LookbookModal.tsx but unmounted in app/page.tsx)'
  },
  {
    name: 'Personal Stylist Drawer: Web Speech Synthesis Toggle',
    protoCheck: () => fs.readFileSync('js/concierge.js', 'utf8').includes('conciergeVoiceToggleBtn'),
    nextCheck: () => fs.readFileSync('components/concierge/ConciergeDrawer.tsx', 'utf8').includes('speechSynthesis') || fs.readFileSync('components/concierge/ConciergeDrawer.tsx', 'utf8').includes('VoiceToggle'),
    desc: 'Speaker audio toggle button in drawer header to hear voice responses'
  },
  {
    name: 'Personal Stylist Drawer: Microphone Input & Listening Waveform',
    protoCheck: () => fs.readFileSync('js/concierge.js', 'utf8').includes('conciergeMicBtn') && fs.readFileSync('js/concierge.js', 'utf8').includes('listening-waveform'),
    nextCheck: () => fs.readFileSync('components/concierge/ConciergeDrawer.tsx', 'utf8').includes('Mic') || fs.readFileSync('components/concierge/ConciergeDrawer.tsx', 'utf8').includes('webkitSpeechRecognition'),
    desc: 'Microphone speech dictation button and 6-bar audio visualizer in drawer input dock'
  },
  {
    name: 'Concierge Studio Page: Live Speech Recognition',
    protoCheck: () => fs.readFileSync('js/concierge.js', 'utf8').includes('webkitSpeechRecognition'),
    nextCheck: () => fs.readFileSync('app/concierge/page.tsx', 'utf8').includes('webkitSpeechRecognition'),
    desc: 'Native speech recognition API (Next.js currently uses a 2.4s timer with hardcoded query fallback)'
  },
  {
    name: 'Smart List: Item Dismissal with 5s Interactive Undo Toast',
    protoCheck: () => fs.readFileSync('js/smart-reorder.js', 'utf8').includes('sl-toast--undo'),
    nextCheck: () => fs.readFileSync('app/smart-list/page.tsx', 'utf8').includes('undo') || fs.readFileSync('components/smart-list/SmartListProductCard.tsx', 'utf8').includes('dismiss'),
    desc: '1-click remove item with 5-second interactive Undo Toast and localStorage retention'
  },
  {
    name: 'Smart List: Interactive Replenishment Cadence Popover',
    protoCheck: () => fs.readFileSync('js/smart-reorder.js', 'utf8').includes('intervals') && fs.readFileSync('js/smart-reorder.js', 'utf8').includes('Cadence'),
    nextCheck: () => fs.existsSync('components/smart-list/CadenceAdjusterPopover.tsx'),
    desc: 'Custom repurchase interval adjuster popover (30/60/90 days / pause) per product'
  },
  {
    name: 'Side-by-Side Comparison: Global Site-Wide Access',
    protoCheck: () => fs.readFileSync('js/comparison-ui.js', 'utf8').includes('bindGlobalTriggers'),
    nextCheck: () => {
      const layout = fs.readFileSync('app/layout.tsx', 'utf8');
      const cat = fs.readFileSync('components/category/CategoryProductGrid.tsx', 'utf8');
      return layout.includes('ComparisonModal') || cat.includes('ComparisonModal') || cat.includes('compare');
    },
    desc: 'Trigger comparison modal from Category PLP, Discovery, and Search, rather than PDP only'
  },
  {
    name: 'Side-by-Side Comparison: Alternative Item Dropdown Switcher',
    protoCheck: () => fs.readFileSync('js/comparison-ui.js', 'utf8').includes('compareSelect') || fs.readFileSync('js/comparison-ui.js', 'utf8').includes('compareSlotB'),
    nextCheck: () => fs.readFileSync('components/product/ComparisonModal.tsx', 'utf8').includes('select') || fs.readFileSync('components/product/ComparisonModal.tsx', 'utf8').includes('onChange'),
    desc: 'Dropdown selector inside comparison modal to switch Product B against any catalog item'
  },
  {
    name: 'Cart Abandonment Recovery: Global Exit-Intent Monitoring',
    protoCheck: () => fs.readFileSync('js/cart-recovery-ui.js', 'utf8').includes('mouseleave'),
    nextCheck: () => fs.readFileSync('app/layout.tsx', 'utf8').includes('CartRecoveryModal'),
    desc: 'Global mouseleave exit-intent trigger mounted in layout for all pages with items in cart'
  },
  {
    name: 'Footer: 6-Palette Theme Switcher Popup Widget',
    protoCheck: () => fs.existsSync('js/theme-switcher.js'),
    nextCheck: () => fs.readFileSync('components/layout/Footer.tsx', 'utf8').includes('theme') || fs.readFileSync('components/layout/Footer.tsx', 'utf8').includes('ThemeSwitcher'),
    desc: 'Popup panel in footer allowing switching between Ocean, Violet, Emerald, Amber, Rose, Obsidian'
  },
  {
    name: 'Delivery Gate: Location Hub Pill & Dark Store Modal in Header',
    protoCheck: () => fs.readFileSync('js/delivery-gate-ui.js', 'utf8').includes('headerDeliveryHubPill'),
    nextCheck: () => fs.readFileSync('components/layout/Header.tsx', 'utf8').includes('headerDeliveryHubPill') && fs.readFileSync('components/layout/Header.tsx', 'utf8').includes('DeliveryGateModal'),
    desc: 'Header delivery location button, express cutoff countdown badge, and dark store selector modal'
  },
  {
    name: 'Checkout: bKash & Nagad MFS PIN Payment Sheet',
    protoCheck: () => fs.readFileSync('pages/checkout.html', 'utf8').includes('bkash'),
    nextCheck: () => fs.existsSync('components/checkout/MfsPaymentSheet.tsx'),
    desc: 'Mobile Financial Services (bKash/Nagad) sheet with live BDT exchange rate calculation'
  },
  {
    name: 'Order Tracking: AI Logistics Concierge & Reschedule Modal',
    protoCheck: () => fs.readFileSync('pages/tracking.html', 'utf8').includes('rescheduleModal'),
    nextCheck: () => fs.existsSync('components/tracking/AILogisticsConcierge.tsx'),
    desc: 'Interactive chat assistant for delivery status and address/date rescheduling modal'
  }
];

featureAudits.forEach(f => {
  const proto = f.protoCheck();
  const next = f.nextCheck();
  recordCheck('Feature / Section', f.name, proto, next, f.desc);
});

console.log('Audit completed. Analyzing summary...\n');
const gaps = checks.filter(c => c.inPrototype && !c.inNext);
const elevated = checks.filter(c => !c.inPrototype && c.inNext);
const match = checks.filter(c => c.inPrototype && c.inNext);

console.log(`TOTAL AUDIT CHECKS: ${checks.length}`);
console.log(`- 100% Matching Parity: ${match.length}`);
console.log(`- Gaps / Not in Next.js: ${gaps.length}`);
console.log(`- Next.js Unique Elevations: ${elevated.length}\n`);

console.log('═══════════════════════════════════════════════════════════════════');
console.log('   FULL INVENTORY OF GAPS (WHERE NEXT.JS IS NOT 100% WITH PROTOTYPE)   ');
console.log('═══════════════════════════════════════════════════════════════════');
gaps.forEach((g, idx) => {
  console.log(`\n[GAP ${idx + 1}] Category: ${g.category}`);
  console.log(`  Name:    ${g.item}`);
  console.log(`  Details: ${g.details}`);
});
