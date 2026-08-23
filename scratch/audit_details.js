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

console.log('--- DETAILED PAGE INSPECTION ---');
files.forEach(f => {
  const rel = path.relative(root, f).replace(/\\/g, '/');
  const html = fs.readFileSync(f, 'utf8');
  
  const hasAnnounce = html.includes('announcement-bar') || html.includes('top-announcement-bar');
  const hasHeader = html.includes('site-header');
  const hasDesktopSearch = html.includes('id="searchTriggerBtn"') || html.includes("id='searchTriggerBtn'");
  const hasMobileSearch = html.includes('id="mobileSearchTriggerBtn"') || html.includes("id='mobileSearchTriggerBtn'");
  const hasSearchModal = html.includes('id="aiSearchModal"') || html.includes("id='aiSearchModal'");
  const hasSearchOverlayScript = html.includes('search-overlay.js');
  
  // Extract nav links
  let navLinks = [];
  const navMatch = html.match(/<nav[^>]*class="[^"]*nav-menu-links[^"]*"[^>]*>([\s\S]*?)<\/nav>/);
  if (navMatch) {
    const aMatches = [...navMatch[1].matchAll(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)];
    navLinks = aMatches.map(m => m[1] + ' (' + m[2].replace(/<[^>]+>/g, '').trim() + ')');
  }

  // Extract drawer links
  let drawerLinks = [];
  const drawerMatch = html.match(/<div[^>]*class="[^"]*mobile-nav-drawer[^"]*"[^>]*>([\s\S]*?)<\/div>/);
  if (drawerMatch) {
    const aMatches = [...drawerMatch[1].matchAll(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)];
    drawerLinks = aMatches.map(m => m[1] + ' (' + m[2].replace(/<[^>]+>/g, '').trim() + ')');
  }

  console.log(`\n📄 [${rel}]`);
  console.log(`  - Header: ${hasHeader ? '✅' : '❌'}`);
  console.log(`  - Announcement: ${hasAnnounce ? '✅' : '❌'}`);
  console.log(`  - Desktop Search Btn (#searchTriggerBtn): ${hasDesktopSearch ? '✅' : '❌'}`);
  console.log(`  - Mobile Search Btn (#mobileSearchTriggerBtn): ${hasMobileSearch ? '✅' : '❌'}`);
  console.log(`  - Search Modal (#aiSearchModal): ${hasSearchModal ? '✅' : '❌'}`);
  console.log(`  - search-overlay.js: ${hasSearchOverlayScript ? '✅' : '❌'}`);
  console.log(`  - Nav links (${navLinks.length}): ${navLinks.join(', ')}`);
  console.log(`  - Drawer links (${drawerLinks.length}): ${drawerLinks.join(', ')}`);
});
