'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Compass, Printer, XCircle, ShieldCheck } from 'lucide-react';

interface ConfirmationNextActionsProps {
  orderRef?: string;
}

export function ConfirmationNextActions({ orderRef = 'NX-EU-D3H23' }: ConfirmationNextActionsProps) {
  const [isCancelled, setIsCancelled] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleCancelClick = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancel = () => {
    setIsCancelled(true);
    setShowCancelConfirm(false);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0A2A54]/35 p-6 backdrop-blur-md next-actions-box">
      <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] uppercase text-white/50 mb-5">
        <Compass className="w-4 h-4 text-accent-cyan" />
        <span>Next Steps</span>
      </div>

      <div className="space-y-2.5">
        {/* Track / View in Orders (Primary) */}
        <Link
          href={`/orders/${encodeURIComponent(orderRef)}`}
          className="w-full h-11 rounded-xl bg-accent-cyan text-[#000B1A] text-xs font-bold flex items-center justify-center gap-2 hover:bg-accent-cyan/90 transition-all shadow-lg shadow-accent-cyan/15"
        >
          <Compass className="w-4 h-4" />
          <span>View in Order History</span>
        </Link>

        {/* Print Receipt */}
        <button
          type="button"
          onClick={handlePrint}
          className="w-full h-11 rounded-xl bg-white/[0.06] border border-white/12 text-white text-xs font-semibold flex items-center justify-center gap-2 hover:bg-white/[0.12] hover:border-white/25 transition-all cursor-pointer btn-print-receipt"
        >
          <Printer className="w-4 h-4 text-accent-cyan" />
          <span>Print Receipt</span>
        </button>

        {/* Cancel Order */}
        {!isCancelled ? (
          <button
            type="button"
            id="btnConfCancelOrder"
            onClick={handleCancelClick}
            className="w-full h-11 rounded-xl bg-white/[0.03] border border-white/10 text-white/60 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 transition-all cursor-pointer btn-order-cancel-trigger"
          >
            <XCircle className="w-4 h-4" />
            <span>Cancel Order</span>
          </button>
        ) : (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs text-center font-medium">
            Cancellation requested for {orderRef}. Our client service team will confirm shortly.
          </div>
        )}

        {/* Continue Shopping */}
        <Link
          href="/category"
          className="block text-center pt-2 text-xs font-semibold text-accent-cyan hover:underline transition-colors"
        >
          Continue shopping &rarr;
        </Link>
      </div>

      {/* Trust & Guarantee Note */}
      <div className="mt-5 pt-4 border-t border-white/10 flex items-start gap-2.5 text-[11px] text-white/50 leading-relaxed">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <span>
          A full confirmation receipt and dispatch notifications will be sent to your registered email.
        </span>
      </div>

      {/* Cancellation Confirmation Dialog Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl bg-[#012148] border border-white/15 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Cancel Order {orderRef}?</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Are you sure you wish to cancel this order? If your order has not yet entered dispatch packing, your payment will be refunded immediately.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelConfirm(false)}
                className="px-4 py-2 rounded-lg border border-white/15 bg-white/5 text-xs text-white hover:bg-white/10"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={confirmCancel}
                className="px-4 py-2 rounded-lg bg-rose-500 text-xs font-bold text-white hover:bg-rose-600"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
