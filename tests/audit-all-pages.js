const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const PAGES_DIR = path.join(ROOT_DIR, 'pages');

const htmlFiles = [
  path.join(ROOT_DIR, 'index.html'),
  path.join(ROOT_DIR, '404.html'),
  ...fs.readdirSync(PAGES_DIR)
    .filter(f => f.endsWith('.html'))
    .map(f => path.join(PAGES_DIR, f))
];

console.log(`Found ${htmlFiles.length} HTML pages to deeply audit.\n`);

let totalIssues = 0;
const report = {};

function checkRelativeAsset(htmlPath, relPath) {
  if (!relPath || relPath.startsWith('http://') || relPath.startsWith('https://') || relPath.startsWith('data:') || relPath.startsWith('#') || relPath.startsWith('mailto:') || relPath.startsWith('tel:')) {
    return { ok: true };
  }
  if (relPath.includes('${') || relPath.includes('{{')) return { ok: true }; // Template string inside script

  const cleanRel = relPath.split('?')[0].split('#')[0];
  if (!cleanRel) return { ok: true };

  let targetPath;
  if (cleanRel.startsWith('/')) {
    targetPath = path.join(ROOT_DIR, cleanRel.slice(1));
  } else {
    targetPath = path.resolve(path.dirname(htmlPath), cleanRel);
  }

  if (fs.existsSync(targetPath)) {
    return { ok: true, resolved: targetPath };
  }
  return { ok: false, checked: targetPath, original: relPath };
}

htmlFiles.forEach(file => {
  const relName = path.relative(ROOT_DIR, file);
  const rawContent = fs.readFileSync(file, 'utf8');
  const issues = [];

  // Strip script and style content for pure HTML AST checking
  const htmlOnly = rawContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // 1. Content & Copy Checks
  if (!rawContent.includes('<title>') || !rawContent.includes('</title>')) {
    issues.push({ dim: 'Content & Copy', desc: 'Missing <title> tag' });
  }
  if (!rawContent.includes('name="description"') && !rawContent.includes('name=\'description\'')) {
    issues.push({ dim: 'Content & Copy', desc: 'Missing meta description tag' });
  }

  // Check for TODO/FIXME
  if (rawContent.includes('TODO:') || rawContent.includes('FIXME:')) {
    issues.push({ dim: 'Content & Copy', desc: 'Contains TODO or FIXME markers' });
  }

  // 2. Visual / Layout / Viewport
  if (!rawContent.includes('name="viewport"') && !rawContent.includes('name=\'viewport\'')) {
    issues.push({ dim: 'Visual / Layout', desc: 'Missing viewport meta tag' });
  }

  // Check CSS stylesheets existence
  const cssMatches = [...rawContent.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/gi), ...rawContent.matchAll(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']stylesheet["']/gi)];
  for (const match of cssMatches) {
    const href = match[1];
    const assetCheck = checkRelativeAsset(file, href);
    if (!assetCheck.ok) {
      issues.push({ dim: 'Visual / Layout', desc: `Broken CSS stylesheet reference: ${href}` });
    }
  }

  // 3. Interactions & Scripts
  const scriptMatches = [...rawContent.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)];
  for (const match of scriptMatches) {
    const src = match[1];
    const assetCheck = checkRelativeAsset(file, src);
    if (!assetCheck.ok) {
      issues.push({ dim: 'Interactions', desc: `Broken JS script reference: ${src}` });
    }
  }

  // 4. Cross-Page Consistency & Links
  const linkMatches = [...htmlOnly.matchAll(/<a[^>]+href=["']([^"']+)["']/gi)];
  for (const match of linkMatches) {
    const href = match[1];
    if (href === '#' || href.startsWith('javascript:')) continue;
    const assetCheck = checkRelativeAsset(file, href);
    if (!assetCheck.ok) {
      issues.push({ dim: 'Cross-Page Uniform', desc: `Broken internal link href: ${href}` });
    }
  }

  // Images existence & Alt text in HTML
  const imgMatches = [...htmlOnly.matchAll(/<img([^>]+)>/gi)];
  for (const match of imgMatches) {
    const imgTag = match[1];
    const srcMatch = imgTag.match(/src=["']([^"']+)["']/i);
    const altMatch = imgTag.match(/alt=["']([^"']*)["']/i);

    if (srcMatch) {
      const src = srcMatch[1];
      const assetCheck = checkRelativeAsset(file, src);
      if (!assetCheck.ok) {
        issues.push({ dim: 'Visual / Layout', desc: `Broken image src: ${src}` });
      }
    } else {
      issues.push({ dim: 'Visual / Layout', desc: `Image missing src attribute in tag: <img ${imgTag}>` });
    }

    if (!altMatch) {
      issues.push({ dim: 'Accessibility', desc: `Image missing alt attribute: <img ${imgTag.slice(0, 50)}...>` });
    }
  }

  // 7. Accessibility Semantics
  const buttonMatches = [...htmlOnly.matchAll(/<button([^>]*)>(.*?)<\/button>/gis)];
  for (const match of buttonMatches) {
    const attrs = match[1];
    const inner = match[2].trim();
    const hasAriaLabel = /aria-label=["'][^"']+["']/i.test(attrs);
    const hasTitle = /title=["'][^"']+["']/i.test(attrs);
    const hasVisibleText = inner.replace(/<[^>]+>/g, '').trim().length > 0;
    
    if (!hasAriaLabel && !hasTitle && !hasVisibleText) {
      issues.push({ dim: 'Accessibility', desc: `Button has no visible text, aria-label, or title: <button ${attrs}>` });
    }
  }

  report[relName] = issues;
  if (issues.length > 0) {
    totalIssues += issues.length;
  }
});

console.log('═══════════════════════════════════════════════════════════════════');
console.log('             STATIC SWEEP RESULTS ACROSS ALL 29 PAGES              ');
console.log('═══════════════════════════════════════════════════════════════════');

for (const [page, issues] of Object.entries(report)) {
  if (issues.length === 0) {
    console.log(`✅ ${page.padEnd(35)} -> ZERO ISSUES FOUND`);
  } else {
    console.log(`❌ ${page.padEnd(35)} -> ${issues.length} ISSUE(S):`);
    issues.forEach(iss => {
      console.log(`   - [${iss.dim}] ${iss.desc}`);
    });
  }
}

console.log('═══════════════════════════════════════════════════════════════════');
console.log(`TOTAL DETECTED STATIC ISSUES ACROSS 29 PAGES: ${totalIssues}`);
console.log('═══════════════════════════════════════════════════════════════════\n');
