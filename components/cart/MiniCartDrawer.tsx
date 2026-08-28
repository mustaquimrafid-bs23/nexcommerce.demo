'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';

export function MiniCartDrawer() {
  const [mounted, setMounted] = useState(false);
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal } =
    useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  const subtotal = getSubtotal();

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <aside className="relative w-full max-w-md bg-obsidian-950 border-l border-white/10 h-full flex flex-col z-10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-accent-pink" />
            <h2 className="text-lg font-semibold tracking-wide text-white">Shopping Bag</h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/5 transition-colors"
            aria-label="Close bag"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <ShoppingBag size={48} className="mx-auto text-white/20" />
              <p className="text-white/60 text-sm">Your shopping bag is currently empty.</p>
              <button
                onClick={closeCart}
                className="px-6 py-2.5 rounded-full border border-white/20 text-white text-xs font-semibold uppercase tracking-wider hover:bg-white/5 transition-colors"
              >
                Explore Collections
              </button>
            </div>
          ) : (
            items.map((item, idx) => (
              <div
                key={`${item.product.id}-${item.selectedSize}-${idx}`}
                className="flex gap-4 p-3 rounded-xl bg-surface-navy/40 border border-white/5"
              >
                <div className="relative w-20 h-20 bg-surface-navy/60 p-1 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-white/10">
                  {item.product.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20">
                      <ShoppingBag size={24} />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-white truncate">{item.product.name}</h3>
                  <p className="text-xs text-white/50 mt-0.5">{formatPrice(item.product.price, item.product.currency)}</p>
                  {item.selectedSize && (
                    <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded bg-white/5 text-white/70">
                      Size: {item.selectedSize}
                    </span>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-white/10 rounded-md">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity - 1,
                            item.selectedSize,
                            item.selectedColor
                          )
                        }
                        className="px-2 py-0.5 text-xs text-white/60 hover:text-white"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-medium text-white">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity + 1,
                            item.selectedSize,
                            item.selectedColor
                          )
                        }
                        className="px-2 py-0.5 text-xs text-white/60 hover:text-white"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() =>
                        removeItem(item.product.id, item.selectedSize, item.selectedColor)
                      }
                      className="text-white/40 hover:text-accent-crimson transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-obsidian-900/80 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/60">Estimated Subtotal</span>
              <span className="text-white font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <Link
              href="/cart"
              onClick={closeCart}
              className="block w-full py-3.5 text-center rounded-xl bg-accent-crimson text-white font-semibold text-xs uppercase tracking-widest hover:bg-accent-crimson/90 transition-colors shadow-lg shadow-accent-crimson/20"
            >
              Review Bag &amp; Checkout
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
