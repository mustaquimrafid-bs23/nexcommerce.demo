'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Truck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Check,
} from 'lucide-react';
import { formatPrice, resolveProductImage } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import { Product } from '@/types/catalog';

export interface OrderItem {
  id?: string;
  name?: string;
  tag?: string;
  price?: number;
  image?: string;
  quantity?: number;
  selectedSize?: string;
  product?: {
    id?: string;
    name?: string;
    price?: number;
    image?: string;
    category?: string;
    tag?: string;
    description?: string;
  };
}

export interface PlacedOrder {
  id: string;
  date: string;
  status: 'transit' | 'delivered' | 'cancelled';
  statusLabel: string;
  eta?: string;
  progress?: number;
  total: number;
  subtotal?: number;
  discount?: number;
  discountCode?: string;
  shipping?: number;
  items: OrderItem[];
  destination: string;
  courier: string;
  payment: string;
  customerName?: string;
  email?: string;
  phone?: string;
}

interface OrderCardProps {
  order: PlacedOrder;
  onCancelOrder?: (orderId: string) => void;
}

export function normalizeOrderItem(item: OrderItem) {
  const name = item.product?.name || item.name || 'Luxury Piece';
  const price = Number(item.product?.price ?? item.price ?? 0);
  const image = item.product?.image || item.image || '/assets/images/products/p1.png';
  const quantity = Math.max(1, Number(item.quantity || 1));
  const selectedSize = item.selectedSize || 'Standard';
  const tag = item.product?.category || item.tag || 'Apparel';
  const id = item.product?.id || item.id || `item-${name.replace(/\s+/g, '-').toLowerCase()}`;

  return {
    id,
    name,
    price,
    image,
    quantity,
    selectedSize,
    tag,
  };
}

