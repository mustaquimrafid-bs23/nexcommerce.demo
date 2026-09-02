import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, Scale, Check, ShoppingBag } from 'lucide-react';
import { Product } from '@/types/catalog';
import { MASTER_PRODUCTS } from '@/data/products';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';

interface ComparisonModalProps {
  isOpen: boolean;
  productA: Product;
  productB: Product;
  onClose: () => void;
}

export function ComparisonModal({
  isOpen,
  productA,
  productB,
  onClose,
}: ComparisonModalProps) {
  const { addItem } = useCartStore();
  const [chosenId, setChosenId] = React.useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [currentProductB, setCurrentProductB] = useState<Product>(productB);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setCurrentProductB(productB);
  }, [productB]);

  if (!isOpen || !mounted) return null;

  const handleChoose = (product: Product) => {
    addItem(product, product.sizes ? product.sizes[0] : 'One Size');
    setChosenId(product.id);
    setTimeout(() => {
      setChosenId(null);
      onClose();
    }, 1200);
  };

  const specs = [
    {
      label: 'Materiality',
      valA: productA.category === 'Acoustics' ? 'Grade 5 Titanium & Lambskin' : '100% Mongolian Cashmere',
      valB: currentProductB.category === 'Acoustics' ? 'Beryllium Foil Drivers' : 'Virgin Italian Wool Crepe',
      diffA: 'Ultra Warm',
      diffB: 'Year-Round',
    },
    {
      label: 'Tailoring & Drape',
      valA: 'Relaxed Floating Silhouette',
      valB: 'Structured Tailored Cut',
      diffA: 'Comfort',
      diffB: 'Formal',
    },
    {
      label: 'Origin & Provenance',
      valA: 'Biella, Northern Italy',
      valB: 'Como Silk Mills, Italy',
      diffA: 'Heritage',
      diffB: 'Artisanal',
    },
    {
      label: 'Optimal Occasion',
      valA: 'Alpine Lounge & Weekend',
      valB: 'Boardroom & Galas',
      diffA: 'Casual Chic',
      diffB: 'Executive',
    },
    {
      label: 'Hardware & Finish',
      valA: 'Natural Horn Buttons',
      valB: 'Solid Polished Brass Buckles',
      diffA: 'Natural',
      diffB: 'High-Luster',
    },
  ];

  return createPortal(
    <div
      id="compareModalBackdrop"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Product Comparison Matrix"
    >
      <div className="relative w-full max-w-3xl rounded-3xl bg-surface-card border border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Scale size={18} className="text-accent-cyan" />
            <div>
              <span className="text-[10px] font-mono text-accent-cyan uppercase tracking-widest block">
                Atelier Comparative Intelligence
              </span>
              <h2 className="font-editorial text-2xl text-white font-normal">
                Side-by-Side Spec &amp; Drape Matrix
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-white/70 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Smart Advisor Verdict Card */}
        <div className="p-4 rounded-2xl bg-obsidian-950/80 border border-accent-pink/30 space-y-2.5">
          <div className="flex items-center gap-1.5 text-accent-pink text-[11px] font-semibold uppercase tracking-wider">
            <Sparkles size={13} />
            <span>Smart Advisor Verdict</span>
          </div>
          <h3 className="text-sm font-semibold text-white">
            {productA.name.split(' ')[0]} provides relaxed seasonal warmth, while {productB.name.split(' ')[0]} offers structured European formality.
          </h3>
          <p className="text-xs text-white/60 font-light leading-relaxed">
            Choose <strong>{productA.name}</strong> for everyday layering and soft tactile comfort. Choose <strong>{productB.name}</strong> for crisp tailoring at evening galas or formal summits.
          </p>
        </div>

        {/* Products Header Row */}
        <div className="grid grid-cols-12 gap-3 items-end border-b border-white/10 pb-4">
          <div className="col-span-4 text-[10px] font-mono uppercase text-white/40 tracking-wider">
            Spec Comparison
          </div>

          <div className="col-span-4 p-3 rounded-2xl bg-obsidian-950/60 border border-white/10 space-y-2 text-center">
            <div className="aspect-square w-16 mx-auto rounded-xl bg-white/5 p-1 flex items-center justify-center">
              <img src={productA.image} alt={productA.name} className="max-h-full max-w-full object-contain" />
            </div>
            <div className="text-xs font-semibold text-white truncate">{productA.name}</div>
            <div className="text-xs font-mono text-accent-cyan">{formatPrice(productA.price)}</div>
            <button
              type="button"
              onClick={() => handleChoose(productA)}
              className="w-full py-1.5 rounded-xl bg-accent-crimson hover:bg-accent-crimson/90 text-white text-[10px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm"
            >
              {chosenId === productA.id ? <Check size={12} /> : <ShoppingBag size={12} />}
              <span>{chosenId === productA.id ? 'Chosen' : 'Choose This'}</span>
            </button>
          </div>

          <div className="col-span-4 p-3 rounded-2xl bg-obsidian-950/60 border border-white/10 space-y-2 text-center">
            <div className="aspect-square w-16 mx-auto rounded-xl bg-white/5 p-1 flex items-center justify-center">
              <img src={currentProductB.image} alt={currentProductB.name} className="max-h-full max-w-full object-contain" />
            </div>
            <div className="space-y-1">
              <select
                id="compareSlotB"
                value={currentProductB.id}
                onChange={(e) => {
                  const next = MASTER_PRODUCTS.find((p) => p.id === e.target.value);
                  if (next) setCurrentProductB(next);
                }}
                className="w-full text-[11px] font-semibold bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg px-2 py-1 text-white truncate focus:outline-none focus:border-accent-cyan cursor-pointer"
                title="Switch comparison piece"
                aria-label="Select piece to compare against"
              >
                {MASTER_PRODUCTS.filter((p) => p.id !== productA.id).map((p) => (
                  <option key={p.id} value={p.id} className="bg-obsidian-900 text-white">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-xs font-mono text-accent-pink">{formatPrice(currentProductB.price)}</div>
            <button
              type="button"
              onClick={() => handleChoose(currentProductB)}
              className="w-full py-1.5 rounded-xl bg-accent-crimson hover:bg-accent-crimson/90 text-white text-[10px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm"
            >
              {chosenId === currentProductB.id ? <Check size={12} /> : <ShoppingBag size={12} />}
              <span>{chosenId === currentProductB.id ? 'Chosen' : 'Choose This'}</span>
            </button>
          </div>
        </div>

        {/* Spec Matrix Rows */}
        <div className="space-y-2.5 text-xs">
          {specs.map((row, idx) => (
            <div
              key={idx}
              className="grid grid-cols-12 gap-3 p-2.5 rounded-xl bg-obsidian-950/40 border border-white/5 items-center"
            >
              <div className="col-span-4 font-mono text-[11px] text-white/50">{row.label}</div>
              <div className="col-span-4 text-white/90 font-medium">
                {row.valA}
                <span className="ml-1.5 px-1.5 py-0.5 rounded bg-accent-cyan/15 text-accent-cyan text-[9px] font-mono uppercase">
                  {row.diffA}
                </span>
              </div>
              <div className="col-span-4 text-white/90 font-medium">
                {row.valB}
                <span className="ml-1.5 px-1.5 py-0.5 rounded bg-accent-pink/15 text-accent-pink text-[9px] font-mono uppercase">
                  {row.diffB}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
