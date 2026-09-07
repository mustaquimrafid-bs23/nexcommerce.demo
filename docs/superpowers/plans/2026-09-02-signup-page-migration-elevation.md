# Batch 8: Client Sign-Up (`/signup`) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate and elevate the Client Sign-Up (`/signup`) page to Next.js 15 App Router with real-time password strength metering, 1-click demo registration, clean UK English copy (zero AI buzzwords), and unified luxury obsidian styling.

**Architecture:** Split-screen layout powered by `AuthLayout.tsx` with left editorial atmosphere showcase and right registration form/success transition views. Includes real-time password strength evaluation and zero-knowledge local client persistence.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS v4, Lucide Icons, localStorage persistence.

## Global Constraints
- All copy must be simple, natural everyday UK English (zero AI words like "Atelier Cryptographic", "Maison Terms of Engagement", "Biometric Authentication").
- Unified luxury radial gradient background: `radial-gradient(circle at 50% 0%, #031838 0%, #011126 50%, #000B1A 100%)`.
- 100% test coverage with deterministic assertions in `tests/test-signup-page.js`.

---

### Task 1: Automated Test Suite for Sign-Up Page

**Files:**
- Create: `tests/test-signup-page.js`

- [ ] **Step 1: Write the failing test**

```javascript
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test-signup-page.js`
Expected: FAIL on AI buzzwords

- [ ] **Step 3: Write minimal implementation in component & page**

Update `components/auth/PasswordStrengthMeter.tsx` and `app/signup/page.tsx` with clean UK English.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test-signup-page.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/test-signup-page.js
git commit -m "test(signup): add automated assertions for sign-up and password strength meter"
```

---

### Task 2: Elevate Real-Time Password Strength Meter

**Files:**
- Modify: `components/auth/PasswordStrengthMeter.tsx`

- [ ] **Step 1: Update PasswordStrengthMeter with clean UK security levels and 3-segment visual track**

```tsx
'use client';

import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumberOrSymbol = /[\d!@#$%^&*(),.?":{}|<>]/.test(password);

  let score = 0;
  if (hasMinLength) score++;
  if (hasUppercase) score++;
  if (hasNumberOrSymbol) score++;

  const getLabel = () => {
    if (!password) return 'Security: Enter a password';
    if (score === 1) return 'Security: Weak';
    if (score === 2) return 'Security: Good';
    return 'Security: Strong & Secure';
  };

  const getBarColor = (index: number) => {
    if (index >= score) return 'bg-white/10';
    if (score === 1) return 'bg-rose-500';
    if (score === 2) return 'bg-amber-400';
    return 'bg-accent-cyan';
  };

  return (
    <div className="space-y-2.5 pt-1">
      {/* 3-Bar Visual Track */}
      <div className="flex items-center justify-between text-[11px] font-medium text-white/60">
        <span>{getLabel()}</span>
        <span className="font-mono text-white/40">{score}/3</span>
      </div>

      <div className="grid grid-cols-3 gap-1.5 h-1.5 w-full">
        <div className={`rounded-full transition-all duration-300 ${getBarColor(0)}`} />
        <div className={`rounded-full transition-all duration-300 ${getBarColor(1)}`} />
        <div className={`rounded-full transition-all duration-300 ${getBarColor(2)}`} />
      </div>

      {/* Requirement Checkpoints */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 pt-1 text-[11px]">
        <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-accent-cyan' : 'text-white/40'}`}>
          {hasMinLength ? <Check size={12} /> : <X size={12} />}
          <span>8+ Characters</span>
        </div>
        <div className={`flex items-center gap-1.5 ${hasUppercase ? 'text-accent-cyan' : 'text-white/40'}`}>
          {hasUppercase ? <Check size={12} /> : <X size={12} />}
          <span>Uppercase</span>
        </div>
        <div className={`flex items-center gap-1.5 ${hasNumberOrSymbol ? 'text-accent-cyan' : 'text-white/40'}`}>
          {hasNumberOrSymbol ? <Check size={12} /> : <X size={12} />}
          <span>Number / Symbol</span>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/auth/PasswordStrengthMeter.tsx
git commit -m "feat(auth): elevate password strength meter with clean UK labels"
```

---

### Task 3: Elevate Sign-Up Page & Success Transition

**Files:**
- Modify: `app/signup/page.tsx`

- [ ] **Step 1: Update app/signup/page.tsx with 1-click demo registration, social SSO, and smooth registration success view**
- [ ] **Step 2: Run test suite**

Run: `node tests/test-signup-page.js`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add app/signup/page.tsx
git commit -m "feat(auth): elevate client sign-up page with clean UK copy and success view"
```

---

### Task 4: Next.js Production Build & 7-Dimension SQA Verification

- [ ] **Step 1: Execute production build**

Run: `npm run build`
Expected: PASS with 0 errors across all 26 routes.

- [ ] **Step 2: Visual browser testing across Desktop (1440x900) and Mobile (375x812)**

Capture screenshots:
- `signup_page_nextjs_desktop_verified.png`
- `signup_page_nextjs_mobile_verified.png`

- [ ] **Step 3: Commit release & update walkthrough artifact**

```bash
git add docs/ tests/
git commit -m "chore(release): complete Batch 8 client sign-up elevation"
```
