'use client';

import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';

interface OrderLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrackOrder: (orderId: string) => void;
}

export default function OrderLookupModal({
  isOpen,
  onClose,
  onTrackOrder,
}: OrderLookupModalProps) {
  const [inputVal, setInputVal] = useState('');

  useEffect(() => {
    if (isOpen) {
      setInputVal('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    onTrackOrder(inputVal.trim().toUpperCase());
    onClose();
  };

  return (
    <div
      id="orderLookupModal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-[#08254c] border border-accent-cyan/40 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-accent-cyan flex items-center gap-2">
            <Search size={14} />
            <span>FIND YOUR ORDER</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close lookup modal"
          >
            <X size={16} />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
          Enter your order number or reference code (e.g.{' '}
          <code className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">ORD-9428-NX</code>
          ,{' '}
          <code className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">ORD-8712-NX</code>
          , or{' '}
          <code className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">NX-M4KZ9</code>
          ) to load its live GPS courier updates.
        </p>

        <form onSubmit={handleSubmit} className="flex gap-2 pt-2">
          <input
            type="text"
            id="orderLookupModalInput"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="e.g. ORD-9428-NX"
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#00142e]/70 border border-white/20 text-white uppercase font-mono text-xs sm:text-sm focus:outline-none focus:border-accent-cyan placeholder:normal-case placeholder:font-sans placeholder:text-white/40"
            autoFocus
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-accent-cyan hover:bg-accent-cyan/90 text-black font-bold text-xs uppercase tracking-wider transition-all flex-shrink-0"
          >
            TRACK
          </button>
        </form>
      </div>
    </div>
  );
}
