'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  X,
  Search,
  Camera,
  Layers,
  Bot,
  Ruler,
  Sliders,
  DollarSign,
  FileText,
  Tag,
  RefreshCw,
  ShoppingBag,
  Truck,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useSearchStore } from '@/store/useSearchStore';
import { useConciergeStore } from '@/store/useConciergeStore';

interface FeatureItem {
  num: string;
  name: string;
  whatItDoes: string;
  realExample: string;
  icon: React.ReactNode;
  color: string;
  actionText: string;
  actionType: 'search' | 'concierge' | 'link';
  href?: string;
}

const FEATURE_GROUPS: { category: string; icon: string; features: FeatureItem[] }[] = [
  {
    category: '1. Finding What You Want (Search & Browse)',
    icon: '🔍',
    features: [
      {
        num: '01',
        name: 'Search in Your Own Words',
        whatItDoes: 'Describe any event, place, or weather in your own normal words.',
        realExample: 'Type: "Warm coat for a cold weekend in Edinburgh"',
        icon: <Search size={16} />,
        color: '#3DE0FF',
        actionText: 'Try Search',
        actionType: 'search',
      },
      {
        num: '02',
        name: 'Shop from Photos',
        whatItDoes: 'Tap on clothes shown in model photos to view details and buy them.',
        realExample: 'Tap the glowing tag on the model to view the dress',
        icon: <Camera size={16} />,
        color: '#F13365',
        actionText: 'Browse Collection',
        actionType: 'link',
        href: '/category',
      },
      {
        num: '03',
        name: 'Side-by-Side Comparison',
        whatItDoes: 'Compare two items side-by-side to check materials, colours, and prices.',
        realExample: 'Compare two wool coats to pick the warmest one',
        icon: <Layers size={16} />,
        color: '#8B5CF6',
        actionText: 'Compare Items',
        actionType: 'link',
        href: '/category',
      },
    ],
  },
  {
    category: '2. Outfits & Getting the Right Size (Styling & Fit)',
    icon: '👔',
    features: [
      {
        num: '04',
        name: 'Personal Stylist',
        whatItDoes: 'Ask for advice on what to wear and get complete matching outfits.',
        realExample: 'Ask: "Suggest a smart-casual dinner outfit under £300"',
        icon: <Sparkles size={16} />,
        color: '#3DE0FF',
        actionText: 'Chat with Stylist',
        actionType: 'concierge',
      },
      {
        num: '05',
        name: 'Size & Fit Advisor',
        whatItDoes: 'Recommends the best size for your height, chest, and fit preference.',
        realExample: 'Recommends UK 10 based on your usual high-street fit',
        icon: <Ruler size={16} />,
        color: '#10B981',
        actionText: 'Check Your Size',
        actionType: 'concierge',
      },
      {
        num: '06',
        name: 'Search by Occasion',
        whatItDoes: 'Find items by telling us where you are going or what you are doing.',
        realExample: 'Type: "Smart dinner jacket for a London evening"',
        icon: <Sliders size={16} />,
        color: '#F59E0B',
        actionText: 'Try Occasion Search',
        actionType: 'search',
      },
    ],
  },
  {
    category: '3. Shopping Bag & Deals (Savings & Budget)',
    icon: '🛒',
    features: [
      {
        num: '07',
        name: 'Shop Within Your Budget',
        whatItDoes: 'Set a spending limit and receive matching clothes that fit your price.',
        realExample: 'Set £450 budget → gets a coat, trousers, and bag for £420',
        icon: <DollarSign size={16} />,
        color: '#10B981',
        actionText: 'Open Bag',
        actionType: 'link',
        href: '/cart',
      },
      {
        num: '08',
        name: 'Add Shopping List to Bag',
        whatItDoes: 'Paste a written note or text list to add all items to your bag in one click.',
        realExample: 'Paste: "2x merino wool jumper M, 1x black trainers 9"',
        icon: <FileText size={16} />,
        color: '#8B5CF6',
        actionText: 'Open Bag',
        actionType: 'link',
        href: '/cart',
      },
      {
        num: '09',
        name: 'Saved Items & Reminders',
        whatItDoes: 'Keep track of items you love and get reminders when essentials run low.',
        realExample: 'Save favourite items to your Smart List to buy later',
        icon: <RefreshCw size={16} />,
        color: '#06B6D4',
        actionText: 'Open Smart List',
        actionType: 'link',
        href: '/smart-list',
      },
    ],
  },
  {
    category: '4. Fast Checkout & Delivery (Buying & Tracking)',
    icon: '🚚',
    features: [
      {
        num: '10',
        name: 'Order Inside Chat',
        whatItDoes: 'Buy your chosen clothes directly in the chat without filling in long forms.',
        realExample: 'Say: "Order my bag" → confirms address and places order',
        icon: <ShoppingBag size={16} />,
        color: '#F13365',
        actionText: 'Chat with Stylist',
        actionType: 'concierge',
      },
      {
        num: '11',
        name: 'Live Delivery Tracker',
        whatItDoes: 'Follow your parcel step-by-step from packing to your front door.',
        realExample: 'Shows driver arrival time and parcel progress on a map',
        icon: <Truck size={16} />,
        color: '#0284C7',
        actionText: 'Track Order',
        actionType: 'link',
        href: '/tracking',
      },
      {
        num: '12',
        name: 'Pick Delivery Window',
        whatItDoes: 'Choose a delivery time that suits you before completing your purchase.',
        realExample: 'Confirms express doorstep delivery for tomorrow afternoon',
        icon: <MapPin size={16} />,
        color: '#F59E0B',
        actionText: 'View Delivery Options',
        actionType: 'link',
        href: '/tracking',
      },
    ],
  },
];

