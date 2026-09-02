const assert = require('assert');
const fs = require('fs');

console.log('--- Testing Client Sign-In (/signin) Suite ---');

// 1. Check page file and AuthLayout
assert(fs.existsSync('app/signin/page.tsx'), 'app/signin/page.tsx must exist');
assert(fs.existsSync('components/auth/AuthLayout.tsx'), 'AuthLayout.tsx must exist');

const layoutContent = fs.readFileSync('components/auth/AuthLayout.tsx', 'utf8');
assert(layoutContent.includes('radial-gradient'), 'AuthLayout must have unified luxury radial gradient background');
assert(!layoutContent.includes('Neural Style Concierge'), 'AI buzzword Neural Style Concierge must be replaced in AuthLayout');

const signinContent = fs.readFileSync('app/signin/page.tsx', 'utf8');
assert(signinContent.includes('demo@nexcommerce.ai'), 'Must support 1-Click demo login');
assert(signinContent.includes('Sign In') || signinContent.includes('Welcome Back'), 'Must have clean sign in title');
assert(signinContent.includes('handleQuickDemo'), 'Must have quick demo handler');
assert(!signinContent.includes('Atelier Client Authentication'), 'AI jargon must be replaced');

console.log('✅ PASS: test-signin-page.js');
