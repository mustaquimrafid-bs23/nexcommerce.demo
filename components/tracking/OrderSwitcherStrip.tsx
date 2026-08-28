'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Layers, Search, ChevronDown, Check, Package } from 'lucide-react';
import { TrackingOrder, DEFAULT_ORDERS } from './types';

interface OrderSwitcherStripProps {
  currentOrder: TrackingOrder;
  onSelectOrder: (orderId: string) => void;
  onOpenLookupModal: () => void;
}

export default function OrderSwitcherStrip({
  currentOrder,
  onSelectOrder,
  onOpenLookupModal,
}: OrderSwitcherStripProps) {
  const [availableOrders, setAvailableOrders] = useState<
    Array<{ id: string; ref: string; statusLabel?: string; status?: string }>
  >(DEFAULT_ORDERS);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Extract placed orders from localStorage safely on client
  useEffect(() => {
    try {
      const stored = localStorage.getItem('nex_placed_orders');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const seen = new Set<string>();
          const combined: Array<{ id: string; ref: string; statusLabel?: string; status?: string }> = [];

          parsed.forEach((o) => {
            const id = o.id || o.ref;
            if (id && !seen.has(id.toUpperCase())) {
              seen.add(id.toUpperCase());
              combined.push({
                id,
                ref: id,
                statusLabel: o.statusLabel || (o.status === 'delivered' ? 'Delivered' : 'In Transit'),
              });
            }
          });

          DEFAULT_ORDERS.forEach((o) => {
            if (!seen.has(o.id.toUpperCase())) {
              seen.add(o.id.toUpperCase());
              combined.push({
                id: o.id,
                ref: o.ref,
                statusLabel: o.statusLabel,
              });
            }
          });

          setAvailableOrders(combined);
        }
      }
    } catch (_) {}
  }, []);

  // Click-outside listener for the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const activeId = String(currentOrder.id || currentOrder.ref).toUpperCase();

  // Reorder list so active order is always present, followed by top other orders
  const activeOrderObj = availableOrders.find(
    (o) => String(o.id || o.ref).toUpperCase() === activeId
  ) || {
    id: currentOrder.id,
    ref: currentOrder.ref,
    statusLabel: currentOrder.statusLabel,
  };

  const otherOrders = availableOrders.filter(
    (o) => String(o.id || o.ref).toUpperCase() !== activeId
  );

  const visibleTopOrders = [activeOrderObj, ...otherOrders.slice(0, 2)];
  const remainingOrders = otherOrders.slice(2);

  return (
    <div className="relative z-30 flex items-center justify-between gap-3 bg-[#08254c]/75 border border-white/15 rounded-xl px-4 py-2.5 backdrop-blur-md">
      {/* Left: Active Order Label + Top 3 Primary Chips */}
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.12em] uppercase text-white/50 flex-shrink-0">
          <Layers size={13} className="text-accent-cyan" />
          <span className="hidden sm:inline">ACTIVE ORDER:</span>
        </div>

        <div id="orderSwitcherChips" className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {visibleTopOrders.map((o) => {
            const oId = String(o.id || o.ref).toUpperCase();
            const isActive = oId === activeId;
            const label = o.id || o.ref;
            const note = o.statusLabel || 'In Transit';

            return (
              <button
                key={label}
                type="button"
                onClick={() => onSelectOrder(label)}
                className={`font-mono text-xs font-semibold px-3 py-1 rounded-full border transition-all inline-flex items-center gap-1.5 flex-shrink-0 ${
                  isActive
                    ? 'bg-accent-cyan text-black border-accent-cyan font-bold shadow-[0_0_12px_rgba(61,224,255,0.35)]'
                    : 'bg-white/10 hover:bg-white/15 border-white/15 text-white/80 hover:text-white'
                }`}
                title={`${label} (${note})`}
              >
                <span>#{label}</span>
                <span
                  className={`text-[10px] hidden md:inline ${
                    isActive ? 'opacity-80' : 'opacity-50'
                  }`}
                >
                  ({note})
                </span>
              </button>
            );
          })}

          {/* "+X More" Dropdown Trigger */}
          {remainingOrders.length > 0 && (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className={`font-mono text-xs font-semibold px-2.5 py-1 rounded-full border transition-all inline-flex items-center gap-1 flex-shrink-0 ${
                  isDropdownOpen
                    ? 'bg-accent-cyan/20 border-accent-cyan text-accent-cyan'
                    : 'bg-white/5 hover:bg-white/10 border-white/15 text-white/70 hover:text-white'
                }`}
                title="View all past orders"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                <span>+{remainingOrders.length} More</span>
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180 text-accent-cyan' : 'text-white/40'
                  }`}
                />
              </button>

              {/* Glassmorphic Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-64 max-h-72 overflow-y-auto bg-[#08254c] border border-accent-cyan/30 rounded-xl p-1.5 shadow-2xl z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-1 duration-150 divide-y divide-white/10">
                  <div className="px-2.5 py-1.5 text-[9.5px] font-bold tracking-wider uppercase text-white/40 flex items-center justify-between">
                    <span>OTHER PLACED ORDERS</span>
                    <span>{remainingOrders.length}</span>
                  </div>

                  <div className="py-1 space-y-0.5">
                    {remainingOrders.map((o) => {
                      const label = o.id || o.ref;
                      const note = o.statusLabel || 'In Transit';
                      return (
                        <button
                          key={label}
                          type="button"
                          onClick={() => {
                            onSelectOrder(label);
                            setIsDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 text-xs text-white/90 hover:text-white flex items-center justify-between transition-colors group"
                        >
                          <div className="flex items-center gap-2">
                            <Package size={13} className="text-accent-cyan opacity-60 group-hover:opacity-100" />
                            <span className="font-mono font-semibold">#{label}</span>
                          </div>
                          <span className="text-[10px] text-white/50">{note}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-1.5 px-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onOpenLookupModal();
                      }}
                      className="w-full py-1.5 text-center text-[11px] font-bold tracking-wider uppercase text-accent-cyan hover:bg-accent-cyan/10 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Search size={11} />
                      <span>Search All Orders</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: Custom Lookup Button */}
      <button
        type="button"
        onClick={onOpenLookupModal}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-cyan/15 hover:bg-accent-cyan/25 border border-accent-cyan/40 text-accent-cyan text-[10.5px] font-bold tracking-wider uppercase transition-all flex-shrink-0"
      >
        <Search size={12} />
        <span className="hidden sm:inline">CUSTOM LOOKUP</span>
        <span className="sm:hidden">LOOKUP</span>
      </button>
    </div>
  );
}
