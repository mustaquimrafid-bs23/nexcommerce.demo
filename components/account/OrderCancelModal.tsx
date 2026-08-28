'use client';

import React, { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface OrderCancelModalProps {
  orderRef: string | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmCancel: (orderRef: string, reason: string) => void;
}

export function OrderCancelModal({
  orderRef,
  isOpen,
  onClose,
  onConfirmCancel,
}: OrderCancelModalProps) {
  const [reason, setReason] = useState('Changed my mind');

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !orderRef) return null;

  const REASONS = [
    'Changed my mind',
    'Delivery time is too long',
    'Ordered the wrong size or colour',
    'Found an alternative piece',
    'Created by mistake',
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onConfirmCancel(orderRef!, reason);
    onClose();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancelOrderTitle"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-md bg-obsidian-950 border border-white/15 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-rose-400" />
            <h2 id="cancelOrderTitle" className="font-display text-lg font-bold text-white">
              Cancel Order {orderRef}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-white/70 leading-relaxed">
          Please let us know why you wish to cancel. A 100% refund will be credited back to your original payment method immediately.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            {REASONS.map((r) => (
              <label
                key={r}
                className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  reason === r
                    ? 'border-accent-cyan/40 bg-accent-cyan/[0.06] text-white'
                    : 'border-white/10 bg-white/[0.02] text-white/70 hover:border-white/20'
                }`}
              >
                <input
                  type="radio"
                  name="cancel_reason"
                  value={r}
                  checked={reason === r}
                  onChange={() => setReason(r)}
                  className="accent-accent-cyan"
                />
                <span>{r}</span>
              </label>
            ))}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-lg bg-white/[0.05] hover:bg-white/10 text-white/70 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Keep Order
            </button>
            <button
              type="submit"
              className="h-10 px-5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-rose-500/20 cursor-pointer"
            >
              Confirm Cancellation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
