'use client';

import React from 'react';
import Link from 'next/link';

interface AuthLayoutProps {
  children: React.ReactNode;
  heroImage?: string;
  mode?: 'signin' | 'signup';
  quote?: string;
  quoteAuthor?: string;
}

export function AuthLayout({
  children,
  heroImage = '/assets/images/lifestyle/auth_lifestyle.jpg',
}: AuthLayoutProps) {
  return (
    <main
      className="auth-shell min-h-screen w-full grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] relative text-white bg-[#012148]"
      style={{
        background: 'radial-gradient(ellipse at 80% 20%, #012B61 0%, #012148 55%, #0A1B3D 100%)',
      }}
    >
      {/* ── Left: Featured Look Showcase & 120fps Animation Track ── */}
      <section
        className="auth-showcase-panel relative hidden lg:flex flex-col justify-between overflow-hidden p-11 bg-[#020712] border-r border-white/5"
        aria-label="Featured Atelier Showcase"
      >
        <div className="showcase-bg-wrap absolute inset-0 z-1 overflow-hidden">
          <img
            src={heroImage}
            alt="Tailored luxury styling in refined atelier setting"
            className="showcase-bg-img w-full h-[108%] object-cover object-[center_30%] block will-change-transform"
            style={{
              animation: 'authKenBurns 18s ease-in-out infinite alternate',
            }}
          />
          <div
            className="showcase-gradient-overlay absolute inset-0 pointer-events-none z-2"
            style={{
              background:
                'linear-gradient(180deg, rgba(3, 8, 20, 0.75) 0%, rgba(3, 8, 20, 0.2) 35%, rgba(3, 8, 20, 0.3) 60%, rgba(3, 8, 20, 0.94) 100%)',
            }}
            aria-hidden="true"
          />
        </div>
      </section>

      {/* ── Right: Minimal Luxury Authentication Portal ── */}
      <section
        className="auth-form-panel flex flex-col justify-center px-6 sm:px-12 lg:px-14 xl:px-18 py-10 sm:py-14 relative z-10 overflow-y-auto min-h-screen"
        style={{
          background: '#012148',
          backgroundImage:
            'radial-gradient(circle at 50% 0%, #012B61 0%, #012148 60%, #0A1B3D 100%)',
        }}
        aria-label="Account Authentication Portal"
      >
        <div className="auth-form-container max-w-[440px] w-full mx-auto flex flex-col">
          {/* Brand Logo Anchor */}
          <Link
            href="/"
            className="auth-brand-logo inline-block mb-8 hover:opacity-85 transition-opacity w-max"
            aria-label="nexCommerce Home"
          >
            <img
              src="/assets/images/brand/logo_light.png"
              alt="nexCommerce — Intelligent Shopping & Intent Discovery"
              className="h-7 w-auto max-w-[175px] object-contain block"
            />
          </Link>

          {children}
        </div>
      </section>
    </main>
  );
}
