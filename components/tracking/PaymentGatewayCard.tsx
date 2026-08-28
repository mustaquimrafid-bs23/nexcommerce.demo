'use client';

import React, { useState } from 'react';
import { Smartphone, CreditCard, Clock, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';
import { TrackingOrder } from './types';
import { formatPrice } from '@/lib/utils';

interface PaymentGatewayCardProps {
  order: TrackingOrder;
  onPaymentSuccess: (updatedOrder: TrackingOrder) => void;
}

export default function PaymentGatewayCard({ order, onPaymentSuccess }: PaymentGatewayCardProps) {
  const [selectedMethod, setSelectedMethod] = useState<'apple_pay' | 'card' | 'klarna'>('apple_pay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [stepText, setStepText] = useState('');

  const isCOD =
    order.paymentStatus === 'pending_cod' ||
    (order.paymentMethod?.toLowerCase().includes('cash on delivery') &&
      order.paymentStatus !== 'paid');

  if (order.paidOnline || (order.paymentStatus === 'paid' && order.previouslyCOD)) {
    return (
      <div
        id="trackingPaymentSuccessCard"
        className="rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-emerald-500/20 via-[#08254c]/90 to-[#08254c]/95 border border-emerald-500/40 backdrop-blur-xl shadow-lg flex items-center justify-between gap-4 flex-wrap"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">Payment Settled &amp; Verified</h3>
            <p className="text-xs text-white/80">
              Your order has been paid online via{' '}
              <strong className="text-white">
                {order.paymentMethod || 'Apple Pay / Visa Debit'}
              </strong>
              . Priority contactless delivery is active.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400">
          PAID IN FULL
        </span>
      </div>
    );
  }

  if (!isCOD) return null;

  const totalFormatted = formatPrice(order.total || 256.5);

  const handleAuthorize = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setStepText('AUTHENTICATING PAYMENT GATEWAY...');

    setTimeout(() => {
      setStepText('VERIFYING 3D SECURE TOKEN...');
      setTimeout(() => {
        let methodLabel = 'Apple Pay / Visa 3DS';
        if (selectedMethod === 'card') methodLabel = 'Card ending in 4242 (Visa)';
        else if (selectedMethod === 'klarna') methodLabel = 'Klarna Pay Later (30 Days)';

        const updated: TrackingOrder = {
          ...order,
          paymentStatus: 'paid',
          paidOnline: true,
          previouslyCOD: true,
          paymentMethod: `Paid online via ${methodLabel}`,
        };

        // Persist to localStorage if placed orders exist
        try {
          const stored = localStorage.getItem('nex_placed_orders');
          if (stored) {
            const list = JSON.parse(stored);
            if (Array.isArray(list)) {
              const match = list.find((o) => (o.id || o.ref) === (order.id || order.ref));
              if (match) {
                match.paymentStatus = 'paid';
                match.paidOnline = true;
                match.previouslyCOD = true;
                match.paymentMethod = updated.paymentMethod;
                localStorage.setItem('nex_placed_orders', JSON.stringify(list));
              }
            }
          }
        } catch (_) {}

        setIsProcessing(false);
        onPaymentSuccess(updated);
      }, 700);
    }, 700);
  };

  return (
    <div
      id="trackingPaymentGateway"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#08254c]/95 via-[#0a2a54]/90 to-[#08254c]/98 border border-accent-cyan/35 p-6 backdrop-blur-xl shadow-2xl space-y-5"
    >
      {/* Ambient Spotlight */}
      <div
        className="absolute -top-10 -right-10 w-48 h-48 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(61, 224, 255, 0.18) 0%, transparent 70%)',
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/10 flex-wrap gap-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 text-[10.5px] font-bold tracking-wider uppercase">
          <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_#fbbf24] animate-pulse" />
          <span>PAYMENT MODE: CASH ON DELIVERY</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[9px] font-bold tracking-wider uppercase text-white/60">
            TOTAL DUE BEFORE DELIVERY
          </span>
          <span className="text-lg font-bold text-accent-cyan tabular-nums">{totalFormatted}</span>
        </div>
      </div>

      {/* Body Info */}
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-white tracking-tight">Pay Online Before Delivery</h2>
        <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-2xl">
          Enjoy 100% contact-free express courier delivery by completing your payment online now with
          1-touch biometric or card authorization.
        </p>
      </div>

      {/* Segmented Payment Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Apple / Google Pay */}
        <button
          type="button"
          onClick={() => setSelectedMethod('apple_pay')}
          className={`p-3.5 rounded-xl border flex items-center justify-between text-left transition-all ${
            selectedMethod === 'apple_pay'
              ? 'bg-accent-cyan/20 border-accent-cyan shadow-[0_0_16px_rgba(61,224,255,0.25)]'
              : 'bg-[#00142e]/60 border-white/15 hover:border-white/30'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-accent-cyan">
              <Smartphone size={16} />
            </div>
            <div className="flex flex-col">
              <strong className="text-xs text-white font-semibold">Apple / Google Pay</strong>
              <small className="text-[10px] text-white/60">1-Touch Biometrics</small>
            </div>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent-cyan/15 border border-accent-cyan/30 text-accent-cyan">
            INSTANT
          </span>
        </button>

        {/* Credit / Debit Card */}
        <button
          type="button"
          onClick={() => setSelectedMethod('card')}
          className={`p-3.5 rounded-xl border flex items-center justify-between text-left transition-all ${
            selectedMethod === 'card'
              ? 'bg-accent-cyan/20 border-accent-cyan shadow-[0_0_16px_rgba(61,224,255,0.25)]'
              : 'bg-[#00142e]/60 border-white/15 hover:border-white/30'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-accent-cyan">
              <CreditCard size={16} />
            </div>
            <div className="flex flex-col">
              <strong className="text-xs text-white font-semibold">Debit / Credit Card</strong>
              <small className="text-[10px] text-white/60">Visa / Mastercard</small>
            </div>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent-cyan/15 border border-accent-cyan/30 text-accent-cyan">
            ENCRYPTED
          </span>
        </button>

        {/* Klarna Pay Later */}
        <button
          type="button"
          onClick={() => setSelectedMethod('klarna')}
          className={`p-3.5 rounded-xl border flex items-center justify-between text-left transition-all ${
            selectedMethod === 'klarna'
              ? 'bg-accent-cyan/20 border-accent-cyan shadow-[0_0_16px_rgba(61,224,255,0.25)]'
              : 'bg-[#00142e]/60 border-white/15 hover:border-white/30'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-accent-cyan">
              <Clock size={16} />
            </div>
            <div className="flex flex-col">
              <strong className="text-xs text-white font-semibold">Klarna Pay Later</strong>
              <small className="text-[10px] text-white/60">Pay in 30 Days &middot; 0% APR</small>
            </div>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent-cyan/15 border border-accent-cyan/30 text-accent-cyan">
            0% APR
          </span>
        </button>
      </div>

      {/* Authorize Button */}
      <button
        type="button"
        id="btnAuthorizeOnlinePay"
        onClick={handleAuthorize}
        disabled={isProcessing}
        className="w-full h-12 rounded-xl bg-gradient-to-r from-[#3de0ff] to-[#0088ff] hover:from-[#5ae5ff] hover:to-[#1a94ff] text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-accent-cyan/25 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>{stepText}</span>
          </>
        ) : (
          <>
            <ShieldCheck size={16} />
            <span>AUTHORISE PAYMENT NOW &middot; {totalFormatted}</span>
          </>
        )}
      </button>
    </div>
  );
}
