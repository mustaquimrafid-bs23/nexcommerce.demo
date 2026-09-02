'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, X, ChevronDown, ChevronUp, Check, Sliders } from 'lucide-react';

interface ConsentCategories {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

export function CookieConsentBanner() {
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState<ConsentCategories>({
    necessary: true,
    functional: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('nex_cookie_consent');
      if (!stored) {
        const timer = setTimeout(() => setShowBanner(true), 600);
        return () => clearTimeout(timer);
      } else {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.categories) {
            setCategories(parsed.categories);
          }
        } catch (e) {
          // ignore parsing error
        }
      }

      // Listen for custom trigger to open preferences
      const handleOpenPrefs = () => setShowModal(true);
      window.addEventListener('nex:open-cookie-settings', handleOpenPrefs);
      return () => window.removeEventListener('nex:open-cookie-settings', handleOpenPrefs);
    }
  }, []);

  if (!mounted) return null;

  const saveConsent = (cats: ConsentCategories) => {
    if (typeof window !== 'undefined') {
      const payload = {
        timestamp: new Date().toISOString(),
        categories: cats,
      };
      localStorage.setItem('nex_cookie_consent', JSON.stringify(payload));
    }
    setShowBanner(false);
    setShowModal(false);
  };

  const handleAcceptAll = () => {
    const allTrue: ConsentCategories = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    setCategories(allTrue);
    saveConsent(allTrue);
  };

  const handleRejectAll = () => {
    const strictlyNecessary: ConsentCategories = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    setCategories(strictlyNecessary);
    saveConsent(strictlyNecessary);
  };

  const handleSavePreferences = () => {
    saveConsent(categories);
  };

  return (
    <>
      {/* Floating Bottom Banner */}
      {showBanner && !showModal && (
        <div
          id="nexCookieBannerWrap"
          className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 p-5 rounded-3xl bg-surface-card border border-white/20 shadow-2xl backdrop-blur-xl animate-fade-in space-y-4"
          role="region"
          aria-label="Cookie consent banner"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-accent-cyan/15 text-accent-cyan flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck size={16} />
            </div>
            <div className="space-y-1 min-w-0">
              <h4 className="text-xs font-semibold text-white">
                Zero-Knowledge Privacy &amp; Cookies
              </h4>
              <p className="text-[11px] text-white/60 font-light leading-relaxed">
                We use strictly necessary telemetry for bag persistence and European VAT compliance. Non-essential cookies personalize your styling curation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              id="cookieAcceptAllBtn"
              type="button"
              onClick={handleAcceptAll}
              className="flex-1 py-2 rounded-xl bg-white text-obsidian-950 text-[11px] font-bold uppercase tracking-wider hover:bg-white/90 transition-all cursor-pointer shadow"
            >
              Accept All
            </button>
            <button
              id="cookieRejectAllBtn"
              type="button"
              onClick={handleRejectAll}
              className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-[11px] font-semibold uppercase tracking-wider hover:bg-white/10 transition-all cursor-pointer"
            >
              Strictly Necessary
            </button>
            <button
              id="cookieOpenPrefsBtn"
              type="button"
              onClick={() => setShowModal(true)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
              title="Preferences"
            >
              <Sliders size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Granular Preferences Modal */}
      {showModal && (
        <div
          id="nexCookieModalOverlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-md animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Privacy and Cookie Preferences"
        >
          <div className="relative w-full max-w-lg rounded-3xl bg-surface-card border border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={18} className="text-accent-cyan" />
                <h3 className="font-editorial text-2xl text-white font-normal">
                  Privacy Preferences
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-white/70 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-white/60 font-light leading-relaxed">
              Tailor your privacy settings. You may update your consent at any time from our legal footer.
            </p>

            {/* Categories */}
            <div className="space-y-3">
              {/* Strictly Necessary */}
              <div className="p-3.5 rounded-2xl bg-obsidian-950/60 border border-white/10 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">Strictly Necessary</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[9px] font-bold">
                      ALWAYS ACTIVE
                    </span>
                  </div>
                  <p className="text-[11px] text-white/50 mt-1">
                    Essential for secure authentication, shopping bag persistence, and checkout.
                  </p>
                </div>
              </div>

              {/* Functional Personalization */}
              <div className="p-3.5 rounded-2xl bg-obsidian-950/60 border border-white/10 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-white">Functional Personalization</span>
                  <p className="text-[11px] text-white/50 mt-1">
                    Retains your Style DNA profile, currency preference, and size recommendations.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={categories.functional}
                  onChange={(e) =>
                    setCategories((prev) => ({ ...prev, functional: e.target.checked }))
                  }
                  className="w-4 h-4 accent-accent-cyan cursor-pointer"
                />
              </div>

              {/* Analytics */}
              <div className="p-3.5 rounded-2xl bg-obsidian-950/60 border border-white/10 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-white">Analytics Telemetry</span>
                  <p className="text-[11px] text-white/50 mt-1">
                    Anonymized Core Web Vitals and navigation heatmaps to improve speed.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={categories.analytics}
                  onChange={(e) =>
                    setCategories((prev) => ({ ...prev, analytics: e.target.checked }))
                  }
                  className="w-4 h-4 accent-accent-cyan cursor-pointer"
                />
              </div>

              {/* Marketing */}
              <div className="p-3.5 rounded-2xl bg-obsidian-950/60 border border-white/10 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-white">Marketing &amp; Campaigns</span>
                  <p className="text-[11px] text-white/50 mt-1">
                    Curated lookbook drops and VIP private salon invites.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={categories.marketing}
                  onChange={(e) =>
                    setCategories((prev) => ({ ...prev, marketing: e.target.checked }))
                  }
                  className="w-4 h-4 accent-accent-cyan cursor-pointer"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={handleRejectAll}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Reject Non-Essential
              </button>
              <button
                type="button"
                onClick={handleSavePreferences}
                className="flex-1 py-2.5 rounded-xl bg-accent-crimson hover:bg-accent-crimson/90 text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow-md"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
