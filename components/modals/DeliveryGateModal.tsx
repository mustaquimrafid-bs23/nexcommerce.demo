'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { X, MapPin, Search, Navigation, Check, Truck, Sparkles } from 'lucide-react';
import { useDeliveryGateStore, DARK_STORE_HUBS, DarkStoreHub } from '@/store/useDeliveryGateStore';

interface DeliveryGateModalProps {
  isOpen?: boolean;
  activeHubId?: string;
  onClose?: () => void;
  onSelectHub?: (hub: DarkStoreHub) => void;
}

export function DeliveryGateModal({
  isOpen: propIsOpen,
  activeHubId: propActiveHubId,
  onClose: propOnClose,
  onSelectHub: propOnSelectHub,
}: DeliveryGateModalProps = {}) {
  const storeIsOpen = useDeliveryGateStore((s) => s.isModalOpen);
  const storeClose = useDeliveryGateStore((s) => s.closeModal);
  const storeActiveHub = useDeliveryGateStore((s) => s.activeHub);
  const storeSetActiveHub = useDeliveryGateStore((s) => s.setActiveHub);

  const isOpen = propIsOpen !== undefined ? propIsOpen : storeIsOpen;
  const activeHubId = propActiveHubId !== undefined ? propActiveHubId : storeActiveHub.id;
  const handleClose = propOnClose || storeClose;
  const handleSelect = propOnSelectHub || storeSetActiveHub;

  const [search, setSearch] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  const filteredHubs = useMemo(() => {
    if (!search.trim()) return DARK_STORE_HUBS;
    const lower = search.toLowerCase();
    return DARK_STORE_HUBS.filter(
      (h) =>
        h.city.toLowerCase().includes(lower) ||
        h.region.toLowerCase().includes(lower) ||
        h.postcode.toLowerCase().includes(lower)
    );
  }, [search]);

  if (!isOpen) return null;

  const handleGpsDetect = () => {
    if (!navigator.geolocation) return;
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      () => {
        setIsDetecting(false);
        // Default to Berlin Mitte for demo
        handleSelect(DARK_STORE_HUBS[0]);
        handleClose();
      },
      () => {
        setIsDetecting(false);
      },
      { timeout: 5000 }
    );
  };

  return (
    <div
      id="deliveryHubModalOverlay"
      className="fixed inset-0 z-[9500] flex items-center justify-center p-4 bg-[#01132B]/85 backdrop-blur-md transition-all duration-300"
      role="dialog"
      aria-modal="true"
      aria-label="Select Delivery Location"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-br from-[#0A2A54]/95 via-[#012148]/98 to-[#00142E] border border-white/15 p-6 sm:p-8 space-y-5 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Glow accent */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-44 w-44 rounded-full bg-accent-cyan/15 blur-2xl" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-accent-cyan/15 border border-accent-cyan/30 flex items-center justify-center text-accent-cyan">
              <MapPin size={16} />
            </div>
            <div>
              <h2 className="font-editorial text-2xl text-white font-medium">Delivery Location</h2>
              <span className="text-[10.5px] text-white/50 block font-mono">
                Select Fulfillment Dark Store
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close delivery modal"
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <p className="text-xs text-white/70 font-normal leading-relaxed">
          Select your destination dark store to unlock same-day white-glove courier dispatch and live inventory routing.
        </p>

        {/* Search input */}
        <div className="relative">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search postal code or city (e.g. 10115, 75001, Berlin, Paris)..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#00142E]/90 border border-white/15 text-white text-xs sm:text-sm outline-none focus:border-accent-cyan transition-all"
          />
        </div>

        {/* GPS location detector button */}
        <button
          type="button"
          onClick={handleGpsDetect}
          disabled={isDetecting}
          className="w-full py-2.5 rounded-xl bg-accent-cyan/10 hover:bg-accent-cyan/20 border border-accent-cyan/30 text-accent-cyan text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Navigation size={13} className={isDetecting ? 'animate-spin' : ''} />
          <span>{isDetecting ? 'Detecting Nearest Atelier...' : 'Use My Current Location'}</span>
        </button>

        {/* Hub Selection Grid */}
        <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
          {filteredHubs.map((hub) => {
            const isSelected = hub.id === activeHubId;
            return (
              <div
                key={hub.id}
                onClick={() => {
                  handleSelect(hub);
                  handleClose();
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-accent-cyan/15 border-accent-cyan shadow-md'
                    : 'bg-[#00142E]/70 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-accent-cyan bg-accent-cyan text-obsidian-950' : 'border-white/20'
                    }`}
                  >
                    {isSelected && <Check size={11} strokeWidth={3} />}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">
                      {hub.city} &middot; <span className="font-mono text-accent-cyan">{hub.postcode}</span>
                    </div>
                    <div className="text-[11px] text-white/50">{hub.courier} &middot; {hub.speed}</div>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-accent-cyan/20 text-accent-cyan text-[10px] font-bold uppercase shrink-0">
                  ⚡ Same-Day
                </span>
              </div>
            );
          })}
        </div>

        {/* Fallback info */}
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-[11px] text-white/60 flex items-center gap-2">
          <Truck size={14} className="text-white/40 shrink-0" />
          <span>All destinations outside regional express zones arrive in 2–3 business days via DHL Carbon-Neutral.</span>
        </div>
      </div>
    </div>
  );
}
export { DARK_STORE_HUBS } from '@/store/useDeliveryGateStore';
export type { DarkStoreHub } from '@/store/useDeliveryGateStore';
