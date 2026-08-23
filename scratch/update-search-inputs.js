const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const pagesDir = path.join(rootDir, 'pages');

const htmlFiles = [
  path.join(rootDir, 'index.html'),
  path.join(rootDir, '404.html'),
  ...fs.readdirSync(pagesDir).filter(f => f.endsWith('.html')).map(f => path.join(pagesDir, f))
];

let updatedCount = 0;

for (const file of htmlFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace search-ai-input without id
  content = content.replace(
    /<input type="text" class="search-ai-input" placeholder="([^"]+)" autocomplete="off" spellcheck="false" aria-label="Search query" \/>/g,
    '<input type="text" id="aiSearchModalInput" name="q" class="search-ai-input" placeholder="$1" autocomplete="off" spellcheck="false" aria-label="Search query" />'
  );
  content = content.replace(
    /<input type="text" class="search-ai-input" placeholder="([^"]+)" autocomplete="off" spellcheck="false" aria-label="Search query">/g,
    '<input type="text" id="aiSearchModalInput" name="q" class="search-ai-input" placeholder="$1" autocomplete="off" spellcheck="false" aria-label="Search query">'
  );

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    updatedCount++;
    console.log(`Updated: ${path.relative(rootDir, file)}`);
  }
}

console.log(`\nUpdated ${updatedCount} files with standardized id and name for search-ai-input.`);
