'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShieldCheck, X } from 'lucide-react';

export function SignedOutToast() {
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const isUrlSignedOut = searchParams?.get('signed_out') === 'true';
    let isSessionSignedOut = false;

    try {
      isSessionSignedOut = sessionStorage.getItem('nex_signed_out_toast') === 'true';
      if (isSessionSignedOut) {
        sessionStorage.removeItem('nex_signed_out_toast');
      }
    } catch (e) {
      // Storage access resilience
    }

    if (isUrlSignedOut || isSessionSignedOut) {
      setVisible(true);

      // Cleanly strip ?signed_out=true from browser URL without triggering reload
      if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
        const url = new URL(window.location.href);
        url.searchParams.delete('signed_out');
        const newUrl = url.pathname + (url.search ? url.search : '') + url.hash;
        window.history.replaceState({}, '', newUrl || '/');
      }

      // Auto dismiss timer
      const dismissTimer = setTimeout(() => {
        handleDismiss();
      }, 4500);

      return () => clearTimeout(dismissTimer);
    }
  }, [searchParams]);

  const handleDismiss = () => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
    }, 300);
  };

  if (!visible) return null;

  return (
    <aside
      id="signedOutToastNotice"
      role="status"
      aria-live="polite"
      aria-label="Sign out confirmation"
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[92vw] max-w-md pointer-events-auto transition-all duration-300 ease-out ${
        closing
          ? 'opacity-0 translate-y-3 scale-95'
          : 'opacity-100 translate-y-0 scale-100 animate-in fade-in slide-in-from-bottom-4 duration-300'
      }`}
    >
      <div className="relative flex items-center gap-3.5 p-4 rounded-2xl bg-[#030c1e]/95 backdrop-blur-2xl border border-[#3DE0FF]/35 shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_24px_rgba(61,224,255,0.15)] text-white">
        {/* Glow indicator */}
        <div className="w-9 h-9 rounded-xl bg-[#3DE0FF]/10 border border-[#3DE0FF]/30 flex items-center justify-center shrink-0 text-[#3DE0FF]">
          <ShieldCheck size={18} />
        </div>

        {/* Message body */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#3DE0FF]">
              Signed Out Safely
            </span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span className="text-[10px] font-medium text-white/50 tracking-wider">
              Guest Mode
            </span>
          </div>
          <p className="text-xs text-white/80 leading-relaxed truncate sm:whitespace-normal">
            You have been signed out. Enjoy browsing our collection.
          </p>
        </div>

        {/* Dismiss action */}
        <button
          type="button"
          onClick={handleDismiss}
          className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors shrink-0 cursor-pointer"
          aria-label="Dismiss message"
          title="Dismiss"
        >
          <X size={14} />
        </button>
      </div>
    </aside>
  );
}