export function FeatureTourModal() {
  const [isOpen, setIsOpen] = useState(false);
  const openSearch = useSearchStore((state) => state.openSearch);
  const openConcierge = useConciergeStore((state) => state.openConcierge);

  // Keyboard escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleAction = (item: FeatureItem) => {
    setIsOpen(false);
    if (item.actionType === 'search') {
      openSearch();
    } else if (item.actionType === 'concierge') {
      openConcierge();
    }
  };

  const pathname = usePathname();
  const isGuidePage = pathname === '/guide' || pathname === '/shopping-guide' || pathname === '/feature-guide';

  return (
    <>
      {/* ─── Floating Button: Bottom-Left Pill (#aiTourFloatingBtn) ─── */}
      {!isGuidePage && (
        <button
          id="aiTourFloatingBtn"
          type="button"
          className="fixed bottom-6 left-6 sm:bottom-7 sm:left-7 z-[8800] flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#071B2E]/95 border border-[#3DE0FF]/35 text-[#3DE0FF] text-xs font-semibold shadow-[0_6px_24px_rgba(0,0,0,0.6)] hover:bg-[#0A2540] hover:border-[#3DE0FF]/70 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer select-none backdrop-blur-md"
          aria-label="View Shopping Guide"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(true)}
        >
          <span className="ai-tour-btn-dot w-2 h-2 rounded-full bg-[#3DE0FF] shadow-[0_0_8px_#3DE0FF] animate-pulse" />
          <span>Shopping Guide</span>
        </button>
      )}

      {/* ─── Shopping Features Modal (#aiTourModal) ─── */}
      {isOpen && (
        <div
          id="aiTourModal"
          role="dialog"
          aria-modal="true"
          aria-label="Shopping Guide Overview"
          data-lenis-prevent
          className="fixed inset-0 z-[99995] flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Panel */}
          <div
            className="ai-tour-panel relative w-full max-w-4xl max-h-[85vh] bg-[#051124] border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200"
            data-lenis-prevent
          >
            {/* Top Accent Gradient */}
            <div className="ai-tour-panel-accent h-1 w-full bg-gradient-to-r from-[#3DE0FF] via-[#F13365] to-[#3DE0FF]" />

            {/* Header */}
            <div className="ai-tour-panel-head p-5 sm:p-7 border-b border-white/10 flex items-start justify-between gap-4">
              <div>
                <div className="ai-tour-panel-tag inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#3DE0FF] uppercase tracking-wider mb-1.5 font-mono">
                  <Sparkles size={12} />
                  <span>Simple &amp; Clear Guide</span>
                </div>
                <h2 className="ai-tour-panel-title text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                  How We Help You Shop
                </h2>
                <p className="ai-tour-panel-sub text-xs sm:text-sm text-white/70 mt-1">
                  12 simple ways to help you find clothes, get the right size, and order with confidence.
                </p>
              </div>

              <button
                id="aiTourCloseBtn"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer flex-shrink-0"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Feature List Body */}
            <div
              className="ai-tour-feature-list flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 sm:space-y-8"
              data-lenis-prevent
              tabIndex={0}
            >
              {FEATURE_GROUPS.map((group, groupIdx) => (
                <div key={groupIdx} className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-white/90 uppercase tracking-wider">
                    <span>{group.icon}</span>
                    <span>{group.category}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {group.features.map((feat) => (
                      <div
                        key={feat.num}
                        className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/15 transition-all duration-200 flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2.5">
                            <span
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                              style={{ backgroundColor: `${feat.color}25`, color: feat.color }}
                            >
                              {feat.icon}
                            </span>
                            <span className="text-[10px] font-mono text-white/40">{feat.num}</span>
                          </div>

                          <h3 className="text-sm font-semibold text-white group-hover:text-[#3DE0FF] transition-colors mb-2">
                            {feat.name}
                          </h3>

                          {/* Mandatory 2-Line Structure: WHAT IT DOES */}
                          <div className="mb-2.5">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-[#3DE0FF]/80 block mb-0.5">
                              What it does
                            </span>
                            <p className="text-xs text-white/75 leading-relaxed">{feat.whatItDoes}</p>
                          </div>

                          {/* Mandatory 2-Line Structure: REAL EXAMPLE */}
                          <div className="p-2 rounded-lg bg-black/40 border border-dashed border-white/10 text-[11px] text-white/80 font-mono mb-3">
                            <span className="text-white/40 block text-[9px] uppercase tracking-wider mb-0.5">
                              Real Example
                            </span>
                            {feat.realExample}
                          </div>
                        </div>

                        {feat.actionType === 'link' && feat.href ? (
                          <Link
                            href={feat.href}
                            onClick={() => setIsOpen(false)}
                            className="inline-flex items-center justify-between text-xs font-semibold text-[#3DE0FF] hover:text-[#F13365] transition-colors pt-2 border-t border-white/5"
                          >
                            <span>{feat.actionText}</span>
                            <ArrowRight size={13} />
                          </Link>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAction(feat)}
                            className="inline-flex items-center justify-between text-xs font-semibold text-[#3DE0FF] hover:text-[#F13365] transition-colors pt-2 border-t border-white/5 cursor-pointer text-left"
                          >
                            <span>{feat.actionText}</span>
                            <ArrowRight size={13} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
