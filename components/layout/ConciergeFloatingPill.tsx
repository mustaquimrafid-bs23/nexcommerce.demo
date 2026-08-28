'use client';

import React from 'react';
import { useConciergeStore } from '@/store/useConciergeStore';

/**
 * ConciergeFloatingPill — Floating Round Chat FAB for Ask Stylist & Smart Concierge.
 * Matches canonical #nexConciergeFloatingPill in js/concierge.js:
 * - Fixed bottom-right FAB (52px round)
 * - Gradient obsidian background (#08142A -> #040C1C)
 * - Cyan border with ambient glow
 * - SVG chat bubble icon + animated crimson sparkle (✦)
 * - Opens the Concierge Drawer on click
 */
export function ConciergeFloatingPill() {
  const { isOpen, openConcierge } = useConciergeStore();

  // Hide floating FAB when the Concierge drawer is open
  if (isOpen) return null;

  return (
    <button
      id="nexConciergeFloatingPill"
      type="button"
      className="concierge-floating-pill fixed bottom-6 right-6 sm:bottom-7 sm:right-7 z-[99990] w-[52px] h-[52px] rounded-full flex items-center justify-center cursor-pointer select-none transition-all duration-300 hover:scale-105 hover:-translate-y-1 active:scale-95 shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_18px_rgba(61,224,255,0.25)] hover:shadow-[0_12px_36px_rgba(241,51,101,0.45),0_0_24px_rgba(241,51,101,0.35)] hover:border-[#F13365] group"
      aria-label="Chat with Personal Stylist"
      title="Personal Stylist"
      data-action="open-concierge"
      onClick={openConcierge}
      style={{
        background: 'linear-gradient(135deg, rgba(8, 20, 42, 0.96), rgba(4, 12, 28, 0.98))',
        border: '1.5px solid rgba(61, 224, 255, 0.45)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="concierge-chat-svg text-[#3DE0FF] group-hover:text-white transition-colors duration-200"
        aria-hidden="true"
      >
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      </svg>
      <span
        className="concierge-fab-sparkle absolute top-2 right-2 text-[10px] leading-none text-[#F13365] drop-shadow-[0_0_4px_rgba(241,51,101,0.8)] animate-pulse"
        aria-hidden="true"
      >
        ✦
      </span>
    </button>
  );
}
