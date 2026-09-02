'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Copy, Check, Calendar, Compass } from 'lucide-react';

interface DigitalBoardingPassProps {
  orderRef: string;
  estimatedDelivery: string;
  total?: number;
  customerName?: string;
  email?: string;
  deliveryAddress?: string;
  paymentMethod?: string;
}

export function DigitalBoardingPass({
  orderRef = 'NX-EU-D3H23',
  estimatedDelivery = 'In 2–4 Business Days (DHL Tracked)',
  total = 359.2,
  customerName = 'Julian Wright',
  email = 'julian@example.com',
  deliveryAddress = 'Friedrichstraße 42, Berlin',
  paymentMethod = 'Klarna Pay in 30 Days',
}: DigitalBoardingPassProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyRef = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(orderRef);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCalendarSync = () => {
    const title = `nexCommerce Delivery: ${orderRef}`;
    const desc = `Your nexCommerce order (${orderRef}) is scheduled for delivery.`;
    const delivDate = new Date(Date.now() + 2 * 86400000);
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const dateStr = `${delivDate.getFullYear()}${pad(delivDate.getMonth() + 1)}${pad(delivDate.getDate())}`;
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//nexCommerce//Delivery//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DESCRIPTION:${desc}`,
      `DTSTART;VALUE=DATE:${dateStr}`,
      `DTEND;VALUE=DATE:${dateStr}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `delivery-${orderRef}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate deterministic QR dot positions from order reference
  const generateQrDots = () => {
    let seed = 0;
    for (let k = 0; k < orderRef.length; k++) {
      seed += orderRef.charCodeAt(k);
    }
    const positions = [
      [42, 12], [52, 18], [38, 26], [58, 30], [44, 36], [56, 42], [40, 50],
      [52, 44], [66, 48], [44, 68], [56, 74], [76, 70], [48, 80], [66, 64], [72, 56]
    ];
    return positions.filter((_, d) => d < 8 || ((seed + d * 37) % 3 !== 0));
  };

  const qrDots = generateQrDots();

  return (
    <div
      id="digitalAtelierPass"
      className="max-w-[780px] mx-auto bg-gradient-to-br from-[#071a3a]/90 via-[#05152e]/95 to-[#020b18]/98 border border-accent-cyan/20 rounded-2xl flex flex-col md:flex-row overflow-hidden relative shadow-[0_24px_60px_rgba(0,0,0,0.5),0_0_30px_rgba(61,224,255,0.08)] text-left mb-8"
    >
      {/* Left Section */}
      <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between gap-5">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold tracking-[0.14em] text-white/40 uppercase">
            DIGITAL ORDER RECEIPT
          </span>
          <span className="text-[9px] font-bold tracking-[0.1em] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-mono">
            AUTHENTICATED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 my-1">
          {/* Order Ref Block */}
          <div>
            <span className="text-[9.5px] font-semibold tracking-[0.12em] text-white/40 uppercase block mb-1">
              ORDER REFERENCE
            </span>
            <div className="flex items-center gap-2">
              <span id="conf-ref" className="font-display text-lg sm:text-xl font-bold tracking-wider text-accent-cyan font-mono">
                {orderRef}
              </span>
              <button
                type="button"
                id="btnCopyRef"
                onClick={handleCopyRef}
                title={copied ? 'Copied!' : 'Copy Order Reference'}
                aria-label="Copy Order Reference"
                className="w-7 h-7 rounded bg-white/[0.06] border border-white/12 text-white/70 hover:text-white hover:bg-white/[0.15] flex items-center justify-center transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Estimated Delivery Block */}
          <div>
            <span className="text-[9.5px] font-semibold tracking-[0.12em] text-white/40 uppercase block mb-1">
              ESTIMATED DELIVERY
            </span>
            <span id="conf-pass-eta" className="text-sm font-semibold text-white block">
              {estimatedDelivery}
            </span>
          </div>

          {/* Total Paid Block */}
          <div>
            <span className="text-[9.5px] font-semibold tracking-[0.12em] text-white/40 uppercase block mb-1">
              TOTAL PAID
            </span>
            <span id="conf-total" className="text-base sm:text-lg font-bold text-white block font-mono">
              € {total.toFixed(2)}
            </span>
          </div>

          {/* Destination Summary */}
          <div>
            <span className="text-[9.5px] font-semibold tracking-[0.12em] text-white/40 uppercase block mb-1">
              DELIVERY DESTINATION
            </span>
            <span id="conf-address" className="text-xs text-white/80 block truncate">
              {deliveryAddress}
            </span>
            <span id="conf-recipient-name" className="text-[11px] text-white/50 block">
              {customerName}
            </span>
            <span id="conf-email" className="hidden">
              {email}
            </span>
          </div>
        </div>

        {/* Quick Utility Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/10">
          <button
            type="button"
            id="btnCalendarSync"
            onClick={handleCalendarSync}
            className="h-8 px-3 rounded-lg bg-white/[0.05] border border-white/12 text-white/80 text-[11px] font-medium inline-flex items-center gap-1.5 hover:bg-white/[0.1] hover:text-white transition-all cursor-pointer"
          >
            <Calendar className="w-3 h-3 text-accent-cyan" />
            <span>Add to Calendar</span>
          </button>

          <Link
            href={`/tracking?order=${encodeURIComponent(orderRef)}`}
            id="conf-track-link"
            className="h-8 px-3 rounded-lg bg-white/[0.05] border border-white/12 text-white/80 text-[11px] font-medium inline-flex items-center gap-1.5 hover:bg-white/[0.1] hover:text-white transition-all cursor-pointer"
          >
            <Compass className="w-3 h-3 text-accent-cyan" />
            <span>Track Delivery</span>
          </Link>
        </div>
      </div>

      {/* Ticket Notch Divider (Desktop) */}
      <div className="hidden md:flex w-6 relative flex-col items-center justify-between py-0">
        <div className="w-6 h-3 bg-[#01132B] rounded-b-full" />
        <div className="flex-1 w-[1px] border-l-2 border-dashed border-white/15 my-1" />
        <div className="w-6 h-3 bg-[#01132B] rounded-t-full" />
      </div>

      {/* Right Section (Scannable QR) */}
      <div className="w-full md:w-[190px] p-4 sm:p-6 md:p-8 flex flex-row md:flex-col items-center justify-center gap-4 md:gap-0 bg-black/25 border-t md:border-t-0 md:border-l border-white/10 shrink-0">
        <Link
          href={`/tracking?order=${encodeURIComponent(orderRef)}`}
          id="passQrFrame"
          title="Track Delivery"
          className="w-[88px] h-[88px] sm:w-[104px] sm:h-[104px] bg-white p-1.5 rounded-xl md:mb-2.5 shadow-lg shadow-black/40 shrink-0 block hover:scale-105 transition-transform cursor-pointer"
        >
          <svg
            id="passQrSvg"
            viewBox="0 0 100 100"
            width="100%"
            height="100%"
            aria-label="Order Tracking QR Code"
            className="w-full h-full"
          >
            <rect width="100" height="100" fill="#FFFFFF" />
            {/* Top-Left Finder */}
            <rect x="10" y="10" width="24" height="24" fill="#000000" />
            <rect x="14" y="14" width="16" height="16" fill="#FFFFFF" />
            <rect x="18" y="18" width="8" height="8" fill="#000000" />
            {/* Top-Right Finder */}
            <rect x="66" y="10" width="24" height="24" fill="#000000" />
            <rect x="70" y="14" width="16" height="16" fill="#FFFFFF" />
            <rect x="74" y="18" width="8" height="8" fill="#000000" />
            {/* Bottom-Left Finder */}
            <rect x="10" y="66" width="24" height="24" fill="#000000" />
            <rect x="14" y="70" width="16" height="16" fill="#FFFFFF" />
            <rect x="18" y="74" width="8" height="8" fill="#000000" />
            {/* Deterministic Payload Dots */}
            {qrDots.map(([x, y], idx) => (
              <rect key={idx} x={x} y={y} width="6" height="6" fill="#000000" />
            ))}
          </svg>
        </Link>
        <span className="text-[8.5px] sm:text-[9px] font-bold tracking-[0.14em] text-white/40 uppercase text-left md:text-center">
          SCAN TO TRACK SHIPMENT
        </span>
      </div>
    </div>
  );
}
