const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'css', 'design-system.css');
const css = fs.readFileSync(cssPath, 'utf8');

// Find all defined CSS variables
const definedVars = new Set();
const varDefRegex = /(--[a-zA-Z0-9-_]+)\s*:/g;
let match;
while ((match = varDefRegex.exec(css)) !== null) {
  definedVars.add(match[1]);
}

console.log('Total defined CSS variables:', definedVars.size);

// Find all referenced CSS variables
const usedVars = new Map();
const varUseRegex = /var\(\s*(--[a-zA-Z0-9-_]+)(?:\s*,\s*([^)]+))?\s*\)/g;
while ((match = varUseRegex.exec(css)) !== null) {
  const varName = match[1];
  const fallback = match[2];
  if (!usedVars.has(varName)) {
    usedVars.set(varName, { count: 0, fallbacks: [] });
  }
  usedVars.get(varName).count++;
  if (fallback) usedVars.get(varName).fallbacks.push(fallback);
}

console.log('Total referenced CSS variables:', usedVars.size);

const missingVars = [];
for (const [varName, info] of usedVars.entries()) {
  if (!definedVars.has(varName)) {
    // Check if it has a fallback everywhere
    if (info.fallbacks.length < info.count) {
      missingVars.push({ varName, count: info.count, fallbackCount: info.fallbacks.length });
    }
  }
}

if (missingVars.length > 0) {
  console.log('⚠️ Undefined CSS variables without fallback:');
  missingVars.forEach(m => console.log(`  - ${m.varName} (used ${m.count} times, fallback in ${m.fallbackCount})`));
} else {
  console.log('✅ All referenced CSS variables are properly defined or have fallbacks!');
}

// Check for missing semicolons in multiline declarations
const lines = css.split('\n');
const missingSemicolons = [];

for (let i = 0; i < lines.length - 1; i++) {
  const line = lines[i].trim();
  const nextLine = lines[i + 1].trim();

  // If line looks like a CSS property declaration: property: value
  if (/^[a-zA-Z0-9-_]+\s*:\s*[^;{}]+$/.test(line)) {
    // and next line is another property declaration or NOT a closing brace
    if (/^[a-zA-Z0-9-_]+\s*:/.test(nextLine)) {
      missingSemicolons.push({ lineNum: i + 1, content: line });
    }
  }
}

if (missingSemicolons.length > 0) {
  console.log('⚠️ Potential missing semicolons:');
  missingSemicolons.forEach(m => console.log(`  Line ${m.lineNum}: ${m.content}`));
} else {
  console.log('✅ No missing semicolons detected between adjacent property declarations!');
}
