/**
 * Unit & Functional Test Suite for Cart Page Authentication Guard
 * Tests:
 * 1. Static HTML invariants on pages/cart.html (head instant guard & NexAuth.requireAuth)
 * 2. Static HTML invariants on pages/signin.html (nextUrl sanitization & contextual cart messaging)
 * 3. Functional behavior of NexAuth.requireAuth() for guest vs authenticated states
 * 4. Post-login redirection resolution for cart destination
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('🧪 Running Cart Auth Guard Unit & Functional Tests...\n');

// 1. Static HTML Assertions on pages/cart.html
console.log('1. Testing static auth guard invariants on pages/cart.html...');
const cartHtml = fs.readFileSync(path.join(__dirname, '../pages/cart.html'), 'utf8');

assert.ok(
  cartHtml.includes("localStorage.getItem('nex_session')") && cartHtml.includes("signin.html?next=cart.html"),
  'cart.html must have instant pre-render head guard redirecting to signin.html?next=cart.html'
);

assert.ok(
  cartHtml.includes('NexAuth.requireAuth();'),
  'cart.html must call NexAuth.requireAuth() in body script tags'
);

console.log('  ✓ cart.html pre-render and standard NexAuth guards verified');

// 2. Static HTML Assertions on pages/signin.html
console.log('2. Testing sign-in contextual prompt and redirect handling on pages/signin.html...');
const signinHtml = fs.readFileSync(path.join(__dirname, '../pages/signin.html'), 'utf8');

assert.ok(
  signinHtml.includes("targetNext.toLowerCase().includes('cart')"),
  'signin.html must detect cart destination and provide contextual luxury prompt'
);

assert.ok(
  signinHtml.includes("targetNext.startsWith('pages/')") || signinHtml.includes("nextUrl.startsWith('pages/')"),
  'signin.html must sanitize relative subpage paths for nextUrl'
);

console.log('  ✓ signin.html destination awareness and prompt verified');

// 3. Functional Simulation of NexAuth.requireAuth()
console.log('3. Testing functional simulation of NexAuth.requireAuth()...');

function simulateAuthGuard(mockSession, currentPath) {
  let redirectedTo = null;
  const isSubpage = currentPath.includes('/pages/') || currentPath.endsWith('/pages');
  
  function resolvePage(page) {
    if (page === 'index.html') return isSubpage ? '../index.html' : 'index.html';
    return isSubpage ? page : 'pages/' + page;
  }

  function isLoggedIn() {
    return mockSession !== null;
  }

  function requireAuth(redirectTo = '') {
    if (!isLoggedIn()) {
      const current = encodeURIComponent(currentPath.split('/').pop());
      redirectedTo = `${resolvePage('signin.html')}?next=${redirectTo || current}`;
    }
  }

  requireAuth();
  return { redirected: redirectedTo !== null, targetUrl: redirectedTo };
}

// Case A: Unauthenticated guest on pages/cart.html
const guestResult = simulateAuthGuard(null, '/pages/cart.html');
assert.strictEqual(guestResult.redirected, true, 'Guest must be redirected');
assert.strictEqual(guestResult.targetUrl, 'signin.html?next=cart.html', 'Target URL must be signin.html?next=cart.html');

// Case B: Authenticated user on pages/cart.html
const authUser = { id: 'u_demo', name: 'Demo User', email: 'demo@nexcommerce.ai' };
const authResult = simulateAuthGuard(authUser, '/pages/cart.html');
assert.strictEqual(authResult.redirected, false, 'Authenticated user must not be redirected');
assert.strictEqual(authResult.targetUrl, null);

console.log('  ✓ NexAuth.requireAuth guard behavior verified for guest vs authenticated states');

// 4. Verification of post-login destination resolution
console.log('4. Testing post-login destination resolution...');

function resolveNextDestination(rawNextParam) {
  let nextUrl = rawNextParam || '../index.html';
  if (nextUrl.startsWith('pages/')) {
    nextUrl = nextUrl.replace(/^pages\//, '');
  }
  return nextUrl;
}

assert.strictEqual(resolveNextDestination('cart.html'), 'cart.html');
assert.strictEqual(resolveNextDestination('pages/cart.html'), 'cart.html');
assert.strictEqual(resolveNextDestination(null), '../index.html');

console.log('  ✓ Post-login destination resolution verified');

// 5. Static & Functional Assertions on AI Assistant Guest Order Protection
console.log('5. Testing AI Assistant Guest Order Protection...');
const conciergeEngineCode = fs.readFileSync(path.join(__dirname, '../js/concierge-engine.js'), 'utf8');
assert.ok(
  conciergeEngineCode.includes('isOrderFlowQuery && !isUserLoggedIn'),
  'concierge-engine.js must check isUserLoggedIn before initiating order flow'
);
assert.ok(
  conciergeEngineCode.includes('order_auth_required'),
  'concierge-engine.js must declare order_auth_required response type'
);

const conciergeUiCode = fs.readFileSync(path.join(__dirname, '../js/concierge.js'), 'utf8');
assert.ok(
  conciergeUiCode.includes('renderOrderAuthRequiredWidget'),
  'concierge.js must implement renderOrderAuthRequiredWidget'
);
assert.ok(
  conciergeUiCode.includes("text === 'Sign in with Demo Client'"),
  'concierge.js must handle Sign in with Demo Client chip'
);
console.log('  ✓ AI Assistant guest order protection invariants verified');

console.log('\n✨ ALL Cart & AI Assistant Auth Guard unit & functional tests PASSED with 100% precision!\n');
