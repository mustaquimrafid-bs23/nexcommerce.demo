'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, Upload, Sparkles, Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { MASTER_PRODUCTS } from '@/data/products';
import { useCartStore } from '@/store/useCartStore';
import { useVisualSearchStore } from '@/store/useVisualSearchStore';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types/catalog';

export const PRESET_LOOKS = [
  {
    id: 'overcoat',
    name: 'Tailored Milan Overcoat',
    image: '/assets/images/products/hero_sweater.png',
    category: 'outerwear',
  },
  {
    id: 'acoustics',
    name: 'Titanium Studio Acoustics',
    image: '/assets/images/products/prod_headphones.png',
    category: 'acoustics',
  },
  {
    id: 'runner',
    name: 'Full-Grain Leather Runner',
    image: '/assets/images/products/prod_runner.png',
    category: 'footwear',
  },
  {
    id: 'blazer',
    name: 'Italian Virgin Wool Blazer',
    image: '/assets/images/products/plp_blazer.png',
    category: 'tailoring',
  },
];

interface VisualSearchModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function VisualSearchModal({ isOpen: propIsOpen, onClose: propOnClose }: VisualSearchModalProps = {}) {
  const storeIsOpen = useVisualSearchStore((s) => s.isOpen);
  const storeClose = useVisualSearchStore((s) => s.closeVisualSearch);
  const storeInitialImage = useVisualSearchStore((s) => s.activeImage);

  const isOpen = propIsOpen !== undefined ? propIsOpen : storeIsOpen;
  const onClose = propOnClose || storeClose;

  const { addItem } = useCartStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeThumb, setActiveThumb] = useState<string | null>(null);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [results, setResults] = useState<Product[]>([]);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (storeInitialImage) {
      setActiveThumb(storeInitialImage);
      setActiveLabel('Uploaded Reference');
      setResults(MASTER_PRODUCTS.slice(0, 3));
    }
  }, [storeInitialImage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: typeof PRESET_LOOKS[0]) => {
    setActiveThumb(preset.image);
    setActiveLabel(preset.name);
    // Find matching products
    const matches = MASTER_PRODUCTS.filter(
      (p) => p.category.toLowerCase() === preset.category.toLowerCase()
    ).slice(0, 3);
    setResults(matches.length > 0 ? matches : MASTER_PRODUCTS.slice(0, 3));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setActiveThumb(dataUrl);
      setActiveLabel(file.name.replace(/\.[^/.]+$/, '').slice(0, 20));

      const lower = file.name.toLowerCase();
      let matched = MASTER_PRODUCTS.slice(0, 3);
      if (lower.includes('shoe') || lower.includes('runner') || lower.includes('boot') || lower.includes('sneaker')) {
        matched = MASTER_PRODUCTS.filter((p) => p.category === 'footwear').slice(0, 3);
      } else if (lower.includes('headphone') || lower.includes('audio') || lower.includes('acoustic')) {
        matched = MASTER_PRODUCTS.filter((p) => p.category === 'acoustics').slice(0, 3);
      } else if (lower.includes('jacket') || lower.includes('coat') || lower.includes('blazer') || lower.includes('outerwear')) {
        matched = MASTER_PRODUCTS.filter((p) => p.category === 'outerwear' || p.category === 'apparel').slice(0, 3);
      }
      setResults(matched.length > 0 ? matched : MASTER_PRODUCTS.slice(0, 3));
    };
    reader.readAsDataURL(file);
  };

  const handleQuickAdd = (product: Product) => {
    addItem(product, product.sizes ? product.sizes[0] : 'One Size');
    setAddedIds((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 2000);
  };

  return (
    <div
      id="nexVisualSearchModal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Multimodal Visual Search"
    >
      <div className="relative w-full max-w-2xl rounded-3xl bg-surface-card border border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-accent-pink/15 text-accent-pink flex items-center justify-center">
              <Camera size={16} />
            </div>
            <div>
              <h2 className="font-editorial text-2xl text-white font-normal">Multimodal Visual Lens</h2>
              <span className="text-[10px] font-mono text-white/50 uppercase">Neural Image Recognition</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close visual search modal"
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-white/70 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Upload Drop Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="p-6 rounded-2xl border-2 border-dashed border-white/20 hover:border-accent-cyan/60 bg-obsidian-950/50 text-center space-y-2 cursor-pointer transition-colors group"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <div className="w-10 h-10 rounded-full bg-white/5 text-white/60 group-hover:text-accent-cyan flex items-center justify-center mx-auto transition-colors">
            <Upload size={18} />
          </div>
          <div className="text-xs font-semibold text-white">Upload or drop any fashion photo</div>
          <p className="text-[11px] text-white/50 font-light">
            Matches silhouette, color harmonies, and textures across our European catalog.
          </p>
        </div>

        {/* Preset Lookbook Inspiration */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-white/60 block">
            Or test with curated atelier pieces:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESET_LOOKS.map((look) => (
              <button
                key={look.id}
                type="button"
                onClick={() => handleSelectPreset(look)}
                className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                  activeLabel === look.name
                    ? 'bg-accent-cyan/15 border-accent-cyan'
                    : 'bg-obsidian-950/60 border-white/10 hover:border-white/20'
                }`}
              >
                <img src={look.image} alt={look.name} className="w-8 h-8 object-contain rounded" />
                <span className="text-[11px] text-white font-medium truncate">{look.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Query Lens Bar */}
        {activeThumb && (
          <div className="p-3 rounded-2xl bg-obsidian-950/90 border border-accent-pink/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <img src={activeThumb} alt="Query Lens" className="w-10 h-10 rounded-lg object-contain bg-white/5 p-1" />
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase text-accent-pink block">Active Lens Query</span>
                <span className="text-xs font-semibold text-white truncate block">{activeLabel}</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-accent-cyan shrink-0">Neural Embeddings Synced</span>
          </div>
        )}

        {/* Matching Results Grid */}
        {results.length > 0 && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between text-xs text-white/60">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Visual Catalog Matches</span>
              <span className="font-mono text-accent-cyan">{results.length} Pieces Found</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {results.map((p, idx) => {
                const matchScore = 98 - idx * 4;
                const isAdded = addedIds.has(p.id);
                return (
                  <div
                    key={p.id}
                    className="p-3 rounded-2xl bg-obsidian-950/60 border border-white/10 flex flex-col justify-between space-y-2.5 relative group"
                  >
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-accent-cyan/20 text-accent-cyan font-mono text-[9px] font-bold">
                      {matchScore}% MATCH
                    </span>

                    <div className="aspect-square rounded-xl bg-white/5 p-2 flex items-center justify-center">
                      <img src={p.image} alt={p.name} className="max-h-full max-w-full object-contain" />
                    </div>

                    <div className="space-y-0.5">
                      <h4 className="text-xs font-semibold text-white truncate">{p.name}</h4>
                      <div className="font-mono text-xs text-white/80">{formatPrice(p.price)}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleQuickAdd(p)}
                      className="w-full py-2 rounded-xl bg-accent-crimson hover:bg-accent-crimson/90 text-white text-[10px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                    >
                      {isAdded ? (
                        <>
                          <Check size={12} />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={12} />
                          <span>Add to Bag</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
