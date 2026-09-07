'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Copy, Check, Printer, FileText, CheckCircle2, Truck, Clock, XCircle } from 'lucide-react';

interface OrderDetailHeaderProps {
  orderRef: string;
  orderDate?: string;
  stage: number; // 1: Placed, 2: Preparing, 3: Shipped, 4: Out for Delivery/Delivered
  statusLabel?: string;
  isDelivered?: boolean;
}

export function OrderDetailHeader({
  orderRef,
  orderDate = 'August 31, 2026',
  stage = 4,
  statusLabel,
  isDelivered = false,
}: OrderDetailHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(orderRef);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // Determine display status and badge styling
  let badgeText = statusLabel || (stage === 4 ? (isDelivered ? 'Delivered' : 'Out for Delivery') : stage === 3 ? 'In Transit' : stage === 2 ? 'Preparing Order' : 'Order Placed');
  let badgeStyle = 'bg-accent-cyan/15 border-accent-cyan/30 text-accent-cyan';
  let BadgeIcon = Truck;

  if (isDelivered || badgeText.toLowerCase().includes('delivered')) {
    badgeStyle = 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400';
    BadgeIcon = CheckCircle2;
  } else if (badgeText.toLowerCase().includes('cancelled')) {
    badgeStyle = 'bg-rose-500/15 border-rose-500/30 text-rose-400';
    BadgeIcon = XCircle;
  } else if (stage <= 2) {
    badgeStyle = 'bg-amber-500/15 border-amber-500/30 text-amber-400';
    BadgeIcon = Clock;
  }

  return (
    <div id="orderDetailHeader" className="mb-8">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-xs font-semibold text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>

        {/* Quick Document Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="btnHeaderPrint"
            onClick={handlePrint}
            className="h-8 px-3 rounded-lg bg-white/[0.06] border border-white/12 text-white hover:bg-white/[0.12] text-xs font-medium inline-flex items-center gap-1.5 transition-all cursor-pointer active:scale-[0.98]"
          >
            <Printer className="w-3.5 h-3.5 text-accent-cyan" />
            <span>Print Receipt</span>
          </button>
          <button
            type="button"
            id="btnHeaderInvoice"
            onClick={handlePrint}
            className="h-8 px-3 rounded-lg bg-white/[0.06] border border-white/12 text-white hover:bg-white/[0.12] text-xs font-medium inline-flex items-center gap-1.5 transition-all cursor-pointer active:scale-[0.98]"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Invoice (PDF)</span>
          </button>
        </div>
      </div>

      {/* Main Order Identity Bar */}
      <div className="rounded-2xl border border-white/10 bg-[#0A2A54]/30 backdrop-blur-md p-6 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1.5 flex-wrap">
              <span className="text-[10px] font-bold tracking-[0.14em] text-white/40 uppercase">
                ORDER DETAILS
              </span>
              <span className="text-white/20">&middot;</span>
              <span className="text-xs text-white/70">
                Placed on {orderDate}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="font-mono text-2xl sm:text-3xl font-bold text-accent-cyan tracking-wide">
                {orderRef}
              </h1>
              <button
                type="button"
                id="btnCopyOrderRef"
                onClick={handleCopy}
                title={copied ? 'Copied to clipboard' : 'Copy order reference'}
                aria-label="Copy order reference"
                className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/12 text-white/70 hover:text-white hover:bg-white/[0.15] flex items-center justify-center transition-all cursor-pointer active:scale-95"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Dynamic Status Chip */}
          <div className="flex items-center gap-3">
            <div
              id="orderStatusBadge"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border shadow-xs ${badgeStyle}`}
            >
              <BadgeIcon className="w-4 h-4" />
              <span>{badgeText}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
