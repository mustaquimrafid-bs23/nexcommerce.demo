const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'css', 'design-system.css');
const css = fs.readFileSync(cssPath, 'utf8');

const lines = css.split('\n');
const warnings = [];

// 1. Check double semicolons
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (/;;/.test(line)) {
    warnings.push({ line: i + 1, type: 'Double semicolon', content: line.trim() });
  }
}

// 2. Check for missing units (e.g. width: 20; height: 100; margin: 10 20;)
const unitReqProps = ['width', 'height', 'min-width', 'min-height', 'max-width', 'max-height', 'top', 'bottom', 'left', 'right', 'margin', 'padding', 'gap', 'font-size', 'border-radius'];
const propRegex = new RegExp(`^\\s*(${unitReqProps.join('|')})\\s*:\\s*([^;]+);`, 'i');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const m = line.match(propRegex);
  if (m) {
    const prop = m[1];
    const val = m[2].trim();
    // check if it is a single number > 0 without unit (excluding line-height, opacity, z-index, flex)
    if (/^[1-9]\d*$/.test(val)) {
      warnings.push({ line: i + 1, type: 'Missing unit on length property', prop, val, content: line.trim() });
    }
  }
}

// 3. Check invalid hex colors
const hexRegex = /#([0-9a-fA-F]{1,})/g;
let mHex;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  while ((mHex = hexRegex.exec(line)) !== null) {
    const hex = mHex[1];
    if (![3, 4, 6, 8].includes(hex.length)) {
      // ignore if it's part of an ID selector like #plpProductGrid
      const preceding = line.slice(0, mHex.index);
      if (!preceding.includes(':') && !preceding.includes('color') && !preceding.includes('background') && !preceding.includes('border') && !preceding.includes('shadow')) {
        continue; // likely a CSS selector ID
      }
      warnings.push({ line: i + 1, type: 'Invalid hex color length', hex: '#' + hex, content: line.trim() });
    }
  }
}

console.log('CSS Quality Audit Results:');
console.log('Total lines scanned:', lines.length);
console.log('Total issues found:', warnings.length);
warnings.forEach(w => console.log(`  Line ${w.line}: [${w.type}] ${w.content}`));
