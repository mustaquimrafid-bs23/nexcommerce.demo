'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Globe, Check } from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer
      className="bg-gradient-to-b from-[#030814] to-[#01040A] border-t border-white/[0.07] pt-14 sm:pt-20 pb-8 sm:pb-10 text-white/70 relative z-20"
      id="siteFooter"
      role="contentinfo"
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 3-Column Asymmetric Grid */}
        <div className="footer-main-grid grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 mb-12 items-start">
          {/* Column 1: Brand Manifesto & Social Channels (5 cols) */}
          <div className="footer-brand-col md:col-span-5 flex flex-col gap-3.5">
            <Link href="/" className="inline-block w-fit" aria-label="nexCommerce Home">
              <img
                src="/assets/images/brand/logo_light.png"
                alt="nexCommerce"
                className="footer-logo-img h-5 sm:h-[22px] w-auto object-contain opacity-95 hover:opacity-100 transition-opacity"
              />
            </Link>

            <p className="footer-brand-desc text-xs sm:text-[12.5px] leading-relaxed text-white/60 max-w-sm">
              Modern online shopping. Handpicked clothes, footwear, and accessories.
            </p>

            {/* Social Icons Row */}
            <div className="footer-social-row flex items-center gap-2.5 pt-1">
              {/* Instagram */}
              <a
                href="#"
                aria-label="nexCommerce on Instagram"
                title="Instagram"
                className="footer-social-link w-8 h-8 rounded-full border border-white/12 hover:border-white/35 flex items-center justify-center text-white/65 hover:text-white hover:bg-white/[0.06] transition-all hover:-translate-y-0.5"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>

              {/* TikTok */}
              <a
                href="#"
                aria-label="nexCommerce on TikTok"
                title="TikTok"
                className="footer-social-link w-8 h-8 rounded-full border border-white/12 hover:border-white/35 flex items-center justify-center text-white/65 hover:text-white hover:bg-white/[0.06] transition-all hover:-translate-y-0.5"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.89a8.27 8.27 0 0 0 4.84 1.55V7a4.85 4.85 0 0 1-1.07-.31z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="#"
                aria-label="nexCommerce on LinkedIn"
                title="LinkedIn"
                className="footer-social-link w-8 h-8 rounded-full border border-white/12 hover:border-white/35 flex items-center justify-center text-white/65 hover:text-white hover:bg-white/[0.06] transition-all hover:-translate-y-0.5"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: About & Guides (3 cols) */}
          <div className="footer-nav-col md:col-span-3 flex flex-col gap-2.5">
            <span className="footer-col-heading text-[11px] font-semibold tracking-[0.16em] uppercase text-white mb-1 block">
              ABOUT
            </span>
            <Link
              href="/discovery"
              className="footer-link-item text-xs sm:text-[12.5px] text-white/55 hover:text-white transition-colors w-fit hover:translate-x-0.5"
            >
              About Us
            </Link>
            <Link
              href="/help"
              className="footer-link-item text-xs sm:text-[12.5px] text-white/55 hover:text-white transition-colors w-fit hover:translate-x-0.5"
            >
              Help &amp; Customer Care
            </Link>
            <Link
              href="/privacy"
              className="footer-link-item text-xs sm:text-[12.5px] text-white/55 hover:text-white transition-colors w-fit hover:translate-x-0.5"
            >
              Privacy Policy
            </Link>
            <Link
              href="/privacy"
              className="footer-link-item text-xs sm:text-[12.5px] text-white/55 hover:text-white transition-colors w-fit hover:translate-x-0.5"
            >
              Terms of Service
            </Link>
          </div>

          {/* Column 3: Newsletter (4 cols) */}
          <div className="footer-newsletter-col md:col-span-4 flex flex-col gap-2.5">
            <span className="footer-col-heading text-[11px] font-semibold tracking-[0.16em] uppercase text-white mb-1 block">
              NEWSLETTER
            </span>
            <p className="footer-newsletter-sub text-xs sm:text-[12.5px] text-white/60 leading-relaxed max-w-sm">
              Get updates on new seasonal collections and special offers.
            </p>

            <form
              id="footerNewsletterForm"
              onSubmit={handleSubmit}
              className="footer-newsletter-form flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-1 max-w-sm w-full"
            >
              <input
                type="email"
                id="footerNewsletterEmail"
                name="newsletter_email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email for newsletter"
                autoComplete="email"
                className="footer-newsletter-input flex-1 px-3.5 py-2.5 rounded-lg bg-white/[0.05] border border-white/10 focus:border-[#3DE0FF] text-xs text-white placeholder-white/40 focus:outline-none transition-colors h-10"
              />
              <button
                type="submit"
                className="footer-newsletter-btn px-4 py-2.5 rounded-lg bg-white/90 hover:bg-white text-[#011630] font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-1 cursor-pointer flex-shrink-0 h-10 active:scale-98"
              >
                {subscribed ? <Check size={14} className="text-emerald-600" /> : 'Subscribe'}
              </button>
            </form>

            <span className="footer-newsletter-fineprint text-[11px] text-white/45 block pt-0.5">
              No spam. Unsubscribe at any time. Read our{' '}
              <Link href="/privacy" className="underline hover:text-white/80 transition-colors">
                Privacy Policy
              </Link>.
            </span>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Payment Badges & Locale */}
        <div className="footer-bottom-bar border-t border-white/[0.06] pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright & Legal */}
          <div className="footer-copy-col text-xs text-white/45 text-center md:text-left space-y-1">
            <div className="footer-copy-text">&copy; 2026 nexCommerce Ltd. All rights reserved.</div>
            <div className="footer-legal-sub text-[11px]">
              All prices incl. statutory VAT &middot;{' '}
              <Link href="/privacy" className="footer-legal-link underline hover:text-white/70">
                Privacy
              </Link>{' '}
              &middot;{' '}
              <Link href="/privacy" className="footer-legal-link underline hover:text-white/70">
                Terms
              </Link>{' '}
              &middot;{' '}
              <button
                type="button"
                className="footer-cookie-trigger footer-legal-link underline hover:text-white/70 cursor-pointer"
                data-open-cookie-settings
              >
                Cookie Settings
              </button>
            </div>
          </div>

          {/* EU Payment Badges */}
          <div
            className="footer-payment-badges flex items-center gap-2 flex-wrap justify-center"
            aria-label="Accepted European Payment Methods"
          >
            <div className="payment-brand-badge px-2.5 py-1 rounded bg-white/[0.06] border border-white/10 text-[11px] font-semibold text-white/70 tracking-wider" title="Apple Pay">
              <span>Pay</span>
            </div>
            <div className="payment-brand-badge px-2.5 py-1 rounded bg-white/[0.06] border border-white/10 text-[11px] font-bold text-white/70 tracking-wider" title="Visa">
              VISA
            </div>
            <div className="payment-brand-badge px-2.5 py-1 rounded bg-white/[0.06] border border-white/10 text-[11px] font-bold text-white/70 tracking-wider" title="Mastercard">
              Mastercard
            </div>
            <div className="payment-brand-badge px-2.5 py-1 rounded bg-white/[0.06] border border-white/10 text-[11px] font-bold text-white/70 tracking-wider" title="Klarna">
              Klarna.
            </div>
          </div>

          {/* Locale Selector */}
          <div className="footer-locale-col flex items-center gap-2 text-xs text-white/50">
            <div className="footer-locale-selector flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-white/70 hover:text-white cursor-pointer transition-colors" aria-label="Locale Selector">
              <Globe size={13} className="text-[#3DE0FF]" />
              <span>Europe &middot; EUR (&euro;)</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
