'use client';

import React, { useState, useEffect } from 'react';
import { X, MapPin } from 'lucide-react';
import { SavedAddress } from './types';

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: Omit<SavedAddress, 'id'>) => void;
  defaultName?: string;
  defaultPhone?: string;
}

export function AddAddressModal({
  isOpen,
  onClose,
  onSave,
  defaultName = 'Julian Voss',
  defaultPhone = '+49 89 1234 5678',
}: AddAddressModalProps) {
  const [tag, setTag] = useState('HOME');
  const [name, setName] = useState(defaultName);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('Munich');
  const [postcode, setPostcode] = useState('80539');
  const [country, setCountry] = useState('Germany');
  const [phone, setPhone] = useState(defaultPhone);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!street.trim()) return;

    onSave({
      tag: tag.toUpperCase(),
      name,
      address: street,
      city,
      postcode,
      country,
      phone,
      isDefault: false,
    });

    // Reset form
    setStreet('');
    onClose();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="addAddressTitle"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="w-full max-w-lg bg-obsidian-950 border border-white/15 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-accent-cyan" />
            <h2 id="addAddressTitle" className="font-display text-lg font-bold text-white">
              Add New Delivery Address
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label
              htmlFor="addrTag"
              className="block text-[10px] font-bold tracking-wider text-white/50 uppercase mb-1.5"
            >
              Address Tag (e.g. Home, Studio, Office)
            </label>
            <input
              id="addrTag"
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="e.g. Home, Studio, Office"
              required
              className="w-full h-10 px-3.5 bg-white/[0.04] border border-white/15 rounded-lg text-white placeholder-white/25 focus:outline-none focus:border-accent-cyan transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="addrName"
              className="block text-[10px] font-bold tracking-wider text-white/50 uppercase mb-1.5"
            >
              Full Recipient Name
            </label>
            <input
              id="addrName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full h-10 px-3.5 bg-white/[0.04] border border-white/15 rounded-lg text-white placeholder-white/25 focus:outline-none focus:border-accent-cyan transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="addrStreet"
              className="block text-[10px] font-bold tracking-wider text-white/50 uppercase mb-1.5"
            >
              Street Address
            </label>
            <input
              id="addrStreet"
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="House, Road, Apartment or Suite"
              required
              className="w-full h-10 px-3.5 bg-white/[0.04] border border-white/15 rounded-lg text-white placeholder-white/25 focus:outline-none focus:border-accent-cyan transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="addrCity"
                className="block text-[10px] font-bold tracking-wider text-white/50 uppercase mb-1.5"
              >
                City
              </label>
              <input
                id="addrCity"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full h-10 px-3.5 bg-white/[0.04] border border-white/15 rounded-lg text-white placeholder-white/25 focus:outline-none focus:border-accent-cyan transition-colors"
              />
            </div>
            <div>
              <label
                htmlFor="addrPostcode"
                className="block text-[10px] font-bold tracking-wider text-white/50 uppercase mb-1.5"
              >
                Postcode
              </label>
              <input
                id="addrPostcode"
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                required
                className="w-full h-10 px-3.5 bg-white/[0.04] border border-white/15 rounded-lg text-white placeholder-white/25 focus:outline-none focus:border-accent-cyan transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="addrCountry"
                className="block text-[10px] font-bold tracking-wider text-white/50 uppercase mb-1.5"
              >
                Country
              </label>
              <input
                id="addrCountry"
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                className="w-full h-10 px-3.5 bg-white/[0.04] border border-white/15 rounded-lg text-white placeholder-white/25 focus:outline-none focus:border-accent-cyan transition-colors"
              />
            </div>
            <div>
              <label
                htmlFor="addrPhone"
                className="block text-[10px] font-bold tracking-wider text-white/50 uppercase mb-1.5"
              >
                Telephone Number
              </label>
              <input
                id="addrPhone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full h-10 px-3.5 bg-white/[0.04] border border-white/15 rounded-lg text-white placeholder-white/25 focus:outline-none focus:border-accent-cyan transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-lg bg-white/[0.05] hover:bg-white/10 text-white/70 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 px-6 rounded-lg bg-accent-cyan hover:bg-accent-cyan/90 text-obsidian-950 text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-accent-cyan/20 cursor-pointer"
            >
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
