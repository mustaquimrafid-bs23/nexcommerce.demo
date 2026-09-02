'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Sparkles, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams?.get('next') || '/account';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleQuickDemo = () => {
    setEmail('demo@nexcommerce.ai');
    setPassword('password123');
    setError(null);

    // Auto-authenticate for seamless 1-click evaluation
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'nex_auth_user',
        JSON.stringify({
          name: 'Tanvir Hossain',
          email: 'demo@nexcommerce.ai',
          tier: 'VIP Patron',
          joined: '2024',
        })
      );
    }
    setToastMessage('Signed in as Demo Client (Tanvir Hossain). Redirecting...');
    setTimeout(() => {
      router.push(nextUrl);
    }, 450);
  };

  const handleSso = (provider: 'Google' | 'Apple') => {
    const ssoEmail = provider === 'Google' ? 'alex.vance@gmail.com' : 'julian.vance@icloud.com';
    const ssoName = provider === 'Google' ? 'Alex Vance' : 'Julian Vance';
    setEmail(ssoEmail);
    setPassword('password123');
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
            joined: '2024',
          })
        );
      }
      setIsLoading(false);
      router.push(nextUrl);
    }, 450);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please provide both your registered email address and password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (email.includes('@') && password.length >= 6) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            'nex_auth_user',
            JSON.stringify({
              name: email.split('@')[0].replace('.', ' '),
              email: email,
              tier: 'Atelier Client',
              joined: '2026',
            })
          );
        }
        setIsLoading(false);
        router.push(nextUrl);
      } else {
        setIsLoading(false);
        setError('Invalid credentials. You may use the 1-Click Demo Login button above.');
      }
    }, 500);
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = email.trim() || 'your registered email';
    setToastMessage(`Password recovery instructions have been sent to ${target}.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6 w-full max-w-md mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-surface-navy border border-accent-cyan/40 text-white text-xs shadow-2xl backdrop-blur-xl flex items-center gap-2">
          <CheckCircle2 size={14} className="text-accent-cyan" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="space-y-2">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-accent-pink flex items-center gap-1.5">
          <Sparkles size={12} />
          <span>Sign In to Your Account</span>
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl text-white font-normal">
          Welcome <span className="italic font-normal">Back</span>
        </h1>
        <p className="text-xs sm:text-sm text-white/60 font-light">
          Sign in to access your saved pieces, order history, and personal style profile.
        </p>
      </div>

      {/* 1-Click Demo Login Pill */}
      <div className="p-3.5 rounded-2xl bg-surface-navy border border-accent-cyan/30 flex items-center justify-between gap-3 shadow-lg">
        <div className="space-y-0.5">
          <div className="text-xs font-semibold text-white">Instant Demo Access</div>
          <div className="text-[11px] text-white/50 font-mono">demo@nexcommerce.ai</div>
        </div>
        <button
          type="button"
          onClick={handleQuickDemo}
          className="px-3.5 py-1.5 rounded-xl bg-accent-cyan text-obsidian-950 hover:bg-accent-cyan/90 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md hover:scale-105"
        >
          1-Click Demo
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
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-accent-cyan hover:underline text-[11px]"
            >
              Forgotten password?
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
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
        </div>

        {/* Remember Me */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded bg-obsidian-950 border border-white/20 text-accent-pink focus:ring-0 cursor-pointer"
          />
          <label htmlFor="rememberMe" className="text-xs text-white/70 cursor-pointer select-none">
            Remember me on this device
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 rounded-2xl bg-accent-crimson hover:bg-accent-crimson/90 text-white text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer shadow-xl shadow-accent-crimson/25 flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.02]"
        >
          {isLoading ? (
            <span>Signing in...</span>
          ) : (
            <>
              <span>Sign In to Account</span>
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
            Or continue with
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

      {/* Switch to Sign Up */}
      <div className="text-center pt-2 text-xs text-white/60">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-accent-pink hover:underline font-semibold">
          Create an account
        </Link>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <AuthLayout
        mode="signin"
        quote="Simplicity is the keynote of all true elegance."
        quoteAuthor="Coco Chanel"
        heroImage="/assets/images/lifestyle/auth_lifestyle.jpg"
      >
        <SignInContent />
      </AuthLayout>
    </Suspense>
  );
}
