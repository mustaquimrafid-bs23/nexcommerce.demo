const fs = require('fs');
const path = require('path');

const root = process.cwd();
const targetFiles = [
  'index.html',
  '404.html',
  'pages/about.html',
  'pages/account.html',
  'pages/cart.html',
  'pages/category.html',
  'pages/checkout.html',
  'pages/components-preview.html',
  'pages/concierge.html',
  'pages/confirmation.html',
  'pages/contact.html',
  'pages/discovery.html',
  'pages/foundation.html',
  'pages/impressum.html',
  'pages/lookbook.html',
  'pages/orders.html',
  'pages/playground.html',
  'pages/privacy.html',
  'pages/product.html',
  'pages/profile.html',
  'pages/security.html',
  'pages/size-guide.html',
  'pages/smart-list.html',
  'pages/terms.html',
  'pages/tracking.html',
  'pages/wishlist.html'
];

targetFiles.forEach(rel => {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) {
    console.log('MISSING:', rel);
    return;
  }
  const html = fs.readFileSync(full, 'utf8');
  const bodyIdx = html.indexOf('<body');
  const mainIdx = html.indexOf('<main');
  console.log(`\n=== ${rel} (body: ${bodyIdx}, main: ${mainIdx}) ===`);
  if (bodyIdx !== -1 && mainIdx !== -1) {
    console.log(html.substring(bodyIdx, Math.min(bodyIdx + 300, mainIdx)));
  } else if (mainIdx === -1) {
    console.log('NO <main tag found! Finding first <div class="container" or <section');
  }
});
