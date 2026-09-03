'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Camera,
  Mic,
  Sparkles,
  Layers,
  Ruler,
  Scale,
  Wallet,
  FileText,
  Tag,
  RotateCcw,
  MessageSquare,
  Truck,
  Clock,
  ShieldCheck,
  ArrowRight,
  Check,
  Copy,
  BookOpen,
  ShoppingBag,
  SlidersHorizontal,
  ChevronRight,
  Zap,
  Info,
  Lock,
} from 'lucide-react';
import { useConciergeStore } from '@/store/useConciergeStore';
import { useSearchStore } from '@/store/useSearchStore';

interface FeatureItem {
  id: number;
  num: string;
  stageId: 'discovery' | 'styling' | 'budget' | 'delivery';
  title: string;
  whatItDoes: string;
  example: string;
  icon: React.ElementType;
  iconGradient: string;
  borderAccent: string;
  href: string;
  actionText: string;
  actionType?: 'link' | 'search' | 'concierge' | 'photo';
}

interface StageSection {
  id: 'discovery' | 'styling' | 'budget' | 'delivery';
  stageNumber: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  iconBoxBg: string;
  badge: string;
}

const STAGES: StageSection[] = [
  {
    id: 'discovery',
    stageNumber: '1',
    title: 'Finding What You Want (Search & Discovery)',
    subtitle: 'Natural ways to find the exact pieces you have in mind without knowing product codes.',
    icon: Search,
    iconBoxBg: 'from-sky-500/20 to-cyan-500/10 border-sky-500/30 text-sky-400',
    badge: '3 Features',
  },
  {
    id: 'styling',
    stageNumber: '2',
    title: 'Outfits & Perfect Fit (Styling & Sizing)',
    subtitle: 'Personal styling advice, coordinated looks, and fit guidance tailored to your measurements.',
    icon: Sparkles,
    iconBoxBg: 'from-pink-500/20 to-rose-500/10 border-pink-500/30 text-pink-400',
    badge: '4 Features',
  },
  {
    id: 'budget',
    stageNumber: '3',
    title: 'Shopping Bag & Deals (Savings & Budget)',
    subtitle: 'Automated budget balancing, shopping list import, and maximum voucher savings.',
    icon: ShoppingBag,
    iconBoxBg: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
    badge: '4 Features',
  },
  {
    id: 'delivery',
    stageNumber: '4',
    title: 'Fast Checkout & Delivery (Buying & Tracking)',
    subtitle: 'Frictionless purchasing, live courier progress, local store fulfillment, and total privacy.',
    icon: Truck,
    iconBoxBg: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    badge: '4 Features',
  },
];