export function OrderCard({ order, onCancelOrder }: OrderCardProps) {
  const { addItem } = useCartStore();
  const [reorderedAll, setReorderedAll] = useState(false);

  const isCancelled = order.status === 'cancelled';
  const isTransit = order.status === 'transit';
  const isDelivered = order.status === 'delivered';

  const normalizedItems = (order.items || []).map(normalizeOrderItem);
  const totalPieces = normalizedItems.reduce((sum, it) => sum + it.quantity, 0);
  const leadItem = normalizedItems[0];
  const maxThumbs = 4;
  const showOverflow = normalizedItems.length > maxThumbs;
  const visibleItems = showOverflow ? normalizedItems.slice(0, 3) : normalizedItems.slice(0, maxThumbs);
  const overflowCount = normalizedItems.length - visibleItems.length;

  const handleReorderAll = () => {
    normalizedItems.forEach((item) => {
      const p: Product = {
        id: item.id,
        name: item.name,
        brand: 'nexCommerce Atelier',
        category: (item.tag as any) || 'apparel',
        price: item.price,
        image: item.image,
        description: item.tag || '',
      };
      addItem(p, item.selectedSize, 'Standard', item.quantity);
    });
    setReorderedAll(true);
    setTimeout(() => setReorderedAll(false), 2200);
  };

  return (
    <div
      id={`card_${order.id}`}
      className={`rounded-2xl border transition-all overflow-hidden backdrop-blur-md ${
        isCancelled
          ? 'border-white/5 bg-[#08254c]/20 opacity-80'
          : 'border-white/10 bg-[#0A2A54]/30 hover:border-white/20'
      }`}
    >
      {/* 1. Header Bar: Meta KPIs + Status Badge */}
      <div className="p-4 sm:p-5 bg-white/[0.02] border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
        {/* Order ID */}
        <div>
          <span className="text-[9px] font-bold tracking-[0.12em] text-white/40 uppercase block">
            ORDER NUMBER
          </span>
          <div className="font-mono text-sm font-bold text-accent-cyan mt-0.5">
            {order.id}
          </div>
        </div>

        {/* Order Date */}
        <div>
          <span className="text-[9px] font-bold tracking-[0.12em] text-white/40 uppercase block">
            ORDER DATE
          </span>
          <div className="text-xs font-medium text-white/80 mt-0.5">
            {order.date}
          </div>
        </div>

        {/* Total Paid */}
        <div>
          <span className="text-[9px] font-bold tracking-[0.12em] text-white/40 uppercase block">
            TOTAL (INCL. VAT)
          </span>
          <div className="text-xs sm:text-sm font-bold text-white font-mono tabular-nums mt-0.5">
            {formatPrice(order.total)}
          </div>
        </div>

        {/* Status Badge */}
        <div>
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-wider ${
              isCancelled
                ? 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
                : isTransit
                ? 'bg-accent-cyan/15 border border-accent-cyan/30 text-accent-cyan'
                : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
            }`}
          >
            {isCancelled ? (
              <XCircle className="w-3.5 h-3.5" />
            ) : isTransit ? (
              <Truck className="w-3.5 h-3.5" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5" />
            )}
            <span>{order.statusLabel}</span>
          </div>
        </div>
      </div>

      {/* 2. Body: Visual Thumbnail Strip & Compact Meta */}
      <div className="p-4 sm:p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Thumbnail Strip + Piece Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
            {/* Visual Thumbnail Gallery */}
            <div className="flex items-center gap-2 shrink-0">
              {visibleItems.map((item, idx) => {
                const imgUrl = resolveProductImage(item.image);
                return (
                  <div
                    key={idx}
                    className="relative w-13 h-15 sm:w-15 sm:h-18 rounded-xl overflow-hidden border border-white/15 bg-[#051833] shrink-0 group transition-all hover:border-accent-cyan/50 hover:shadow-lg hover:shadow-accent-cyan/10"
                    title={`${item.name} · Qty ${item.quantity}`}
                  >
                    <img
                      src={imgUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/images/products/p1.png';
                      }}
                    />
                    {item.quantity > 1 && (
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/85 backdrop-blur-sm text-[9px] font-mono font-bold text-white border border-white/20 leading-none">
                        ×{item.quantity}
                      </span>
                    )}
                  </div>
                );
              })}

              {/* Overflow Counter Pill if > 4 items */}
              {overflowCount > 0 && (
                <Link
                  href={`/orders/${encodeURIComponent(order.id)}`}
                  className="w-13 h-15 sm:w-15 sm:h-18 rounded-xl border border-dashed border-white/25 bg-white/[0.03] hover:bg-white/[0.08] hover:border-accent-cyan transition-all flex flex-col items-center justify-center text-center shrink-0 group"
                  title={`View all ${normalizedItems.length} items`}
                >
                  <span className="text-xs sm:text-sm font-bold text-accent-cyan group-hover:scale-110 transition-transform">
                    +{overflowCount}
                  </span>
                  <span className="text-[9px] text-white/50 uppercase font-semibold tracking-wider">
                    more
                  </span>
                </Link>
              )}
            </div>

            {/* Item Title & Summary */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold tracking-wider text-accent-cyan uppercase bg-accent-cyan/10 px-2 py-0.5 rounded-full border border-accent-cyan/20">
                  {totalPieces} {totalPieces === 1 ? 'Piece' : 'Pieces'}
                </span>
                {leadItem?.tag && (
                  <span className="text-[10px] text-white/40 tracking-wider uppercase truncate">
                    {leadItem.tag}
                  </span>
                )}
              </div>

              <h4 className="text-xs sm:text-sm font-semibold text-white truncate max-w-sm sm:max-w-md mt-1">
                {leadItem ? leadItem.name : 'Curated Selection'}
                {normalizedItems.length > 1 && (
                  <span className="text-white/45 font-normal text-xs ml-1.5">
                    + {normalizedItems.length - 1} other {normalizedItems.length - 1 === 1 ? 'piece' : 'pieces'}
                  </span>
                )}
              </h4>

              {order.destination && (
                <p className="text-[11px] text-white/50 truncate max-w-sm sm:max-w-md mt-0.5">
                  <span className="text-white/30">Ship to:</span> {order.destination}
                </p>
              )}
            </div>
          </div>

          {/* Right: Unified Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 flex-wrap sm:flex-nowrap pt-1 lg:pt-0">
            <button
              type="button"
              onClick={handleReorderAll}
              className={`h-8 sm:h-9 px-3 sm:px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                reorderedAll
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-white/[0.05] border border-white/12 text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              {reorderedAll ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Added to Bag</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-3.5 h-3.5 text-accent-cyan" />
                  <span>Buy Again</span>
                </>
              )}
            </button>

            <Link
              href={`/tracking?ref=${encodeURIComponent(order.id)}`}
              className="h-8 sm:h-9 px-3 sm:px-3.5 rounded-xl border border-white/12 bg-white/[0.04] hover:bg-white/10 hover:border-white/30 text-white/80 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Truck className="w-3.5 h-3.5 text-accent-cyan" />
              <span>Track</span>
            </Link>

            <Link
              href={`/orders/${encodeURIComponent(order.id)}`}
              className="h-8 sm:h-9 px-3.5 sm:px-4 rounded-xl bg-accent-cyan text-[#01132B] text-xs font-bold flex items-center gap-1.5 hover:bg-accent-cyan/90 transition-all shadow-sm shadow-accent-cyan/20"
            >
              <span>View Order Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 3. Milestone Stepper for In-Transit Orders */}
        {isTransit && (
          <div className="pt-3.5 mt-2 border-t border-white/10 bg-white/[0.02] rounded-xl p-3.5 sm:p-4">
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent-cyan flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                <span>Live Courier Journey</span>
              </span>
              <span className="text-[11px] font-medium text-white/70">
                {order.eta || 'In Transit'}
              </span>
            </div>

            <div className="flex items-center justify-between gap-1 relative text-[10px] text-center">
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500 flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-white/80 font-medium">Confirmed</span>
              </div>
              <div className="flex-1 h-[2px] bg-gradient-to-r from-emerald-500 to-accent-cyan -mt-3" />
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="w-5 h-5 rounded-full bg-accent-cyan/20 text-accent-cyan border border-accent-cyan flex items-center justify-center animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
                </div>
                <span className="text-accent-cyan font-semibold">In Transit</span>
              </div>
              <div className="flex-1 h-[2px] bg-white/10 -mt-3" />
              <div className="flex-1 flex flex-col items-center gap-1">
                <div className="w-5 h-5 rounded-full bg-white/5 text-white/30 border border-white/10 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                </div>
                <span className="text-white/40">Delivered</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
