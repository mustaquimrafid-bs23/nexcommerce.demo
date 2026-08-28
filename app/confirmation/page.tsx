'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  Package,
  Truck,
  ShieldCheck,
  Printer,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { CartItem } from '@/types/catalog';

interface OrderData {
  orderId: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  client: {
    name: string;
    email: string;
    address: string;
    apartment: string;
    city: string;
    postalCode: string;
  };
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const queryOrderId = searchParams ? searchParams.get('orderId') || 'NX-ORD-982412' : 'NX-ORD-982412';
  const [mounted, setMounted] = useState(false);
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('latest_order');
      if (stored) {
        try {
          setOrder(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Header Confirmation */}
      <section className="bg-obsidian-950 border-b border-white/10 pt-16 pb-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
            <CheckCircle2 size={32} />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white/80">
              <Sparkles size={12} className="text-accent-pink" />
              <span>Order Reference: {order ? order.orderId : queryOrderId}</span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl font-light text-white tracking-tight">
              Thank You For Your <br />
              <span className="italic font-normal">Atelier Patronage</span>
            </h1>

            <p className="text-xs sm:text-sm text-white/70 max-w-lg mx-auto leading-relaxed">
              We have received your order authorization. Your creations are now entering bespoke packaging and courier preparation in our atelier.
            </p>
          </div>

          {/* Action Row */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/tracking"
              className="px-8 py-3.5 rounded-full bg-white text-obsidian-950 font-semibold text-xs uppercase tracking-widest hover:bg-white/90 transition-all flex items-center gap-2 shadow-lg shadow-white/5"
            >
              <Truck size={16} />
              <span>Live Courier Journey</span>
            </Link>

            <button
              onClick={() => window.print()}
              className="px-6 py-3.5 rounded-full bg-surface-navy/60 border border-white/15 text-white font-semibold text-xs uppercase tracking-widest hover:bg-surface-navy transition-all flex items-center gap-2"
            >
              <Printer size={16} />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>
      </section>

      {/* Itemized Order Receipt Details */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-8">
        <div className="p-8 rounded-3xl bg-surface-navy/35 border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 text-xs">
            <div>
              <div className="text-white/50">Recipient Atelier Delivery Address</div>
              <div className="text-white font-medium mt-1">
                {order ? `${order.client.name}` : 'Eleanor Vance'}
              </div>
              <div className="text-white/70">
                {order
                  ? `${order.client.address}, ${order.client.apartment || ''}, ${order.client.city}`
                  : 'Gulshan Avenue, Road 45, House 12, Dhaka'}
              </div>
            </div>

            <div className="sm:text-right">
              <div className="text-white/50">Estimated Atelier Arrival</div>
              <div className="text-emerald-400 font-semibold mt-1">2–3 Business Days</div>
              <div className="text-white/40">Express Courier Service</div>
            </div>
          </div>

          {/* Items Breakdown */}
          {order && order.items && order.items.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-editorial text-lg text-white">Itemized Creations</h3>
              <div className="divide-y divide-white/5">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 rounded bg-surface-card overflow-hidden">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-white font-medium">{item.product.name}</div>
                        <div className="text-white/50">
                          Qty: {item.quantity} {item.selectedSize ? `• ${item.selectedSize}` : ''}
                        </div>
                      </div>
                    </div>

                    <span className="text-white font-semibold">
                      {formatPrice(item.product.price * item.quantity, item.product.currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing Math */}
          {order && (
            <div className="pt-4 border-t border-white/10 space-y-2 text-xs">
              <div className="flex justify-between text-white/70">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Privilege Discount</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-white/70">
                <span>Express Courier Dispatch</span>
                <span>{order.shipping === 0 ? 'COMPLIMENTARY' : formatPrice(order.shipping)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-4 border-t border-white/10 text-base">
                <span className="font-editorial text-xl text-white">Total Settled</span>
                <span className="font-bold text-2xl text-white">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="text-center pt-4">
          <Link
            href="/category"
            className="inline-flex items-center gap-2 text-xs font-semibold text-white/80 hover:text-white transition-colors"
          >
            <span>Return to Maison Discovery</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-accent-pink border-t-transparent animate-spin" />
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
