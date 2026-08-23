const fs = require('fs');
const path = require('path');

const root = process.cwd();

const h1Mappings = [
  {
    file: 'pages/about.html',
    fn: (html) => html.replace('<h2 class="about-hero-title"', '<h1 class="about-hero-title"').replace('</h2>', '</h1>')
  },
  {
    file: 'pages/account.html',
    fn: (html) => html.replace('<main', '<main>\n    <h1 class="sr-only">Client Atelier Account</h1><main-hidden')
      .replace('<main>\n    <h1 class="sr-only">Client Atelier Account</h1><main-hidden', '<main><h1 class="sr-only">Client Atelier Account</h1>')
  },
  {
    file: 'pages/cart.html',
    fn: (html) => html.replace('<div class="cart-title">', '<h1 class="cart-title">').replace('</div><!-- cart-title -->', '</h1>')
  },
  {
    file: 'pages/category.html',
    fn: (html) => html.replace('<h2 class="plp-spotlight-title"', '<h1 class="plp-spotlight-title"').replace('</h2><!-- spotlight -->', '</h1>')
  },
  {
    file: 'pages/checkout.html',
    fn: (html) => html.replace('<main class="checkout-wrapper">', '<main class="checkout-wrapper">\n    <h1 class="sr-only">Atelier Checkout &amp; Order Finalization</h1>')
  },
  {
    file: 'pages/concierge.html',
    fn: (html) => html.replace('<main class="concierge-studio-main">', '<main class="concierge-studio-main">\n    <h1 class="sr-only">nexCommerce Style Concierge &amp; Personal Styling Studio</h1>')
  },
  {
    file: 'pages/contact.html',
    fn: (html) => html.replace('<main', '<main>\n    <h1 class="sr-only">Client Services &amp; Private Concierge Inquiries</h1><main-hidden')
      .replace('<main>\n    <h1 class="sr-only">Client Services &amp; Private Concierge Inquiries</h1><main-hidden', '<main><h1 class="sr-only">Client Services &amp; Private Concierge Inquiries</h1>')
  },
  {
    file: 'pages/discovery.html',
    fn: (html) => html.replace('<main class="discovery-v2-main">', '<main class="discovery-v2-main">\n    <h1 class="sr-only">Visual Discovery &amp; Search Curation</h1>')
  },
  {
    file: 'pages/foundation.html',
    fn: (html) => html.replace('<main class="foundation-main">', '<main class="foundation-main">\n    <h1 class="sr-only">nexCommerce Design System Foundation</h1>')
  },
  {
    file: 'pages/impressum.html',
    fn: (html) => html.replace('<main class="terms-page-shell">', '<main class="terms-page-shell">\n    <h1 class="sr-only">Legal Notice &amp; Impressum</h1>')
  },
  {
    file: 'pages/lookbook.html',
    fn: (html) => html.replace('<main class="lookbook-wrapper">', '<main class="lookbook-wrapper">\n    <h1 class="sr-only">The Winter Edit 2026 Lookbook</h1>')
  },
  {
    file: 'pages/orders.html',
    fn: (html) => html.replace('<div class="orders-header-wrap">', '<div class="orders-header-wrap"><h1 class="orders-title" style="font-family:var(--font-display);font-size:32px;font-weight:600;margin-bottom:8px;color:#FFFFFF;">Order Journey</h1>')
  },
  {
    file: 'pages/playground.html',
    fn: (html) => html.replace('<main class="container">', '<main class="container">\n    <h1 class="sr-only">Component Playground</h1>')
  },
  {
    file: 'pages/privacy.html',
    fn: (html) => html.replace(/<h2 style="font-family:\s*var\(--font-serif\);\s*font-size:\s*36px;\s*margin-bottom:\s*16px;">Privacy Policy<\/h2>/i, '<h1 style="font-family: var(--font-serif); font-size: 36px; margin-bottom: 16px;">Privacy Policy</h1>')
  },
  {
    file: 'pages/profile.html',
    fn: (html) => html.replace('<main class="container">', '<main class="container">\n    <h1 class="sr-only">Client AI Style Profile &amp; Preferences</h1>')
  },
  {
    file: 'pages/security.html',
    fn: (html) => html.replace(/<h2 style="font-family:\s*var\(--font-serif\);\s*font-size:\s*36px;\s*margin-bottom:\s*16px;">Security Architecture<\/h2>/i, '<h1 style="font-family: var(--font-serif); font-size: 36px; margin-bottom: 16px;">Security Architecture</h1>')
  },
  {
    file: 'pages/size-guide.html',
    fn: (html) => html.replace('<div class="sg-header-wrap">', '<div class="sg-header-wrap"><h1 class="sg-title" style="font-family:var(--font-display);font-size:32px;font-weight:600;margin-bottom:8px;color:#FFFFFF;">Precision Size &amp; Fit Studio</h1>')
  },
  {
    file: 'pages/smart-list.html',
    fn: (html) => html.replace('<main>', '<main>\n    <h1 class="sr-only">Personalized Smart List AI Curation</h1>')
  },
  {
    file: 'pages/terms.html',
    fn: (html) => html.replace(/<h2 style="font-family:\s*var\(--font-serif\);\s*font-size:\s*36px;\s*margin-bottom:\s*16px;">Terms &amp; Conditions<\/h2>/i, '<h1 style="font-family: var(--font-serif); font-size: 36px; margin-bottom: 16px;">Terms &amp; Conditions</h1>')
  },
  {
    file: 'pages/tracking.html',
    fn: (html) => html.replace('<main class="tracking-main-shell">', '<main class="tracking-main-shell">\n    <h1 class="sr-only">Live Shipment Journey &amp; Tracking</h1>')
  }
];

h1Mappings.forEach(item => {
  const full = path.join(root, item.file);
  if (!fs.existsSync(full)) return;
  let html = fs.readFileSync(full, 'utf8');
  if (!html.includes('<h1')) {
    html = item.fn(html);
    fs.writeFileSync(full, html, 'utf8');
    console.log(`✅ Fixed H1 in ${item.file}`);
  }
});
