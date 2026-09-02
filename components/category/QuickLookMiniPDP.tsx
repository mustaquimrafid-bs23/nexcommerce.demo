'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, ShoppingBag, Heart, Check, ArrowRight, Star } from 'lucide-react';
import { Product } from '@/types/catalog';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';

interface QuickLookMiniPDPProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickLookMiniPDP({ product, isOpen, onClose }: QuickLookMiniPDPProps) {
  const { addItem } = useCartStore();
  const { toggleWishlist, isWishlisted } = useWishlistStore();

  const [activeImage, setActiveImage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isAdded, setIsAdded] = useState(false);

  React.useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0].name : '');
      setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : '');
      setIsAdded(false);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const wishlisted = isWishlisted(product.id);
  const gallery = [product.image, ...(product.gallery || [])].filter(Boolean);

  const handleAdd = () => {
    addItem(product, selectedSize || 'One Size');
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div
      id="plpQuickLookDrawer"
      className="fixed inset-0 z-50 flex justify-end bg-obsidian-950/70 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={`Quick look at ${product.name}`}
    >
      <div
        className="w-full max-w-lg bg-surface-card border-l border-white/15 h-full overflow-y-auto p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xl animate-slide-in-right"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-accent-cyan">
            Quick Look &middot; Mini-PDP
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-white/70 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Gallery Visual */}
        <div className="space-y-3">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-obsidian-950 p-6 flex items-center justify-center border border-white/10 shadow-lg">
            <img
              src={activeImage || product.image}
              alt={product.name}
              className="max-h-full max-w-full object-contain drop-shadow-xl"
            />
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className="absolute top-3 right-3 p-2 rounded-full bg-obsidian-950/80 border border-white/10 text-white cursor-pointer"
            >
              <Heart size={15} fill={wishlisted ? 'currentColor' : 'none'} className={wishlisted ? 'text-accent-pink' : 'text-white/60'} />
            </button>
          </div>

          {gallery.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border p-1 bg-obsidian-950 shrink-0 cursor-pointer ${
                    activeImage === img ? 'border-accent-pink' : 'border-white/10 opacity-70'
                  }`}
                >
                  <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs text-white/50 mb-1">
              <span className="uppercase font-mono">{product.category}</span>
              {product.rating && (
                <span className="flex items-center gap-1 text-amber-400">
                  <Star size={11} fill="currentColor" />
                  <span>{product.rating}</span>
                </span>
              )}
            </div>
            <h3 className="font-editorial text-2xl text-white font-normal">{product.name}</h3>
            <div className="font-mono text-xl font-bold text-white mt-1">&euro;{product.price.toFixed(2)}</div>
          </div>

          {/* Color Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs text-white/60 font-medium">Color: <span className="text-white">{selectedColor}</span></div>
              <div className="flex items-center gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                      selectedColor === c.name ? 'border-accent-pink ring-2 ring-accent-pink/30 scale-110' : 'border-white/20'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Picker */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs text-white/60 font-medium">Size: <span className="text-white">{selectedSize}</span></div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase border transition-all cursor-pointer ${
                      selectedSize === s
                        ? 'bg-white text-obsidian-950 border-white'
                        : 'bg-obsidian-950/60 border-white/10 text-white/70 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={handleAdd}
            className="w-full py-3.5 rounded-2xl bg-accent-crimson hover:bg-accent-crimson/90 text-white text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl shadow-accent-crimson/20"
          >
            {isAdded ? (
              <>
                <Check size={14} />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag size={14} />
                <span>Add to Shopping Bag</span>
              </>
            )}
          </button>

          <Link
            href={`/product/${product.id}`}
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all border border-white/10"
          >
            <span>View Full Product Details</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
