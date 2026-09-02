'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, Lock, ArrowRight, Check } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface MfsPaymentSheetProps {
  isOpen: boolean;
  gateway: 'bkash' | 'nagad';
  amount: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function MfsPaymentSheet({
  isOpen,
  gateway,
  amount,
  onClose,
  onSuccess,
}: MfsPaymentSheetProps) {
  const [step, setStep] = useState<'phone' | 'otp' | 'pin'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('01712345678');
  const [otp, setOtp] = useState('123456');
  const [pin, setPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const isBkash = gateway === 'bkash';
  const brandName = isBkash ? 'bKash' : 'Nagad';
  const brandColor = isBkash ? 'bg-[#E2136E]' : 'bg-[#F7931E]';
  const brandText = isBkash ? 'text-[#E2136E]' : 'text-[#F7931E]';

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'phone') {
      setStep('otp');
    } else if (step === 'otp') {
      setStep('pin');
    } else if (step === 'pin') {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        onSuccess();
      }, 1200);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={`${brandName} Payment Sheet`}
    >
      <div className="relative w-full max-w-sm rounded-3xl bg-surface-card border border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl overflow-hidden">
        {/* Header Strip with MFS Branding */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className={`px-2.5 py-1 rounded-lg text-white font-bold text-xs ${brandColor}`}>
              {brandName}
            </div>
            <div className="text-xs font-mono text-white/60">Merchant Settlement</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-white/70 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Invoice Amount */}
        <div className="text-center p-4 rounded-2xl bg-obsidian-950/80 border border-white/10 space-y-1">
          <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Total Payable</span>
          <div className="text-2xl font-mono font-bold text-white">
            {formatPrice(amount)}
          </div>
          <div className="text-[10px] text-accent-cyan font-mono">BDT {Math.round(amount * 135).toLocaleString()} Approx</div>
        </div>

        {/* Form Steps */}
        <form onSubmit={handleNext} className="space-y-4">
          {step === 'phone' && (
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/70 block">
                Enter {brandName} Account Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full px-4 py-3 rounded-2xl bg-obsidian-950/90 border border-white/15 text-white text-base font-mono outline-none focus:border-accent-cyan"
                required
              />
              <p className="text-[11px] text-white/50 leading-relaxed font-light">
                By confirming, you agree to the merchant terms and conditions.
              </p>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/70 block">
                Verification Code (OTP)
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full px-4 py-3 rounded-2xl bg-obsidian-950/90 border border-white/15 text-white text-center text-lg font-mono tracking-widest outline-none focus:border-accent-cyan"
                maxLength={6}
                required
              />
              <p className="text-[11px] text-white/50 text-center font-light">
                We sent a 6-digit code to <span className="font-mono text-white">{phoneNumber}</span>. Demo code is 123456.
              </p>
            </div>
          )}

          {step === 'pin' && (
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/70 block">
                Enter 5-Digit {brandName} PIN
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="•••••"
                className="w-full px-4 py-3 rounded-2xl bg-obsidian-950/90 border border-white/15 text-white text-center text-xl font-mono tracking-widest outline-none focus:border-accent-cyan"
                maxLength={5}
                required
                autoFocus
              />
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-400">
                <Lock size={12} />
                <span>256-bit Encrypted Tokenizer</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full py-3.5 rounded-2xl text-white text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl ${brandColor} hover:opacity-90`}
          >
            {isProcessing ? (
              <span>Authenticating Settlement...</span>
            ) : (
              <>
                <span>{step === 'pin' ? 'Confirm Settlement' : 'Continue'}</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
