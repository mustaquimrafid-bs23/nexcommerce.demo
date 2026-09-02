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
} from 'lucide-react';
import { MASTER_PRODUCTS } from '@/data/products';
import { useCartStore } from '@/store/useCartStore';
import { Product } from '@/types/catalog';
import { formatPrice } from '@/lib/utils';

import { useVisualSearchStore } from '@/store/useVisualSearchStore';

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

function DiscoveryContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [selectedSphere, setSelectedSphere] = useState('all');
  const [activeHotspot, setActiveHotspot] = useState<string | null>('hotspot-1');
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const openVisualSearch = useVisualSearchStore((state) => state.openVisualSearch);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    addItem(product);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1400);
    setTimeout(() => {
      openCart();
    }, 350);
  };

  // Extract individual keywords as removable context pills
  const contextPills = useMemo(() => {
    if (!query.trim()) return [];
    return query
      .split(/\s+/)
      .filter((w) => w.length > 2)
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

  // Filter products by sphere and query
  const filteredProducts = useMemo(() => {
    let list = [...MASTER_PRODUCTS];

    if (selectedSphere !== 'all') {
      if (selectedSphere === 'quiet-luxury') {
        list = list.filter((p) => p.category === 'apparel' || p.category === 'accessories');
      } else if (selectedSphere === 'alpine-thermal') {
        list = list.filter((p) => p.category === 'outerwear' || (p.tags && p.tags.includes('warm')));
      } else if (selectedSphere === 'nordic-minimal') {
        list = list.filter((p) => p.tags && (p.tags.includes('minimal') || p.tags.includes('leather')));
      } else if (selectedSphere === 'nocturne-acoustic') {
        list = list.filter((p) => p.category === 'acoustics');
      } else if (selectedSphere === 'transit-leisure') {
        list = list.filter((p) => p.category === 'footwear' || p.category === 'accessories');
      }
    }

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter((p) => {
        const inName = p.name.toLowerCase().includes(q);
        const inBrand = (p.brand || '').toLowerCase().includes(q);
        const inCat = p.category.toLowerCase().includes(q) || (p.subCategory || '').toLowerCase().includes(q);
        const inDesc = p.description.toLowerCase().includes(q);
        const inTags = p.tags ? p.tags.some((t) => t.toLowerCase().includes(q)) : false;
        return inName || inBrand || inCat || inDesc || inTags;
      });
    }

    return list;
  }, [query, selectedSphere]);

  return (
    <div className="min-h-screen pb-24 bg-transparent text-white">
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
                onClick={() => openVisualSearch()}
                className="p-2 text-white/60 hover:text-accent-pink transition-colors cursor-pointer"
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

        {/* Shoppable Editorial Lookbook */}
        <div className="space-y-4 pt-4">
          <div className="flex justify-between items-baseline">
            <div>
              <span className="text-[11px] font-bold tracking-widest uppercase text-accent-pink">
                Shoppable Editorial Lookbook
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl text-white font-normal mt-1">
                Atelier Winter Look &bull; Tap Hotspots to Inspect
              </h2>
            </div>
            <span className="text-xs text-white/40 hidden sm:inline">
              3 Interactive Hotspots Active
            </span>
          </div>

          <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#031633]">
            <img
              src="/assets/images/lifestyle/Gemini_Generated_Image_c36exc36exc36exc.jpg"
              alt="Maison Editorial Look"
              className="w-full h-full object-cover brightness-[0.75]"
            />

            {/* Interactive Hotspot Pins */}
            {HOTSPOTS.map((spot) => (
              <div
                key={spot.id}
                className="absolute z-20"
                style={{ top: spot.top, left: spot.left }}
              >
                <button
                  onClick={() =>
                    setActiveHotspot(activeHotspot === spot.id ? null : spot.id)
                  }
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    activeHotspot === spot.id
                      ? 'bg-accent-pink scale-125 ring-4 ring-accent-pink/40 text-white'
                      : 'bg-obsidian-950/80 text-white border border-white/40 hover:scale-110'
                  }`}
                  aria-label={spot.label}
                >
                  <Plus size={14} strokeWidth={3} />
                </button>

                {/* Popover Card */}
                {activeHotspot === spot.id && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-10 w-64 p-3.5 rounded-2xl bg-[#020b18]/95 backdrop-blur-xl border border-accent-cyan/35 shadow-[0_16px_36px_rgba(0,0,0,0.6)] space-y-3 z-30 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex gap-3">
                      <div className="w-12 h-14 rounded-lg bg-[#06224c] border border-white/10 p-1 flex-shrink-0 flex items-center justify-center">
                        <img
                          src={spot.product.image}
                          alt={spot.product.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="overflow-hidden space-y-0.5">
                        <span className="text-[9px] uppercase tracking-wider text-accent-cyan font-bold block">
                          {spot.label}
                        </span>
                        <h4 className="text-xs font-semibold text-white truncate">
                          {spot.product.name}
                        </h4>
                        <div className="text-xs font-bold text-accent-cyan tabular-nums">
                          {spot.product.formattedPrice}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1 border-t border-white/10">
                      <button
                        onClick={(e) => handleQuickAdd(spot.product, e)}
                        className="flex-1 py-1.5 rounded-lg bg-white hover:bg-slate-200 text-obsidian-950 text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <ShoppingBag size={12} />
                        <span>Quick Add</span>
                      </button>
                      <Link
                        href={`/product/${spot.product.id}`}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition-colors"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

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
      </div>
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
