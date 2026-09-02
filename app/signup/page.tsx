'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Sparkles, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { PasswordStrengthMeter } from '@/components/auth/PasswordStrengthMeter';

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '/account';

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
    setFullName('Julian Vance');
    setEmail('julian.vance@atelier-client.de');
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
      setError('Please accept the Maison Terms of Engagement.');
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
      <div className="space-y-6 text-center py-8 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-accent-cyan/15 border border-accent-cyan/30 text-accent-cyan mx-auto flex items-center justify-center">
          <CheckCircle2 size={32} />
        </div>

        <div className="space-y-2">
          <h2 className="font-editorial text-3xl sm:text-4xl text-white font-normal">
            Welcome to the <span className="italic font-normal">Maison</span>
          </h2>
          <p className="text-xs text-white/60 leading-relaxed font-light">
            Your client profile has been cryptographically provisioned. You now have full access to private pre-orders, bespoke styling, and continental delivery.
          </p>
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => router.push(nextUrl)}
            className="w-full py-3.5 rounded-2xl bg-accent-crimson hover:bg-accent-crimson/90 text-white text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer shadow-xl shadow-accent-crimson/20"
          >
            Enter Client Suite
          </button>
          <Link
            href="/profile"
            className="w-full py-3 rounded-2xl bg-surface-card border border-white/10 hover:border-white/20 text-white text-xs font-medium transition-all text-center"
          >
            Calibrate Your Style DNA (Optional)
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-md mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-accent-pink">
            Client Registration
          </span>
          <button
            id="quickDemoBtn"
            type="button"
            onClick={handleQuickDemo}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-cyan/15 hover:bg-accent-cyan/25 border border-accent-cyan/30 text-[11px] font-semibold text-accent-cyan transition-colors cursor-pointer"
          >
            <Sparkles size={11} />
            <span>1-Click Demo Client</span>
          </button>
        </div>

        <h1 className="font-editorial text-3xl sm:text-4xl text-white font-normal">
          Create an <span className="italic font-normal">Account</span>
        </h1>
        <p className="text-xs text-white/60 leading-relaxed font-light">
          Join our private clientele to receive tailor consultations and priority atelier delivery.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle size={15} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* SSO Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleSso('Google')}
          className="p-3 rounded-2xl bg-surface-card border border-white/10 hover:border-white/25 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer hover:bg-white/[0.04]"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 17C3.7 20.7 7.5 24 12 24z"
            />
          </svg>
          <span>Google</span>
        </button>

        <button
          type="button"
          onClick={() => handleSso('Apple')}
          className="p-3 rounded-2xl bg-surface-card border border-white/10 hover:border-white/25 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer hover:bg-white/[0.04]"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.76 1.05-1.81.93-2.87-.91.04-2.02.61-2.67 1.37-.58.67-1.08 1.75-.95 2.78 1.02.08 2.06-.52 2.69-1.28z" />
          </svg>
          <span>Apple</span>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-[11px] font-semibold tracking-widest uppercase text-white/30">Or register with email</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/70 block">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Julian Vance"
            className="w-full px-4 py-3 rounded-2xl bg-surface-card border border-white/15 focus:border-accent-pink/60 text-white placeholder-white/30 text-sm outline-none transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/70 block">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="client@atelier.com"
            className="w-full px-4 py-3 rounded-2xl bg-surface-card border border-white/15 focus:border-accent-pink/60 text-white placeholder-white/30 text-sm outline-none transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/70 block">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 pr-11 rounded-2xl bg-surface-card border border-white/15 focus:border-accent-pink/60 text-white placeholder-white/30 text-sm outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {/* Live Strength Meter */}
          <PasswordStrengthMeter password={password} />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/70 block">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full px-4 py-3 rounded-2xl bg-surface-card border border-white/15 focus:border-accent-pink/60 text-white placeholder-white/30 text-sm outline-none transition-all"
          />
        </div>

        <div className="p-3 rounded-2xl bg-surface-navy/40 border border-white/5 space-y-1 text-[11px] text-white/60">
          <div className="font-semibold text-accent-cyan uppercase tracking-wider text-[10px]">
            Atelier Client Privileges
          </div>
          <p>
            Instant Private Pre-Access &middot; Dedicated Neural Style Concierge &middot; Priority European Courier
          </p>
        </div>

        <div className="pt-1">
          <label className="flex items-start gap-2.5 text-xs text-white/70 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 rounded bg-surface-card border-white/20 text-accent-pink focus:ring-0"
            />
            <span className="leading-snug">
              I accept the <Link href="/terms" className="text-accent-cyan hover:underline">Maison Terms of Engagement</Link> and acknowledge the European right of statutory withdrawal.
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 rounded-2xl bg-accent-crimson hover:bg-accent-crimson/90 disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl shadow-accent-crimson/20 cursor-pointer"
        >
          {isLoading ? (
            <span>Creating Atelier Identity...</span>
          ) : (
            <>
              <span>Complete Registration</span>
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </form>

      {/* Switch to Sign In */}
      <div className="pt-2 text-center text-xs text-white/50 border-t border-white/10">
        <span>Already hold an Atelier account? </span>
        <Link href={`/signin${nextUrl ? `?next=${encodeURIComponent(nextUrl)}` : ''}`} className="text-accent-cyan font-semibold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <AuthLayout
      quote="Simplicity is the keynote of all true elegance."
      quoteAuthor="Coco Chanel"
      mode="signup"
    >
      <Suspense fallback={<div className="p-8 text-center text-white/50 text-sm">Loading Client Portal...</div>}>
        <SignUpContent />
      </Suspense>
    </AuthLayout>
  );
}
