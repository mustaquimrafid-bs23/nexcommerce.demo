'use client';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Sparkles,
  Camera,
  ShoppingBag,
  ArrowRight,
  Eye,
  Plus,
  CheckCircle2,
  SlidersHorizontal,
  X,
  Check,
  Mic,
} from 'lucide-react';
import { MASTER_PRODUCTS } from '@/data/products';
import { useCartStore } from '@/store/useCartStore';
import { Product } from '@/types/catalog';
import { formatPrice } from '@/lib/utils';

import { useVisualSearchStore } from '@/store/useVisualSearchStore';
import { useSearchStore } from '@/store/useSearchStore';

const AESTHETIC_SPHERES = [
  { id: 'all', label: 'All Spheres', color: '#FFFFFF' },
  { id: 'quiet-luxury', label: 'Quiet Luxury', color: '#E2E8F0' },
  { id: 'alpine-thermal', label: 'Alpine Thermal', color: '#3DE0FF' },
  { id: 'nordic-minimal', label: 'Nordic Minimal', color: '#F59E0B' },
  { id: 'nocturne-acoustic', label: 'Nocturne Acoustic', color: '#A855F7' },
  { id: 'transit-leisure', label: 'Transit Leisure', color: '#10B981' },
];

const QUICK_INTENTS = [
  { label: 'Leather sneakers', query: 'sneakers' },
  { label: 'Cashmere knitwear', query: 'cashmere' },
  { label: 'Studio acoustics', query: 'audio' },
  { label: 'Quiet luxury', query: 'tailored' },
];

const HOTSPOTS = [
  {
    id: 'hotspot-1',
    top: '32%',
    left: '48%',
    product: MASTER_PRODUCTS[0], // Cashmere Sweater
    label: 'Pure Cashmere Knit',
  },
  {
    id: 'hotspot-2',
    top: '54%',
    left: '52%',
    product: MASTER_PRODUCTS[1], // Tailored Blazer
    label: 'Italian Virgin Wool',
  },
  {
    id: 'hotspot-3',
    top: '80%',
    left: '55%',
    product: MASTER_PRODUCTS[5], // Leather Runner
    label: 'Calfskin Minimalist Runner',
  },
];

export interface CapsulePiece {
  name: string;
  price: string;
  id: string;
}

export interface OutfitCapsule {
  id: string;
  badge: string;
  title: string;
  desc: string;
  image: string;
  bundleIds: string[];
  keywords: string;
  pieces: CapsulePiece[];
  totalLabel: string;
  totalVal: string;
}