const FEATURES: FeatureItem[] = [
  // STAGE 1
  {
    id: 1,
    num: 'Feature 01',
    stageId: 'discovery',
    title: 'Smart Voice & Text Search',
    whatItDoes: 'Type or speak in everyday phrases. It understands what you need (warmth, price, occasion, colour) without needing exact product names.',
    example: '"Warm wool coat for an evening winter dinner under £250"',
    icon: Search,
    iconGradient: 'from-cyan-500 to-blue-600',
    borderAccent: 'hover:border-cyan-400/50',
    href: '/discovery',
    actionText: 'Try Smart Search',
    actionType: 'search',
  },
  {
    id: 2,
    num: 'Feature 02',
    stageId: 'discovery',
    title: 'Search by Photo',
    whatItDoes: 'Upload a snapshot from social media or a street style photo to instantly find matching clothing, footwear, and accessories in the store.',
    example: 'Upload a photo of white leather trainers to find the closest match in our catalogue.',
    icon: Camera,
    iconGradient: 'from-purple-500 to-indigo-600',
    borderAccent: 'hover:border-purple-400/50',
    href: '/discovery?mode=visual',
    actionText: 'Try Photo Search',
    actionType: 'search',
  },
  {
    id: 3,
    num: 'Feature 03',
    stageId: 'discovery',
    title: 'Natural Voice Search',
    whatItDoes: 'Speak naturally into your microphone. It filters out pauses and filler words, then reads back a concise, helpful summary of matching pieces.',
    example: '"Show me tailored navy wool blazers and trousers under £300."',
    icon: Mic,
    iconGradient: 'from-sky-500 to-cyan-600',
    borderAccent: 'hover:border-sky-400/50',
    href: '/discovery?mode=voice',
    actionText: 'Try Voice Search',
    actionType: 'search',
  },

  // STAGE 2
  {
    id: 4,
    num: 'Feature 04',
    stageId: 'styling',
    title: '24/7 Personal Stylist',
    whatItDoes: 'A dedicated style assistant that knows which piece you are viewing and offers instant coordination advice, fabric care, and sizing suggestions.',
    example: 'Viewing a merino knitwear piece? The stylist suggests matching tailored trousers and care tips.',
    icon: MessageSquare,
    iconGradient: 'from-rose-500 to-pink-600',
    borderAccent: 'hover:border-rose-400/50',
    href: '/concierge',
    actionText: 'Open Stylist Chat',
    actionType: 'concierge',
  },
  {
    id: 5,
    num: 'Feature 05',
    stageId: 'styling',
    title: '1-Click Complete Outfits',
    whatItDoes: 'Puts together complete head-to-toe coordinated looks (jacket + knitwear + trousers + footwear) and lets you add the full set in a single tap.',
    example: 'Select "City Weekend Capsule" to bundle overcoat, cashmere crewneck, and trainers together.',
    icon: Layers,
    iconGradient: 'from-amber-500 to-orange-600',
    borderAccent: 'hover:border-amber-400/50',
    href: '/product/1',
    actionText: 'View Outfits',
    actionType: 'link',
  },
  {
    id: 6,
    num: 'Feature 06',
    stageId: 'styling',
    title: 'Precise Size & Fit Guide',
    whatItDoes: 'Enter your chest and waist measurements to find your recommended size and see whether the garment drapes in a tailored or relaxed fit.',
    example: 'Chest 98 cm + Waist 82 cm → Recommended Size Medium (94% fit match).',
    icon: Ruler,
    iconGradient: 'from-emerald-500 to-teal-600',
    borderAccent: 'hover:border-emerald-400/50',
    href: '/product/1',
    actionText: 'Open Size Guide',
    actionType: 'link',
  },
  {
    id: 7,
    num: 'Feature 07',
    stageId: 'styling',
    title: 'Side-by-Side Comparison',
    whatItDoes: 'Compares two similar garments side by side on fabric warmth, material composition, and price, with a clear summary on which one to choose.',
    example: '"Choose Cashmere for cold winter evenings; choose Fine-Knit Merino for climate-controlled offices."',
    icon: Scale,
    iconGradient: 'from-cyan-500 to-blue-600',
    borderAccent: 'hover:border-cyan-400/50',
    href: '/category',
    actionText: 'Compare Items',
    actionType: 'link',
  },

  // STAGE 3
  {
    id: 8,
    num: 'Feature 08',
    stageId: 'budget',
    title: 'Target-Budget Wardrobe Builder',
    whatItDoes: 'Set a total spending limit (e.g. £500), and it automatically curates a complete matching wardrobe that stays strictly within your budget.',
    example: 'Set £500 limit → selects wool jumper + trousers + leather bag = £454 (£46 budget left over).',
    icon: Wallet,
    iconGradient: 'from-emerald-500 to-teal-600',
    borderAccent: 'hover:border-emerald-400/50',
    href: '/cart',
    actionText: 'Build Within Budget',
    actionType: 'link',
  },
  {
    id: 9,
    num: 'Feature 09',
    stageId: 'budget',
    title: 'Paste a Shopping List (Slip-to-Cart)',
    whatItDoes: 'Paste unformatted text messages or notes, and it instantly identifies each item, colour, size, and quantity, adding them directly to your bag.',
    example: 'Paste: "2x merino wool sweater in charcoal size M, 1x white leather runners 42"',
    icon: FileText,
    iconGradient: 'from-purple-500 to-indigo-600',
    borderAccent: 'hover:border-purple-400/50',
    href: '/cart',
    actionText: 'Try List Scanner',
    actionType: 'link',
  },
  {
    id: 10,
    num: 'Feature 10',
    stageId: 'budget',
    title: 'Automatic Best-Offer Finder',
    whatItDoes: 'Calculates the optimal voucher combination and notifies you if adding a small accessory unlocks a higher tier discount for greater total savings.',
    example: 'Notification: "Add £15 more to unlock 15% VIP discount (saving £35+ net on your order)!"',
    icon: Tag,
    iconGradient: 'from-amber-500 to-yellow-600',
    borderAccent: 'hover:border-amber-400/50',
    href: '/cart',
    actionText: 'Check Savings',
    actionType: 'link',
  },
  {
    id: 11,
    num: 'Feature 11',
    stageId: 'budget',
    title: 'Wardrobe Restock Reminders',
    whatItDoes: 'Learns your wardrobe replenishment cycles and gently reminds you when staple pieces (like t-shirts or knitwear) are due for restocking.',
    example: '1-tap restock prompt after 60 days with your exact saved colour and size.',
    icon: RotateCcw,
    iconGradient: 'from-cyan-500 to-teal-600',
    borderAccent: 'hover:border-cyan-400/50',
    href: '/smart-list',
    actionText: 'Open Smart List',
    actionType: 'link',
  },

  // STAGE 4
  {
    id: 12,
    num: 'Feature 12',
    stageId: 'delivery',
    title: 'Order Directly in Chat',
    whatItDoes: 'Confirm and place your order directly inside the styling assistant with your saved delivery address in 3 taps, without filling web forms.',
    example: 'Type "Confirm my order" → confirms saved address and dispatches your order immediately.',
    icon: ShoppingBag,
    iconGradient: 'from-rose-500 to-pink-600',
    borderAccent: 'hover:border-rose-400/50',
    href: '/concierge',
    actionText: 'Try Chat Ordering',
    actionType: 'concierge',
  },
  {
    id: 13,
    num: 'Feature 13',
    stageId: 'delivery',
    title: 'Live 6-Stage Delivery Tracker',
    whatItDoes: 'An interactive live timeline displaying each milestone of your order, accompanied by clear courier progress updates in plain English.',
    example: 'Status: "Parcel arrived at local fulfillment depot. Courier scheduled for delivery today by 15:30."',
    icon: Truck,
    iconGradient: 'from-sky-500 to-blue-600',
    borderAccent: 'hover:border-sky-400/50',
    href: '/tracking',
    actionText: 'Open Live Tracker',
    actionType: 'link',
  },
  {
    id: 14,
    num: 'Feature 14',
    stageId: 'delivery',
    title: 'Same-Day Local Delivery Countdown',
    whatItDoes: 'Verifies real-time boutique and warehouse stock in your city to show exact same-day delivery dispatch timers so you know when it arrives.',
    example: '"Order within 1 hr 45 mins for 45-minute express local delivery to your door today."',
    icon: Clock,
    iconGradient: 'from-amber-500 to-orange-600',
    borderAccent: 'hover:border-amber-400/50',
    href: '/category',
    actionText: 'Check City Delivery',
    actionType: 'link',
  },
  {
    id: 15,
    num: 'Feature 15',
    stageId: 'delivery',
    title: '100% Private On-Device Vault',
    whatItDoes: 'Your style preferences, measurements, and shopping items are stored exclusively on your device. Never uploaded, tracked, or shared.',
    example: '1-tap control on the Privacy page to export or permanently clear your saved browsing signals.',
    icon: ShieldCheck,
    iconGradient: 'from-emerald-500 to-green-600',
    borderAccent: 'hover:border-emerald-400/50',
    href: '/privacy',
    actionText: 'Open Privacy Vault',
    actionType: 'link',
  },
];

