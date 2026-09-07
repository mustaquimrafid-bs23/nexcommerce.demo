'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Sparkles, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams?.get('next') || '/account';
  const isSignedOut = searchParams?.get('signed_out') === 'true';
  const isCartRedirect = nextUrl.toLowerCase().includes('cart');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [inputPulse, setInputPulse] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (isSignedOut) {
      try {
        localStorage.removeItem('nex_auth_user');
        localStorage.removeItem('nex_session');
        localStorage.removeItem('nex_user');
        localStorage.removeItem('nex_auth_token');
        localStorage.setItem('nex_signed_out', 'true');
      } catch (e) {
        console.error(e);
      }
    }
  }, [isSignedOut]);

  const handleQuickDemo = () => {
    setEmail('demo@nexcommerce.ai');
    setPassword('password123');
    setError(null);
    setInputPulse(true);
    setTimeout(() => setInputPulse(false), 700);
  };

  const handleSso = (provider: 'Google' | 'Apple') => {
    const ssoEmail = provider === 'Google' ? 'alex.vanguard@gmail.com' : 'alex.vanguard@icloud.com';
    const ssoName = 'Alex Vanguard';
    setEmail(ssoEmail);
    setPassword('password123');
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('nex_signed_out');
        localStorage.setItem(
          'nex_auth_user',
          JSON.stringify({
            name: ssoName,
            email: ssoEmail,
            tier: 'VIP Patron',
            joined: '2024',
          })
        );
        localStorage.setItem(
          'nex_session',
          JSON.stringify({
            name: ssoName,
            email: ssoEmail,
          })
        );
        window.dispatchEvent(new Event('storage'));
      }
      setIsLoading(false);
      router.push(nextUrl);
    }, 450);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setError('Please provide both email and password.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (cleanEmail === 'demo@nexcommerce.ai' || (cleanEmail.includes('@') && password.length >= 6)) {
        if (typeof window !== 'undefined') {
          const isDemo = cleanEmail === 'demo@nexcommerce.ai';
          const clientName = isDemo
            ? 'Tanvir Hossain'
            : cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
          const userTier = isDemo ? 'VIP Patron' : 'Atelier Client';
          const joinYear = isDemo ? '2024' : '2026';

          localStorage.removeItem('nex_signed_out');
          localStorage.setItem(
            'nex_auth_user',
            JSON.stringify({
              name: clientName,
              email: cleanEmail,
              tier: userTier,
              joined: joinYear,
            })
          );
          localStorage.setItem(
            'nex_session',
            JSON.stringify({
              name: clientName,
              email: cleanEmail,
            })
          );
          window.dispatchEvent(new Event('storage'));
        }
        setIsLoading(false);
        router.push(nextUrl);
      } else {
        setIsLoading(false);
        setError('Invalid credentials. Use Quick Demo Client or a password with at least 6 characters.');
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
      }
    }, 480);
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = email.trim() || 'your registered email';
    setToastMessage(`Password recovery instructions have been dispatched to ${target}. Please check your inbox.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className={`w-full ${isShaking ? 'animate-[authShake_0.42s_ease-in-out]' : ''}`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="authToast"
          role="status"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-md text-xs text-[#F5F7FA] shadow-2xl backdrop-blur-xl flex items-center gap-2 border border-[#3DE0FF]/35"
          style={{ background: '#0B2147' }}
        >
          <CheckCircle2 size={15} className="text-[#3DE0FF] shrink-0" />
          <span id="authToastMsg">{toastMessage}</span>
        </div>
      )}

      {/* Signed Out Banner */}
      {isSignedOut && (
        <div className="p-3.5 mb-5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-white flex items-center gap-2.5 shadow-md">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>You have been signed out successfully. Sign in again below to access your account.</span>
        </div>
      )}

      {/* Editorial Greetings */}
      <h1 className="text-3xl sm:text-[34px] font-semibold text-white tracking-tight leading-snug mb-1.5 font-sans">
        Welcome back.
      </h1>
      <p className="auth-subheading text-[13px] text-[#94A3B8] leading-relaxed mb-6">
        {isCartRedirect
          ? 'Sign in to access your shopping bag and proceed to checkout.'
          : 'Sign in to access your saved orders, Smart Style Profile, and private benefits.'}
      </p>

      {/* 1-Click Demo Client Pill */}
      <div
        id="quickDemoBtn"
        role="button"
        tabIndex={0}
        onClick={handleQuickDemo}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleQuickDemo()}
        aria-label="Quick sign in with demo client credentials"
        className="auth-demo-pill flex items-center justify-between gap-3 p-2.5 sm:py-2.5 sm:px-3.5 mb-5 rounded-[10px] cursor-pointer transition-all duration-200 border border-[#3DE0FF]/25 hover:border-[#3DE0FF]/40 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-6px_rgba(61,224,255,0.15)] select-none"
        style={{
          background: 'linear-gradient(135deg, rgba(61, 224, 255, 0.08) 0%, rgba(251, 113, 133, 0.04) 100%)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-[#3DE0FF] flex items-center justify-center">
            <Sparkles size={16} />
          </span>
          <div className="flex flex-col gap-0.5 text-left">
            <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#3DE0FF]">
              ✦ Quick Demo Client
            </span>
            <span className="text-[11px] text-[#94A3B8]">
              Populate demo credentials in 1-click
            </span>
          </div>
        </div>
        <span className="text-[9.5px] font-bold tracking-[0.08em] uppercase text-white bg-white/10 border border-white/15 rounded-full px-2 py-0.5 whitespace-nowrap">
          Demo Access
        </span>
      </div>

      {/* Social SSO Quick Actions */}
      <div className="auth-social-row grid grid-cols-2 gap-2.5 mb-4.5">
        <button
          type="button"
          id="googleSsoBtn"
          onClick={() => handleSso('Google')}
          aria-label="Sign in with Google"
          className="auth-social-btn inline-flex items-center justify-center gap-2.5 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.18] hover:-translate-y-0.5 rounded-lg py-2.5 px-3.5 text-[11.5px] font-semibold text-white cursor-pointer transition-all duration-180"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="shrink-0">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          <span>Google</span>
        </button>
        <button
          type="button"
          id="appleSsoBtn"
          onClick={() => handleSso('Apple')}
          aria-label="Sign in with Apple"
          className="auth-social-btn inline-flex items-center justify-center gap-2.5 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.18] hover:-translate-y-0.5 rounded-lg py-2.5 px-3.5 text-[11.5px] font-semibold text-white cursor-pointer transition-all duration-180"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 text-white">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.89c.66-.81 1.11-1.93.99-3.06-1 .04-2.17.67-2.85 1.47-.6.7-.13 1.84 0 2.97 1.12.09 2.2-.57 1.86-1.38z"/>
          </svg>
          <span>Apple</span>
        </button>
      </div>

      {/* Subtle Divider */}
      <div className="auth-divider flex items-center gap-3.5 mb-4.5">
        <div className="flex-1 h-px bg-white/[0.06]" />
        <span className="text-[9.5px] text-[#64748B] tracking-[0.12em] uppercase font-semibold">
          or sign in with credentials
        </span>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>

      {/* Authentication Form */}
      <form id="signInForm" onSubmit={handleSubmit} noValidate className="auth-form flex flex-col gap-4">
        {/* Email Field */}
        <div className="form-group flex flex-col gap-1.5">
          <label htmlFor="email" className="form-label text-[10px] font-semibold tracking-[0.1em] uppercase text-[#94A3B8]">
            Email Address
          </label>
          <div className="form-input-wrap relative w-full">
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@atelier.nexcommerce.ai"
              autoComplete="email"
              required
              className={`form-input w-full px-3.5 py-3 rounded-lg bg-white/[0.03] border text-[13.5px] text-white placeholder:text-white/20 outline-none transition-all duration-200 ${
                error && !email
                  ? 'border-[#FB7185] bg-[#FB7185]/[0.05]'
                  : inputPulse
                  ? 'border-[#3DE0FF] shadow-[0_0_16px_rgba(61,224,255,0.3)]'
                  : 'border-white/[0.08] focus:border-[#3DE0FF]/50 focus:bg-white/[0.05] focus:shadow-[0_0_16px_rgba(61,224,255,0.15)]'
              }`}
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="form-group flex flex-col gap-1.5">
          <div className="form-label-row flex items-center justify-between">
            <label htmlFor="password" className="form-label text-[10px] font-semibold tracking-[0.1em] uppercase text-[#94A3B8]">
              Password
            </label>
            <button
              type="button"
              id="forgotPasswordLink"
              onClick={handleForgotPassword}
              className="form-forgot-link text-[11px] text-[#3DE0FF] hover:underline transition-colors cursor-pointer bg-transparent border-none p-0"
            >
              Forgot password?
            </button>
          </div>
          <div className="form-input-wrap relative w-full">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoComplete="current-password"
              required
              className={`form-input w-full px-3.5 py-3 pr-11 rounded-lg bg-white/[0.03] border text-[13.5px] text-white placeholder:text-white/20 outline-none transition-all duration-200 ${
                error && !password
                  ? 'border-[#FB7185] bg-[#FB7185]/[0.05]'
                  : inputPulse
                  ? 'border-[#3DE0FF] shadow-[0_0_16px_rgba(61,224,255,0.3)]'
                  : 'border-white/[0.08] focus:border-[#3DE0FF]/50 focus:bg-white/[0.05] focus:shadow-[0_0_16px_rgba(61,224,255,0.15)]'
              }`}
            />
            <button
              type="button"
              id="passwordToggleBtn"
              onClick={() => setShowPassword(!showPassword)}
              className="form-input-peek-btn absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 inline-flex items-center justify-center text-[#64748B] hover:text-white hover:bg-white/[0.06] rounded-md transition-colors border-none bg-transparent cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              title="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Remember Checkbox */}
        <div className="form-checkbox-row flex items-center gap-2.5 pt-0.5 select-none cursor-pointer">
          <input
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="form-checkbox-input w-4 h-4 rounded border border-white/20 bg-white/[0.03] text-[#3DE0FF] focus:ring-0 cursor-pointer accent-[#3DE0FF]"
          />
          <label htmlFor="rememberMe" className="form-checkbox-label text-xs text-[#94A3B8] cursor-pointer">
            Keep me signed in on this device
          </label>
        </div>

        {/* Error Banner */}
        {error && (
          <div
            id="authError"
            role="alert"
            className="auth-error-banner flex items-center gap-2.5 p-3 rounded-lg bg-[#FB7185]/10 border border-[#FB7185]/30 text-xs text-[#FB7185]"
          >
            <AlertCircle size={16} className="shrink-0" />
            <span id="authErrorMsg">{error}</span>
          </div>
        )}

        {/* Primary Submit Button */}
        <button
          type="submit"
          id="signInBtn"
          disabled={isLoading}
          aria-label="Sign In to Your Account"
          className="auth-submit-btn w-full mt-1.5 py-3.5 px-5.5 rounded-lg bg-white text-[#030814] hover:opacity-95 hover:-translate-y-0.5 text-[11.5px] font-bold tracking-[0.1em] uppercase transition-all duration-180 cursor-pointer shadow-[0_4px_20px_rgba(255,255,255,0.15)] hover:shadow-[0_6px_24px_rgba(255,255,255,0.25)] flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed border-none"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-black/20 border-t-[#030814] rounded-full animate-spin" />
              <span className="opacity-75">SIGNING IN...</span>
            </>
          ) : (
            <span className="btn-text">SIGN IN TO ATELIER</span>
          )}
        </button>
      </form>

      {/* Footer Switch & Security Footnote */}
      <div className="auth-footer-zone mt-6 text-center flex flex-col gap-3.5">
        <p className="auth-switch-text text-[12.5px] text-[#94A3B8]">
          New to nexCommerce?{' '}
          <Link
            href="/signup"
            id="signupLink"
            className="auth-switch-link text-white font-semibold border-b border-white/25 hover:border-[#3DE0FF] hover:text-[#3DE0FF] pb-0.5 transition-colors"
          >
            Create an account
          </Link>
        </p>
        <div className="auth-security-footnote inline-flex items-center justify-center gap-1.5 text-[10.5px] text-[#64748B] tracking-[0.04em]">
          <ShieldCheck size={13} className="text-[#34D399]" />
          <span>Encrypted 256-bit TLS · Atelier Privacy Guarantee</span>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white bg-[#012148]">Loading...</div>}>
      <AuthLayout mode="signin">
        <SignInContent />
      </AuthLayout>
    </Suspense>
  );
}

