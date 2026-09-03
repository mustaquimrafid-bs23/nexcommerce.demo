'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import {
  Search,
  Camera,
  Mic,
  MessageSquare,
  Layers,
  Ruler,
  Columns,
  Wallet,
  FileText,
  Tag,
  RefreshCw,
  ShoppingBag,
  Truck,
  MapPin,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useSearchStore } from '@/store/useSearchStore';
import { useConciergeStore } from '@/store/useConciergeStore';
import { useVisualSearchStore } from '@/store/useVisualSearchStore';
import { useDeliveryGateStore } from '@/store/useDeliveryGateStore';

export interface FeatureItem {
  num: string;
  name: string;
  whatItDoes: string;
  realExample: string;
  icon: React.ReactNode;
  gradient: string;
  color: string;
  actionText: string;
  actionType: 'search' | 'visual-search' | 'concierge' | 'delivery-gate' | 'link';
  href?: string;
  exampleQuery?: string;
}

export interface FeatureStage {
  icon: string;
  label: string;
  features: FeatureItem[];
}

export const FEATURE_STAGES: FeatureStage[] = [
  {
    icon: '🔍',
    label: '1. Finding What You Want (Search & Discovery)',
    features: [
      {
        num: '01',
        name: 'Smart Conversational Search',
        whatItDoes: 'Type in normal sentences instead of exact keywords.',
        realExample: 'Type: "Warm coat for a cold weekend in Edinburgh"',
        icon: <Search size={18} />,
        gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
        color: '#3DE0FF',
        actionText: 'Try Search',
        actionType: 'search',
        exampleQuery: 'Warm coat for a cold weekend in Edinburgh',
      },
      {
        num: '02',
        name: 'Search by Photo',
        whatItDoes: 'Upload any picture or screenshot to find matching items.',
        realExample: 'Upload a photo of white sneakers from Instagram.',
        icon: <Camera size={18} />,
        gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
        color: '#8b5cf6',
        actionText: 'Try Photo Search',
        actionType: 'visual-search',
        href: '/discovery?mode=visual',
      },
      {
        num: '03',
        name: 'Natural Voice Search',
        whatItDoes: 'Talk naturally into the microphone without robotic commands.',
        realExample: '"Hey stylist, show me black overcoats under $300."',
        icon: <Mic size={18} />,
        gradient: 'linear-gradient(135deg, #0284c7, #0369a1)',
        color: '#0284c7',
        actionText: 'Try Voice Search',
        actionType: 'search',
        exampleQuery: 'black overcoats under $300',
      },
    ],
  },
  {
    icon: '👔',
    label: '2. Outfits & Perfect Fit (Styling & Sizing)',
    features: [
      {
        num: '04',
        name: '24/7 Personal Stylist Chat',
        whatItDoes: 'A private chat stylist that knows what product you are viewing.',
        realExample: 'Viewing a blazer? It suggests matching pants & shoes.',
        icon: <MessageSquare size={18} />,
        gradient: 'linear-gradient(135deg, #ec4899, #be185d)',
        color: '#ec4899',
        actionText: 'Open Chat',
        actionType: 'concierge',
        exampleQuery: 'Suggest matching pants and shoes for this blazer',
      },
      {
        num: '05',
        name: '1-Click Outfit Bundles',
        whatItDoes: 'Bundles complete head-to-toe matching looks in 1 click.',
        realExample: '1 button adds jacket, shirt, pants, and watch together.',
        icon: <Layers size={18} />,
        gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
        color: '#f59e0b',
        actionText: 'View Outfits',
        actionType: 'link',
        href: '/discovery#drops',
      },
      {
        num: '06',
        name: 'Smart Size & Fit Advisor',
        whatItDoes: 'Enter chest and waist measurements to find your exact size.',
        realExample: 'Chest 98cm + Waist 82cm → Size Medium (94% fit).',
        icon: <Ruler size={18} />,
        gradient: 'linear-gradient(135deg, #10b981, #047857)',
        color: '#10b981',
        actionText: 'Open Size Guide',
        actionType: 'link',
        href: '/size-guide',
      },
      {
        num: '07',
        name: 'Side-by-Side Comparison',
        whatItDoes: 'Compares two items side-by-side across warmth, fabric, and fit.',
        realExample: 'Choose Cashmere for winter; Fine-Knit for office.',
        icon: <Columns size={18} />,
        gradient: 'linear-gradient(135deg, #0284c7, #0369a1)',
        color: '#0284c7',
        actionText: 'Compare Items',
        actionType: 'link',
        href: '/category?open=comparison',
      },
    ],
  },
  {
    icon: '🛒',
    label: '3. Shopping Bag & Deals (Savings & Budget)',
    features: [
      {
        num: '08',
        name: 'Target-Budget Cart Builder',
        whatItDoes: 'Set a spending limit and it builds a matching wardrobe for you.',
        realExample: 'Set $500 budget → gets 3 matching pieces for $454.',
        icon: <Wallet size={18} />,
        gradient: 'linear-gradient(135deg, #10b981, #047857)',
        color: '#10b981',
        actionText: 'Build Under Budget',
        actionType: 'link',
        href: '/cart?open=budget',
      },
      {
        num: '09',
        name: 'Paste a Shopping List (Slip-to-Cart)',
        whatItDoes: 'Paste a text note and it adds all items to your bag in 1 click.',
        realExample: 'Paste: "2x cashmere sweater M, 1x leather runner 42"',
        icon: <FileText size={18} />,
        gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
        color: '#8b5cf6',
        actionText: 'Try List Scanner',
        actionType: 'link',
        href: '/cart?open=slip',
      },
      {
        num: '10',
        name: 'Proactive Discount Optimizer',
        whatItDoes: 'Automatically finds and applies the best coupon codes.',
        realExample: 'Alert: "Add $15 more to unlock 15% VIP discount!"',
        icon: <Tag size={18} />,
        gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
        color: '#f59e0b',
        actionText: 'Check Savings',
        actionType: 'link',
        href: '/cart',
      },
      {
        num: '11',
        name: 'Smart Reorder Reminders',
        whatItDoes: 'Reminds you when wardrobe essentials are running low.',
        realExample: '1-click restock popover after 60 days.',
        icon: <RefreshCw size={18} />,
        gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
        color: '#06b6d4',
        actionText: 'Open Smart List',
        actionType: 'link',
        href: '/smart-list',
      },
    ],
  },
  {
    icon: '🚚',
    label: '4. Fast Checkout & Delivery (Buying & Tracking)',
    features: [
      {
        num: '12',
        name: 'Order Directly in Chat',
        whatItDoes: 'Buy items right inside the chat without filling long forms.',
        realExample: 'Say: "Order my bag" → Confirms address and places order.',
        icon: <ShoppingBag size={18} />,
        gradient: 'linear-gradient(135deg, #ec4899, #be185d)',
        color: '#ec4899',
        actionText: 'Try Chat Order',
        actionType: 'concierge',
        exampleQuery: 'Order my bag',
      },
      {
        num: '13',
        name: 'Live 6-Stage Delivery Tracker',
        whatItDoes: 'Shows live progress from tailoring to doorstep with clear updates.',
        realExample: 'Explains: "Driver will arrive today by 3:30 PM."',
        icon: <Truck size={18} />,
        gradient: 'linear-gradient(135deg, #0284c7, #0369a1)',
        color: '#0284c7',
        actionText: 'Open Tracker',
        actionType: 'link',
        href: '/tracking',
      },
      {
        num: '14',
        name: 'Same-Day Local Delivery Gate',
        whatItDoes: 'Checks local warehouse stock for 45-minute express delivery.',
        realExample: 'Order within 1h 45m for express delivery today.',
        icon: <MapPin size={18} />,
        gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
        color: '#f59e0b',
        actionText: 'Check City Hub',
        actionType: 'delivery-gate',
        href: '/category',
      },
      {
        num: '15',
        name: '100% Private On-Device Vault',
        whatItDoes: 'Your sizes and favorites stay strictly on your phone. Never tracked or sold.',
        realExample: '1-click button on Privacy page to download or erase data.',
        icon: <ShieldCheck size={18} />,
        gradient: 'linear-gradient(135deg, #10b981, #047857)',
        color: '#10b981',
        actionText: 'Open Vault',
        actionType: 'link',
        href: '/privacy',
      },
    ],
  },
];