export default function GuidePage() {
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const { openConcierge } = useConciergeStore();

  const handleCopyExample = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleActionClick = (feature: FeatureItem, e: React.MouseEvent) => {
    if (feature.actionType === 'concierge') {
      e.preventDefault();
      openConcierge(feature.example.replace(/^["']|["']$/g, ''));
    } else if (feature.actionType === 'search') {
      e.preventDefault();
      const cleanQuery = feature.example.replace(/^["']|["']$/g, '');
      useSearchStore.getState().openSearch(cleanQuery, true);
    }
  };

  // Filter features based on stage & search query
  const filteredFeatures = useMemo(() => {
    return FEATURES.filter((f) => {
      const matchesStage = selectedStage === 'all' || f.stageId === selectedStage;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        f.title.toLowerCase().includes(q) ||
        f.whatItDoes.toLowerCase().includes(q) ||
        f.example.toLowerCase().includes(q) ||
        f.num.toLowerCase().includes(q);
      return matchesStage && matchesSearch;
    });
  }, [selectedStage, searchQuery]);

  // Group filtered features by stage
  const visibleStages = useMemo(() => {
    return STAGES.map((stage) => {
      const stageFeatures = filteredFeatures.filter((f) => f.stageId === stage.id);
      return {
        ...stage,
        features: stageFeatures,
      };
    }).filter((stage) => stage.features.length > 0);
  }, [filteredFeatures]);

  return (
    <div className="min-h-screen bg-[#001229] text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8 selection:bg-[#3DE0FF]/30 selection:text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* HERO SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3DE0FF]/10 border border-[#3DE0FF]/25 text-[#3DE0FF] text-xs font-bold uppercase tracking-wider mb-4 shadow-[0_0_20px_rgba(61,224,255,0.15)]">
            <Sparkles size={13} className="animate-pulse" />
            <span>Simple &amp; Clear Overview</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Every Smart Feature in 4 Simple Stages
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Everything you need to know about how nexCommerce makes shopping faster, simpler, and tailored to your personal style.
          </p>

          {/* Quick Metrics Strip */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#3DE0FF] animate-ping" />
              <span className="font-semibold text-white">15 Elevated Features</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
              <Layers size={13} className="text-pink-400" />
              <span className="font-semibold text-white">4 Shopping Stages</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
              <Lock size={13} className="text-emerald-400" />
              <span className="font-semibold text-white">100% On-Device Privacy</span>
            </div>
          </div>
        </motion.div>

        {/* CONTROLS BAR: STAGE FILTER TABS & SEARCH */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="sticky top-20 z-30 mb-10 p-2 sm:p-3 rounded-2xl bg-[#01142e]/90 backdrop-blur-2xl border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center justify-between gap-3"
        >
          {/* Stage Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedStage('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                selectedStage === 'all'
                  ? 'bg-white text-[#001229] shadow-lg shadow-white/10 scale-105'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>All Features</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${selectedStage === 'all' ? 'bg-[#001229]/15 text-[#001229]' : 'bg-white/10 text-slate-300'}`}>
                15
              </span>
            </button>

            {STAGES.map((stage) => {
              const isActive = selectedStage === stage.id;
              const count = FEATURES.filter((f) => f.stageId === stage.id).length;
              return (
                <button
                  key={stage.id}
                  onClick={() => setSelectedStage(stage.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#3DE0FF] text-[#001229] font-bold shadow-lg shadow-[#3DE0FF]/20 scale-105'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{stage.stageNumber}. {stage.title.split('(')[0].trim()}</span>
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${isActive ? 'bg-[#001229]/20 text-[#001229]' : 'bg-white/10 text-slate-300'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-64 shrink-0">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search guide..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.06] hover:bg-white/[0.09] focus:bg-[#021838] border border-white/15 focus:border-[#3DE0FF] rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder:text-slate-400 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs px-1"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </motion.div>

        {/* STAGES LIST */}
        <div className="space-y-16">
          {visibleStages.length === 0 ? (
            <div className="text-center py-20 bg-white/[0.02] border border-white/10 rounded-3xl p-8">
              <Info size={36} className="mx-auto text-[#3DE0FF] mb-3 opacity-60" />
              <h3 className="text-lg font-bold text-white mb-1">No features found</h3>
              <p className="text-xs text-slate-400 mb-4">No feature matches your search &quot;{searchQuery}&quot;.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedStage('all');
                }}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            visibleStages.map((stage, stageIdx) => {
              const StageIcon = stage.icon;
              return (
                <motion.section
                  key={stage.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: stageIdx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-6"
                >
                  {/* Stage Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center bg-gradient-to-br ${stage.iconBoxBg}`}>
                        <StageIcon size={20} />
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                          {stage.stageNumber}. {stage.title}
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
                          {stage.subtitle}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-400 bg-white/[0.05] border border-white/10 px-3 py-1 rounded-full self-start sm:self-center">
                      {stage.features.length} {stage.features.length === 1 ? 'Feature' : 'Features'}
                    </span>
                  </div>

                  {/* 3-Column Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {stage.features.map((feature, featIdx) => {
                      const FeatIcon = feature.icon;
                      const isCopied = copiedId === feature.id;

                      return (
                        <motion.div
                          key={feature.id}
                          whileHover={{ y: -4, transition: { duration: 0.2 } }}
                          className={`group bg-[#061e3d]/80 hover:bg-[#0b284e] border border-white/10 ${feature.borderAccent} rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.45)] relative overflow-hidden`}
                        >
                          {/* Ambient Glow */}
                          <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] group-hover:bg-[#3DE0FF]/[0.05] rounded-full blur-2xl pointer-events-none transition-colors" />

                          <div>
                            {/* Card Top */}
                            <div className="flex items-start gap-3.5 mb-4">
                              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.iconGradient} flex items-center justify-center text-white shadow-lg shrink-0`}>
                                <FeatIcon size={20} />
                              </div>
                              <div className="min-w-0">
                                <div className="text-[11px] font-bold uppercase tracking-wider text-[#3DE0FF]">
                                  {feature.num}
                                </div>
                                <h3 className="text-base font-bold text-white mt-0.5 group-hover:text-white transition-colors leading-snug">
                                  {feature.title}
                                </h3>
                              </div>
                            </div>

                            {/* What it does */}
                            <div className="space-y-1.5 mb-4">
                              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                What it does
                              </div>
                              <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed">
                                {feature.whatItDoes}
                              </p>
                            </div>

                            {/* Real Example Box */}
                            <div
                              onClick={() => handleCopyExample(feature.id, feature.example)}
                              className="group/ex bg-[#001229]/70 hover:bg-[#001229] border border-dashed border-white/15 hover:border-[#3DE0FF]/40 rounded-xl p-3 mb-4 cursor-pointer transition-colors relative"
                              title="Click to copy example"
                            >
                              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#3DE0FF] mb-1.5">
                                <span className="flex items-center gap-1.5">
                                  <Zap size={11} className="text-[#3DE0FF]" />
                                  Real Example
                                </span>
                                <span className="text-slate-400 group-hover/ex:text-white flex items-center gap-1 text-[10px] font-normal normal-case">
                                  {isCopied ? (
                                    <>
                                      <Check size={11} className="text-emerald-400" />
                                      <span className="text-emerald-400 font-semibold">Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy size={11} />
                                      <span>Copy</span>
                                    </>
                                  )}
                                </span>
                              </div>
                              <div className="text-xs text-slate-200 font-medium leading-relaxed italic">
                                {feature.example}
                              </div>
                            </div>
                          </div>

                          {/* Card Footer CTA */}
                          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                            <span className="text-[11px] text-slate-400 font-medium">
                              Try in Store
                            </span>
                            <Link
                              href={feature.href}
                              onClick={(e) => handleActionClick(feature, e)}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3DE0FF] hover:text-white group-hover:underline transition-all"
                            >
                              <span>{feature.actionText}</span>
                              <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                            </Link>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.section>
              );
            })
          )}
        </div>

        {/* BOTTOM CALL TO ACTION BANNER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#061e3d] via-[#0b284e] to-[#061e3d] border border-white/15 text-center relative overflow-hidden shadow-2xl"
        >
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#3DE0FF]/10 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 tracking-tight">
            Ready to Experience the Collection?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mb-6 leading-relaxed">
            Explore curated autumn/winter tailoring, smart outfit bundles, and instant private stylist advice with zero friction.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/discovery"
              className="px-5 py-2.5 rounded-xl bg-[#3DE0FF] hover:bg-[#32c5e2] text-[#001229] text-xs font-bold transition-all transform hover:-translate-y-0.5 shadow-lg shadow-[#3DE0FF]/25 flex items-center gap-2"
            >
              <Search size={14} />
              <span>Explore Collection</span>
            </Link>

            <button
              onClick={() => openConcierge()}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all border border-white/15 hover:border-white/30 flex items-center gap-2"
            >
              <Sparkles size={14} className="text-[#F13365]" />
              <span>Ask Personal Stylist</span>
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
