'use client';

import React, { useState, useMemo } from 'react';
import { X, MapPin, Search, Navigation, Check, Sparkles, Truck } from 'lucide-react';

export interface DarkStoreHub {
  id: string;
  city: string;
  region: string;
  postcode: string;
  courier: string;
  speed: string;
  cutoff: string;
}

export const DARK_STORE_HUBS: DarkStoreHub[] = [
  {
    id: 'hub-berlin',
    city: 'Berlin Mitte',
    region: 'Torstraße Atelier',
    postcode: '10115',
    courier: 'DHL Same-Day Express',
    speed: 'Delivery within 2h',
    cutoff: 'Order before 17:00',
  },
  {
    id: 'hub-paris',
    city: 'Paris Le Marais',
    region: 'Rue Saint-Honoré',
    postcode: '75001',
    courier: 'Chronopost White-Glove',
    speed: 'Delivery within 2.5h',
    cutoff: 'Order before 18:30',
  },
  {
    id: 'hub-london',
    city: 'London Mayfair',
    region: 'Bond Street Atelier',
    postcode: 'W1S 1SR',
    courier: 'Royal Mail Special Delivery',
    speed: 'Same-Day Courier',
    cutoff: 'Order before 16:00',
  },
  {
    id: 'hub-milan',
    city: 'Milan Quadrilatero',
    region: 'Via Monte Napoleone',
    postcode: '20121',
    courier: 'Poste Italiane Express',
    speed: 'Same-Day Delivery',
    cutoff: 'Order before 17:30',
  },
  {
    id: 'hub-amsterdam',
    city: 'Amsterdam Grachtengordel',
    region: 'Keizersgracht',
    postcode: '1012',
    courier: 'PostNL Zero-Emission',
    speed: 'Same-Day Bike Courier',
    cutoff: 'Order before 18:00',
  },
];

interface DeliveryGateModalProps {
  isOpen: boolean;
  activeHubId: string;
  onClose: () => void;
  onSelectHub: (hub: DarkStoreHub) => void;
}

export function DeliveryGateModal({
  isOpen,
  activeHubId,
  onClose,
  onSelectHub,
}: DeliveryGateModalProps) {
  const [search, setSearch] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);

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
        onSelectHub(DARK_STORE_HUBS[0]);
        onClose();
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Select Delivery Location"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-surface-card border border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-accent-cyan" />
            <h2 className="font-editorial text-2xl text-white font-normal">Delivery Location</h2>
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
          Select your destination dark store to unlock same-day white-glove dispatch and live inventory routing.
        </p>

        {/* Search input */}
        <div className="relative">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search postal code or city (e.g. 10115, Berlin, Paris)..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-obsidian-950/80 border border-white/15 text-white text-xs sm:text-sm outline-none focus:border-accent-cyan"
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
        <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
          {filteredHubs.map((hub) => {
            const isSelected = hub.id === activeHubId;
            return (
              <div
                key={hub.id}
                onClick={() => {
                  onSelectHub(hub);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-accent-cyan/15 border-accent-cyan shadow-md'
                    : 'bg-obsidian-950/60 border-white/10 hover:border-white/20'
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
