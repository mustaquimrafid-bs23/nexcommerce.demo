const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    if (file === '.git' || file === 'node_modules') return;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else {
      results.push(fullPath);
    }
  });
  return results;
}

const allFiles = walk('.');
const matches = [];

allFiles.forEach(f => {
  try {
    const content = fs.readFileSync(f, 'utf8');
    if (/lookbook/i.test(content)) {
      matches.push(f);
    }
  } catch (e) {}
});

console.log('Total files containing lookbook:', matches.length);
matches.forEach(m => console.log(m));
