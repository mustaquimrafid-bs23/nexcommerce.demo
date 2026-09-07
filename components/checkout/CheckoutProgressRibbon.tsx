'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface CheckoutProgressRibbonProps {
  activeStep: number;
  onStepClick?: (step: number) => void;
}

export function CheckoutProgressRibbon({
  activeStep,
  onStepClick,
}: CheckoutProgressRibbonProps) {
  return (
    <nav
      id="checkoutProgressRibbon"
      aria-label="Checkout Progression Steps"
      className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0A2A54]/35 px-6 py-4 mb-7 backdrop-blur-md"
    >
      {/* Step 1 */}
      <div
        id="ribbon-step-1"
        onClick={() => onStepClick?.(1)}
        className={`flex items-center gap-3 shrink-0 cursor-pointer transition-opacity ${
          activeStep >= 1 ? 'opacity-100' : 'opacity-50'
        }`}
      >
        <div
          id="bubble-1"
          className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs font-bold transition-all shrink-0 ${
            activeStep > 1
              ? 'border-[#34D399] bg-[#34D399] text-[#01132B]'
              : activeStep === 1
              ? 'border-accent-cyan bg-accent-cyan text-[#01132B] shadow-[0_0_16px_rgba(61,224,255,0.4)]'
              : 'border-white/20 bg-white/[0.04] text-white/60'
          }`}
        >
          {activeStep > 1 ? <Check className="h-4 w-4 stroke-[3]" /> : '01'}
        </div>
        <div className="hidden sm:flex flex-col gap-0.5">
          <span className="text-[13px] font-semibold text-white tracking-wide">Information</span>
          <span className="text-[11px] text-white/45">Contact &amp; Address</span>
        </div>
      </div>

      {/* Connector 1 */}
      <div
        id="line-1"
        className={`h-0.5 flex-1 mx-4 rounded-full transition-all ${
          activeStep >= 2
            ? 'bg-gradient-to-r from-[#34D399] to-accent-cyan'
            : 'bg-white/10'
        }`}
      />

      {/* Step 2 */}
      <div
        id="ribbon-step-2"
        onClick={() => onStepClick?.(2)}
        className={`flex items-center gap-3 shrink-0 cursor-pointer transition-opacity ${
          activeStep >= 2 ? 'opacity-100' : 'opacity-50'
        }`}
      >
        <div
          id="bubble-2"
          className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs font-bold transition-all shrink-0 ${
            activeStep > 2
              ? 'border-[#34D399] bg-[#34D399] text-[#01132B]'
              : activeStep === 2
              ? 'border-accent-cyan bg-accent-cyan text-[#01132B] shadow-[0_0_16px_rgba(61,224,255,0.4)]'
              : 'border-white/20 bg-white/[0.04] text-white/60'
          }`}
        >
          {activeStep > 2 ? <Check className="h-4 w-4 stroke-[3]" /> : '02'}
        </div>
        <div className="hidden sm:flex flex-col gap-0.5">
          <span className="text-[13px] font-semibold text-white tracking-wide">Delivery Options</span>
          <span className="text-[11px] text-white/45">Delivery &amp; Timing</span>
        </div>
      </div>

      {/* Connector 2 */}
      <div
        id="line-2"
        className={`h-0.5 flex-1 mx-4 rounded-full transition-all ${
          activeStep >= 3
            ? 'bg-gradient-to-r from-[#34D399] to-accent-cyan'
            : 'bg-white/10'
        }`}
      />

      {/* Step 3 */}
      <div
        id="ribbon-step-3"
        onClick={() => onStepClick?.(3)}
        className={`flex items-center gap-3 shrink-0 cursor-pointer transition-opacity ${
          activeStep >= 3 ? 'opacity-100' : 'opacity-50'
        }`}
      >
        <div
          id="bubble-3"
          className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs font-bold transition-all shrink-0 ${
            activeStep === 3
              ? 'border-accent-cyan bg-accent-cyan text-[#01132B] shadow-[0_0_16px_rgba(61,224,255,0.4)]'
              : 'border-white/20 bg-white/[0.04] text-white/60'
          }`}
        >
          03
        </div>
        <div className="hidden sm:flex flex-col gap-0.5">
          <span className="text-[13px] font-semibold text-white tracking-wide">Payment &amp; Review</span>
          <span className="text-[11px] text-white/45">Payment &amp; Verification</span>
        </div>
      </div>
    </nav>
  );
}
