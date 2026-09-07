'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Sparkles, ArrowRight, AlertCircle, CheckCircle2, ShoppingBag, User } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { PasswordStrengthMeter } from '@/components/auth/PasswordStrengthMeter';

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams?.get('next') || '/account';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleQuickDemo = () => {
    setFullName('Eleanor Vance');
    setEmail('eleanor.vance@nexcommerce.ai');
    setPassword('Atelier2026!');
    setConfirmPassword('Atelier2026!');
    setError(null);
  };

  const handleSso = (provider: 'Google' | 'Apple') => {
    const ssoName = provider === 'Google' ? 'Alex Vance' : 'Julian Vance';
    const ssoEmail = provider === 'Google' ? 'alex.vance@gmail.com' : 'julian.vance@icloud.com';
    setFullName(ssoName);
    setEmail(ssoEmail);
    setPassword('Atelier2026!');
    setConfirmPassword('Atelier2026!');
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'nex_auth_user',
          JSON.stringify({
            name: ssoName,
            email: ssoEmail,
            tier: 'VIP Patron',
            joined: '2026',
          })
        );
      }
      setIsLoading(false);
      setIsSuccess(true);
    }, 450);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please complete all registration fields.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (!agreeTerms) {
      setError('Please accept the Terms & Conditions and Privacy Policy.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'nex_auth_user',
          JSON.stringify({
            name: fullName,
            email: email,
            tier: 'Atelier Client',
            joined: '2026',
          })
        );
      }
      setIsLoading(false);
      setIsSuccess(true);
    }, 500);
  };

  if (isSuccess) {
    return (
      <div className="space-y-6 w-full max-w-md mx-auto text-center py-4">
        <div className="w-16 h-16 rounded-3xl bg-accent-cyan/15 text-accent-cyan flex items-center justify-center mx-auto border border-accent-cyan/30 shadow-2xl">
          <CheckCircle2 size={32} />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-accent-cyan">
            Membership Activated
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-white font-normal">
            Welcome, <span className="italic font-normal">{fullName || 'Client'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-white/70 font-light max-w-sm mx-auto leading-relaxed">
            Your account has been created. You can now access tailored collections, saved pieces, and 24/7 style advisory.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/account"
            className="px-6 py-3.5 rounded-2xl bg-accent-crimson hover:bg-accent-crimson/90 text-white text-xs font-semibold uppercase tracking-widest transition-all shadow-xl shadow-accent-crimson/25 flex items-center justify-center gap-2"
          >
            <User size={14} />
            <span>Go to My Account</span>
          </Link>
          <Link
            href="/category"
            className="px-6 py-3.5 rounded-2xl bg-surface-navy border border-white/15 hover:border-white/30 text-white text-xs font-semibold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag size={14} />
            <span>Explore Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-md mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-accent-cyan flex items-center gap-1.5">
          <Sparkles size={12} />
          <span>Create Your Account &middot; Client Privileges</span>
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl text-white font-normal">
          Create an <span className="italic font-normal">Account</span>
        </h1>
        <p className="text-xs sm:text-sm text-white/60 font-light">
          Join nexCommerce to save your favourite pieces, track orders, and access 24/7 Concierge stylist advice.
        </p>
      </div>

      {/* 1-Click Demo Fill Pill */}
      <div className="p-3.5 rounded-2xl bg-surface-navy border border-accent-pink/30 flex items-center justify-between gap-3 shadow-lg">
        <div className="space-y-0.5">
          <div className="text-xs font-semibold text-white">Prefill Demo Credentials</div>
          <div className="text-[11px] text-white/50 font-mono">Eleanor Vance</div>
        </div>
        <button
          type="button"
          onClick={handleQuickDemo}
          className="px-3.5 py-1.5 rounded-xl bg-accent-pink text-white hover:opacity-90 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md hover:scale-105"
        >
          Prefill Demo
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-accent-crimson/15 border border-accent-crimson/40 text-xs text-white flex items-center gap-2.5">
          <AlertCircle size={15} className="text-accent-pink shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-white/80 block">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Eleanor Vance"
            required
            className="w-full px-4 py-3 rounded-xl bg-obsidian-950/80 border border-white/10 text-white text-xs placeholder:text-white/30 focus:border-accent-cyan focus:outline-none transition-colors"
          />
        </div>

        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-white/80 block">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="client@domain.com"
            required
            className="w-full px-4 py-3 rounded-xl bg-obsidian-950/80 border border-white/10 text-white text-xs placeholder:text-white/30 focus:border-accent-cyan focus:outline-none transition-colors"
          />
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-medium text-white/80">
              Password
            </label>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
              className="w-full px-4 py-3 rounded-xl bg-obsidian-950/80 border border-white/10 text-white text-xs placeholder:text-white/30 focus:border-accent-cyan focus:outline-none transition-colors pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {/* Real-Time Password Strength Meter */}
          <PasswordStrengthMeter password={password} />
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-medium text-white/80 block">
            Confirm Password
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            required
            className="w-full px-4 py-3 rounded-xl bg-obsidian-950/80 border border-white/10 text-white text-xs placeholder:text-white/30 focus:border-accent-cyan focus:outline-none transition-colors"
          />
        </div>

        {/* Terms Agreement */}
        <div className="flex items-start gap-2 pt-1">
          <input
            type="checkbox"
            id="agreeTerms"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="w-4 h-4 rounded bg-obsidian-950 border border-white/20 text-accent-pink focus:ring-0 cursor-pointer mt-0.5"
          />
          <label htmlFor="agreeTerms" className="text-xs text-white/70 cursor-pointer select-none leading-relaxed">
            I agree to the{' '}
            <Link href="/terms" className="text-accent-cyan underline hover:text-white">
              Terms &amp; Conditions
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-accent-cyan underline hover:text-white">
              Privacy Policy
            </Link>
            .
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 rounded-2xl bg-accent-crimson hover:bg-accent-crimson/90 text-white text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer shadow-xl shadow-accent-crimson/25 flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.02]"
        >
          {isLoading ? (
            <span>Creating account...</span>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </form>

      {/* Alternative Social SSO */}
      <div className="space-y-3 pt-2">
        <div className="relative flex items-center justify-center">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-surface-card px-3 text-[11px] text-white/40 uppercase tracking-wider absolute">
            Or register with
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={() => handleSso('Google')}
            className="py-2.5 px-4 rounded-xl bg-obsidian-950/70 border border-white/10 hover:border-white/25 text-white text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Google</span>
          </button>
          <button
            type="button"
            onClick={() => handleSso('Apple')}
            className="py-2.5 px-4 rounded-xl bg-obsidian-950/70 border border-white/10 hover:border-white/25 text-white text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Apple</span>
          </button>
        </div>
      </div>

      {/* Switch to Sign In */}
      <div className="text-center pt-2 text-xs text-white/60">
        Already have an account?{' '}
        <Link href="/signin" className="text-accent-cyan hover:underline font-semibold">
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <AuthLayout
        mode="signup"
        quote="Fashion fades, only style remains the same."
        quoteAuthor="Coco Chanel"
        heroImage="/assets/images/lifestyle/auth_lifestyle.jpg"
      >
        <SignUpContent />
      </AuthLayout>
    </Suspense>
  );
}
