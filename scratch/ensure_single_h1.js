const fs = require('fs');
const path = require('path');

const root = process.cwd();
function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'scratch') {
        results = results.concat(getHtmlFiles(full));
      }
    } else if (file.endsWith('.html')) {
      results.push(full);
    }
  });
  return results;
}

const titles = {
  'index.html': 'nexCommerce — Next Generation Editorial & Agentic Commerce Platform',
  '404.html': 'Destination Unavailable',
  'pages/404.html': 'Destination Unavailable',
  'pages/about.html': 'The Maison Philosophy & Sustainable Atelier Craft',
  'pages/account.html': 'Client Atelier Account & Preferences',
  'pages/cart.html': 'Your Curated Shopping Bag',
  'pages/category.html': 'Maison Ready-to-Wear & Atelier Collections',
  'pages/checkout.html': 'Atelier Checkout & Express Order Finalization',
  'pages/concierge.html': 'nexCommerce Style Concierge & Styling Studio',
  'pages/confirmation.html': 'Order Confirmed — Atelier Delivery Journey',
  'pages/contact.html': 'Client Services & Private Concierge Inquiries',
  'pages/discovery.html': 'Visual Discovery & Search Curation',
  'pages/foundation.html': 'nexCommerce Design System Foundation',
  'pages/impressum.html': 'Legal Notice & Impressum',
  'pages/lookbook.html': 'The Winter Edit 2026 Lookbook',
  'pages/orders.html': 'Order Journey & Delivery Archives',
  'pages/playground.html': 'Interactive Component Playground',
  'pages/privacy.html': 'Privacy & Data Governance Policy',
  'pages/product.html': 'Cashmere Turtleneck Sweater',
  'pages/profile.html': 'Client AI Style Profile & Preferences',
  'pages/security.html': 'Security Architecture & Client Protection',
  'pages/size-guide.html': 'Precision Size & Fit Studio',
  'pages/smart-list.html': 'Personalized Smart List AI Curation',
  'pages/terms.html': 'Terms & Conditions of Service',
  'pages/tracking.html': 'Live Shipment Journey & Real-Time Tracking',
  'pages/wishlist.html': 'All Your Saved Items',
  'pages/signin.html': 'Client Atelier Authentication',
  'pages/signup.html': 'Create Your Atelier Client Account'
};

const files = getHtmlFiles(root);
files.forEach(f => {
  const rel = path.relative(root, f).replace(/\\/g, '/');
  if (rel.includes('.superpowers')) return;
  let html = fs.readFileSync(f, 'utf8');
  const htmlOnly = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  const h1Matches = [...htmlOnly.matchAll(/<h1\b[^>]*>/gi)];

  if (h1Matches.length === 0) {
    const title = titles[rel] || 'nexCommerce Atelier';
    // Insert <h1 class="sr-only">title</h1> after <body... or <main...
    if (html.includes('<main')) {
      html = html.replace(/<main[^>]*>/i, `$&\n    <h1 class="sr-only">${title}</h1>`);
    } else {
      html = html.replace(/<body[^>]*>/i, `$&\n  <h1 class="sr-only">${title}</h1>`);
    }
    fs.writeFileSync(f, html, 'utf8');
    console.log(`✅ [${rel}] Injected single semantic H1: "${title}"`);
  } else if (h1Matches.length === 1) {
    console.log(`✓ [${rel}] Has 1 H1.`);
  } else {
    console.log(`⚠️ [${rel}] Has ${h1Matches.length} H1 elements.`);
  }
});
