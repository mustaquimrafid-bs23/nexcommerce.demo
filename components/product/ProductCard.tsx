'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Heart } from 'lucide-react';
import { Product } from '@/types/catalog';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [mounted, setMounted] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isWishlisted } = useWishlistStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const wishlisted = mounted ? isWishlisted(product.id) : false;

  return (
    <div className="group rounded-3xl bg-surface-card border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col overflow-hidden shadow-xl hover:-translate-y-1">
      {/* Visual Image Container with Radial Studio Background */}
      <div className="relative aspect-[4/5] bg-surface-navy/40 overflow-hidden flex items-center justify-center p-4">
        <Link href={`/product/${product.id}`} className="block w-full h-full flex items-center justify-center">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20">
              <ShoppingBag size={40} />
            </div>
          )}
        </Link>

        {product.tag && (
          <span className="absolute top-3.5 left-3.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-obsidian-950/80 backdrop-blur-md text-white border border-white/10">
            {product.tag}
          </span>
        )}

        {/* Wishlist Floating Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={`absolute top-3.5 right-3.5 p-2.5 rounded-full backdrop-blur-md transition-all ${
            wishlisted
              ? 'bg-accent-pink text-white'
              : 'bg-obsidian-950/70 text-white/70 hover:text-white hover:bg-obsidian-950'
          }`}
          aria-label="Save to favourites"
        >
          <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Details Section */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3 bg-obsidian-950/70 border-t border-white/5">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-accent-cyan font-semibold mb-1">
            {product.category}
          </div>
          <Link href={`/product/${product.id}`} className="block">
            <h3 className="font-editorial text-lg text-white font-medium hover:text-accent-pink transition-colors truncate">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-white/60 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <span className="text-sm font-semibold text-white">
            {formatPrice(product.price, product.currency)}
          </span>

          <button
            onClick={() =>
              addItem(
                product,
                product.sizes ? product.sizes[0] : undefined,
                product.colors ? product.colors[0].name : undefined
              )
            }
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-accent-crimson text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <ShoppingBag size={13} />
            <span>Quick Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
