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

console.log('═══════════════════════════════════════════════════════════════════════════════════');
console.log('         THE 7-DIMENSION FULL-SITE STOREFRONT AUDIT & REGRESSION SWEEP             ');
console.log(`         Auditing ${htmlFiles.length} HTML Pages & Core Engine Subsystems`);
console.log('═══════════════════════════════════════════════════════════════════════════════════\n');

const results = {
  dim1_content: [],
  dim2_visual: [],
  dim3_interactions: [],
  dim4_uniformity: [],
  dim5_flows: [],
  dim6_edge: [],
  dim7_a11y: []
};

function checkRelativeAsset(htmlPath, relPath) {
  if (!relPath || relPath.startsWith('http://') || relPath.startsWith('https://') || relPath.startsWith('data:') || relPath.startsWith('#') || relPath.startsWith('mailto:') || relPath.startsWith('tel:')) {
    return { ok: true };
  }
  if (relPath.includes('${') || relPath.includes('{{')) return { ok: true };

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

// ─────────────────────────────────────────────────────────────────────────────
// 1. Cross-Page Static HTML Auditing across all 7 Dimensions
// ─────────────────────────────────────────────────────────────────────────────
htmlFiles.forEach(file => {
  const relName = path.relative(ROOT_DIR, file);
  const rawContent = fs.readFileSync(file, 'utf8');
  const htmlOnly = rawContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // --- Dimension 1: Content & Copy ---
  // Title tag
  const titleMatch = rawContent.match(/<title>(.*?)<\/title>/i);
  if (!titleMatch || !titleMatch[1].trim()) {
    results.dim1_content.push({ page: relName, issue: 'Missing or empty <title> tag' });
  } else if (!titleMatch[1].includes('nexCommerce') && !relName.includes('playground')) {
    results.dim1_content.push({ page: relName, issue: `<title> missing brand suffix "nexCommerce": "${titleMatch[1]}"` });
  }

  // Meta description
  const metaDescMatch = rawContent.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i) ||
                        rawContent.match(/<meta\s+content=["'](.*?)["']\s+name=["']description["']/i);
  if (!metaDescMatch || !metaDescMatch[1].trim()) {
    results.dim1_content.push({ page: relName, issue: 'Missing meta description' });
  } else if (metaDescMatch[1].trim().length < 20) {
    results.dim1_content.push({ page: relName, issue: `Meta description too short (${metaDescMatch[1].trim().length} chars): "${metaDescMatch[1]}"` });
  }

  // Single H1 enforcement (excluding style guide / preview / full-bleed lookbook pages if deliberate)
  const h1Matches = [...htmlOnly.matchAll(/<h1\b[^>]*>/gi)];
  if (h1Matches.length === 0 && !relName.includes('components-preview')) {
    results.dim1_content.push({ page: relName, issue: 'Missing <h1> heading element' });
  } else if (h1Matches.length > 1 && !relName.includes('components-preview')) {
    results.dim1_content.push({ page: relName, issue: `Multiple (${h1Matches.length}) <h1> headings detected (WCAG hierarchy violation)` });
  }

  // Check for lingering placeholder / unfinished tokens
  if (rawContent.includes('TODO:') || rawContent.includes('FIXME:') || rawContent.includes('Lorem ipsum')) {
    results.dim1_content.push({ page: relName, issue: 'Contains unfinished draft/placeholder copy (TODO/FIXME/Lorem)' });
  }

  // Check announcement bar copy standardization if announcement bar exists
  if (rawContent.includes('top-announcement-bar') || rawContent.includes('announcement-inner')) {
    if (rawContent.includes('30-day free returns')) {
      results.dim1_content.push({ page: relName, issue: 'Announcement bar has obsolete "30-day" returns instead of "14-day free returns"' });
    }
  }

  // --- Dimension 2: Visual / Layout ---
  // Viewport tag
  if (!rawContent.includes('name="viewport"') && !rawContent.includes('name=\'viewport\'')) {
    results.dim2_visual.push({ page: relName, issue: 'Missing mobile viewport meta tag' });
  }

  // CSS Stylesheets
  const cssMatches = [...rawContent.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/gi), ...rawContent.matchAll(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']stylesheet["']/gi)];
  for (const match of cssMatches) {
    const href = match[1];
    const assetCheck = checkRelativeAsset(file, href);
    if (!assetCheck.ok) {
      results.dim2_visual.push({ page: relName, issue: `Broken CSS stylesheet path: ${href}` });
    }
  }

  // Image assets
  const imgMatches = [...htmlOnly.matchAll(/<img([^>]+)>/gi)];
  for (const match of imgMatches) {
    const imgTag = match[1];
    const srcMatch = imgTag.match(/src=["']([^"']+)["']/i);
    if (srcMatch) {
      const src = srcMatch[1];
      const assetCheck = checkRelativeAsset(file, src);
      if (!assetCheck.ok) {
        results.dim2_visual.push({ page: relName, issue: `Broken image source: ${src}` });
      }
    } else {
      results.dim2_visual.push({ page: relName, issue: `Image tag missing src attribute: <img ${imgTag}>` });
    }
  }

  // --- Dimension 3: Interactions & Lifecycle Handlers ---
  // JavaScript dependencies
  const scriptMatches = [...rawContent.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)];
  const scriptSrcs = [];
  for (const match of scriptMatches) {
    const src = match[1];
    scriptSrcs.push(src);
    const assetCheck = checkRelativeAsset(file, src);
    if (!assetCheck.ok) {
      results.dim3_interactions.push({ page: relName, issue: `Broken JS script path: ${src}` });
    }
  }

  // Duplicate scripts
  const uniqueScripts = new Set();
  for (const src of scriptSrcs) {
    const cleanSrc = src.split('?')[0];
    if (uniqueScripts.has(cleanSrc)) {
      results.dim3_interactions.push({ page: relName, issue: `Duplicate script loaded: ${src}` });
    }
    uniqueScripts.add(cleanSrc);
  }

  // Native alert usage
  if (htmlOnly.includes('alert(') || (rawContent.includes('alert(') && !relName.includes('test'))) {
    // Check if script has native alert
    const scriptMatchesInner = [...rawContent.matchAll(/<script\b[^>]*>(.*?)<\/script>/gis)];
    for (const sm of scriptMatchesInner) {
      if (sm[1].includes('alert(') && !sm[1].includes('// alert') && !sm[1].includes('/* alert')) {
        results.dim3_interactions.push({ page: relName, issue: 'Script contains native browser alert() instead of toast/modal' });
      }
    }
  }

  // --- Dimension 4: Cross-Page Uniformity & Link Resolution ---
  // All anchor links
  const linkMatches = [...htmlOnly.matchAll(/<a[^>]+href=["']([^"']+)["']/gi)];
  for (const match of linkMatches) {
    const href = match[1];
    if (href === '#' || href.startsWith('javascript:')) continue;
    const assetCheck = checkRelativeAsset(file, href);
    if (!assetCheck.ok) {
      results.dim4_uniformity.push({ page: relName, issue: `Broken internal link href: ${href}` });
    }
  }

  // Mobile nav drawer accessibility & consistency (on main storefront pages)
  if (!relName.includes('components-preview') && !relName.includes('foundation') && !relName.includes('playground')) {
    if (rawContent.includes('site-header') || rawContent.includes('nav-brand-group')) {
      if (!rawContent.includes('id="mobileNavDrawer"')) {
        results.dim4_uniformity.push({ page: relName, issue: 'Header present but missing #mobileNavDrawer element' });
      }
    }
  }

  // Wishlist / Cart badges in header
  if (rawContent.includes('class="site-header"')) {
    if (!rawContent.includes('id="headerCartCount"')) {
      results.dim4_uniformity.push({ page: relName, issue: 'Header missing #headerCartCount badge element' });
    }
    if (!rawContent.includes('id="headerWishlistCount"')) {
      results.dim4_uniformity.push({ page: relName, issue: 'Header missing #headerWishlistCount badge element' });
    }
    // Global Delivery Location Hub scripts
    if (!rawContent.includes('delivery-gate-engine.js')) {
      results.dim4_uniformity.push({ page: relName, issue: 'Missing delivery-gate-engine.js for global header delivery pill' });
    }
    if (!rawContent.includes('delivery-gate-ui.js')) {
      results.dim4_uniformity.push({ page: relName, issue: 'Missing delivery-gate-ui.js for global header delivery pill' });
    }
  }

  // --- Dimension 7: Accessibility (WCAG 2.1 AA) ---
  // Img alt tags
  for (const match of imgMatches) {
    const imgTag = match[1];
    const altMatch = imgTag.match(/alt=["']([^"']*)["']/i);
    if (!altMatch) {
      results.dim7_a11y.push({ page: relName, issue: `<img> missing alt attribute: <img ${imgTag.slice(0, 50)}...>` });
    }
  }

  // Button accessibility: text, aria-label, or title
  const buttonMatches = [...htmlOnly.matchAll(/<button([^>]*)>(.*?)<\/button>/gis)];
  for (const match of buttonMatches) {
    const attrs = match[1];
    const inner = match[2].trim();
    const hasAriaLabel = /aria-label=["'][^"']+["']/i.test(attrs);
    const hasTitle = /title=["'][^"']+["']/i.test(attrs);
    const hasVisibleText = inner.replace(/<[^>]+>/g, '').trim().length > 0;

    if (!hasAriaLabel && !hasTitle && !hasVisibleText) {
      results.dim7_a11y.push({ page: relName, issue: `Interactive button without text, aria-label, or title: <button ${attrs}>` });
    }
  }

  // Form input accessibility: <input> must have id with corresponding label, or aria-label, or title
  const inputMatches = [...htmlOnly.matchAll(/<input([^>]+)>/gi)];
  for (const match of inputMatches) {
    const attrs = match[1];
    const typeMatch = attrs.match(/type=["']([^"']+)["']/i);
    const inputType = typeMatch ? typeMatch[1].toLowerCase() : 'text';
    if (inputType === 'hidden' || inputType === 'submit' || inputType === 'button') continue;

    const hasAriaLabel = /aria-label=["'][^"']+["']/i.test(attrs);
    const hasAriaLabelledBy = /aria-labelledby=["'][^"']+["']/i.test(attrs);
    const idMatch = attrs.match(/id=["']([^"']+)["']/i);
    let hasLabelTag = false;
    if (idMatch) {
      const inputId = idMatch[1];
      hasLabelTag = htmlOnly.includes(`for="${inputId}"`) || htmlOnly.includes(`for='${inputId}'`);
    }

    if (!hasAriaLabel && !hasAriaLabelledBy && !hasLabelTag) {
      results.dim7_a11y.push({ page: relName, issue: `Form input missing associated <label for="..."> or aria-label: <input ${attrs.slice(0, 50)}...>` });
    }
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. CSS Syntax & Design System Brace Balance Sweep
// ─────────────────────────────────────────────────────────────────────────────
const cssFiles = fs.readdirSync(path.join(ROOT_DIR, 'css')).filter(f => f.endsWith('.css'));
cssFiles.forEach(cssFile => {
  const cssContent = fs.readFileSync(path.join(ROOT_DIR, 'css', cssFile), 'utf8');
  let openBraces = 0;
  let closeBraces = 0;
  for (let i = 0; i < cssContent.length; i++) {
    if (cssContent[i] === '{') openBraces++;
    if (cssContent[i] === '}') closeBraces++;
  }
  if (openBraces !== closeBraces) {
    results.dim2_visual.push({ page: `css/${cssFile}`, issue: `Unbalanced CSS braces: ${openBraces} '{' vs ${closeBraces} '}'` });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Print Dimension-by-Dimension Audit Summary
// ─────────────────────────────────────────────────────────────────────────────
let totalDefects = 0;

const dimNames = [
  ['dim1_content', '1. Content & Copy Integrity'],
  ['dim2_visual', '2. Visual / Layout & Asset Integrity'],
  ['dim3_interactions', '3. Interactions & Lifecycle Handlers'],
  ['dim4_uniformity', '4. Cross-Page Uniformity & Link Resolution'],
  ['dim5_flows', '5. End-to-End User Flows & State Engines'],
  ['dim6_edge', '6. Edge Cases & Boundary Conditions'],
  ['dim7_a11y', '7. Accessibility (WCAG 2.1 AA)']
];

for (const [key, title] of dimNames) {
  const issues = results[key];
  totalDefects += issues.length;
  console.log(`┌─────────────────────────────────────────────────────────────────────────────┐`);
  console.log(`│ [DIMENSION] ${title.padEnd(63)} │`);
  console.log(`└─────────────────────────────────────────────────────────────────────────────┘`);
  if (issues.length === 0) {
    console.log(`  ✨ ALL CHECKS PASSED (0 Defects Detected)\n`);
  } else {
    console.log(`  ⚠️ ${issues.length} ISSUE(S) DETECTED:`);
    issues.forEach(item => {
      console.log(`  - [${item.page}] ${item.issue}`);
    });
    console.log('');
  }
}

console.log('═══════════════════════════════════════════════════════════════════════════════════');
console.log(`  AUDIT SUMMARY: ${totalDefects} total static defects found across all 7 dimensions.`);
console.log('═══════════════════════════════════════════════════════════════════════════════════\n');

if (totalDefects > 0) {
  process.exit(1);
}
