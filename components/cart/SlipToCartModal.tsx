'use client';

import React, { useState } from 'react';
import { X, Receipt, Sparkles, Check, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { MASTER_PRODUCTS } from '@/data/products';
import { Product } from '@/types/catalog';
import { formatPrice } from '@/lib/utils';

interface SlipToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ParsedMatch {
  rawLine: string;
  quantity: number;
  selectedSize?: string;
  product: Product;
  confidence: number;
  isAmbiguous: boolean;
  alternatives: Product[];
}

const SAMPLE_LISTS = [
  {
    name: 'Autumn Warmth',
    text: '1x Cashmere Turtleneck Sweater (Size M)\n1x Structured Wool Blazer (Size 48)\n1x Titanium Watch',
  },
  {
    name: 'Travel Edit',
    text: '1x Leather Weekender Tote\n1x Studio Acoustics Headphone GT\n2x Cashmere Turtleneck Sweater',
  },
];

export function SlipToCartModal({ isOpen, onClose }: SlipToCartModalProps) {
  const [inputText, setInputText] = useState('');
  const [matches, setMatches] = useState<ParsedMatch[]>([]);
  const [unmatchedLines, setUnmatchedLines] = useState<string[]>([]);
  const [hasParsed, setHasParsed] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  if (!isOpen) return null;

  const parseAndMatch = (text: string) => {
    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const matchedList: ParsedMatch[] = [];
    const unmatchedList: string[] = [];

    lines.forEach((line) => {
      // 1. Extract Quantity (e.g. "2x", "2 pcs", "2 ", or default 1)
      let qty = 1;
      const qtyMatch = line.match(/^(\d+)\s*(?:x|pcs|pieces|items)?\b/i);
      if (qtyMatch) {
        qty = parseInt(qtyMatch[1], 10);
      }

      // 2. Extract Size Hint (e.g. "(Size M)", "size 48", "M")
      let sizeHint: string | undefined;
      const sizeMatch = line.match(/(?:size|sz|\()\s*([SMLXL0-9]+)\b/i);
      if (sizeMatch) {
        sizeHint = sizeMatch[1].toUpperCase();
      }

      // 3. Clean line for matching
      const cleanLine = line
        .replace(/^(\d+)\s*(?:x|pcs|pieces|items)?\b/i, '')
        .replace(/(?:size|sz|\()\s*([SMLXL0-9]+)\b\)?/i, '')
        .replace(/[^\w\s]/g, ' ')
        .trim()
        .toLowerCase();

      // Find matching products
      const scored = MASTER_PRODUCTS.map((prod) => {
        let score = 0;
        const nameLower = prod.name.toLowerCase();
        const catLower = prod.category.toLowerCase();
        const descLower = prod.description.toLowerCase();

        const words = cleanLine.split(/\s+/).filter((w) => w.length > 2);
        words.forEach((w) => {
          if (nameLower.includes(w)) score += 0.4;
          if (catLower.includes(w)) score += 0.2;
          if (descLower.includes(w)) score += 0.1;
        });

        return { prod, score };
      })
        .filter((item) => item.score > 0.2)
        .sort((a, b) => b.score - a.score);

      if (scored.length > 0) {
        const best = scored[0];
        const alts = scored.slice(1, 3).map((s) => s.prod);
        matchedList.push({
          rawLine: line,
          quantity: qty,
          selectedSize: sizeHint || best.prod.sizes?.[0] || 'Medium',
          product: best.prod,
          confidence: Math.min(0.98, best.score),
          isAmbiguous: scored.length > 1 && scored[0].score - scored[1].score < 0.2,
          alternatives: [best.prod, ...alts],
        });
      } else {
        unmatchedList.push(line);
      }
    });

    setMatches(matchedList);
    setUnmatchedLines(unmatchedList);
    setHasParsed(true);
  };

  const handleApplyPreset = (text: string) => {
    setInputText(text);
    parseAndMatch(text);
  };

  const handleUpdateQty = (index: number, delta: number) => {
    setMatches((prev) => {
      const updated = [...prev];
      const newQty = Math.max(1, updated[index].quantity + delta);
      updated[index] = { ...updated[index], quantity: newQty };
      return updated;
    });
  };

  const handleRemoveMatch = (index: number) => {
    setMatches((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSwapProduct = (index: number, newProductId: string) => {
    const newProd = MASTER_PRODUCTS.find((p) => p.id === newProductId);
    if (!newProd) return;
    setMatches((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], product: newProd };
      return updated;
    });
  };

  const handleAddAllToBag = () => {
    matches.forEach((m) => {
      addItem(m.product, m.selectedSize, undefined, m.quantity);
    });
    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
      onClose();
    }, 1200);
  };

  const totalMatchedCount = matches.reduce((sum, m) => sum + m.quantity, 0);
  const totalMatchedAmount = matches.reduce((sum, m) => sum + m.quantity * m.product.price, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-3xl bg-obsidian-950 border border-accent-pink/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-white"
        role="dialog"
        aria-modal="true"
        aria-label="Paste a Shopping List"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-surface-navy/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent-pink/15 border border-accent-pink/30 flex items-center justify-center text-accent-pink">
              <Receipt size={16} />
            </div>
            <div>
              <h3 className="text-base font-editorial text-white font-medium">Paste a Shopping List</h3>
              <p className="text-[11px] text-white/50">
                Paste any text notes or written items to instantly match and import them into your bag
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto" data-lenis-prevent>
          {/* Input & Presets */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase font-bold text-white/60 tracking-wider">
                Paste Your List Below:
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/40 font-semibold">Try sample:</span>
                {SAMPLE_LISTS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(sample.text)}
                    className="text-[10px] px-2 py-0.5 rounded bg-white/5 hover:bg-white/15 text-accent-pink border border-white/10 transition-colors"
                  >
                    {sample.name}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                if (e.target.value.trim()) {
                  parseAndMatch(e.target.value);
                } else {
                  setMatches([]);
                  setHasParsed(false);
                }
              }}
              placeholder="e.g. 1x Cashmere Sweater (Size M), 1x Leather Weekender Tote..."
              className="w-full bg-black/40 border border-white/15 rounded-xl p-3.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-accent-pink font-mono"
            />
          </div>

          {/* Parsed Matches Review Area */}
          {hasParsed && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
              {/* Left Column: Line checklist */}
              <div className="md:col-span-5 space-y-3">
                <div className="text-[10px] uppercase font-bold text-white/50 tracking-wider">
                  List Parsing Status
                </div>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {matches.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between text-xs gap-2"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                        <span className="truncate text-white/80">{m.rawLine}</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 flex-shrink-0">
                        {Math.round(m.confidence * 100)}%
                      </span>
                    </div>
                  ))}
                  {unmatchedLines.map((line, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-between text-xs gap-2"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-2 h-2 rounded-full bg-rose-400 flex-shrink-0" />
                        <span className="truncate text-white/60">{line}</span>
                      </div>
                      <span className="text-[10px] font-bold text-rose-400 flex-shrink-0">
                        Not Found
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Matched Product Cards */}
              <div className="md:col-span-7 space-y-3">
                <div className="text-[10px] uppercase font-bold text-white/50 tracking-wider">
                  Matched Atelier Pieces ({matches.length})
                </div>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {matches.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-surface-navy/40 border border-white/10 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={m.product.image}
                          alt={m.product.name}
                          className="w-12 h-12 rounded-lg object-contain bg-white/5 p-1 border border-white/5 flex-shrink-0"
                        />
                        <div>
                          <div className="text-xs font-semibold text-white">{m.product.name}</div>
                          <div className="text-[11px] text-white/50">
                            {formatPrice(m.product.price)} &middot; {m.selectedSize}
                          </div>
                          {m.alternatives.length > 1 && (
                            <select
                              value={m.product.id}
                              onChange={(e) => handleSwapProduct(idx, e.target.value)}
                              className="mt-1 bg-black/60 border border-white/15 text-[10px] text-white/80 rounded px-1.5 py-0.5 focus:outline-none"
                            >
                              {m.alternatives.map((alt) => (
                                <option key={alt.id} value={alt.id}>
                                  Switch: {alt.name}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Stepper */}
                        <div className="flex items-center border border-white/15 rounded-lg bg-black/40 text-xs">
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(idx, -1)}
                            className="px-2 py-0.5 text-white/60 hover:text-white"
                          >
                            -
                          </button>
                          <span className="px-2 font-bold text-white tabular-nums">{m.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQty(idx, 1)}
                            className="px-2 py-0.5 text-white/60 hover:text-white"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => handleRemoveMatch(idx)}
                          className="p-1 text-white/40 hover:text-rose-400 transition-colors"
                          title="Remove match"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-surface-navy/60 flex items-center justify-between gap-4">
          <div className="text-xs text-white/70">
            {matches.length > 0 ? (
              <span>
                Total Matched: <strong className="text-emerald-400 font-bold text-sm">{formatPrice(totalMatchedAmount)}</strong> ({totalMatchedCount} items)
              </span>
            ) : (
              <span className="text-white/40">Paste a list above to preview matched items</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddAllToBag}
            disabled={matches.length === 0}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-accent-pink to-accent-cyan hover:from-accent-pink/90 hover:to-accent-cyan/90 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-accent-pink/20 transition-all active:scale-95"
          >
            {successToast ? (
              <>
                <Check size={14} />
                <span>Added to Bag!</span>
              </>
            ) : (
              <>
                <ShoppingBag size={14} />
                <span>Add All Matched ({totalMatchedCount}) to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