export const OUTFIT_CAPSULES: OutfitCapsule[] = [
  {
    id: 'capsule-1',
    badge: 'CAPSULE 01 · EVENING',
    title: 'The Milan Evening Look',
    desc: 'Breathable cashmere knitwear paired with studio acoustics and leather transit carryall.',
    image: '/assets/images/lifestyle/hero_sweater_landscape.jpg',
    bundleIds: ['p1', 'p4', 'p7'],
    keywords: 'milan evening cashmere sweater headphones tote quiet luxury winter',
    pieces: [
      { name: 'Cashmere Sweater', price: '€ 185.00', id: 'p1' },
      { name: 'Studio Spatial Headphones', price: '€ 320.00', id: 'p4' },
      { name: 'Leather Weekender Tote', price: '€ 285.00', id: 'p7' },
    ],
    totalLabel: 'Capsule Total (3 Pieces)',
    totalVal: '€ 790.00',
  },
  {
    id: 'capsule-2',
    badge: 'CAPSULE 02 · MOVEMENT',
    title: 'Minimalist Urban Rotation',
    desc: 'Structured tailoring engineered with Italian calfskin low-tops for quiet city mobility.',
    image: '/assets/images/lifestyle/hero_runner_landscape.jpg',
    bundleIds: ['p2', 'p6'],
    keywords: 'minimalist urban movement runner sneakers blazer calfskin quiet city mobility',
    pieces: [
      { name: 'Structured Wool Blazer', price: '€ 245.00', id: 'p2' },
      { name: 'Minimalist Leather Runner', price: '€ 195.00', id: 'p6' },
    ],
    totalLabel: 'Capsule Total (2 Pieces)',
    totalVal: '€ 440.00',
  },
  {
    id: 'capsule-3',
    badge: 'CAPSULE 03 · TRANSIT',
    title: 'Long-Haul Flight Comfort',
    desc: 'Full-grain leather carryall and ultra-soft knitwear for effortless transit hours.',
    image: '/assets/images/lifestyle/hero_tote_landscape.jpg',
    bundleIds: ['p1', 'p7'],
    keywords: 'long haul flight comfort transit tote sweater carryall knitwear',
    pieces: [
      { name: 'Cashmere Knit Sweater', price: '€ 185.00', id: 'p1' },
      { name: 'Leather Weekender Tote', price: '€ 285.00', id: 'p7' },
    ],
    totalLabel: 'Capsule Total (2 Pieces)',
    totalVal: '€ 470.00',
  },
  {
    id: 'capsule-4',
    badge: 'CAPSULE 04 · WINTER TAILORING',
    title: 'Alpine Winter & Tailored Layers',
    desc: 'Double-faced cashmere overcoat layered with virgin wool knitwear for effortless winter evenings.',
    image: '/assets/images/lifestyle/hero_sweater_landscape.jpg',
    bundleIds: ['p3', 'p1'],
    keywords: 'overcoat overcoats coat coats winter black charcoal tailoring cashmere warm outerwear alpine under $300',
    pieces: [
      { name: 'Tailored Charcoal Overcoat', price: '€ 280.00', id: 'p3' },
      { name: 'Cashmere Turtleneck Sweater', price: '€ 185.00', id: 'p1' },
    ],
    totalLabel: 'Capsule Total (2 Pieces)',
    totalVal: '€ 465.00',
  },
];

function DiscoveryContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [selectedSphere, setSelectedSphere] = useState('all');
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [bundleAdded, setBundleAdded] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const openVisualSearch = useVisualSearchStore((state) => state.openVisualSearch);
  const openVoiceSearch = useSearchStore((state) => state.openVoiceSearch);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  // Handle direct navigation to #drops anchor
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#drops') {
      setTimeout(() => {
        const el = document.getElementById('drops');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 350);
    }
  }, []);

  useEffect(() => {
    const mode = searchParams?.get('mode');
    const visual = searchParams?.get('visual');
    if (mode === 'visual' || visual === '1') {
      const look = searchParams?.get('look');
      openVisualSearch(look || undefined);
    } else if (mode === 'voice' || mode === 'audio') {
      openVoiceSearch(true);
    }
  }, [searchParams, openVisualSearch, openVoiceSearch]);

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    addItem(product);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1400);
  };

  // 1-Click Capsule Bundle Add (Feature 05)
  const addBundle = (ids: string[], capsuleId: string) => {
    let addedCount = 0;
    ids.forEach((id) => {
      const prod = MASTER_PRODUCTS.find((p) => p.id === id);
      if (prod) {
        addItem(prod);
        addedCount++;
      }
    });

    setBundleAdded((prev) => ({ ...prev, [capsuleId]: true }));
    setTimeout(() => {
      setBundleAdded((prev) => ({ ...prev, [capsuleId]: false }));
    }, 2000);

    setToastMessage(`Added ${addedCount} capsule pieces to your shopping bag!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Filter Outfit Drops according to search query
  const visibleCapsules = useMemo(() => {
    if (!query.trim()) return OUTFIT_CAPSULES;
    const qLower = query.toLowerCase().trim();
    const terms = qLower.split(/\s+/).filter((t) => t.length > 2);
    const matches = OUTFIT_CAPSULES.filter((cap) => {
      const keywords = cap.keywords.toLowerCase();
      const title = cap.title.toLowerCase();
      const desc = cap.desc.toLowerCase();
      const pieces = cap.pieces.map((p) => p.name.toLowerCase()).join(' ');
      const haystack = `${keywords} ${title} ${desc} ${pieces}`;
      return haystack.includes(qLower) || terms.some((t) => haystack.includes(t));
    });
    return matches.length > 0 ? matches : OUTFIT_CAPSULES;
  }, [query]);

  // Extract individual keywords as removable context pills (filtering stop words)
  const contextPills = useMemo(() => {
    if (!query.trim()) return [];
    const STOPWORDS = new Set([
      'for', 'a', 'an', 'in', 'and', 'the', 'with', 'under', 'to', 'of', 'on', 'at', 'is', 'by', 'or', 'from'
    ]);
    return query
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w.toLowerCase()))
      .map((w) => ({
        tag: w,
        label: w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
      }));
  }, [query]);

  const removeContextPill = (tagToRemove: string) => {
    const remaining = query
      .split(/\s+/)
      .filter((w) => w.toLowerCase() !== tagToRemove.toLowerCase())
      .join(' ');
    setQuery(remaining);
  };

  // Filter products by sphere and query with intelligent intent and token matching
  const filteredProducts = useMemo(() => {
    let list = [...MASTER_PRODUCTS];

    if (selectedSphere !== 'all') {
      if (selectedSphere === 'quiet-luxury') {
        list = list.filter((p) => p.category === 'apparel' || p.category === 'accessories' || p.tags?.includes('quiet luxury'));
      } else if (selectedSphere === 'alpine-thermal') {
        list = list.filter((p) => p.category === 'outerwear' || (p.tags && (p.tags.includes('warm') || p.tags.includes('winter'))));
      } else if (selectedSphere === 'nordic-minimal') {
        list = list.filter((p) => p.tags && (p.tags.includes('minimal') || p.tags.includes('leather')));
      } else if (selectedSphere === 'nocturne-acoustic') {
        list = list.filter((p) => p.category === 'acoustics' || p.category === 'audio');
      } else if (selectedSphere === 'transit-leisure') {
        list = list.filter((p) => p.category === 'footwear' || p.category === 'accessories');
      }
    }

    if (!query.trim()) {
      return list;
    }

    const q = query.toLowerCase().trim();
    const intent = useSearchStore.getState().parseIntent(q);

    // Stop words to exclude from keyword extraction
    const STOP_WORDS = new Set([
      'for', 'a', 'an', 'in', 'and', 'the', 'with', 'under', 'less', 'than', 'to', 'of',
      'on', 'at', 'is', 'by', 'or', 'from', 'me', 'show', 'looking', 'find', 'pieces',
      'items', 'products', 'something', 'like', 'hey', 'stylist', 'i', 'want', 'need', 'please'
    ]);

    // Raw tokens without currency symbols or punctuation
    const rawTokens = q
      .replace(/[€$£?,.!]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 1 && !STOP_WORDS.has(t) && !/^\d+$/.test(t));

    // Token stemming: generate both singular & plural variations
    const expandedTerms = new Set<string>();
    rawTokens.forEach((term) => {
      expandedTerms.add(term);
      if (term.endsWith('ies')) {
        expandedTerms.add(term.slice(0, -3) + 'y');
      } else if (term.endsWith('es')) {
        expandedTerms.add(term.slice(0, -2));
      } else if (term.endsWith('s')) {
        expandedTerms.add(term.slice(0, -1));
      } else {
        expandedTerms.add(term + 's');
      }
    });
    const terms = Array.from(expandedTerms);

    // Filter products matching intent & keywords
    let matched = list.filter((p) => {
      // 1. Direct whole-query match
      const inName = p.name.toLowerCase().includes(q);
      const inBrand = (p.brand || '').toLowerCase().includes(q);
      const inCat = p.category.toLowerCase().includes(q) || (p.subCategory || '').toLowerCase().includes(q);
      const inDesc = p.description.toLowerCase().includes(q);
      const inTags = p.tags ? p.tags.some((t) => t.toLowerCase().includes(q) || q.includes(t.toLowerCase())) : false;
      const inColor = p.colors ? p.colors.some((c) => c.name.toLowerCase().includes(q) || q.includes(c.name.toLowerCase())) : false;
      if (inName || inBrand || inCat || inDesc || inTags || inColor) {
        return true;
      }

      // 2. Target Category Intent Match
      let categoryMatch = false;
      if (intent.targetCategory) {
        const cat = intent.targetCategory.toLowerCase();
        if (cat === 'outerwear') {
          categoryMatch =
            p.category === 'outerwear' ||
            Boolean(p.subCategory && p.subCategory.toLowerCase().includes('coat')) ||
            Boolean(p.tags && p.tags.some((t) => t.includes('coat') || t.includes('overcoat') || t.includes('outerwear') || t.includes('blazer')));
        } else if (cat === 'apparel') {
          categoryMatch = p.category === 'apparel' || Boolean(p.tags && p.tags.includes('apparel'));
        } else if (cat === 'audio') {
          categoryMatch = p.category === 'acoustics' || Boolean(p.tags && p.tags.includes('audio'));
        } else if (cat === 'footwear') {
          categoryMatch = p.category === 'footwear' || Boolean(p.tags && p.tags.includes('footwear'));
        } else if (cat === 'accessories') {
          categoryMatch = p.category === 'accessories';
        }
      }

      // 3. Keyword / Term matches across name, tags, description, category, colors
      const termMatch = terms.some((term) => {
        return (
          p.name.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term) ||
          Boolean(p.subCategory && p.subCategory.toLowerCase().includes(term)) ||
          Boolean(p.tags && p.tags.some((t) => t.toLowerCase().includes(term) || term.includes(t.toLowerCase()))) ||
          p.description.toLowerCase().includes(term) ||
          Boolean(p.colors && p.colors.some((c) => c.name.toLowerCase().includes(term) || term.includes(c.name.toLowerCase())))
        );
      });

      return categoryMatch || termMatch;
    });

    // 4. Narrow to target category if products match
    if (intent.targetCategory) {
      const cat = intent.targetCategory.toLowerCase();
      const categoryOnly = matched.filter((p) => {
        if (cat === 'outerwear') {
          return (
            p.category === 'outerwear' ||
            Boolean(p.subCategory && p.subCategory.toLowerCase().includes('coat')) ||
            Boolean(p.tags && p.tags.some((t) => t.includes('coat') || t.includes('overcoat') || t.includes('outerwear') || t.includes('blazer')))
          );
        } else if (cat === 'apparel') {
          return p.category === 'apparel' || Boolean(p.tags && p.tags.includes('apparel'));
        } else if (cat === 'audio') {
          return p.category === 'acoustics' || Boolean(p.tags && p.tags.includes('audio'));
        } else if (cat === 'footwear') {
          return p.category === 'footwear' || Boolean(p.tags && p.tags.includes('footwear'));
        } else if (cat === 'accessories') {
          return p.category === 'accessories';
        }
        return true;
      });
      if (categoryOnly.length > 0) {
        matched = categoryOnly;
      }
    }

    // 5. Budget Constraint Filtering
    if (intent.budgetMax) {
      const budgetMatched = matched.filter((p) => p.price <= intent.budgetMax!);
      if (budgetMatched.length > 0) {
        matched = budgetMatched;
      }
    }

    // 5. Intelligent Fallback: if zero results, return closest matching items from catalog
    if (matched.length === 0) {
      matched = list.filter((p) => {
        return terms.some(
          (t) =>
            p.name.toLowerCase().includes(t) ||
            (p.tags && p.tags.some((tag) => tag.toLowerCase().includes(t))) ||
            (p.colors && p.colors.some((c) => c.name.toLowerCase().includes(t)))
        );
      });
    }

    // If still zero, show top atelier pieces so user never sees an empty screen
    if (matched.length === 0) {
      matched = list.slice(0, 4);
    }

    // Sort by relevance score
    return matched.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      // Prioritize direct budget match
      if (intent.budgetMax) {
        if (a.price <= intent.budgetMax) scoreA += 20;
        if (b.price <= intent.budgetMax) scoreB += 20;
      }

      // Prioritize target category
      if (intent.targetCategory) {
        const cat = intent.targetCategory.toLowerCase();
        if (cat === 'outerwear') {
          if (a.category === 'outerwear' || a.tags?.includes('overcoat')) scoreA += 30;
          if (b.category === 'outerwear' || b.tags?.includes('overcoat')) scoreB += 30;
        }
      }

      // Prioritize specific term hits
      terms.forEach((term) => {
        if (a.name.toLowerCase().includes(term)) scoreA += 15;
        if (b.name.toLowerCase().includes(term)) scoreB += 15;
        if (a.tags?.some((t) => t.toLowerCase() === term)) scoreA += 10;
        if (b.tags?.some((t) => t.toLowerCase() === term)) scoreB += 10;
        if (a.colors?.some((c) => c.name.toLowerCase().includes(term))) scoreA += 10;
        if (b.colors?.some((c) => c.name.toLowerCase().includes(term))) scoreB += 10;
      });

      return scoreB - scoreA;
    });
  }, [query, selectedSphere]);

  return (
    <div
      className="min-h-screen pb-24 text-white"
      style={{
        background: 'radial-gradient(circle at 50% 0%, #031838 0%, #011126 50%, #000B1A 100%)',
      }}
    >
      {/* Hero Section */}
      <section className="pt-12 pb-14 px-4 sm:px-6 lg:px-8 border-b border-white/10 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/25 text-xs font-semibold text-accent-cyan tracking-widest uppercase">
            <Sparkles size={12} />
            <span>Visual Discovery &amp; Outfits</span>
          </div>

          <h1 className="font-sans text-4xl sm:text-6xl font-bold tracking-tight text-white">
            Visual Discovery <span className="font-editorial italic font-normal text-slate-300">&amp; Moodboards</span>
          </h1>

          <p className="text-sm sm:text-base text-[#94a3b8] max-w-xl mx-auto leading-relaxed">
            Explore luxury pieces through tactile moodboards, styled outfit drops, and aesthetic realm lenses.
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto space-y-3 pt-2">
            <div className="flex items-center gap-2 p-1.5 pl-4 rounded-full bg-white/5 border border-white/15 focus-within:border-accent-cyan/50 focus-within:ring-2 focus-within:ring-accent-cyan/20 focus-within:bg-[#031838]/80 backdrop-blur-xl transition-all shadow-xl">
              <Search size={18} className="text-white/40 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search aesthetics, occasions, or materials (e.g. Leather runner sneakers, Winter cashmere coat)..."
                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 text-white/40 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              )}

              <button
                type="button"
                id="discoveryVoiceSearchBtn"
                onClick={() => openVoiceSearch(true)}
                className="p-2 text-white/60 hover:text-accent-pink transition-colors cursor-pointer"
                title="Natural Voice Search (Feature 03)"
                aria-label="Natural Voice Search"
              >
                <Mic size={16} />
              </button>

              <button
                type="button"
                id="discoveryVisualSearchBtn"
                onClick={() => openVisualSearch()}
                className="p-2 text-white/60 hover:text-accent-cyan transition-colors cursor-pointer"
                title="Search by Photo (Visual Search)"
                aria-label="Search by Photo"
              >
                <Camera size={16} />
              </button>

              <button
                type="button"
                onClick={() => setQuery(query || 'cashmere')}
                className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-200 text-obsidian-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer flex-shrink-0"
              >
                <span>Explore</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Removable Understood Context Pills */}
            {contextPills.length > 0 && (
              <div className="flex items-center justify-center gap-1.5 flex-wrap pt-1 text-xs animate-fade-in">
                <span className="text-[10px] font-mono uppercase tracking-wider text-accent-cyan mr-1">
                  Understood Context:
                </span>
                {contextPills.map((pill) => (
                  <span
                    key={pill.tag}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-accent-cyan/15 border border-accent-cyan/30 text-accent-cyan text-[11px] font-semibold"
                  >
                    <span>{pill.label}</span>
                    <button
                      type="button"
                      onClick={() => removeContextPill(pill.tag)}
                      className="hover:text-white transition-colors p-0.5"
                      aria-label={`Remove filter ${pill.label}`}
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Quick Intent Chips */}
            <div className="flex items-center justify-center gap-2 flex-wrap pt-1 text-xs">
              <span className="text-[11px] font-semibold text-[#64748b] uppercase tracking-wider">
                Quick Intent:
              </span>
              {QUICK_INTENTS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => setQuery(item.query)}
                  className="px-3 py-1 rounded-full bg-white/5 hover:bg-accent-cyan/10 border border-white/10 hover:border-accent-cyan/30 text-[#cbd5e1] hover:text-accent-cyan text-xs transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Aesthetic Filter Spheres */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        <div className="flex flex-col items-center gap-3">
          <span className="text-[11px] font-semibold tracking-widest text-[#94a3b8] uppercase">
            Aesthetic Realms
          </span>
          <div className="flex items-center gap-2.5 flex-wrap justify-center">
            {AESTHETIC_SPHERES.map((sphere) => {
              const isActive = selectedSphere === sphere.id;
              return (
                <button
                  key={sphere.id}
                  onClick={() => setSelectedSphere(sphere.id)}
                  className={`flex items-center gap-2.5 px-4 py-2 rounded-full border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white border-white text-obsidian-950 shadow-[0_8px_24px_rgba(255,255,255,0.15)] font-bold -translate-y-0.5'
                      : 'bg-white/5 border-white/10 text-[#94a3b8] hover:bg-white/10 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: sphere.color, boxShadow: `0 0 8px ${sphere.color}` }}
                  />
                  <span className="text-xs font-semibold">{sphere.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Status Banner */}
        {(query.trim() || selectedSphere !== 'all') && (
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-accent-cyan/5 border border-accent-cyan/20 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs">
              <Sparkles size={14} className="text-accent-cyan" />
              <span className="text-[#e2e8f0]">
                Showing results for{' '}
                <strong className="text-white">
                  &ldquo;{query || selectedSphere}&rdquo;
                </strong>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-accent-cyan/15 text-accent-cyan font-semibold text-[11px]">
                ({filteredProducts.length} {filteredProducts.length === 1 ? 'Piece' : 'Pieces'} Found)
              </span>
            </div>

            <button
              onClick={() => {
                setQuery('');
                setSelectedSphere('all');
              }}
              className="text-xs text-white/60 hover:text-white underline cursor-pointer"
            >
              Clear Filter
            </button>
          </div>
        )}

        {/* Discovery Matched Product Masonry Grid */}
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="font-editorial text-2xl text-white font-normal">
              Curated Atelier Pieces
            </h3>
            <span className="text-xs text-white/50">{filteredProducts.length} Pieces Found</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((product) => {
              const isAdded = addedIds[product.id];
              return (
                <div
                  key={product.id}
                  className="rounded-2xl bg-[#031633] border border-white/10 hover:border-accent-cyan/40 p-3 flex flex-col justify-between transition-all group shadow-md"
                >
                  <div className="relative aspect-square rounded-xl bg-gradient-radial from-[#062656] to-[#020f24] overflow-hidden flex items-center justify-center p-3 mb-3">
                    {product.matchBadge && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#011126]/90 border border-accent-cyan/40 text-[9px] font-bold text-accent-cyan uppercase tracking-wider z-10">
                        {product.matchBadge}
                      </span>
                    )}

                    <Link
                      href={`/product/${product.id}`}
                      className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#011126]/90 hover:bg-white text-white hover:text-obsidian-950 border border-white/20 text-[10px] font-bold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-all z-10 flex items-center gap-1"
                    >
                      <Eye size={11} />
                      <span>Quick Look</span>
                    </Link>

                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-[85%] h-[85%] object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="space-y-1 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold uppercase tracking-widest text-[#7a92b3]">
                          {product.brand}
                        </span>
                        <span className="text-amber-400 font-bold">
                          ★ {product.rating || 4.9} <span className="text-white/40 font-normal">(94)</span>
                        </span>
                      </div>

                      <h4 className="text-xs font-semibold text-white truncate">
                        <Link href={`/product/${product.id}`} className="hover:text-accent-cyan transition-colors">
                          {product.name}
                        </Link>
                      </h4>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2 mt-2">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-accent-cyan tabular-nums">
                          {product.formattedPrice}
                        </div>
                        <div className="text-[9px] text-[#94a3b8] flex items-center gap-1">
                          <CheckCircle2 size={9} className="text-emerald-400" />
                          <span>In Stock &bull; Ready to ship</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleQuickAdd(product, e)}
                        className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                          isAdded
                            ? 'bg-accent-cyan border-accent-cyan text-obsidian-950'
                            : 'bg-white/10 hover:bg-white text-white hover:text-obsidian-950 border-white/20'
                        }`}
                        title="Add to Bag"
                        aria-label={`Add ${product.name} to Bag`}
                      >
                        {isAdded ? <Check size={14} strokeWidth={3} /> : <Plus size={14} />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── 3. FEATURED EDITORIAL OUTFIT DROPS / COMPLETE OUTFIT BUILDER (#drops) ─── */}
        <section id="drops" aria-labelledby="dropsTitle" className="space-y-6 pt-10 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 id="dropsTitle" className="font-sans text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Complete Outfit Builder
              </h2>
              <p className="text-xs sm:text-sm text-[#94a3b8] mt-1.5 leading-relaxed">
                Complete styled ensembles tailored for climate, occasion, and harmony &mdash; 1-click bundle checkout.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 disc-drops-grid">
            {visibleCapsules.map((capsule) => {
              const isAdded = bundleAdded[capsule.id];
              return (
                <div
                  key={capsule.id}
                  className="disc-drop-card rounded-lg bg-[#031633] border border-white/10 hover:border-accent-cyan/40 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,0,0,0.4)] group"
                  data-bundle-keywords={capsule.keywords}
                  data-bundle-ids={capsule.bundleIds.join(',')}
                >
                  {/* Banner */}
                  <div className="disc-drop-banner w-full h-48 sm:h-52 relative overflow-hidden">
                    <img
                      src={capsule.image}
                      alt={capsule.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#011126]/95" />
                    <span className="disc-drop-capsule-badge absolute top-3.5 left-3.5 px-2.5 py-1 rounded-full bg-[#020b18]/85 border border-white/15 text-[9px] font-bold tracking-[0.14em] uppercase text-accent-cyan backdrop-blur-md">
                      {capsule.badge}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="disc-drop-content p-5 flex flex-col gap-4 flex-1 justify-between">
                    <div className="space-y-2">
                      <h3 className="disc-drop-title font-sans text-lg font-semibold text-white">
                        {capsule.title}
                      </h3>
                      <p className="disc-drop-desc text-xs leading-relaxed text-[#94a3b8]">
                        {capsule.desc}
                      </p>
                    </div>

                    {/* Pieces List */}
                    <div className="disc-drop-pieces py-3 border-y border-white/10 space-y-2.5">
                      {capsule.pieces.map((piece) => (
                        <div key={piece.name} className="disc-drop-piece-row flex items-center justify-between gap-2.5">
                          <span className="disc-drop-piece-name text-xs text-[#e2e8f0] flex items-center gap-1.5">
                            <Check size={12} className="text-accent-cyan flex-shrink-0" strokeWidth={2.5} />
                            <span>{piece.name}</span>
                          </span>
                          <span className="disc-drop-piece-price font-sans text-xs font-semibold text-[#94a3b8] tabular-nums">
                            {piece.price}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Footer & CTA */}
                    <div className="disc-drop-footer flex items-center justify-between gap-3 pt-1 mt-auto">
                      <div className="disc-drop-total flex flex-col">
                        <span className="disc-drop-total-label text-[9px] font-bold tracking-[0.12em] uppercase text-[#64748b]">
                          {capsule.totalLabel}
                        </span>
                        <span className="disc-drop-total-val font-sans text-lg font-bold text-white tabular-nums">
                          {capsule.totalVal}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => addBundle(capsule.bundleIds, capsule.id)}
                        className={`btn-disc-bundle px-4 py-2.5 rounded text-[10px] font-bold tracking-[0.12em] uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
                          isAdded
                            ? 'bg-accent-cyan text-obsidian-950 font-extrabold shadow-[0_4px_16px_rgba(61,224,255,0.4)]'
                            : 'bg-white hover:bg-slate-100 text-obsidian-950 hover:-translate-y-0.5 shadow-md'
                        }`}
                        data-bundle-ids={capsule.bundleIds.join(',')}
                        aria-label={`Add ${capsule.title} to Bag`}
                      >
                        {isAdded ? (
                          <>
                            <Check size={12} strokeWidth={3} />
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={12} />
                            <span>Add Capsule</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-[#020b18]/95 border border-accent-cyan/40 text-white text-xs font-medium shadow-[0_12px_32px_rgba(0,0,0,0.6)] backdrop-blur-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Sparkles size={14} className="text-accent-cyan flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default function DiscoveryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-white/60">
          Loading Discovery Atelier...
        </div>
      }
    >
      <DiscoveryContent />
    </Suspense>
  );
}
