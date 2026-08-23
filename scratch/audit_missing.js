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

const files = getHtmlFiles(root);
console.log('Total HTML files:', files.length);

const missingHeaderJs = [];
const missingSearchJs = [];
const missingSearchModal = [];
const missingAnnounce = [];
const missingMobileSearchBtn = [];

files.forEach(f => {
  const rel = path.relative(root, f).replace(/\\/g, '/');
  if (rel.includes('signin') || rel.includes('signup')) return; // Auth pages exempt
  const html = fs.readFileSync(f, 'utf8');

  if (!html.includes('header.js')) missingHeaderJs.push(rel);
  if (!html.includes('search-overlay.js')) missingSearchJs.push(rel);
  if (!html.includes('id="aiSearchModal"') && !html.includes("id='aiSearchModal'")) missingSearchModal.push(rel);
  if (!html.includes('top-announcement-bar')) missingAnnounce.push(rel);
  if (!html.includes('id="mobileSearchTriggerBtn"') && !html.includes("id='mobileSearchTriggerBtn'")) missingMobileSearchBtn.push(rel);
});

console.log('\n❌ Missing header.js:', missingHeaderJs);
console.log('\n❌ Missing search-overlay.js:', missingSearchJs);
console.log('\n❌ Missing #aiSearchModal:', missingSearchModal);
console.log('\n❌ Missing .top-announcement-bar:', missingAnnounce);
console.log('\n❌ Missing #mobileSearchTriggerBtn in header:', missingMobileSearchBtn);
