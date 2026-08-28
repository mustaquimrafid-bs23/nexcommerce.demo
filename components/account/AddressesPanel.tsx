'use client';

import React, { useState } from 'react';
import { Plus, CheckCircle2 } from 'lucide-react';
import { SavedAddress } from './types';
import { AddAddressModal } from './AddAddressModal';

interface AddressesPanelProps {
  addresses: SavedAddress[];
  onAddAddress: (newAddr: Omit<SavedAddress, 'id'>) => void;
  onRemoveAddress: (id: string) => void;
  userName?: string;
  userPhone?: string;
}

export function AddressesPanel({
  addresses,
  onAddAddress,
  onRemoveAddress,
  userName,
  userPhone,
}: AddressesPanelProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editNotice, setEditNotice] = useState<string | null>(null);

  function handleEdit(addr: SavedAddress) {
    setEditNotice(`Editing "${addr.tag}" address is ready.`);
    setTimeout(() => setEditNotice(null), 3000);
  }

  return (
    <div className="space-y-6">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-2">
        <div>
          <div className="text-[9px] font-bold tracking-[0.14em] text-white/35 uppercase">
            SAVED ADDRESSES
          </div>
          <p className="text-xs text-white/50 mt-1">
            Manage your delivery locations.
          </p>
        </div>

        {editNotice && (
          <div className="text-xs text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 px-3 py-1 rounded-md flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 size={13} />
            <span>{editNotice}</span>
          </div>
        )}
      </div>

      {/* Addresses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-200 ${
              addr.isDefault
                ? 'bg-accent-cyan/[0.03] border border-accent-cyan/20'
                : 'bg-white/[0.02] border border-white/[0.07] hover:border-white/[0.14]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3.5">
                <span className="text-[9px] font-bold tracking-[0.14em] text-white/40 uppercase">
                  {addr.tag}
                </span>
                {addr.isDefault && (
                  <span className="text-[9px] font-bold tracking-wider uppercase text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/25 px-2 py-0.5 rounded-full">
                    DEFAULT
                  </span>
                )}
              </div>

              <div className="text-xs sm:text-[13px] text-white/70 leading-relaxed space-y-1">
                <div className="font-semibold text-white">{addr.name}</div>
                <div>{addr.address}</div>
                <div>
                  {addr.postcode} {addr.city}, {addr.country}
                </div>
                <div className="text-white/50 text-[11px] pt-1">{addr.phone}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 mt-4 border-t border-white/[0.06] text-xs">
              <button
                type="button"
                onClick={() => handleEdit(addr)}
                className="font-semibold text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                Edit Details
              </button>
              {!addr.isDefault && (
                <button
                  type="button"
                  onClick={() => onRemoveAddress(addr.id)}
                  className="font-semibold text-rose-400/70 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Add New Address Card */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="min-h-[180px] rounded-2xl border border-dashed border-white/15 hover:border-accent-cyan/40 bg-white/[0.01] hover:bg-accent-cyan/[0.02] p-6 flex flex-col items-center justify-center gap-3 text-center transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full border border-white/15 group-hover:border-accent-cyan/40 group-hover:text-accent-cyan text-white/40 flex items-center justify-center transition-colors">
            <Plus size={18} />
          </div>
          <div>
            <div className="font-display font-semibold text-sm text-white/70 group-hover:text-white transition-colors">
              Add New Address
            </div>
            <div className="text-[11px] text-white/35 mt-0.5">
              Personal residence, studio or workplace
            </div>
          </div>
        </button>
      </div>

      {/* Modal */}
      <AddAddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onAddAddress}
        defaultName={userName}
        defaultPhone={userPhone}
      />
    </div>
  );
}
