const fs = require('fs');
const path = require('path');

const root = process.cwd();

const titles = {
  'pages/about.html': 'The Maison Philosophy & Sustainable Atelier Craft',
  'pages/account.html': 'Client Atelier Account & Preferences',
  'pages/cart.html': 'Your Curated Shopping Bag',
  'pages/category.html': 'Maison Ready-to-Wear & Atelier Collections',
  'pages/checkout.html': 'Atelier Checkout & Express Order Finalization',
  'pages/concierge.html': 'nexCommerce Style Concierge & Styling Studio',
  'pages/contact.html': 'Client Services & Private Concierge Inquiries',
  'pages/discovery.html': 'Visual Discovery & Search Curation',
  'pages/foundation.html': 'nexCommerce Design System Foundation',
  'pages/impressum.html': 'Legal Notice & Impressum',
  'pages/lookbook.html': 'The Winter Edit 2026 Lookbook',
  'pages/orders.html': 'Order Journey & Delivery Archives',
  'pages/playground.html': 'Interactive Component Playground',
  'pages/privacy.html': 'Privacy & Data Governance Policy',
  'pages/profile.html': 'Client AI Style Profile & Preferences',
  'pages/security.html': 'Security Architecture & Client Protection',
  'pages/size-guide.html': 'Precision Size & Fit Studio',
  'pages/smart-list.html': 'Personalized Smart List AI Curation',
  'pages/terms.html': 'Terms & Conditions of Service',
  'pages/tracking.html': 'Live Shipment Journey & Real-Time Tracking'
};

Object.entries(titles).forEach(([rel, title]) => {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) return;
  let html = fs.readFileSync(full, 'utf8');

  // Check if H1 exists in htmlOnly (excluding script)
  const htmlOnly = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  if (!htmlOnly.includes('<h1')) {
    // Insert after <main...
    const mainMatch = html.match(/<main[^>]*>/i);
    if (mainMatch) {
      html = html.replace(mainMatch[0], `${mainMatch[0]}\n    <h1 class="sr-only">${title}</h1>`);
      fs.writeFileSync(full, html, 'utf8');
      console.log(`✅ [${rel}] Added H1: "${title}"`);
    } else {
      console.log(`⚠️ [${rel}] No <main> tag found`);
    }
  } else {
    console.log(`ℹ️ [${rel}] Already has H1`);
  }
});
