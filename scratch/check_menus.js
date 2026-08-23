const fs = require('fs');
const path = require('path');

const files = ['index.html', '404.html', ...fs.readdirSync('pages').filter(f => f.endsWith('.html')).map(f => 'pages/' + f)];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const hasMoreMenu = content.includes('headerMoreMenu');
  const hasMoreMenuDesktopOnly = /class="[^"]*nav-more-menu[^"]*desktop-only/i.test(content);
  const hasDrawer = content.includes('mobileNavDrawer');
  console.log(f, { hasMoreMenu, hasMoreMenuDesktopOnly, hasDrawer });
});
