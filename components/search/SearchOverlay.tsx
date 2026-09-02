'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  Sparkles,
  Camera,
  History,
  Plus,
  ArrowRight,
  Eye,
  CheckCircle2,
  SlidersHorizontal,
  SearchX,
  Check,
} from 'lucide-react';
import { useSearchStore, POPULAR_DEPARTMENTS } from '@/store/useSearchStore';
import { useCartStore } from '@/store/useCartStore';
import { Product } from '@/types/catalog';
import { SearchWhyModal } from './SearchWhyModal';
import { formatPrice } from '@/lib/utils';

export function SearchOverlay() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeDepartment, setActiveDepartment] = useState('apparel');
  const [selectedProductForWhy, setSelectedProductForWhy] = useState<Product | null>(null);
  const [activeSwatches, setActiveSwatches] = useState<Record<string, number>>({});
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});
  const [isProcessingSearch, setIsProcessingSearch] = useState(false);
  const [hasExecutedSearch, setHasExecutedSearch] = useState(false);
  const [focusIndex, setFocusIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const thinkingBarRef = useRef<HTMLDivElement>(null);
  const thinkingTrackRef = useRef<HTMLDivElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  const {
    isOpen,
    query,
    openSearch,
    closeSearch,
    setQuery,
    parseIntent,
    getSearchResults,
    getTypeaheadResults,
    getSeasonalHighlights,
    recentSearches,
    loadRecentSearches,
    saveRecentSearch,
    deleteRecentSearch,
    clearAllRecentSearches,
    checkTypo,
  } = useSearchStore();

  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  // Initialize and load recent searches on mount
  useEffect(() => {
    setMounted(true);
    loadRecentSearches();

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          closeSearch();
        } else {
          openSearch();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        closeSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, openSearch, closeSearch, loadRecentSearches]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setHasExecutedSearch(false);
      setIsProcessingSearch(false);
      setFocusIndex(-1);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  // GPU Thinking Track Animation
  const runThinkingTrack = useCallback((durationMs = 450, onDone?: () => void) => {
    if (!thinkingTrackRef.current || !thinkingBarRef.current) {
      if (onDone) onDone();
      return;
    }
    const track = thinkingTrackRef.current;
    const bar = thinkingBarRef.current;

    track.classList.add('active');
    bar.style.transform = 'scaleX(0)';

    let start: number | null = null;
    let isCancelled = false;

    function step(ts: number) {
      if (isCancelled) return;
      if (!start) start = ts;
      const progress = Math.min((ts - start) / durationMs, 1);
      bar.style.transform = `scaleX(${progress.toFixed(3)})`;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);

    const timer = setTimeout(() => {
      isCancelled = true;
      track.classList.remove('active');
      if (onDone) onDone();
    }, durationMs);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
      track.classList.remove('active');
    };
  }, []);

  const seasonalHighlights = useMemo(() => getSeasonalHighlights(), [getSeasonalHighlights]);
  const intent = useMemo(() => parseIntent(query), [parseIntent, query]);
  const typeahead = useMemo(() => getTypeaheadResults(), [getTypeaheadResults, query]);
  const searchResults = useMemo(() => getSearchResults(), [getSearchResults, query]);
  const typo = useMemo(() => checkTypo(query), [checkTypo, query]);

  // Execute full search
  const handleExecuteSearch = (q: string) => {
    if (!q.trim()) return;
    setQuery(q);
    saveRecentSearch(q);
    setIsProcessingSearch(true);

    runThinkingTrack(400, () => {
      setIsProcessingSearch(false);
      setHasExecutedSearch(true);
    });
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleExecuteSearch(query);
    }
  };

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    addItem(product);
    setAddedItemIds((prev) => ({ ...prev, [product.id]: true }));

    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1400);

    setTimeout(() => {
      closeSearch();
      openCart();
    }, 350);
  };

  const handleSelectSwatch = (productId: string, swatchIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveSwatches((prev) => ({ ...prev, [productId]: swatchIndex }));
  };

  const handleNavigateDiscovery = (targetQuery?: string) => {
    const q = targetQuery || query;
    closeSearch();
    router.push(`/discovery?q=${encodeURIComponent(q)}`);
  };

  if (!mounted || !isOpen) return null;

  const isIdle = !query.trim();
  const isTypeahead = query.trim().length >= 2 && !hasExecutedSearch && !isProcessingSearch;
  const isResults = (hasExecutedSearch || query.trim().length >= 2) && !isTypeahead && !isProcessingSearch;

  const highlightMatch = (text: string, q: string) => {
    if (!q.trim()) return text;
    const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === q.toLowerCase() ? (
        <mark key={i} className="search-hl font-bold bg-accent-cyan/25 text-accent-cyan rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-14 px-4 overflow-y-auto">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-[#011a3c]/60 backdrop-blur-md transition-opacity duration-300"
          onClick={closeSearch}
          aria-hidden="true"
        />

        {/* Master Atelier Modal Container */}
        <div
          id="aiSearchModal"
          className="relative w-full max-w-4xl bg-gradient-to-b from-[#0e2e5c]/95 to-[#061c3e]/98 backdrop-blur-2xl border border-white/20 rounded-2xl sm:rounded-3xl shadow-[0_30px_80px_rgba(0,14,38,0.6)] z-10 flex flex-col max-h-[88vh] overflow-hidden my-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Intelligent Atelier Search"
        >
          {/* Search Header Bar */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center gap-3 bg-[#0a274e]/70">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#143c76]/75 border border-white/20 focus-within:border-accent-cyan focus-within:ring-2 focus-within:ring-accent-cyan/30 focus-within:bg-[#1a4c91]/95 transition-all">
              <Sparkles size={18} className="text-accent-cyan flex-shrink-0" />
              <input
                id="aiSearchModalInput"
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setHasExecutedSearch(false);
                }}
                onKeyDown={handleInputKeyDown}
                placeholder="Something for a winter evening in Milan"
                className="w-full bg-transparent text-sm sm:text-base text-white placeholder-white/50 focus:outline-none font-sans"
                autoComplete="off"
                spellCheck="false"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setHasExecutedSearch(false);
                    inputRef.current?.focus();
                  }}
                  className="w-5 h-5 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center text-xs transition-colors flex-shrink-0 cursor-pointer"
                  aria-label="Clear search input"
                >
                  <X size={12} />
                </button>
              )}

              <button
                type="button"
                onClick={() => handleNavigateDiscovery(query || 'visual-lens')}
                className="text-white/60 hover:text-accent-cyan transition-colors flex-shrink-0 p-1 cursor-pointer"
                title="Shop by Photo (Visual Search)"
                aria-label="Shop by Photo (Visual Search)"
              >
                <Camera size={17} />
              </button>
            </div>

            <button
              type="button"
              onClick={closeSearch}
              className="w-10 h-10 rounded-xl bg-[#143c76]/75 hover:bg-[#1c54a0] border border-white/15 hover:border-white/30 text-white/70 hover:text-white flex items-center justify-center transition-all flex-shrink-0 cursor-pointer"
              aria-label="Close search"
            >
              <X size={18} />
            </button>
          </div>

          {/* 120fps GPU Thinking Track */}
          <div ref={thinkingTrackRef} className="nex-thinking-track" aria-hidden="true">
            <div ref={thinkingBarRef} className="nex-thinking-bar" />
          </div>

          {/* Modal Body Container */}
          <div
            id="aiSearchResultsModal"
            ref={resultsContainerRef}
            className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar"
            tabIndex={0}
          >
            {/* ─── STATE 1: IDLE / CURATED EDITORIAL ATELIER ───────────────────────── */}
            {isIdle && (
              <div className="space-y-5 animate-in fade-in duration-200">
                {/* Department Navigation Tabs */}
                <div className="flex items-center gap-4 sm:gap-6 pb-3 border-b border-white/10 text-xs overflow-x-auto no-scrollbar">
                  <span className="font-bold tracking-widest text-[#7a92b3] uppercase text-[11px] flex-shrink-0">
                    DEPARTMENTS:
                  </span>
                  {POPULAR_DEPARTMENTS.map((dept) => (
                    <button
                      key={dept.label}
                      onClick={() => {
                        setActiveDepartment(dept.query);
                        handleExecuteSearch(dept.query);
                      }}
                      className={`whitespace-nowrap transition-colors font-medium cursor-pointer ${
                        activeDepartment === dept.query
                          ? 'text-accent-cyan font-bold border-b border-accent-cyan pb-0.5'
                          : 'text-[#cbd5e1] hover:text-accent-cyan'
                      }`}
                    >
                      {dept.label}
                    </button>
                  ))}
                </div>

                {/* Seasonal Highlights Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold tracking-widest text-[#7a92b3] uppercase text-[11px]">
                      SEASONAL HIGHLIGHTS
                    </span>
                    {recentSearches.length > 0 && (
                      <button
                        id="btnClearSearchHistory"
                        onClick={clearAllRecentSearches}
                        className="text-[11px] font-semibold text-accent-cyan hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        CLEAR RECENT
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {seasonalHighlights.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        onClick={closeSearch}
                        className="p-3 rounded-xl bg-[#061c40]/50 hover:bg-[#0e3062]/75 border border-white/10 hover:border-accent-cyan/40 transition-all flex items-center gap-3.5 group shadow-sm"
                      >
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-b from-white/10 to-black/40 border border-white/10 p-1 flex-shrink-0 flex items-center justify-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <span className="text-[9px] font-bold tracking-widest text-[#7a92b3] uppercase block">
                            {product.brand}
                          </span>
                          <h4 className="text-xs font-semibold text-white group-hover:text-accent-cyan truncate transition-colors">
                            {product.name}
                          </h4>
                          <span className="text-xs font-bold text-accent-cyan tabular-nums block">
                            {product.formattedPrice}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Persistent Recent Searches Footer */}
                {recentSearches.length > 0 && (
                  <div className="pt-3 border-t border-white/10 flex items-center gap-3 text-xs flex-wrap">
                    <div className="flex items-center gap-1.5 text-[#b0c4de] font-semibold flex-shrink-0">
                      <History size={13} className="text-accent-cyan" />
                      <span>Recent:</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {recentSearches.map((r, idx) => (
                        <div
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0e2e5c]/50 hover:bg-[#164484]/80 border border-white/10 hover:border-accent-cyan/30 text-xs text-[#cbd5e1] hover:text-white transition-all cursor-pointer group"
                          onClick={() => handleExecuteSearch(r)}
                        >
                          <span>{r}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteRecentSearch(r);
                            }}
                            className="text-white/40 hover:text-accent-pink ml-0.5 p-0.5 transition-colors"
                            aria-label={`Remove recent search ${r}`}
                          >
                            <X size={11} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─── STATE 2: INSTANT TYPEAHEAD ─────────────────────────────────────── */}
            {isTypeahead && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="p-2.5 rounded-lg bg-[#123870]/60 border-l-2 border-accent-cyan text-xs text-[#e2e8f0] flex items-center justify-between">
                  <span>
                    Press <strong>Enter</strong> to explore all matches for &ldquo;{query}&rdquo;
                  </span>
                  <button
                    onClick={() => handleNavigateDiscovery()}
                    className="text-accent-cyan hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>See all</span>
                    <ArrowRight size={12} />
                  </button>
                </div>

                {typeahead.departments.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold tracking-widest text-[#b0c4de] uppercase">
                      DEPARTMENTS
                    </span>
                    <div className="space-y-1.5">
                      {typeahead.departments.map((dept) => (
                        <button
                          key={dept.label}
                          onClick={() => {
                            closeSearch();
                            router.push(`/category?cat=${dept.query}`);
                          }}
                          className="w-full p-2.5 rounded-lg bg-[#123870]/60 hover:bg-[#1a4e96]/85 border border-white/10 hover:border-accent-cyan/40 text-left text-xs sm:text-sm text-white flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <span>{highlightMatch(dept.label, query)}</span>
                          <span className="text-accent-cyan">&rarr;</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {typeahead.products.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold tracking-widest text-[#b0c4de] uppercase">
                      PRODUCTS
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {typeahead.products.map((p) => (
                        <Link
                          key={p.id}
                          href={`/product/${p.id}`}
                          onClick={closeSearch}
                          className="p-2.5 rounded-lg bg-[#123870]/65 hover:bg-[#1a4e96]/90 border border-white/15 hover:border-accent-cyan/45 flex items-center gap-3 text-white transition-all group cursor-pointer"
                        >
                          <div className="w-12 h-14 rounded-md bg-[#06224c] border border-white/10 p-1 flex-shrink-0 flex items-center justify-center">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="min-w-0 flex-1 space-y-0.5">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-[#b0c4de]">
                              {p.brand}
                            </span>
                            <h4 className="text-xs font-medium text-white truncate">
                              {highlightMatch(p.name, query)}
                            </h4>
                            <span className="text-xs font-bold text-accent-cyan tabular-nums">
                              {p.formattedPrice}
                            </span>
                          </div>
                          <span className="px-2.5 py-1 rounded bg-white/10 group-hover:bg-white text-white group-hover:text-[#003371] text-[11px] font-semibold transition-colors flex-shrink-0">
                            View &rarr;
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {typeahead.products.length === 0 && typeahead.departments.length === 0 && (
                  <div className="py-8 text-center space-y-3">
                    <SlidersHorizontal size={28} className="mx-auto text-white/40" />
                    <p className="text-xs text-white/60">
                      No exact matches for &ldquo;{query}&rdquo;.
                    </p>
                    {typeahead.typoCorrection && (
                      <div className="pt-2">
                        <button
                          onClick={() => handleExecuteSearch(typeahead.typoCorrection!)}
                          className="px-4 py-2 rounded-full bg-accent-cyan/15 hover:bg-accent-cyan/25 border border-accent-cyan/30 text-accent-cyan text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span>Did you mean: &ldquo;{typeahead.typoCorrection}&rdquo;?</span>
                          <span>&rarr;</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    onClick={() => handleNavigateDiscovery()}
                    className="w-full p-3 rounded-xl bg-gradient-to-r from-accent-cyan/15 to-accent-pink/15 hover:from-accent-cyan/25 hover:to-accent-pink/25 border border-accent-cyan/30 text-xs font-bold text-white flex items-center justify-between transition-all cursor-pointer"
                  >
                    <span>Explore all results for &ldquo;{query}&rdquo; in Discovery</span>
                    <span className="text-accent-cyan">&rarr;</span>
                  </button>
                </div>
              </div>
            )}

            {/* ─── STATE 3: NATURAL LANGUAGE INTENT RESULTS ────────────────────────── */}
            {isResults && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Results Top Bar & Intent Badges */}
                <div className="flex items-center justify-between flex-wrap gap-2.5 pb-1">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#123870]/70 border border-white/20 text-xs font-semibold text-white">
                    <Sparkles size={13} className="text-accent-cyan" />
                    <span>
                      {searchResults.length} Recommended Pieces for &ldquo;{query}&rdquo;
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {intent.occasion && (
                      <span className="px-2.5 py-0.5 rounded-full bg-accent-pink/15 border border-accent-pink/30 text-accent-pink text-[11px] font-semibold">
                        Occasion: {intent.occasion}
                      </span>
                    )}
                    {intent.climate && (
                      <span className="px-2.5 py-0.5 rounded-full bg-accent-cyan/15 border border-accent-cyan/30 text-accent-cyan text-[11px] font-semibold">
                        Climate: {intent.climate}
                      </span>
                    )}
                    {intent.location && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[11px] font-semibold">
                        Location: {intent.location}
                      </span>
                    )}
                    {intent.budgetMax && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/15 border border-emerald-400/30 text-emerald-400 text-[11px] font-semibold">
                        Budget: &le; €{intent.budgetMax}
                      </span>
                    )}
                  </div>
                </div>

                {/* 3D Motion Product Grid */}
                {searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.map(({ product, matchBadge, matchReason }) => {
                      const selectedSwatch = activeSwatches[product.id] ?? 0;
                      const currentImage = product.colors?.[selectedSwatch]?.img || product.image;
                      const isAdded = addedItemIds[product.id];

                      return (
                        <div
                          key={product.id}
                          className="search-product-card rounded-xl bg-[#031633] border border-white/15 hover:border-accent-cyan/45 shadow-[0_6px_18px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col group transition-all"
                        >
                          {/* Radial Studio Image Container */}
                          <div className="relative w-full aspect-[1/1.05] bg-gradient-radial from-[#062656] to-[#020f24] overflow-hidden flex items-center justify-center p-3">
                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#011126]/90 border border-accent-cyan/40 text-[9px] font-bold text-accent-cyan uppercase tracking-wider backdrop-blur-md z-10">
                              {matchBadge}
                            </span>

                            <Link
                              href={`/product/${product.id}`}
                              onClick={closeSearch}
                              className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#011126]/90 hover:bg-white text-white hover:text-[#001229] border border-white/20 hover:border-white text-[10px] font-bold tracking-wider uppercase backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all z-10 flex items-center gap-1 cursor-pointer"
                            >
                              <Eye size={11} />
                              <span>Quick Look</span>
                            </Link>

                            <img
                              src={currentImage}
                              alt={product.name}
                              className="w-[88%] h-[88%] object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          </div>

                          {/* Card Content Details */}
                          <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
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
                                <Link
                                  href={`/product/${product.id}`}
                                  onClick={closeSearch}
                                  className="hover:text-accent-cyan transition-colors"
                                >
                                  {product.name}
                                </Link>
                              </h4>

                              {/* Interactive Color Swatches */}
                              {product.colors && product.colors.length > 0 && (
                                <div className="flex items-center gap-1.5 pt-0.5">
                                  {product.colors.map((c, sIdx) => (
                                    <button
                                      key={sIdx}
                                      onClick={(e) => handleSelectSwatch(product.id, sIdx, e)}
                                      className={`w-3 h-3 rounded-full border transition-all cursor-pointer ${
                                        selectedSwatch === sIdx
                                          ? 'border-white scale-125 ring-2 ring-accent-cyan/40'
                                          : 'border-white/30 hover:scale-110'
                                      }`}
                                      style={{ backgroundColor: c.hex }}
                                      title={c.name}
                                      aria-label={`Select ${c.name} finish`}
                                    />
                                  ))}
                                </div>
                              )}

                              {/* Why Matches Link */}
                              <button
                                type="button"
                                onClick={() => setSelectedProductForWhy(product)}
                                className="text-[10px] text-accent-cyan hover:underline pt-0.5 block font-medium cursor-pointer"
                              >
                                See why this matches &rarr;
                              </button>
                            </div>

                            {/* Card Footer: Price & Quick Add */}
                            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
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
                                type="button"
                                onClick={(e) => handleQuickAdd(product, e)}
                                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${
                                  isAdded
                                    ? 'bg-accent-cyan border-accent-cyan text-obsidian-950 scale-110'
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
                ) : (
                  /* Empty state */
                  <div className="py-12 text-center space-y-3">
                    <SearchX size={36} className="mx-auto text-white/40" />
                    <h4 className="text-sm font-semibold text-white">No exact matches found</h4>
                    <p className="text-xs text-white/60">
                      We couldn&apos;t find items matching &ldquo;{query}&rdquo;.
                    </p>
                    {typo && (
                      <div className="pt-1">
                        <button
                          onClick={() => handleExecuteSearch(typo)}
                          className="px-4 py-2 rounded-full bg-accent-cyan/15 hover:bg-accent-cyan/25 border border-accent-cyan/30 text-accent-cyan text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span>Did you mean: &ldquo;{typo}&rdquo;?</span>
                          <span>&rarr;</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* See All in Full Discovery Button */}
                <div className="pt-2">
                  <button
                    onClick={() => handleNavigateDiscovery()}
                    className="w-full p-3.5 rounded-xl bg-gradient-to-r from-accent-cyan/15 to-accent-pink/15 hover:from-accent-cyan/25 hover:to-accent-pink/25 border border-accent-cyan/30 text-xs font-bold uppercase tracking-wider text-white flex items-center justify-between transition-all cursor-pointer shadow-md"
                  >
                    <span>SEE ALL RESULTS FOR &ldquo;{query}&rdquo; IN FULL CATALOG</span>
                    <span className="text-accent-cyan">&rarr;</span>
                  </button>
                </div>

                {/* Conversational Refinement Bar */}
                <div className="space-y-2 pt-1 border-t border-white/10">
                  <span className="text-[10px] font-bold tracking-widest text-[#7a92b3] uppercase">
                    REFINE SEARCH
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                    {[
                      { label: 'Under € 200', query: 'under 200' },
                      { label: 'Warmer', query: 'winter warm' },
                      { label: 'More Minimal', query: 'minimal clean' },
                      { label: 'Travel Ready', query: 'travel flight' },
                      { label: 'Clothing Only', query: 'apparel' },
                    ].map((pill) => (
                      <button
                        key={pill.label}
                        onClick={() => handleExecuteSearch(pill.query)}
                        className="px-3 py-1 rounded-full bg-[#123870]/60 hover:bg-[#1a4e96]/90 border border-white/15 hover:border-accent-cyan/40 text-xs text-[#cbd5e1] hover:text-white whitespace-nowrap transition-colors cursor-pointer"
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Info Bar */}
          <div className="p-3 sm:px-5 bg-[#061c3e] border-t border-white/10 flex items-center justify-between text-[11px] text-white/50 font-sans">
            <span>
              Press <strong className="text-white">Enter</strong> to see all results
            </span>
            <div className="flex items-center gap-1 text-accent-cyan font-semibold">
              <span>Submit</span>
              <span>&crarr;</span>
            </div>
          </div>
        </div>
      </div>

      {/* Design & Fit Evidence Modal Popup */}
      <SearchWhyModal
        product={selectedProductForWhy}
        onClose={() => setSelectedProductForWhy(null)}
      />
    </>
  );
}
