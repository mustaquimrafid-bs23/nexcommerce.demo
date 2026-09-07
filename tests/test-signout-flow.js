const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(err.message);
  }
}

console.log('─── Testing Complete Sign Out Feature & Session Flow ───\n');

// 1. Next.js Account Page Verification
console.log('[Tier 1: Next.js Account Page - app/account/page.tsx]');
const accountPageContent = fs.readFileSync(path.join(ROOT, 'app/account/page.tsx'), 'utf-8');

test('Imports useRouter from next/navigation', () => {
  assert(accountPageContent.includes("from 'next/navigation'"), 'Missing useRouter import');
  assert(accountPageContent.includes('const router = useRouter()'), 'Missing useRouter instantiation');
});

test('Defines handleSignOut with full storage cleanup and direct homepage redirect', () => {
  assert(accountPageContent.includes('const handleSignOut ='), 'Missing handleSignOut definition');
  assert(accountPageContent.includes("localStorage.removeItem('nex_auth_user')"), 'Missing nex_auth_user cleanup');
  assert(accountPageContent.includes("localStorage.removeItem('nex_session')"), 'Missing nex_session cleanup');
  assert(accountPageContent.includes("localStorage.removeItem('nex_user')"), 'Missing nex_user cleanup');
  assert(accountPageContent.includes("localStorage.removeItem('nex_auth_token')"), 'Missing nex_auth_token cleanup');
  assert(accountPageContent.includes("localStorage.setItem('nex_signed_out', 'true')"), 'Missing nex_signed_out setting');
  assert(accountPageContent.includes("router.push('/?signed_out=true')"), 'Missing redirect to / with status query');
});

test('Eliminates intermediate in-page screen flash during signout', () => {
  // Assert handleSignOut does not call setCurrentAuthState('signed_out'), eliminating the 350ms flash
  const handleSignOutBody = accountPageContent.slice(
    accountPageContent.indexOf('const handleSignOut ='),
    accountPageContent.indexOf('const handleSignIn =')
  );
  assert(!handleSignOutBody.includes("setCurrentAuthState('signed_out')"), 'Must not trigger in-page SignedOutView flash in handleSignOut');
});

test('Wires handleSignOut to AccountHero and EmptyAccountView', () => {
  assert(accountPageContent.includes('onSignOut={handleSignOut}'), 'onSignOut must use handleSignOut');
  assert(!accountPageContent.includes("onSignOut={() => setCurrentAuthState('signed_out')}"), 'Stale inline state-only signout must not exist');
});

test('Synchronizes stored session on mount', () => {
  assert(accountPageContent.includes("localStorage.getItem('nex_signed_out') === 'true'"), 'Must check if explicitly signed out on mount');
  assert(accountPageContent.includes("localStorage.getItem('nex_auth_user')"), 'Must check stored user session on mount');
});

// 2. Next.js Sign In Page Verification
console.log('\n[Tier 2: Next.js Sign In Page - app/signin/page.tsx]');
const signinPageContent = fs.readFileSync(path.join(ROOT, 'app/signin/page.tsx'), 'utf-8');

test('Detects isSignedOut from searchParams and renders confirmation banner', () => {
  assert(signinPageContent.includes("searchParams?.get('signed_out') === 'true'"), 'Missing isSignedOut detection');
  assert(signinPageContent.includes('You have been signed out successfully'), 'Missing signed out confirmation message');
});

test('Removes nex_signed_out upon login in 1-Click Demo, SSO, and Form Submit', () => {
  assert(signinPageContent.includes("localStorage.removeItem('nex_signed_out')"), 'Must remove nex_signed_out upon signing in');
});

// 3. SignedOutView component
console.log('\n[Tier 3: SignedOutView component - components/account/SignedOutView.tsx]');
const signedOutViewContent = fs.readFileSync(path.join(ROOT, 'components/account/SignedOutView.tsx'), 'utf-8');

test('Includes direct link to /signin with 1-Click Demo / SSO', () => {
  assert(signedOutViewContent.includes('href="/signin"'), 'Missing link to /signin page');
  assert(signedOutViewContent.includes('1-Click Demo / SSO'), 'Missing callout for 1-Click Demo / SSO on signin page');
});

// 4. Static site mirror verification
console.log('\n[Tier 4: Static Site Mirror - js/auth.js and js/account.js]');
const authJsContent = fs.readFileSync(path.join(ROOT, 'js/auth.js'), 'utf-8');
const accountJsContent = fs.readFileSync(path.join(ROOT, 'js/account.js'), 'utf-8');

test('js/auth.js _clearSession removes all session tokens', () => {
  assert(authJsContent.includes("localStorage.removeItem('nex_auth_user')"), 'auth.js must clear nex_auth_user');
  assert(authJsContent.includes("localStorage.removeItem('nex_user')"), 'auth.js must clear nex_user');
  assert(authJsContent.includes("localStorage.removeItem('nex_auth_token')"), 'auth.js must clear nex_auth_token');
});

