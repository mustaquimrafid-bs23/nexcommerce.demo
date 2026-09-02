'use client';

import React from 'react';
import { Lock, Check } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface PaymentAuthModalProps {
  isOpen: boolean;
  total: number;
  paymentMethod: string;
  isConfirmed: boolean;
  onClose?: () => void;
}

export function PaymentAuthModal({
  isOpen,
  total,
  paymentMethod,
  isConfirmed,
  onClose,
}: PaymentAuthModalProps) {
  if (!isOpen) return null;

  const methodDetails: Record<string, { title: string; desc: string; badge: string }> = {
    card: {
      title: '3D Secure Bank Challenge',
      desc: 'Please confirm this purchase in your bank mobile app (Verified by Visa / Mastercard Identity Check).',
      badge: '3D Secure 2.2',
    },
    klarna: {
      title: 'Klarna Direct Verification',
      desc: 'Confirming your 30-day payment authorization with Klarna Bank AB.',
      badge: 'Klarna.',
    },
    ideal: {
      title: 'iDEAL Bank Verification',
      desc: 'Authenticating your direct bank transfer in an encrypted session.',
      badge: 'iDEAL',
    },
    applepay: {
      title: 'Apple Pay Confirmation',
      desc: 'Double-click side button or authenticate with Face ID to complete order.',
      badge: 'Pay',
    },
    paypal: {
      title: 'PayPal Secure Payment',
      desc: 'Authenticating one-touch payment with PayPal.',
      badge: 'PayPal',
    },
    sepa: {
      title: 'SEPA Direct Debit',
      desc: 'Registering SEPA direct debit payment mandate with the banking network.',
      badge: 'SEPA DIRECT DEBIT',
    },
    bancontact: {
      title: 'Bancontact Belgium',
      desc: 'Connecting with Payconiq / Bancontact secure gateway.',
      badge: 'Bancontact',
    },
  };

  const current = methodDetails[paymentMethod] || methodDetails.klarna;

  return (
    <div
      id="payment-modal-overlay"
      className="fixed inset-0 z-[9000] flex items-center justify-center bg-[#01132B]/90 backdrop-blur-md p-4"
    >
      {!isConfirmed ? (
        <div
          id="eu-payment-auth-card"
          className="w-full max-w-[460px] rounded-[18px] border border-white/15 bg-gradient-to-br from-[#0A2A54]/95 to-[#01132B]/98 p-8 sm:p-9 text-center shadow-[0_30px_60px_-12px_rgba(0,0,0,0.7)]"
        >
          <div className="inline-flex items-center justify-center rounded px-2.5 py-1 text-xs font-bold bg-[#0F2042] text-white border border-white/10 mb-4">
            {current.badge}
          </div>

          <h3
            id="eu-auth-title"
            className="font-display text-xl font-bold text-white mb-2"
          >
            {current.title}
          </h3>

          <p
            id="eu-auth-desc"
            className="text-[13px] text-white/60 leading-relaxed mb-6"
          >
            {current.desc}
          </p>

          <div className="flex justify-between items-center rounded-xl border border-white/10 bg-white/[0.03] p-4 mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
              Amount to Authorise
            </span>
            <span
              id="eu-auth-amount"
              className="text-2xl font-bold text-accent-cyan font-mono"
            >
              {formatPrice(total)}
            </span>
          </div>

          {/* Animated Progress Bar */}
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mb-5">
            <div className="h-full w-1/2 bg-accent-cyan animate-[euAuthSlide_1.5s_infinite_ease-in-out]" />
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11.5px] text-white/45">
            <Lock className="h-3.5 w-3.5 text-[#34D399]" />
            <span>Bank-grade encrypted secure payment verification</span>
          </div>
        </div>
      ) : (
        <div
          id="payment-success-panel"
          className="w-full max-w-[420px] rounded-[18px] border border-white/15 bg-gradient-to-br from-[#0A2A54]/95 to-[#01132B]/98 p-10 text-center shadow-[0_30px_60px_-12px_rgba(0,0,0,0.7)]"
        >
          <div className="mx-auto mb-4.5 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#34D399] bg-[#34D399]/15 text-[#34D399]">
            <Check className="h-8 w-8 stroke-[3]" />
          </div>
          <h3 className="font-display text-2xl font-bold text-white mb-2">
            Order Confirmed
          </h3>
          <p className="text-[13.5px] text-white/60 leading-relaxed">
            Preparing your receipt, order confirmation, and delivery tracking...
          </p>
        </div>
      )}
    </div>
  );
}
