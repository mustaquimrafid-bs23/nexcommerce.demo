'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Check, Shield, MapPin } from 'lucide-react';
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
  const [selectedSlot, setSelectedSlot] = useState('14:00 – 18:00 (Afternoon Standard)');
  const [driverNote, setDriverNote] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

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

  const days = [
    { label: 'Tomorrow', desc: 'Next working day dispatch' },
    { label: 'In 2 Days', desc: 'Hold at regional distribution hub' },
    { label: 'Saturday Slot', desc: 'Weekend signature delivery' },
  ];

  const slots = [
    '09:00 – 12:00 (Morning Priority)',
    '14:00 – 18:00 (Afternoon Standard)',
    '18:00 – 21:00 (Evening Signature)',
  ];

  const presets = [
    'Leave at Concierge Desk',
    'Leave in Secure Porch',
    'Leave with Neighbour at No. 42',
    'Ring Bell Twice on Arrival',
  ];

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmed(true);
    setTimeout(() => {
      onConfirmReschedule(selectedDay, selectedSlot);
      setIsConfirmed(false);
      onClose();
    }, 850);
  };

  return (
    <div
      className="fixed inset-0 z-[9500] flex items-center justify-center p-4 bg-[#01132B]/85 backdrop-blur-md transition-all duration-300"
      role="dialog"
      aria-modal="true"
      aria-label="Reschedule Delivery Slot"
    >
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-br from-[#0A2A54]/95 via-[#012148]/98 to-[#00142E] border border-white/15 p-6 sm:p-7 space-y-5 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Glow accent */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-44 w-44 rounded-full bg-accent-cyan/15 blur-2xl" />

        <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-accent-cyan/15 border border-accent-cyan/30 flex items-center justify-center text-accent-cyan">
              <Calendar size={16} />
            </div>
            <div>
              <h2 className="font-editorial text-xl text-white font-medium">Reschedule Delivery</h2>
              <span className="text-[10.5px] text-white/50 block font-mono">
                Order #{order.ref || order.id}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <p className="text-xs text-white/70 font-normal leading-relaxed">
          Select a convenient doorstep delivery window for your parcel.
        </p>

        <form onSubmit={handleConfirm} className="space-y-4">
          {/* Day selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/80 block">
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
                      : 'bg-[#00142E]/70 border-white/10 text-white/70 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold">{d.label}</div>
                  <div className="text-[9.5px] text-white/50 truncate mt-0.5">{d.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Slot selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/80 block">
              Doorstep Time Slot
            </label>
            <div className="space-y-1.5">
              {slots.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSlot(s)}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                    selectedSlot === s
                      ? 'bg-accent-cyan/15 border-accent-cyan text-accent-cyan shadow-sm'
                      : 'bg-[#00142E]/70 border-white/10 text-white/70 hover:text-white'
                  }`}
                >
                  <span>{s}</span>
                  {selectedSlot === s && <Check size={14} className="text-accent-cyan" />}
                </button>
              ))}
            </div>
          </div>

          {/* Courier instruction note */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/80 block">
              Special Courier Instructions (Optional)
            </label>
            <input
              type="text"
              value={driverNote}
              onChange={(e) => setDriverNote(e.target.value)}
              placeholder="e.g. Leave with concierge or safe porch..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#00142E]/90 border border-white/15 text-white text-xs outline-none focus:border-accent-cyan"
            />
            {/* Quick instruction presets */}
            <div className="flex flex-wrap gap-1 pt-0.5">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setDriverNote(preset)}
                  className="px-2 py-0.5 rounded-full bg-white/[0.04] hover:bg-white/10 text-white/60 hover:text-white text-[10px] transition-colors cursor-pointer border border-white/5"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isConfirmed}
            className="w-full min-h-[46px] rounded-xl bg-accent-pink hover:bg-accent-pink/90 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-accent-pink/25"
          >
            {isConfirmed ? (
              <>
                <Check size={14} />
                <span>Delivery Window Updated!</span>
              </>
            ) : (
              <span>Confirm New Delivery Window</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
