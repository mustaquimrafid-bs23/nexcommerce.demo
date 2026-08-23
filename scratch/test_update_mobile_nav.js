const fs = require('fs');
const path = require('path');

const rootFiles = ['index.html', '404.html'];
const subpageFiles = fs.readdirSync('pages')
  .filter(f => f.endsWith('.html') && f !== 'signin.html' && f !== 'signup.html')
  .map(f => 'pages/' + f);

console.log('Root files:', rootFiles);
console.log('Subpage files:', subpageFiles);

// Check current matches
[...rootFiles, ...subpageFiles].forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const hasMoreMenu = content.includes('id="headerMoreMenu"');
  const hasDrawer = content.includes('id="mobileNavDrawer"');
  console.log(file, { hasMoreMenu, hasDrawer });
});