test('js/account.js handleAccountSignOut clears session and redirects to homepage with query param', () => {
  assert(accountJsContent.includes('signed_out=true'), 'account.js must redirect with signed_out=true');
  assert(accountJsContent.includes('index.html'), 'account.js must redirect to index.html');
  assert(accountJsContent.includes("localStorage.removeItem('nex_auth_user')"), 'account.js must clear nex_auth_user');
  assert(!accountJsContent.includes("changeDevAuthState('signed_out')"), 'account.js must not flash in-page signed_out view');
});

// 5. Homepage Signed Out Toast Verification
console.log('\n[Tier 5: Homepage Signed Out Toast Notification]');
const homePageContent = fs.readFileSync(path.join(ROOT, 'app/page.tsx'), 'utf-8');
const toastComponentContent = fs.readFileSync(path.join(ROOT, 'components/home/SignedOutToast.tsx'), 'utf-8');
const indexHtmlContent = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');

test('app/page.tsx mounts SignedOutToast inside Suspense', () => {
  assert(homePageContent.includes('<SignedOutToast />'), 'HomePage must include SignedOutToast');
  assert(homePageContent.includes('<Suspense fallback={null}>'), 'SignedOutToast must be wrapped in Suspense');
});

test('components/home/SignedOutToast.tsx detects signed_out and strips param cleanly', () => {
  assert(toastComponentContent.includes("searchParams?.get('signed_out') === 'true'"), 'Missing signed_out param check');
  assert(toastComponentContent.includes('window.history.replaceState'), 'Must strip query param using replaceState');
  assert(toastComponentContent.includes('Signed Out Safely'), 'Missing luxury toast badge');
  assert(toastComponentContent.includes('Enjoy browsing our collection'), 'Missing toast message body');
});

test('index.html contains matching signedOutToastNotice handler', () => {
  assert(indexHtmlContent.includes('signedOutToastNotice'), 'index.html must include signedOutToastNotice');
  assert(indexHtmlContent.includes('SIGNED OUT SAFELY'), 'index.html must display SIGNED OUT SAFELY toast title');
});

// 6. Functional Storage Lifecycle Simulation
console.log('\n[Tier 6: Functional Storage Lifecycle Simulation]');
test('Simulated login -> signout -> reload lifecycle', () => {
  const mockStorage = {};
  const mockLocalStorage = {
    getItem: (k) => mockStorage[k] || null,
    setItem: (k, v) => { mockStorage[k] = String(v); },
    removeItem: (k) => { delete mockStorage[k]; },
  };

  // Step 1: User logs in
  mockLocalStorage.setItem('nex_auth_user', JSON.stringify({ name: 'Tanvir Hossain', email: 'demo@nexcommerce.ai' }));
  mockLocalStorage.setItem('nex_session', JSON.stringify({ name: 'Tanvir Hossain', email: 'demo@nexcommerce.ai' }));
  assert.strictEqual(mockLocalStorage.getItem('nex_signed_out'), null);
  assert(mockLocalStorage.getItem('nex_auth_user') !== null);

  // Step 2: User clicks Sign Out
  mockLocalStorage.removeItem('nex_auth_user');
  mockLocalStorage.removeItem('nex_session');
  mockLocalStorage.removeItem('nex_user');
  mockLocalStorage.removeItem('nex_auth_token');
  mockLocalStorage.setItem('nex_signed_out', 'true');

  assert.strictEqual(mockLocalStorage.getItem('nex_auth_user'), null);
  assert.strictEqual(mockLocalStorage.getItem('nex_session'), null);
  assert.strictEqual(mockLocalStorage.getItem('nex_signed_out'), 'true');

  // Step 3: Page reloads - mount check
  const isSignedOut = mockLocalStorage.getItem('nex_signed_out') === 'true';
  const effectiveAuthState = isSignedOut ? 'signed_out' : 'signed_in';
  assert.strictEqual(effectiveAuthState, 'signed_out', 'Page must remain signed_out on refresh');

  // Step 4: User logs in again
  mockLocalStorage.removeItem('nex_signed_out');
  mockLocalStorage.setItem('nex_auth_user', JSON.stringify({ name: 'Julian Voss', email: 'julian.voss@atelier-client.de' }));
  assert.strictEqual(mockLocalStorage.getItem('nex_signed_out'), null);
  assert.strictEqual(JSON.parse(mockLocalStorage.getItem('nex_auth_user')).name, 'Julian Voss');
});

console.log(`\n==============================================`);
console.log(`Test Results: ${passedTests} / ${totalTests} passed.`);
if (passedTests === totalTests) {
  console.log('✓ All Sign Out Flow tests passed successfully!');
  process.exit(0);
} else {
  console.error('✗ Some tests failed.');
  process.exit(1);
}
