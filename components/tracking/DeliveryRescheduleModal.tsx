'use client';

import React, { useState } from 'react';
import { X, Calendar, Clock, Check, Shield } from 'lucide-react';
import { TrackingOrder } from './types';

interface DeliveryRescheduleModalProps {
  isOpen: boolean;
  order: TrackingOrder;
  onClose: () => void;
  onConfirmReschedule: (newDate: string, slot: string) => void;
}

export function DeliveryRescheduleModal({
  isOpen,
  order,
  onClose,
  onConfirmReschedule,
}: DeliveryRescheduleModalProps) {
  const [selectedDay, setSelectedDay] = useState('Tomorrow');
  const [selectedSlot, setSelectedSlot] = useState('14:00 – 18:00 (Afternoon)');
  const [driverNote, setDriverNote] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!isOpen) return null;

  const days = [
    { label: 'Tomorrow', desc: 'Next business day dispatch' },
    { label: 'In 2 Days', desc: 'Hold at regional distribution hub' },
    { label: 'Weekend Slot', desc: 'Saturday White-Glove handoff' },
  ];

  const slots = [
    '09:00 – 12:00 (Morning Priority)',
    '14:00 – 18:00 (Afternoon Standard)',
    '18:00 – 21:00 (Evening Signature)',
  ];

  const handleConfirm = () => {
    setIsConfirmed(true);
    setTimeout(() => {
      onConfirmReschedule(selectedDay, selectedSlot);
      setIsConfirmed(false);
      onClose();
    }, 1000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Reschedule Delivery Slot"
    >
      <div className="relative w-full max-w-md rounded-3xl bg-surface-card border border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-accent-cyan" />
            <h2 className="font-editorial text-2xl text-white font-normal">Reschedule Delivery</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-white/70 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <p className="text-xs text-white/60 font-light leading-relaxed">
          Select an optimized doorstep window for parcel <strong className="text-white font-mono">{order.id}</strong>.
        </p>

        {/* Day selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/70 block">
            Select Delivery Day
          </label>
          <div className="grid grid-cols-3 gap-2">
            {days.map((d) => (
              <button
                key={d.label}
                type="button"
                onClick={() => setSelectedDay(d.label)}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  selectedDay === d.label
                    ? 'bg-accent-cyan/15 border-accent-cyan text-accent-cyan shadow-sm'
                    : 'bg-obsidian-950/60 border-white/10 text-white/70 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold">{d.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Slot selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/70 block">
            Doorstep Time Slot
          </label>
          <div className="space-y-2">
            {slots.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSlot(s)}
                className={`w-full p-3 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                  selectedSlot === s
                    ? 'bg-accent-cyan/15 border-accent-cyan text-accent-cyan shadow-sm'
                    : 'bg-obsidian-950/60 border-white/10 text-white/70 hover:text-white'
                }`}
              >
                <span>{s}</span>
                {selectedSlot === s && <Check size={14} className="text-accent-cyan" />}
              </button>
            ))}
          </div>
        </div>

        {/* Driver instruction note */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/70 block">
            Special Driver Instructions (Optional)
          </label>
          <input
            type="text"
            value={driverNote}
            onChange={(e) => setDriverNote(e.target.value)}
            placeholder="e.g. Ring apartment 4B or leave with doorman"
            className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950/80 border border-white/15 text-white text-xs outline-none focus:border-accent-cyan"
          />
        </div>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={isConfirmed}
          className="w-full py-3.5 rounded-2xl bg-accent-crimson hover:bg-accent-crimson/90 text-white text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl shadow-accent-crimson/25"
        >
          {isConfirmed ? (
            <>
              <Check size={14} />
              <span>Slot Confirmed with Courier!</span>
            </>
          ) : (
            <span>Update Courier Dispatch Window</span>
          )}
        </button>
      </div>
    </div>
  );
}
