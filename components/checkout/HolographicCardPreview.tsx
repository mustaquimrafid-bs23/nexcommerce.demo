'use client';

import React from 'react';

interface HolographicCardPreviewProps {
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvv: string;
  isFlipped: boolean;
}

export function HolographicCardPreview({
  cardNumber,
  cardName,
  cardExpiry,
  cardCvv,
  isFlipped,
}: HolographicCardPreviewProps) {
  // Card brand detection
  const cleanNum = cardNumber.replace(/\D/g, '');
  let brandText = 'CARD';
  let brandColor = 'rgba(255,255,255,0.8)';
  if (/^4/.test(cleanNum)) {
    brandText = 'VISA';
    brandColor = '#3DE0FF';
  } else if (/^5[1-5]/.test(cleanNum)) {
    brandText = 'MASTERCARD';
    brandColor = '#FB7185';
  } else if (/^3[47]/.test(cleanNum)) {
    brandText = 'AMEX';
    brandColor = '#34D399';
  }

  return (
    <div className="flex justify-center [perspective:1200px] my-5">
      <div
        id="holographicCard"
        className={`relative w-full max-w-[360px] aspect-[1.586/1] rounded-2xl transition-transform duration-[650ms] [transform-style:preserve-3d] ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* FRONT FACE */}
        <div className="absolute inset-0 flex flex-col justify-between rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-[#0A2A54] via-[#01132B] to-[#103B75] shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.14)] [backface-visibility:hidden] overflow-hidden">
          <div className="flex justify-between items-center">
            {/* EMV Chip */}
            <div className="h-7 w-9.5 rounded-md border border-black/20 bg-gradient-to-br from-[#E6C875] to-[#B89736]" />
            {/* Contactless Icon */}
            <svg
              className="text-white/45"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12a10 10 0 0 1 10-10" />
              <path d="M5 16a6 6 0 0 1 6-6" />
              <path d="M5 20a2 2 0 0 1 2-2" />
            </svg>
          </div>

          <div
            id="cardDisplayNumber"
            className="font-mono text-[clamp(14px,1.85vw,18px)] tracking-[0.18em] text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)] font-medium"
          >
            {cardNumber || '•••• •••• •••• ••••'}
          </div>

          <div className="flex justify-between items-end gap-2">
            <div>
              <span className="block text-[7px] font-bold tracking-[0.12em] text-white/45 mb-0.5">
                CARDHOLDER
              </span>
              <span
                id="cardDisplayName"
                className="font-sans text-[11.5px] font-semibold tracking-wide text-white uppercase"
              >
                {cardName || 'YOUR NAME'}
              </span>
            </div>

            <div>
              <span className="block text-[7px] font-bold tracking-[0.12em] text-white/45 mb-0.5">
                EXPIRES
              </span>
              <span
                id="cardDisplayExpiry"
                className="font-sans text-[11.5px] font-semibold tracking-wide text-white"
              >
                {cardExpiry || 'MM/YY'}
              </span>
            </div>

            <div id="cardBrandIcon">
              <span
                className="text-xs font-extrabold tracking-wider"
                style={{ color: brandColor }}
              >
                {brandText}
              </span>
            </div>
          </div>

          {/* Shimmer Sheen */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(45deg,transparent_35%,rgba(61,224,255,0.1)_50%,transparent_65%)] bg-[length:200%_200%] animate-[card-sheen_6s_ease-in-out_infinite]" />
        </div>

        {/* BACK FACE */}
        <div className="absolute inset-0 flex flex-col justify-between rounded-2xl bg-gradient-to-br from-[#01132B] to-[#0A2A54] shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.14)] [transform:rotateY(180deg)] [backface-visibility:hidden] overflow-hidden">
          <div className="h-10 w-full bg-black mt-5" />

          <div className="px-5 sm:px-6">
            <span className="block text-[8px] font-bold tracking-widest text-white/45 text-right mb-1">
              SECURITY CODE (CVV/CVC)
            </span>
            <div
              id="cardDisplayCvc"
              className="rounded bg-white text-black font-mono text-sm font-bold p-1.5 px-3 text-right tracking-[0.2em]"
            >
              {cardCvv || '•••'}
            </div>
          </div>

          <div className="flex justify-between items-center px-5 sm:px-6 pb-4 text-[7.5px] text-white/35">
            <span>AUTHORISED SIGNATURE &middot; NOT VALID UNLESS SIGNED</span>
            <span>nexCommerce Atelier</span>
          </div>
        </div>
      </div>
    </div>
  );
}
