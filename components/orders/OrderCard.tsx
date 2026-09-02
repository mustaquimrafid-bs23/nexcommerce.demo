'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Truck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Printer,
  RotateCcw,
  Check,
  Package,
} from 'lucide-react';
import { formatPrice, resolveProductImage } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import { Product } from '@/types/catalog';

export interface OrderItem {
  id?: string;
  name: string;
  tag?: string;
  price: number;
  image: string;
  quantity?: number;
  selectedSize?: string;
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

export function OrderCard({ order, onCancelOrder }: OrderCardProps) {
  const { addItem } = useCartStore();
  const [reorderedId, setReorderedId] = useState<string | null>(null);

  const isCancelled = order.status === 'cancelled';
  const isTransit = order.status === 'transit';
  const isDelivered = order.status === 'delivered';

  const handleReorder = (item: OrderItem) => {
    const p: Product = {
      id: item.id || `reorder-${item.name.replace(/\s+/g, '-').toLowerCase()}`,
      name: item.name,
      brand: 'nexCommerce Atelier',
      category: 'apparel',
      price: item.price,
      image: item.image,
      description: item.tag || '',
    };

    addItem(p, item.selectedSize || 'M', 'Standard', item.quantity || 1);
    setReorderedId(item.name);
    setTimeout(() => setReorderedId(null), 2000);
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
      {/* Header Bar */}
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

      {/* Body: Items Preview List */}
      <div className="p-4 sm:p-6 space-y-4">
        <div className="divide-y divide-white/5">
          {order.items.map((item, idx) => {
            const imgUrl = resolveProductImage(item.image);
            const isAdded = reorderedId === item.name;

            return (
              <div
                key={idx}
                className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                {/* Thumb + Meta */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-14 rounded-lg overflow-hidden border border-white/10 bg-[#071A3A] shrink-0">
                    <img
                      src={imgUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/images/products/p1.png';
                      }}
                    />
                  </div>

                  <div className="min-w-0">
                    {item.tag && (
                      <span className="text-[9px] font-semibold text-white/40 tracking-wider uppercase block">
                        {item.tag}
                      </span>
                    )}
                    <h4 className="text-xs sm:text-sm font-semibold text-white truncate">
                      {item.name}
                    </h4>
                    <div className="text-[11px] text-white/50 mt-0.5">
                      Qty {item.quantity || 1} &middot;{' '}
                      <strong className="text-white/80 font-mono">
                        {formatPrice((item.price || 0) * (item.quantity || 1))}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Re-order Action */}
                <div className="shrink-0 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleReorder(item)}
                    className={`h-8 px-3.5 rounded-lg text-[10.5px] font-bold tracking-wider uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-white/[0.05] border border-white/10 text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-3 h-3 text-accent-cyan" />
                        <span>Re-order</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Milestone Stepper for In-Transit Orders */}
        {isTransit && (
          <div className="mt-4 pt-4 border-t border-white/10 bg-white/[0.02] rounded-xl p-4">
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent-cyan flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                <span>Live Courier Status</span>
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

        {/* Footer Actions */}
        <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-white/50 truncate max-w-sm">
            <span className="text-white/30">Destination:</span> {order.destination}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/tracking?ref=${encodeURIComponent(order.id)}`}
              className="h-8 px-3.5 rounded-lg border border-white/20 text-white/80 hover:text-white hover:border-white text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Truck className="w-3.5 h-3.5 text-accent-cyan" />
              <span>Track Shipment</span>
            </Link>
            <Link
              href={`/orders/${encodeURIComponent(order.id)}`}
              className="h-8 px-4 rounded-lg bg-accent-cyan text-[#01132B] text-xs font-bold flex items-center gap-1.5 hover:bg-accent-cyan/90 transition-all shadow-sm"
            >
              <span>View Order Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
