'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import {
  FileText,
  Printer,
  RotateCcw,
  Headphones,
  Compass,
  XCircle,
  ShieldCheck,
  Check,
  X,
  QrCode,
  MessageSquare,
  PhoneCall,
  Sparkles,
} from 'lucide-react';

interface OrderActionHubProps {
  orderRef: string;
  stage: number; // 1 to 4
  courier?: string;
  trackingNumber?: string;
}

export function OrderActionHub({
  orderRef,
  stage = 4,
  courier = 'DHL Express',
  trackingNumber,
}: OrderActionHubProps) {
  const [mounted, setMounted] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnSubmitted, setReturnSubmitted] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const canCancel = stage <= 1 && !isCancelled;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleConfirmCancel = () => {
    setIsCancelled(true);
    setShowCancelModal(false);
  };

  // Generate deterministic QR dot positions for return code
  const returnCode = `RET-${orderRef.replace(/[^A-Z0-9]/gi, '')}-PACKSTATION`;

  return (
    <div
      id="orderActionHub"
      className="rounded-2xl border border-white/10 bg-[#0A2A54]/30 backdrop-blur-md p-6 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.25)] space-y-4"
    >
      <div className="flex items-center gap-2.5 pb-4 border-b border-white/10">
        <Compass className="w-4 h-4 text-accent-cyan" />
        <h3 className="text-xs font-bold tracking-[0.14em] uppercase text-white">
          ORDER MANAGEMENT &amp; SERVICES
        </h3>
      </div>

      <div className="space-y-2.5">
        {/* 1. Download Invoice (PDF) */}
        <button
          type="button"
          id="btnDownloadInvoice"
          onClick={handlePrint}
          className="w-full h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-emerald-500/25 transition-all cursor-pointer shadow-sm active:scale-[0.99]"
        >
          <FileText className="w-4 h-4 text-emerald-400" />
          <span>Download Tax Invoice (PDF)</span>
        </button>

        {/* 2. Print Physical Receipt */}
        <button
          type="button"
          id="btnPrintReceipt"
          onClick={handlePrint}
          className="w-full h-11 rounded-xl bg-white/[0.06] border border-white/12 text-white hover:bg-white/[0.12] text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
        >
          <Printer className="w-4 h-4 text-accent-cyan" />
          <span>Print Physical Receipt</span>
        </button>

        {/* 3. Return or Exchange */}
        <button
          type="button"
          id="btnReturnExchange"
          onClick={() => {
            setShowReturnModal(true);
            setReturnSubmitted(false);
          }}
          className="w-full h-11 rounded-xl bg-white/[0.06] border border-white/12 text-white hover:bg-white/[0.12] text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
        >
          <RotateCcw className="w-4 h-4 text-amber-400" />
          <span>Start Return or Exchange</span>
        </button>

        {/* 4. Atelier Customer Care / Concierge */}
        <button
          type="button"
          id="btnCustomerCare"
          onClick={() => setShowSupportModal(true)}
          className="w-full h-11 rounded-xl bg-white/[0.06] border border-white/12 text-white hover:bg-white/[0.12] text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
        >
          <Headphones className="w-4 h-4 text-accent-cyan" />
          <span>Need Help? Contact Concierge</span>
        </button>

        {/* 5. Conditional Cancel Button (Only if unfulfilled/stage 1) */}
        {canCancel && (
          <button
            type="button"
            id="btnOrderCancel"
            onClick={() => setShowCancelModal(true)}
            className="w-full h-11 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-rose-500/25 transition-all cursor-pointer shadow-xs"
          >
            <XCircle className="w-4 h-4" />
            <span>Cancel Order</span>
          </button>
        )}

        {isCancelled && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
            Cancellation requested for {orderRef}. Customer service will confirm refund.
          </div>
        )}
      </div>

      {/* Return & Warranty Guarantee */}
      <div className="mt-5 pt-4 border-t border-white/10 flex items-start gap-2.5 text-[11px] text-white/50 leading-relaxed">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <span>
          30-day complimentary atelier returns &amp; 2-year luxury craftsmanship warranty on all pieces.
        </span>
      </div>

      {/* Portaled Return / Exchange Modal with Contactless Drop-off QR */}
      {mounted && showReturnModal && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="fixed inset-0" onClick={() => setShowReturnModal(false)} />
          <div className="max-w-md w-full rounded-2xl bg-[#012148] border border-white/20 p-6 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.85)] space-y-4 relative z-10 animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[9.5px] font-bold tracking-[0.14em] uppercase text-amber-400 block mb-0.5">
                  COMPLIMENTARY RETURN
                </span>
                <h3 className="text-base font-bold text-white">Return or Exchange: {orderRef}</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowReturnModal(false)}
                className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white flex items-center justify-center transition-all cursor-pointer -mt-1 -mr-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!returnSubmitted ? (
              <>
                <p className="text-xs text-white/70 leading-relaxed">
                  Generate an instant, paperless DHL Packstation return QR code. No home printing required. Please select a reason:
                </p>
                <select className="w-full bg-[#01132B] border border-white/15 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-accent-cyan">
                  <option value="size">Exchange for a different size</option>
                  <option value="preference">Style preference changed</option>
                  <option value="condition">Inquiry regarding tailoring fit</option>
                  <option value="other">Other reason</option>
                </select>
                <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowReturnModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 text-xs text-white hover:bg-white/10 font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setReturnSubmitted(true)}
                    className="px-5 py-2.5 rounded-xl bg-accent-cyan text-xs font-bold text-[#000B1A] hover:bg-accent-cyan/90 cursor-pointer shadow-lg shadow-accent-cyan/20 inline-flex items-center gap-1.5 transition-all"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Generate Drop-off QR</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="py-2 text-center space-y-4">
                {/* Contactless QR Box */}
                <div className="w-36 h-36 bg-white p-2 rounded-2xl mx-auto shadow-2xl flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <rect width="100" height="100" fill="#FFFFFF" />
                    <rect x="8" y="8" width="26" height="26" fill="#000000" />
                    <rect x="12" y="12" width="18" height="18" fill="#FFFFFF" />
                    <rect x="16" y="16" width="10" height="10" fill="#000000" />
                    <rect x="66" y="8" width="26" height="26" fill="#000000" />
                    <rect x="70" y="12" width="18" height="18" fill="#FFFFFF" />
                    <rect x="74" y="16" width="10" height="10" fill="#000000" />
                    <rect x="8" y="66" width="26" height="26" fill="#000000" />
                    <rect x="12" y="70" width="18" height="18" fill="#FFFFFF" />
                    <rect x="16" y="74" width="10" height="10" fill="#000000" />
                    <rect x="42" y="14" width="6" height="6" fill="#000000" />
                    <rect x="52" y="24" width="6" height="6" fill="#000000" />
                    <rect x="40" y="44" width="8" height="8" fill="#000000" />
                    <rect x="54" y="50" width="6" height="6" fill="#000000" />
                    <rect x="68" y="42" width="6" height="6" fill="#000000" />
                    <rect x="42" y="72" width="8" height="8" fill="#000000" />
                    <rect x="60" y="70" width="6" height="6" fill="#000000" />
                    <rect x="74" y="60" width="8" height="8" fill="#000000" />
                  </svg>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Contactless QR Generated</h4>
                  <p className="text-xs text-emerald-400 font-medium">
                    Show this QR code at any DHL Packstation or parcel shop.
                  </p>
                  <span className="font-mono text-[11px] text-white/50 block mt-1">
                    {returnCode}
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReturnModal(false)}
                    className="px-6 py-2.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white font-semibold hover:bg-white/15 cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* Portaled Concierge Modal with WhatsApp & Priority Channels */}
      {mounted && showSupportModal && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="fixed inset-0" onClick={() => setShowSupportModal(false)} />
          <div className="max-w-md w-full rounded-2xl bg-[#012148] border border-white/20 p-6 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.85)] space-y-4 relative z-10 animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[9.5px] font-bold tracking-[0.14em] uppercase text-accent-cyan flex items-center gap-1 mb-0.5">
                  <Sparkles className="w-3 h-3" />
                  <span>24/7 PRIVATE CLIENT SERVICE</span>
                </span>
                <h3 className="text-base font-bold text-white">Atelier Concierge</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSupportModal(false)}
                className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white flex items-center justify-center transition-all cursor-pointer -mt-1 -mr-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-white/70 leading-relaxed">
              Our dedicated client specialists are available 24/7 for tailoring inquiries, special courier delivery instructions, or urgent dispatch adjustments.
            </p>

            <div className="space-y-2.5">
              {/* Direct WhatsApp Channel */}
              <a
                href="https://wa.me/498920187600"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-emerald-500/25 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Chat via WhatsApp (+49 89 2018 7600)</span>
              </a>

              {/* Direct Concierge Phone */}
              <a
                href="tel:+498920187600"
                className="w-full h-11 rounded-xl bg-white/[0.06] border border-white/12 text-white text-xs font-semibold flex items-center justify-center gap-2 hover:bg-white/[0.12] transition-all cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-accent-cyan" />
                <span>Call Priority Line (+49 89 2018 7600)</span>
              </a>
            </div>

            <div className="p-3.5 rounded-xl bg-[#01132B] border border-white/10 text-xs space-y-1 text-white/60">
              <div className="flex justify-between">
                <span>Email Support:</span>
                <span className="text-accent-cyan font-medium">concierge@nexcommerce.de</span>
              </div>
              <div className="flex justify-between">
                <span>Average Response Time:</span>
                <span className="text-emerald-400 font-medium">Under 10 Minutes</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowSupportModal(false)}
                className="px-6 py-2.5 rounded-xl bg-white/10 border border-white/15 text-xs font-semibold text-white hover:bg-white/15 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Portaled Cancel Confirmation Modal */}
      {mounted && showCancelModal && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="fixed inset-0" onClick={() => setShowCancelModal(false)} />
          <div className="max-w-md w-full rounded-2xl bg-[#012148] border border-white/20 p-6 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.85)] space-y-4 relative z-10 animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-bold text-white">Cancel Order {orderRef}?</h3>
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white flex items-center justify-center transition-all cursor-pointer -mt-1 -mr-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Are you sure you wish to cancel this order? Since processing has just started, your payment will be refunded immediately to your original payment method.
            </p>
            <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 text-xs text-white hover:bg-white/10 font-medium cursor-pointer"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-5 py-2.5 rounded-xl bg-rose-600 text-xs font-bold text-white hover:bg-rose-700 cursor-pointer shadow-sm transition-all"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
