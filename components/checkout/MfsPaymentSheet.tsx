'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, ShieldCheck, Lock, ArrowRight, Check, RefreshCw } from 'lucide-react';
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
  const [resendTimer, setResendTimer] = useState(30);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const phoneInputRef = useRef<HTMLInputElement>(null);
  const otpInputRef = useRef<HTMLInputElement>(null);
  const pinInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setStep('phone');
      setPin('');
      setErrorMsg(null);
      setResendTimer(30);
      setTimeout(() => {
        phoneInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && step === 'otp' && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, step, resendTimer]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isBkash = gateway === 'bkash';
  const brandName = isBkash ? 'bKash' : 'Nagad';
  const brandColor = isBkash ? 'bg-[#E2136E]' : 'bg-[#F7931E]';
  const brandHover = isBkash ? 'hover:bg-[#C70E5E]' : 'hover:bg-[#DE8116]';
  const brandRing = isBkash ? 'focus:border-[#E2136E] focus:ring-[#E2136E]/20' : 'focus:border-[#F7931E] focus:ring-[#F7931E]/20';
  const bdtAmount = Math.round(amount * 135);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (step === 'phone') {
      const cleanPhone = phoneNumber.replace(/\s+/g, '');
      if (cleanPhone.length < 11) {
        setErrorMsg('Please enter a valid 11-digit mobile number.');
        return;
      }
      setStep('otp');
      setTimeout(() => otpInputRef.current?.focus(), 100);
    } else if (step === 'otp') {
      if (otp.length < 4) {
        setErrorMsg('Please enter the 6-digit verification code.');
        return;
      }
      setStep('pin');
      setTimeout(() => pinInputRef.current?.focus(), 100);
    } else if (step === 'pin') {
      if (pin.length < 4) {
        setErrorMsg('Please enter your 5-digit PIN.');
        return;
      }
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        onSuccess();
      }, 950);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9500] flex items-center justify-center p-4 bg-[#01132B]/85 backdrop-blur-md transition-all duration-300"
      role="dialog"
      aria-modal="true"
      aria-label={`${brandName} Mobile Payment Sheet`}
    >
      <div className="relative w-full max-w-[390px] rounded-3xl bg-gradient-to-br from-[#0A2A54]/95 via-[#012148]/98 to-[#00142E] border border-white/15 p-6 sm:p-7 space-y-5 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Glow accent */}
        <div
          className="pointer-events-none absolute -top-20 -right-20 h-44 w-44 rounded-full blur-2xl opacity-20"
          style={{ backgroundColor: isBkash ? '#E2136E' : '#F7931E' }}
        />

        {/* Header Strip with MFS Branding */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
          <div className="flex items-center gap-2.5">
            <span className={`px-2.5 py-1 rounded-lg text-white font-extrabold text-xs tracking-wide shadow-md ${brandColor}`}>
              {brandName}
            </span>
            <span className="text-xs font-semibold text-white/70">
              Secure Mobile Payment
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close payment modal"
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Payable Amount Summary */}
        <div className="text-center p-4 rounded-2xl bg-[#00142E]/70 border border-white/10 space-y-1 backdrop-blur-sm">
          <span className="text-[10px] font-semibold text-white/50 uppercase tracking-widest block">
            Total Payable
          </span>
          <div className="text-2xl font-mono font-bold text-white tracking-tight">
            {formatPrice(amount)}
          </div>
          <div className="text-[11px] text-accent-cyan font-mono font-medium">
            ≈ BDT {bdtAmount.toLocaleString('en-GB')}
          </div>
        </div>

        {/* Step Progression Indicators */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 'phone' ? `w-7 ${brandColor}` : 'w-2 bg-white/20'}`} />
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 'otp' ? `w-7 ${brandColor}` : 'w-2 bg-white/20'}`} />
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 'pin' ? `w-7 ${brandColor}` : 'w-2 bg-white/20'}`} />
        </div>

        {/* Form Content */}
        <form onSubmit={handleNext} className="space-y-4">
          {step === 'phone' && (
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-white/80 block">
                Enter your {brandName} mobile number
              </label>
              <div className="relative">
                <input
                  ref={phoneInputRef}
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="017XXXXXXXX"
                  maxLength={14}
                  className={`w-full px-3.5 py-3 rounded-xl bg-[#00142E]/90 border text-white text-base font-mono outline-none transition-all ${
                    errorMsg ? 'border-[#FB7185]' : 'border-white/15'
                  } ${brandRing}`}
                  required
                />
              </div>
              <p className="text-[11px] text-white/50 leading-relaxed">
                We will send an SMS verification code to this number.
              </p>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs font-semibold text-white/80">
                <span>Verification Code (OTP)</span>
                {resendTimer > 0 ? (
                  <span className="text-[11px] text-white/40 font-mono">Resend in {resendTimer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setResendTimer(30)}
                    className="text-[11px] text-accent-cyan hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw size={11} />
                    <span>Resend code</span>
                  </button>
                )}
              </div>
              <input
                ref={otpInputRef}
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className={`w-full px-4 py-3 rounded-xl bg-[#00142E]/90 border text-white text-center text-lg font-mono tracking-[0.25em] outline-none transition-all ${
                  errorMsg ? 'border-[#FB7185]' : 'border-white/15'
                } ${brandRing}`}
                maxLength={6}
                required
              />
              <p className="text-[11px] text-white/50 text-center">
                Code sent to <span className="font-mono text-white/90">{phoneNumber}</span>. Demo code: <strong className="text-white">123456</strong>
              </p>
            </div>
          )}

          {step === 'pin' && (
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-white/80 block">
                Enter your 5-digit {brandName} PIN
              </label>
              <input
                ref={pinInputRef}
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 5))}
                placeholder="•••••"
                className={`w-full px-4 py-3 rounded-xl bg-[#00142E]/90 border text-white text-center text-xl font-mono tracking-[0.35em] outline-none transition-all ${
                  errorMsg ? 'border-[#FB7185]' : 'border-white/15'
                } ${brandRing}`}
                maxLength={5}
                required
                autoFocus
              />
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-400 pt-0.5">
                <Lock size={12} />
                <span>Bank-grade 256-bit encrypted token connection</span>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="text-[11.5px] text-[#FB7185] bg-[#FB7185]/10 border border-[#FB7185]/20 rounded-lg p-2 text-center">
              {errorMsg}
            </div>
          )}

          <div className="flex gap-2.5 pt-1">
            {step !== 'phone' && (
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  setStep(step === 'pin' ? 'otp' : 'phone');
                }}
                disabled={isProcessing}
                className="px-4 py-3 rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] text-white text-xs font-semibold transition-all cursor-pointer"
              >
                Back
              </button>
            )}

            <button
              type="submit"
              disabled={isProcessing}
              className={`flex-1 min-h-[46px] rounded-xl text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${brandColor} ${brandHover} disabled:opacity-50`}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Processing Payment...</span>
                </div>
              ) : (
                <>
                  <span>{step === 'pin' ? `Confirm & Pay with ${brandName}` : 'Continue'}</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
