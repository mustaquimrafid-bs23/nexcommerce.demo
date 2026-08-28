'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Lock } from 'lucide-react';

interface SignedOutViewProps {
  onSignIn: (email: string) => void;
}

export function SignedOutView({ onSignIn }: SignedOutViewProps) {
  const [email, setEmail] = useState('julian.voss@atelier-client.de');
  const [password, setPassword] = useState('••••••••');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSignIn(email);
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-16 px-4 text-center">
      <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-accent-cyan bg-accent-cyan/10 px-3 py-1 rounded-full mb-3">
        ACCOUNT
      </span>

      <h1 className="font-display font-bold text-3xl sm:text-4xl text-white mb-2">
        WELCOME BACK
      </h1>

      <p className="text-sm text-white/50 max-w-sm mb-8">
        Sign in to view your orders, saved delivery addresses, and personal style profile.
      </p>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 sm:p-7 text-left space-y-4 shadow-xl"
      >
        <div>
          <label
            htmlFor="accountSignInEmail"
            className="block text-[10px] font-bold tracking-wider uppercase text-white/50 mb-1.5"
          >
            EMAIL ADDRESS
          </label>
          <input
            type="email"
            id="accountSignInEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full h-11 px-3.5 bg-obsidian-950 border border-white/15 rounded-xl text-xs text-white placeholder-white/25 focus:outline-none focus:border-accent-cyan transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="accountSignInPassword"
            className="block text-[10px] font-bold tracking-wider uppercase text-white/50 mb-1.5"
          >
            PASSWORD
          </label>
          <input
            type="password"
            id="accountSignInPassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full h-11 px-3.5 bg-obsidian-950 border border-white/15 rounded-xl text-xs text-white placeholder-white/25 focus:outline-none focus:border-accent-cyan transition-colors"
          />
        </div>

        <button
          type="submit"
          className="w-full h-12 rounded-xl bg-accent-cyan hover:bg-accent-cyan/90 text-obsidian-950 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent-cyan/20 cursor-pointer mt-2"
        >
          <Lock size={13} />
          <span>SIGN IN</span>
        </button>
      </form>

      <Link
        href="/"
        className="inline-flex items-center gap-1 text-xs text-accent-cyan hover:underline mt-6 tracking-wide"
      >
        <span>CONTINUE AS GUEST</span>
        <ArrowRight size={13} />
      </Link>
    </div>
  );
}