export function FeatureTourModal() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const openSearch = useSearchStore((state) => state.openSearch);
  const openConcierge = useConciergeStore((state) => state.openConcierge);
  const openVisualSearch = useVisualSearchStore((state) => state.openVisualSearch);
  const openDeliveryGate = useDeliveryGateStore((state) => state.openModal);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      const q = item.exampleQuery || 'Warm coat for a cold weekend in Edinburgh';
      openSearch(q, true);
    } else if (item.actionType === 'visual-search') {
      openVisualSearch();
    } else if (item.actionType === 'concierge') {
      openConcierge(item.exampleQuery);
    } else if (item.actionType === 'delivery-gate') {
      if (openDeliveryGate) {
        openDeliveryGate();
      } else if (item.href) {
        router.push(item.href);
      }
    } else if (item.href) {
      router.push(item.href);
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
          aria-label="View Smart Features"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(true)}
        >
          <span className="ai-tour-btn-dot" />
          <span>Smart Features</span>
        </button>
      )}

      {/* ─── Shopping Features Modal (#aiTourModal) ─── */}
      {mounted && isOpen && createPortal(
        <div
          id="aiTourModal"
          role="dialog"
          aria-modal="true"
          aria-label="Smart Features overview"
          data-lenis-prevent
          className="open"
        >
          {/* Backdrop click dismiss */}
          <div
            className="fixed inset-0"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Panel - 100% Parity with feature/storefront-elevation */}
          <div className="ai-tour-panel relative z-10" data-lenis-prevent>
            {/* Top Accent Gradient Bar */}
            <div className="ai-tour-panel-accent" />

            {/* Header */}
            <div className="ai-tour-panel-head">
              <div>
                <div className="ai-tour-panel-tag">
                  <span>✨ Simple &amp; Clear Overview</span>
                </div>
                <div className="ai-tour-panel-title">Smart Shopping Features</div>
                <div className="ai-tour-panel-sub">
                  15 simple tools to make finding, sizing, and buying clothes easier and faster.
                </div>
              </div>

              <button
                id="aiTourCloseBtn"
                className="ai-tour-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            {/* Feature List (4 Stages, 15 Cards) */}
            <div className="ai-tour-feature-list" data-lenis-prevent tabIndex={0}>
              {FEATURE_STAGES.map((stage, sIdx) => (
                <div key={sIdx} className="ai-tour-section-block">
                  <div className="ai-tour-section-header">
                    <span>{stage.icon}</span>
                    <span className="ai-tour-section-title">{stage.label}</span>
                    <span className="ai-tour-section-badge">{stage.features.length} Features</span>
                  </div>

                  <div className="ai-tour-cards-grid">
                    {stage.features.map((feat) => (
                      <div key={feat.num} className="ai-tour-card-box">
                        <div>
                          <div className="ai-tour-box-top">
                            <div
                              className="ai-tour-box-icon"
                              style={{ background: feat.gradient }}
                            >
                              {feat.icon}
                            </div>
                            <div className="ai-tour-box-meta">
                              <span className="ai-tour-box-num">Feature {feat.num}</span>
                              <h4 className="ai-tour-box-title">{feat.name}</h4>
                            </div>
                          </div>

                          <div className="ai-tour-box-content">
                            <div className="ai-tour-info-row">
                              <div className="ai-tour-info-label">What it does</div>
                              <p className="ai-tour-info-text">{feat.whatItDoes}</p>
                            </div>

                            <div className="ai-tour-example-box">
                              <div className="ai-tour-example-label">Real Example</div>
                              <div className="ai-tour-example-val">{feat.realExample}</div>
                            </div>
                          </div>
                        </div>

                        <div className="ai-tour-box-footer">
                          {feat.actionType === 'link' && feat.href ? (
                            <Link
                              href={feat.href}
                              onClick={() => setIsOpen(false)}
                              className="ai-tour-card-action-link"
                            >
                              <span>{feat.actionText}</span>
                              <ArrowRight size={13} />
                            </Link>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleAction(feat)}
                              className="ai-tour-card-action-btn"
                              data-tour-demo={feat.actionType === 'search' ? 'ai-search' : undefined}
                            >
                              <span>{feat.actionText}</span>
                              <ArrowRight size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
