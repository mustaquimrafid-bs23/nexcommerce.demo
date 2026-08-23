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
console.log('Total HTML files found:', files.length);

const summary = [];
files.forEach(f => {
  const rel = path.relative(root, f).replace(/\\/g, '/');
  const html = fs.readFileSync(f, 'utf8');
  
  const hasAnnounce = html.includes('announcement-bar') || html.includes('top-announcement-bar');
  const hasHeader = html.includes('site-header');
  const hasDesktopSearch = html.includes('search-trigger') && html.includes('searchTriggerBtn');
  const hasMobileSearch = html.includes('mobileSearchTriggerBtn');
  const hasNavLinks = html.includes('nav-menu-links');
  const hasMobileDrawer = html.includes('mobileNavDrawer');
  
  // Extract nav links
  let navLinks = [];
  const navMatch = html.match(/<nav[^>]*class="[^"]*nav-menu-links[^"]*"[^>]*>([\s\S]*?)<\/nav>/);
  if (navMatch) {
    const aMatches = [...navMatch[1].matchAll(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)];
    navLinks = aMatches.map(m => ({ href: m[1], text: m[2].replace(/<[^>]+>/g, '').trim() }));
  }

  // Extract announcement bar content
  let announceContent = '';
  const annMatch = html.match(/<div class="(?:top-announcement-bar|announcement-bar)[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/);
  if (annMatch) {
    announceContent = annMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  summary.push({
    file: rel,
    hasAnnounce,
    announceText: announceContent.substring(0, 40),
    hasHeader,
    hasDesktopSearch,
    hasMobileSearch,
    hasNavLinks,
    hasMobileDrawer,
    navLinksCount: navLinks.length,
    navLinks: navLinks.map(n => n.text + ' (' + n.href + ')').join(', ')
  });
});

console.table(summary);
