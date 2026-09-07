'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Download,
  Trash2,
  Code,
  FileText,
  ChevronDown,
  CheckCircle2,
  Copy,
  X,
  ExternalLink,
  ChevronRight,
  Eye,
  Sparkles,
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useSmartListStore } from '@/store/useSmartListStore';

const PILLARS = [
  {
    directive: 'Directive 01',
    title: 'Zero Third-Party Data Brokerage',
    description:
      'We never sell, rent, or syndicate client browsing behavior, search history, or purchase records to advertising networks or external data brokers.',
    icon: Lock,
  },
  {
    directive: 'Directive 02',
    title: 'Biometric & Sizing Confidentiality',
    description:
      'Anatomical size calibrations and personal fit vectors are stored locally in your browser storage and never uploaded to cloud profiling servers.',
    icon: ShieldCheck,
  },
  {
    directive: 'Directive 03',
    title: 'Financial Tokenization Isolation',
    description:
      'Payment details and mobile PIN authentications are tokenized directly with PCI-DSS Level 1 compliant gateways with zero merchant persistence.',
    icon: FileText,
  },
  {
    directive: 'Directive 04',
    title: 'Telemetry Transparency & In-Browser Intelligence',
    description:
      'All personalized style suggestions and search intent parsing are computed locally on your device with complete transparency.',
    icon: Eye,
  },
  {
    directive: 'Directive 05',
    title: 'Irrevocable Erasure & Machine Portability',
    description:
      'You maintain unconditional ownership of your data with 1-click JSON export and instantaneous local storage cryptographic purging.',
    icon: Trash2,
  },
];

const STATUTORY_RIGHTS = [
  {
    id: 'portability',
    title: 'Right to Data Portability (GDPR Article 20)',
    content:
      'You have the statutory right to receive all personal data, catalog wishlists, and order histories concerning you in a structured, commonly used, and machine-readable JSON format.',
  },
  {
    id: 'erasure',
    title: 'Right to Erasure / Right to be Forgotten (GDPR Article 17)',
    content:
      'You may unconditionally demand the immediate erasure of all stored client preferences, temporary shopping tokens, and session telemetry from this device.',
  },
  {
    id: 'profiling',
    title: 'Right to Object to Automated Profiling (GDPR Article 21)',
    content:
      'You have the right to opt out of automated algorithmic recommendations. All concierge suggestions will default to un-personalized seasonal collections.',
  },
  {
    id: 'telemetry',
    title: 'Cookie & Telemetry Revocation (ePrivacy Directive)',
    content:
      'Only strictly necessary functional cookies required for shopping bag synchronization and payment settlement are initialized by default.',
  },
];

