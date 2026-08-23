const fs = require('fs');
const path = require('path');

const root = process.cwd();
const files = [
  'pages/about.html',
  'pages/account.html',
  'pages/cart.html',
  'pages/category.html',
  'pages/checkout.html',
  'pages/concierge.html',
  'pages/contact.html',
  'pages/discovery.html',
  'pages/foundation.html',
  'pages/impressum.html',
  'pages/lookbook.html',
  'pages/orders.html',
  'pages/playground.html',
  'pages/privacy.html',
  'pages/profile.html',
  'pages/security.html',
  'pages/size-guide.html',
  'pages/smart-list.html',
  'pages/terms.html',
  'pages/tracking.html'
];

files.forEach(f => {
  const full = path.join(root, f);
  if (!fs.existsSync(full)) return;
  const html = fs.readFileSync(full, 'utf8');
  const h1 = html.match(/<h1[\s\S]*?<\/h1>/i);
  const h2 = html.match(/<h2[\s\S]*?<\/h2>/i);
  console.log(`[${f}] H1: ${h1 ? h1[0].slice(0, 60) : 'NONE'} | H2: ${h2 ? h2[0].slice(0, 60) : 'NONE'}`);
});
