'use client';

import React from 'react';
import { Package } from 'lucide-react';
import { CartItem } from '@/types/catalog';
import { formatPrice, resolveProductImage } from '@/lib/utils';

interface OrderItemsBreakdownProps {
  items: CartItem[];
}

export function OrderItemsBreakdown({ items = [] }: OrderItemsBreakdownProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0A2A54]/35 p-6 backdrop-blur-md">
      <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] uppercase text-white/50 mb-4">
        <Package className="w-4 h-4 text-accent-cyan" />
        <span>Items Ordered</span>
      </div>

      <div id="conf-items-list" className="divide-y divide-white/5">
        {items.map((item, idx) => {
          const product = item.product;
          const imgUrl = resolveProductImage(product.image);
          const lineTotal = (product.price || 0) * (item.quantity || 1);
          const categoryTag = (product.category || 'APPAREL').toUpperCase();

          return (
            <div
              key={product.id || idx}
              className="py-4 first:pt-1 last:pb-0 flex items-center justify-between gap-4"
            >
              {/* Product Thumbnail & Meta */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-16 h-20 rounded-lg overflow-hidden border border-white/10 bg-[#071A3A] shrink-0">
                  <img
                    src={imgUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/images/products/p1.png';
                    }}
                  />
                </div>

                <div className="min-w-0">
                  <span className="text-[9.5px] font-bold tracking-[0.12em] uppercase text-white/40 block">
                    {categoryTag}
                  </span>
                  <h4 className="text-sm font-semibold text-white truncate mt-0.5">
                    {product.name}
                  </h4>
                  <div className="text-xs text-white/45 mt-1 flex items-center gap-1.5">
                    <span>{item.selectedSize ? `${item.selectedSize}` : 'Standard'}</span>
                    <span>&middot;</span>
                    <span>Qty {item.quantity || 1}</span>
                  </div>
                </div>
              </div>

              {/* Pricing Column */}
              <div className="text-right shrink-0">
                <div className="text-sm font-bold text-white font-mono tabular-nums">
                  {formatPrice(lineTotal, product.currency)}
                </div>
                {item.quantity > 1 && (
                  <div className="text-[11px] text-white/40 tabular-nums">
                    {formatPrice(product.price, product.currency)} each
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