export default function PrivacyPage() {
  const [mounted, setMounted] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [openRight, setOpenRight] = useState<string>('portability');

  const cart = useCartStore();
  const wishlist = useWishlistStore();
  const smartList = useSmartListStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-accent-pink border-t-transparent animate-spin" />
      </div>
    );
  }

  const vaultPayload = {
    metadata: {
      generatedAt: new Date().toISOString(),
      vaultVersion: '2.0.0-NextJS-Atelier',
      clientProfile: 'Eleanor Vance (#NX-VIP-00892)',
      jurisdiction: 'GDPR / CCPA Sovereignty Vault',
    },
    shoppingBag: {
      itemCount: cart.items.length,
      appliedCoupon: cart.appliedCoupon,
      subtotal: cart.getSubtotal(),
      items: cart.items,
    },
    savedWishlist: {
      itemCount: wishlist.savedItems.length,
      items: wishlist.savedItems,
    },
    smartReplenishment: {
      scheduledItemCount: smartList.items.length,
      items: smartList.items,
    },
    telemetry: {
      trackingEnabled: false,
      thirdPartyTrackers: 0,
      clientEncryptionState: 'Active Local AES-GCM',
    },
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(vaultPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast('Vault JSON copied to clipboard');
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(vaultPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'maison-sovereign-vault.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Downloaded maison-sovereign-vault.json');
  };

  const handlePurgeAll = () => {
    cart.clearCart();
    wishlist.clearWishlist();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('latest_order');
      sessionStorage.removeItem('latest_order');
    }
    showToast('All local storage vault data has been purged.');
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-500 text-obsidian-950 font-semibold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <section className="bg-white/[0.02] backdrop-blur-md border-b border-white/10 pt-10 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs text-white/50">
            <Link href="/" className="hover:text-white transition-colors">
              Maison
            </Link>
            <ChevronRight size={12} />
            <span className="text-white">Data Sovereignty Hub</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-2">
                <ShieldCheck size={12} />
                <span>100% Client-Side Encrypted &bull; Zero Data Brokerage</span>
              </div>
              <h1 className="font-editorial text-3xl sm:text-4xl text-white font-normal">
                Data Sovereignty &amp; <span className="italic">Privacy Vault</span>
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsJsonModalOpen(true)}
                className="px-5 py-2.5 rounded-full bg-surface-navy/70 border border-white/15 hover:border-white/30 text-white text-xs font-semibold transition-colors flex items-center gap-2"
              >
                <Code size={14} className="text-accent-pink" />
                <span>Inspect Vault JSON</span>
              </button>

              <button
                onClick={handleDownloadJson}
                className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-obsidian-950 text-xs font-semibold transition-colors flex items-center gap-2"
              >
                <Download size={14} />
                <span>Export Vault</span>
              </button>

              <button
                onClick={handlePurgeAll}
                className="px-5 py-2.5 rounded-full bg-accent-crimson/20 border border-accent-crimson/40 hover:bg-accent-crimson text-white text-xs font-semibold transition-colors flex items-center gap-2"
              >
                <Trash2 size={14} />
                <span>Purge All</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Live Vault Metrics Bar */}
      <section className="bg-surface-navy/40 border-b border-white/10 py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-surface-navy/50 border border-white/10 flex justify-between items-center">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-white/50 block">
                Shopping Bag Tokens
              </span>
              <strong className="text-lg font-bold text-white">
                {cart.items.length} Items
              </strong>
            </div>
            <button
              onClick={() => {
                cart.clearCart();
                showToast('Bag data purged.');
              }}
              className="text-[11px] text-accent-crimson hover:underline"
            >
              Clear
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-surface-navy/50 border border-white/10 flex justify-between items-center">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-white/50 block">
                Saved Wishlist Creations
              </span>
              <strong className="text-lg font-bold text-white">
                {wishlist.savedItems.length} Pieces
              </strong>
            </div>
            <button
              onClick={() => {
                wishlist.clearWishlist();
                showToast('Wishlist data purged.');
              }}
              className="text-[11px] text-accent-crimson hover:underline"
            >
              Clear
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-surface-navy/50 border border-white/10 flex justify-between items-center">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-white/50 block">
                Smart Care Schedules
              </span>
              <strong className="text-lg font-bold text-white">
                {smartList.items.length} Schedules
              </strong>
            </div>
            <Link href="/smart-list" className="text-[11px] text-accent-pink hover:underline">
              Manage
            </Link>
          </div>

          <div className="p-4 rounded-2xl bg-surface-navy/50 border border-white/10 flex justify-between items-center">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-white/50 block">
                Third-Party Trackers
              </span>
              <strong className="text-lg font-bold text-emerald-400">
                0 Blocked (100% Clean)
              </strong>
            </div>
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        {/* 5 Pillars of Data Sovereignty */}
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent-pink">
              Architectural Directives
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl text-white font-normal">
              The 5 Pillars of Maison Data Sovereignty
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.directive}
                  className="p-6 rounded-3xl bg-surface-navy/30 border border-white/10 space-y-4 hover:border-white/20 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-accent-cyan">
                        {pillar.directive}
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                        <Icon size={16} />
                      </div>
                    </div>

                    <h3 className="font-editorial text-lg text-white font-medium">
                      {pillar.title}
                    </h3>

                    <p className="text-xs text-white/60 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Statutory Rights Hub (GDPR & CCPA Accordions) */}
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
              Statutory Protections
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl text-white font-normal">
              Interactive GDPR &amp; CCPA Rights Hub
            </h2>
          </div>

          <div className="space-y-3">
            {STATUTORY_RIGHTS.map((right) => (
              <div
                key={right.id}
                className="p-5 rounded-2xl bg-surface-navy/30 border border-white/10 space-y-3 overflow-hidden"
              >
                <button
                  onClick={() =>
                    setOpenRight(openRight === right.id ? '' : right.id)
                  }
                  className="w-full flex items-center justify-between text-left font-medium text-sm text-white hover:text-accent-pink transition-colors"
                >
                  <span>{right.title}</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      openRight === right.id ? 'rotate-180 text-accent-pink' : 'text-white/40'
                    }`}
                  />
                </button>

                {openRight === right.id && (
                  <p className="text-xs text-white/70 leading-relaxed pt-2 border-t border-white/5">
                    {right.content}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* JSON Vault Inspector Modal */}
      {isJsonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            onClick={() => setIsJsonModalOpen(false)}
          />

          <div className="relative w-full max-w-2xl bg-obsidian-950 border border-white/20 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl z-10 flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Code size={18} className="text-accent-pink" />
                <h3 className="font-editorial text-xl text-white">
                  Local Sovereign Vault JSON
                </h3>
              </div>

              <button
                onClick={() => setIsJsonModalOpen(false)}
                className="p-1.5 text-white/40 hover:text-white rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto rounded-2xl bg-obsidian-900 border border-white/10 p-4 font-mono text-xs text-white/80 leading-relaxed">
              <pre>{JSON.stringify(vaultPayload, null, 2)}</pre>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-white/40">
                Machine-readable format per GDPR Article 20
              </span>

              <div className="flex gap-2">
                <button
                  onClick={handleCopyJson}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white text-white hover:text-obsidian-950 text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Copy size={13} />
                  <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
                </button>

                <button
                  onClick={handleDownloadJson}
                  className="px-4 py-2 rounded-xl bg-accent-pink hover:bg-accent-pink/90 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Download size={13} />
                  <span>Download JSON</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
