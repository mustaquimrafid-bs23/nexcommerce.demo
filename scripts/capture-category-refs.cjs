const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function capture() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const outDir = path.join(__dirname, '..', 'docs', 'superpowers', 'plans');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // 1. Capture HTML Reference (feature/storefront-elevation)
  console.log('Capturing HTML reference...');
  const pageRef = await context.newPage();
  try {
    await pageRef.goto('http://localhost:8080/pages/category.html', { waitUntil: 'networkidle', timeout: 10000 });
    await pageRef.waitForTimeout(1000);
    await pageRef.screenshot({
      path: path.join(outDir, 'category_storefront_elevation_fullpage.png'),
      fullPage: true
    });
    console.log('Saved category_storefront_elevation_fullpage.png');
  } catch (err) {
    console.error('Error capturing HTML ref:', err.message);
  }

  // 2. Capture Next.js current page
  console.log('Capturing Next.js Category page...');
  const pageNext = await context.newPage();
  try {
    await pageNext.goto('http://localhost:3000/category', { waitUntil: 'networkidle', timeout: 10000 });
    await pageNext.waitForTimeout(1000);
    await pageNext.screenshot({
      path: path.join(outDir, 'nextjs_category_desktop_fullpage.png'),
      fullPage: true
    });
    console.log('Saved nextjs_category_desktop_fullpage.png');

    // Trigger Quick Look in Next.js
    const quickLookButtons = await pageNext.$$('button[title*="Quick Look"], button[aria-label*="Quick look"]');
    if (quickLookButtons.length > 0) {
      await quickLookButtons[0].click();
      await pageNext.waitForTimeout(500);
      await pageNext.screenshot({
        path: path.join(outDir, 'nextjs_category_quicklook_drawer.png'),
        fullPage: false
      });
      console.log('Saved nextjs_category_quicklook_drawer.png');
    }
  } catch (err) {
    console.error('Error capturing Next.js page:', err.message);
  }

  await browser.close();
  console.log('Capture complete.');
}

capture().catch(console.error);
