const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const PAGES_DIR = path.join(ROOT_DIR, 'pages');

// 1. Delete pages/lookbook.html if it exists
const lookbookPath = path.join(PAGES_DIR, 'lookbook.html');
if (fs.existsSync(lookbookPath)) {
  fs.unlinkSync(lookbookPath);
  console.log('✅ Deleted pages/lookbook.html');
} else {
  console.log('ℹ️ pages/lookbook.html already does not exist');
}

// Helper to remove desktop nav link and mobile drawer link
function cleanHtmlFile(filePath, isRoot) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Remove desktop nav lookbook link
  // Handles: <a href="pages/lookbook.html" ...>Lookbook</a> or <a href="lookbook.html" ...>Lookbook</a>
  content = content.replace(/[ \t]*<a\s+href="(?:pages\/)?lookbook\.html"\s+class="nav-item-link"\s+data-nav="lookbook">Lookbook<\/a>\r?\n?/g, '');

  // Remove mobile drawer lookbook link
  // Matches: <a href="pages/lookbook.html" ...>\s*<span>Lookbook</span>\s*<i ...></i>\s*</a>
  const mobileDrawerRegex = /[ \t]*<a\s+href="(?:pages\/)?lookbook\.html"\s+class="mobile-drawer-link"[^>]*>[\s\S]*?<span>Lookbook<\/span>[\s\S]*?<\/a>\r?\n?/g;
  content = content.replace(mobileDrawerRegex, '');

  // 404 specific replacements
  if (filePath.endsWith('404.html')) {
    content = content.replace(
      'The requested atelier destination is unavailable. Explore our active ready-to-wear collections, Lookbook, or consult our Style Concierge.',
      'The requested atelier destination is unavailable. Explore our active ready-to-wear collections, Smart List, or consult our Style Concierge.'
    );
    content = content.replace(
      '<a href="pages/lookbook.html" class="recovery-prompt-chip">✦ The Winter Lookbook</a>',
      '<a href="pages/smart-list.html" class="recovery-prompt-chip">✦ AI Smart List</a>'
    );
    const lookbookWingCardRegex = /<a\s+href="pages\/lookbook\.html"\s+class="recovery-wing-card">[\s\S]*?<\/a>/;
    const smartListWingCard = `<a href="pages/smart-list.html" class="recovery-wing-card">
          <div>
            <span class="recovery-wing-tag">AGENTIC COMMERCE</span>
            <div class="recovery-wing-title">Smart List &amp; Vault</div>
            <p class="recovery-wing-desc">AI-powered predictive wardrobe planning, budget caps, and dynamic auto-ordering.</p>
          </div>
          <div class="recovery-wing-cta">
            <span>EXPLORE SMART LIST</span>
            <i data-lucide="arrow-right" style="width: 13px; height: 13px; color: var(--accent-cyan);"></i>
          </div>
        </a>`;
    content = content.replace(lookbookWingCardRegex, smartListWingCard);
  }

  // Wishlist specific replacements
  if (filePath.endsWith('wishlist.html')) {
    content = content.replace(
      'Explore the lookbook and collections to begin saving items, or restore default items.',
      'Explore our ready-to-wear collections to begin saving items, or restore default items.'
    );
    content = content.replace(
      /<a\s+href="lookbook\.html"\s+class="btn-primary-commerce"[\s\S]*?<span>VIEW LOOKBOOK 2026<\/span>[\s\S]*?<\/a>\s*<button type="button" class="btn-secondary-action" data-action="reset-defaults"[\s\S]*?<span>RESTORE DEFAULTS<\/span>\s*<\/button>\s*<a href="category\.html\?cat=all" class="btn-secondary-action"[^>]*>\s*<span>EXPLORE COLLECTIONS<\/span>\s*<\/a>/,
      `<a href="category.html?cat=all" class="btn-primary-commerce" style="height: 46px; padding: 0 28px; display: inline-flex; align-items: center; gap: 6px;">
            <span>EXPLORE COLLECTIONS</span>
            <i data-lucide="arrow-right" style="width: 14px; height: 14px;"></i>
          </a>
          <button type="button" class="btn-secondary-action" data-action="reset-defaults" style="height: 46px; padding: 0 24px; display: inline-flex; align-items: center; gap: 6px; cursor: pointer;">
            <i data-lucide="rotate-ccw" style="width: 14px; height: 14px;"></i>
            <span>RESTORE DEFAULTS</span>
          </button>`
    );
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Cleaned lookbook references from ${path.relative(ROOT_DIR, filePath)}`);
  }
}

// Clean index.html and 404.html
cleanHtmlFile(path.join(ROOT_DIR, 'index.html'), true);
cleanHtmlFile(path.join(ROOT_DIR, '404.html'), true);

// Clean all subpages in pages/
const subpages = fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.html'));
subpages.forEach(sp => {
  cleanHtmlFile(path.join(PAGES_DIR, sp), false);
});

// Update README.md
const readmePath = path.join(ROOT_DIR, 'README.md');
if (fs.existsSync(readmePath)) {
  let readme = fs.readFileSync(readmePath, 'utf8');
  // Remove lookbook table row
  readme = readme.replace(/\| \*\*12\*\* \| \[`lookbook\.html`\][^\n]+\n/g, '');
  // Remove lookbook tree entry
  readme = readme.replace(/[ \t]*├── 📄 lookbook\.html[^\n]+\n/g, '');
  fs.writeFileSync(readmePath, readme, 'utf8');
  console.log('✅ Updated README.md');
}

// Update tests/verify-all-35-fixes.js
const testFixesPath = path.join(ROOT_DIR, 'tests', 'verify-all-35-fixes.js');
if (fs.existsSync(testFixesPath)) {
  let testFixes = fs.readFileSync(testFixesPath, 'utf8');
  // Update Bug 8, 18, 20 & 23
  testFixes = testFixes.replace(
    /check\('Bug 8: Lookbook popover viewport boundary clamping', \(\) => \{[\s\S]*?\}\);/,
    `check('Bug 8: Lookbook page removal / retirement verified', () => {
  assert.ok(!fs.existsSync('pages/lookbook.html'), 'pages/lookbook.html must be completely removed');
});`
  );
  testFixes = testFixes.replace(
    /check\('Bug 18: Lookbook Look 04 category mapping', \(\) => \{[\s\S]*?\}\);/,
    `check('Bug 18: Retired Lookbook check (page removed)', () => {
  assert.ok(!fs.existsSync('pages/lookbook.html'), 'pages/lookbook.html cleanly unlinked');
});`
  );
  testFixes = testFixes.replace(
    /check\('Bug 20 & 23: Lookbook add to bag integration and modal Escape dismissal', \(\) => \{[\s\S]*?\}\);/,
    `check('Bug 20 & 23: Retired Lookbook modal check (page removed)', () => {
  assert.ok(!fs.existsSync('pages/lookbook.html'), 'pages/lookbook.html cleanly unlinked');
});`
  );
  fs.writeFileSync(testFixesPath, testFixes, 'utf8');
  console.log('✅ Updated tests/verify-all-35-fixes.js');
}

// Update tests/full-7dimension-audit.js
const testAuditPath = path.join(ROOT_DIR, 'tests', 'full-7dimension-audit.js');
if (fs.existsSync(testAuditPath)) {
  let testAudit = fs.readFileSync(testAuditPath, 'utf8');
  testAudit = testAudit.replace(" && !relName.includes('lookbook.html')", "");
  fs.writeFileSync(testAuditPath, testAudit, 'utf8');
  console.log('✅ Updated tests/full-7dimension-audit.js');
}
