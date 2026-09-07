const assert = require('assert');
const fs = require('fs');

console.log('--- Testing Client Sign-Up (/signup) Suite ---');

// 1. Check page file and PasswordStrengthMeter
assert(fs.existsSync('app/signup/page.tsx'), 'app/signup/page.tsx must exist');
assert(fs.existsSync('components/auth/PasswordStrengthMeter.tsx'), 'PasswordStrengthMeter.tsx must exist');

const meterContent = fs.readFileSync('components/auth/PasswordStrengthMeter.tsx', 'utf8');
assert(!meterContent.includes('Atelier Cryptographic'), 'AI jargon Atelier Cryptographic must be replaced');
assert(meterContent.includes('Security: Strong') || meterContent.includes('Strong'), 'Must have clean UK security level');

const signupContent = fs.readFileSync('app/signup/page.tsx', 'utf8');
assert(signupContent.includes('Create an Account') || signupContent.includes('Create Account'), 'Must have clean sign up title');
assert(!signupContent.includes('Atelier Client Registration'), 'AI jargon must be replaced');
assert(!signupContent.includes('Maison Terms of Engagement'), 'Terms must refer to Terms & Conditions');
assert(signupContent.includes('handleQuickDemo'), 'Must have quick demo handler');
assert(signupContent.includes('isSuccess'), 'Must have success view state');

console.log('✅ PASS: test-signup-page.js');
