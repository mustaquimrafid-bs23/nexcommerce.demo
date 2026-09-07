const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function assert(desc, condition) {
  if (condition) {
    console.log(`  ✓ ${desc}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${desc}`);
    failed++;
  }
}

console.log('🧪 Testing Authentication Suite Migration (SignIn & SignUp)...');

const signinPath = path.resolve(process.cwd(), 'app/signin/page.tsx');
assert('app/signin/page.tsx exists', fs.existsSync(signinPath));

const signupPath = path.resolve(process.cwd(), 'app/signup/page.tsx');
assert('app/signup/page.tsx exists', fs.existsSync(signupPath));

const authLayoutPath = path.resolve(process.cwd(), 'components/auth/AuthLayout.tsx');
assert('components/auth/AuthLayout.tsx exists', fs.existsSync(authLayoutPath));

const meterPath = path.resolve(process.cwd(), 'components/auth/PasswordStrengthMeter.tsx');
assert('components/auth/PasswordStrengthMeter.tsx exists', fs.existsSync(meterPath));

if (fs.existsSync(signinPath)) {
  const signinContent = fs.readFileSync(signinPath, 'utf8');
  assert('SignIn has quickDemoBtn / demo credentials filler', signinContent.includes('quickDemo') || signinContent.includes('demo@nexcommerce.ai'));
  assert('SignIn has Google SSO button', signinContent.includes('Google'));
  assert('SignIn has Apple SSO button', signinContent.includes('Apple'));
}

if (fs.existsSync(signupPath)) {
  const signupContent = fs.readFileSync(signupPath, 'utf8');
  assert('SignUp has PasswordStrengthMeter', signupContent.includes('PasswordStrengthMeter'));
  assert('SignUp has client privileges display', signupContent.includes('Concierge') || signupContent.includes('Privilege'));
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
