'use client';

import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumberOrSymbol = /[\d!@#$%^&*(),.?":{}|<>]/.test(password);

  let score = 0;
  if (hasMinLength) score++;
  if (hasUppercase) score++;
  if (hasNumberOrSymbol) score++;

  const getLabel = () => {
    if (!password) return 'Security: Enter a password';
    if (score === 1) return 'Security: Weak';
    if (score === 2) return 'Security: Good';
    return 'Security: Strong & Secure';
  };

  const getBarColor = (index: number) => {
    if (index >= score) return 'bg-white/10';
    if (score === 1) return 'bg-rose-500';
    if (score === 2) return 'bg-amber-400';
    return 'bg-accent-cyan';
  };

  return (
    <div className="space-y-2.5 pt-1">
      {/* 3-Bar Visual Track */}
      <div className="flex items-center justify-between text-[11px] font-medium text-white/60">
        <span>{getLabel()}</span>
        <span className="font-mono text-white/40">{score}/3</span>
      </div>

      <div className="grid grid-cols-3 gap-1.5 h-1.5 w-full">
        <div className={`rounded-full transition-all duration-300 ${getBarColor(0)}`} />
        <div className={`rounded-full transition-all duration-300 ${getBarColor(1)}`} />
        <div className={`rounded-full transition-all duration-300 ${getBarColor(2)}`} />
      </div>

      {/* Requirement Checkpoints */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 pt-1 text-[11px]">
        <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-accent-cyan' : 'text-white/40'}`}>
          {hasMinLength ? <Check size={12} /> : <X size={12} />}
          <span>8+ Characters</span>
        </div>
        <div className={`flex items-center gap-1.5 ${hasUppercase ? 'text-accent-cyan' : 'text-white/40'}`}>
          {hasUppercase ? <Check size={12} /> : <X size={12} />}
          <span>Uppercase</span>
        </div>
        <div className={`flex items-center gap-1.5 ${hasNumberOrSymbol ? 'text-accent-cyan' : 'text-white/40'}`}>
          {hasNumberOrSymbol ? <Check size={12} /> : <X size={12} />}
          <span>Number / Symbol</span>
        </div>
      </div>
    </div>
  );
}
