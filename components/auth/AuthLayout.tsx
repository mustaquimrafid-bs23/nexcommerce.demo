'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Shield, Clock, Award, ArrowLeft } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  quote: string;
  quoteAuthor: string;
  heroImage?: string;
  mode: 'signin' | 'signup';
}

export function AuthLayout({
  children,
  quote,
  quoteAuthor,
  heroImage = '/assets/images/lifestyle/auth_lifestyle.jpg',
  mode,
}: AuthLayoutProps) {
  return (
    <div
      className="min-h-screen text-white flex flex-col justify-between pt-8 pb-12"
      style={{ background: 'radial-gradient(circle at 50% 0%, #031838 0%, #011126 50%, #000B1A 100%)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Back navigation */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/50 hover:text-accent-cyan transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Return to Storefront</span>
          </Link>
        </div>

        {/* 2-Column Split Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch rounded-3xl overflow-hidden border border-white/10 bg-surface-card/60 backdrop-blur-xl shadow-2xl">
          {/* Left Column: Editorial Atmospheric Image & Literary Quote */}
          <div className="hidden lg:flex lg:col-span-6 relative flex-col justify-between p-12 overflow-hidden bg-obsidian-950">
            <div className="absolute inset-0">
              <img
                src={heroImage}
                alt="nexCommerce Tailoring & Design"
                className="w-full h-full object-cover opacity-45 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/40 to-transparent" />
            </div>

            {/* Top Brand Badge */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-white/90">
                <Sparkles size={13} className="text-accent-cyan" />
                <span>Client Membership Portal</span>
              </div>
            </div>

            {/* Bottom Quote & Privileges */}
            <div className="relative z-10 space-y-6">
              <blockquote className="space-y-2 border-l-2 border-accent-pink pl-4">
                <p className="font-editorial text-2xl lg:text-3xl text-white font-normal italic leading-snug">
                  &ldquo;{quote}&rdquo;
                </p>
                <footer className="text-xs uppercase tracking-widest text-white/50 font-medium">
                  &mdash; {quoteAuthor}
                </footer>
              </blockquote>

              <div className="pt-4 border-t border-white/10 space-y-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-accent-cyan block">
                  Membership Privileges
                </span>
                <div className="grid grid-cols-1 gap-2.5 text-xs text-white/70">
                  <div className="flex items-center gap-2.5">
                    <Shield size={14} className="text-accent-pink shrink-0" />
                    <span>24/7 Personal Style Advisor Access</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock size={14} className="text-accent-pink shrink-0" />
                    <span>Complimentary Express UK &amp; European Delivery</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Award size={14} className="text-accent-pink shrink-0" />
                    <span>Early Access to New Collections &amp; Free Lifetime Care</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form Container */}
          <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
