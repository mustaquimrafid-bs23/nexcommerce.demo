const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'css', 'design-system.css');
const css = fs.readFileSync(cssPath, 'utf8');

console.log('Validating CSS syntax for:', cssPath);
console.log('File size:', css.length, 'bytes');

let inComment = false;
let inString = false;
let stringChar = '';
let openBraces = [];
let openParens = [];
let openSquare = [];
let errors = [];

const lines = css.split('\n');

for (let lineNum = 1; lineNum <= lines.length; lineNum++) {
  const line = lines[lineNum - 1];
  
  for (let col = 0; col < line.length; col++) {
    const char = line[col];
    const prevChar = col > 0 ? line[col - 1] : '';
    const nextChar = col < line.length - 1 ? line[col + 1] : '';

    if (inComment) {
      if (char === '*' && nextChar === '/') {
        inComment = false;
        col++; // skip '/'
      }
      continue;
    }

    if (inString) {
      if (char === stringChar && prevChar !== '\\') {
        inString = false;
        stringChar = '';
      }
      continue;
    }

    // Check comment start
    if (char === '/' && nextChar === '*') {
      inComment = true;
      col++; // skip '*'
      continue;
    }

    // Check string start
    if (char === '"' || char === "'") {
      inString = true;
      stringChar = char;
      continue;
    }

    // Brackets check
    if (char === '{') {
      openBraces.push({ line: lineNum, col: col + 1 });
    } else if (char === '}') {
      if (openBraces.length === 0) {
        errors.push(`Unexpected closing brace '}' at line ${lineNum}, col ${col + 1}`);
      } else {
        openBraces.pop();
      }
    } else if (char === '(') {
      openParens.push({ line: lineNum, col: col + 1 });
    } else if (char === ')') {
      if (openParens.length === 0) {
        errors.push(`Unexpected closing parenthesis ')' at line ${lineNum}, col ${col + 1}`);
      } else {
        openParens.pop();
      }
    } else if (char === '[') {
      openSquare.push({ line: lineNum, col: col + 1 });
    } else if (char === ']') {
      if (openSquare.length === 0) {
        errors.push(`Unexpected closing square bracket ']' at line ${lineNum}, col ${col + 1}`);
      } else {
        openSquare.pop();
      }
    }
  }
}

if (inComment) {
  errors.push('Unclosed comment at EOF');
}
if (inString) {
  errors.push(`Unclosed string (${stringChar}) at EOF`);
}
if (openBraces.length > 0) {
  errors.push(`Unclosed braces: ${openBraces.length}. First unclosed at line ${openBraces[0].line}:${openBraces[0].col}`);
}
if (openParens.length > 0) {
  errors.push(`Unclosed parens: ${openParens.length}. First unclosed at line ${openParens[0].line}:${openParens[0].col}`);
}
if (openSquare.length > 0) {
  errors.push(`Unclosed square brackets: ${openSquare.length}. First unclosed at line ${openSquare[0].line}:${openSquare[0].col}`);
}

console.log('Syntax errors report:');
if (errors.length === 0) {
  console.log('✅ ZERO syntax/balance errors found in design-system.css!');
} else {
  console.error('❌ Found ' + errors.length + ' error(s):');
  errors.forEach(e => console.error('  - ' + e));
}
