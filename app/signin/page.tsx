'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '/account';

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
  };

  const handleSso = (provider: 'Google' | 'Apple') => {
    const ssoEmail = provider === 'Google' ? 'alex.vance@gmail.com' : 'julian.vance@icloud.com';
    setEmail(ssoEmail);
    setPassword('password123');
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'nex_auth_user',
          JSON.stringify({
            name: provider === 'Google' ? 'Alex Vance' : 'Julian Vance',
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
      setError('Please provide both your registered email and password.');
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
        setError('Invalid credentials. You may use the 1-Click Quick Demo Client pill above.');
      }
    }, 500);
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = email.trim() || 'your registered email';
    setToastMessage(`Password recovery instructions have been dispatched to ${target}.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6 w-full max-w-md mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-surface-navy border border-accent-cyan/40 text-white text-xs shadow-2xl backdrop-blur-xl">
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-accent-cyan">
            Client Authentication
          </span>
          <button
            id="quickDemoBtn"
            type="button"
            onClick={handleQuickDemo}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-pink/15 hover:bg-accent-pink/25 border border-accent-pink/30 text-[11px] font-semibold text-accent-pink transition-colors cursor-pointer"
          >
            <Sparkles size={11} />
            <span>1-Click Demo Client</span>
          </button>
        </div>

        <h1 className="font-editorial text-3xl sm:text-4xl text-white font-normal">
          Welcome to the <span className="italic font-normal">Atelier</span>
        </h1>
        <p className="text-xs text-white/60 leading-relaxed font-light">
          Sign in to access your bespoke wardrobe capsules, active orders, and neural Style Concierge.
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
        <span className="text-[11px] font-semibold tracking-widest uppercase text-white/30">Or with email</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      {/* Main Sign In Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/70 block">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="client@atelier.com"
            className="w-full px-4 py-3 rounded-2xl bg-surface-card border border-white/15 focus:border-accent-cyan/60 text-white placeholder-white/30 text-sm outline-none transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/70">
              Password
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-[11px] text-accent-cyan hover:underline"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 pr-11 rounded-2xl bg-surface-card border border-white/15 focus:border-accent-cyan/60 text-white placeholder-white/30 text-sm outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-white/70 pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded bg-surface-card border-white/20 text-accent-pink focus:ring-0"
            />
            <span>Remember this device for 30 days</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 rounded-2xl bg-accent-crimson hover:bg-accent-crimson/90 disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl shadow-accent-crimson/20 cursor-pointer"
        >
          {isLoading ? (
            <span>Authenticating Credentials...</span>
          ) : (
            <>
              <span>Sign In to Atelier</span>
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </form>

      {/* Switch to Sign Up */}
      <div className="pt-2 text-center text-xs text-white/50 border-t border-white/10">
        <span>First time visiting the Maison? </span>
        <Link href={`/signup${nextUrl ? `?next=${encodeURIComponent(nextUrl)}` : ''}`} className="text-accent-cyan font-semibold hover:underline">
          Create an Atelier Account
        </Link>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <AuthLayout
      quote="Style is knowing who you are, what you want to say, and not giving a damn."
      quoteAuthor="Gore Vidal"
      mode="signin"
    >
      <Suspense fallback={<div className="p-8 text-center text-white/50 text-sm">Loading Client Portal...</div>}>
        <SignInContent />
      </Suspense>
    </AuthLayout>
  );
}
