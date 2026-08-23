const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const dirs = [rootDir, path.join(rootDir, 'pages')];

let totalFixed = 0;

for (const dir of dirs) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // Match full <input ...class="search-ai-input"...> tag (any attribute order)
    content = content.replace(/<input([^>]*)class="search-ai-input"([^>]*)>/g, (fullMatch, before, after) => {
      const full = fullMatch;
      const hasId = /id="[^"]+"/.test(full);
      const hasName = /\bname="[^"]+"/.test(full);
      const hasSpellcheck = /spellcheck=/.test(full);
      const hasAriaLabel = /aria-label=/.test(full);

      if (hasId && hasName && hasSpellcheck && hasAriaLabel) return full;

      // Extract placeholder to build a clean replacement
      const placeholderMatch = full.match(/placeholder="([^"]*)"|placeholder='([^']*)'/);
      const placeholder = placeholderMatch ? (placeholderMatch[1] || placeholderMatch[2]) : 'Search query';
      const isSelfClosing = full.endsWith('/>');

      // Build canonical version
      const canonical = `<input type="text" id="aiSearchModalInput" name="q" class="search-ai-input" placeholder="${placeholder}" autocomplete="off" spellcheck="false" aria-label="Search query"${isSelfClosing ? ' /' : ''}>`;
      return canonical;
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      totalFixed++;
      console.log(`Fixed: ${path.relative(rootDir, filePath)}`);
    }
  }
}

console.log(`\nTotal files fixed: ${totalFixed}`);

// Verify
let remaining = 0;
for (const dir of dirs) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  for (const file of files) {
    const content = fs.readFileSync(path.join(dir, file), 'utf8');
    const matches = content.match(/<input[^>]*class="search-ai-input"[^>]*>/g) || [];
    for (const m of matches) {
      const hasId = /id="[^"]+"/.test(m);
      const hasName = /\bname="[^"]+"/.test(m);
      if (!hasId || !hasName) {
        console.error(`STILL MISSING: ${file} -> ${m}`);
        remaining++;
      }
    }
  }
}
if (remaining === 0) {
  console.log('✅ All search-ai-input elements now have id and name attributes!');
} else {
  console.error(`❌ ${remaining} inputs still missing id or name.`);
}
