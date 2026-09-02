'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { X, ShoppingBag, Heart, Check, ArrowRight, Star, ShieldCheck, Truck } from 'lucide-react';
import { Product } from '@/types/catalog';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCurrencyStore } from '@/store/useCurrencyStore';

interface QuickLookMiniPDPProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickLookMiniPDP({ product, isOpen, onClose }: QuickLookMiniPDPProps) {
  const { addItem } = useCartStore();
  const { toggleWishlist, isWishlisted } = useWishlistStore();
  const formatPrice = useCurrencyStore((state) => state.formatPrice);

  const [mounted, setMounted] = useState(false);
  const [activeImage, setActiveImage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0].name : '');
      setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : '');
      setIsAdded(false);
    }
  }, [product]);

  // Keyboard Escape listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  if (!mounted || !isOpen || !product) return null;

  const wishlisted = isWishlisted(product.id);
  const gallery = [product.image, ...(product.gallery || [])].filter(Boolean);

  const handleAdd = () => {
    addItem(product, selectedSize || 'One Size', selectedColor || undefined);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return createPortal(
    <div
      id="plpQuickLookDrawer"
      className="fixed inset-0 z-[999] flex justify-end bg-black/70 backdrop-blur-md transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view of ${product.name}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <aside
        className="w-full max-w-[520px] bg-[#080E1E] border-l border-white/12 h-full max-h-screen flex flex-col justify-between shadow-2xl animate-slide-in-right overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Header */}
        <div className="quicklook-header px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#3DE0FF]">
              QUICK VIEW
            </span>
            <span className="text-white/30">|</span>
            <span className="text-[10px] uppercase font-semibold text-white/50 tracking-wider">
              {product.brand || 'ARC'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
            aria-label="Close Quick Look"
          >
            <X size={16} />
          </button>
        </div>

        {/* 2. Scrollable Body */}
        <div className="quicklook-body flex-1 overflow-y-auto p-6 space-y-5" data-lenis-prevent>
          {/* Media Stage */}
          <div className="space-y-3">
            <div className="relative w-full h-[250px] sm:h-[270px] rounded-xl overflow-hidden bg-radial from-[#0F1D38] to-[#030713] border border-white/10 flex items-center justify-center p-4 shadow-inner">
              <img
                src={activeImage || product.image}
                alt={product.name}
                className="max-h-full max-w-full object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.7)] transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`absolute top-3 right-3 p-2.5 rounded-full border transition-all cursor-pointer backdrop-blur-md ${
                  wishlisted
                    ? 'bg-[#E60C45] border-[#E60C45] text-white shadow-lg'
                    : 'bg-black/60 border-white/15 text-white/60 hover:text-white hover:border-white/40'
                }`}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart size={14} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Thumbnail Filmstrip */}
            {gallery.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`w-13 h-13 rounded-lg overflow-hidden border p-1 bg-[#040916] shrink-0 cursor-pointer transition-all ${
                      activeImage === img
                        ? 'border-[#3DE0FF] ring-2 ring-[#3DE0FF]/30 opacity-100'
                        : 'border-white/12 opacity-65 hover:opacity-100 hover:border-white/30'
                    }`}
                  >
                    <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between text-[10px] text-white/50 uppercase tracking-widest">
              <span>{product.category}</span>
              {product.rating && (
                <span className="flex items-center gap-1 text-amber-400 font-semibold">
                  <Star size={11} fill="currentColor" />
                  <span>{product.rating}</span>
                </span>
              )}
            </div>

            <h3 className="font-editorial text-2xl text-white font-medium tracking-tight">
              {product.name}
            </h3>

            <div className="text-xl font-bold text-white font-mono tabular-nums">
              {formatPrice(product.price)}
            </div>

            {/* Delivery & Authenticity Trust Row */}
            <div className="flex items-center gap-4 py-2 text-[11px] text-white/65 border-y border-white/8">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Truck size={13} />
                <span>Free express delivery</span>
              </span>
              <span className="flex items-center gap-1.5 text-white/60">
                <ShieldCheck size={13} />
                <span>100% genuine</span>
              </span>
            </div>

            {/* Colour Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="text-xs text-white/70 font-medium">
                  Colour: <span className="text-white font-semibold">{selectedColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => {
                        setSelectedColor(c.name);
                        if (c.img) setActiveImage(c.img);
                      }}
                      className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                        selectedColor === c.name
                          ? 'border-[#3DE0FF] ring-2 ring-[#3DE0FF]/40 scale-110 shadow-md'
                          : 'border-white/20 hover:scale-105 opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                      aria-label={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="text-xs text-white/70 font-medium">
                  Size: <span className="text-white font-semibold">{selectedSize}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`px-3.5 py-1.5 rounded-md text-xs font-semibold uppercase border transition-all cursor-pointer ${
                        selectedSize === s
                          ? 'bg-white text-[#01132B] border-white shadow-md'
                          : 'bg-white/[0.04] border-white/12 text-white/70 hover:text-white hover:border-white/30'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. Sticky Footer Actions */}
        <div className="quicklook-footer p-5 border-t border-white/10 bg-black/70 backdrop-blur-md space-y-2.5 shrink-0">
          <button
            type="button"
            onClick={handleAdd}
            className={`w-full py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-98 ${
              isAdded
                ? 'bg-emerald-500 text-white'
                : 'bg-[#E60C45] hover:bg-[#E60C45]/90 text-white shadow-[#E60C45]/20'
            }`}
          >
            {isAdded ? (
              <>
                <Check size={15} strokeWidth={3} />
                <span>Added to Bag ✓</span>
              </>
            ) : (
              <>
                <ShoppingBag size={15} />
                <span>Add to Bag</span>
              </>
            )}
          </button>

          <Link
            href={`/product/${product.id}`}
            onClick={onClose}
            className="w-full py-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all border border-white/12"
          >
            <span>View full details</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </aside>
    </div>,
    document.body
  );
}
