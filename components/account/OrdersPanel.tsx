'use client';

import React from 'react';
import { PackageSearch } from 'lucide-react';
import { AccountOrder, OrderItem } from './types';
import { OrderCard } from './OrderCard';

export type OrderFilter = 'ALL' | 'ACTIVE' | 'DELIVERED' | 'CANCELLED';

interface OrdersPanelProps {
  orders: AccountOrder[];
  activeFilter: OrderFilter;
  onFilterChange: (filter: OrderFilter) => void;
  onReorder: (orderRef: string, item: OrderItem) => void;
  onCancelOrder: (orderRef: string) => void;
}

export function OrdersPanel({
  orders,
  activeFilter,
  onFilterChange,
  onReorder,
  onCancelOrder,
}: OrdersPanelProps) {
  const filteredOrders = orders.filter((order) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'ACTIVE') return order.status === 'preparing';
    if (activeFilter === 'DELIVERED') return order.status === 'delivered';
    if (activeFilter === 'CANCELLED') return order.status === 'cancelled';
    return true;
  });

  const filterOptions: OrderFilter[] = ['ALL', 'ACTIVE', 'DELIVERED', 'CANCELLED'];

  return (
    <div className="space-y-6">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="text-[9px] font-bold tracking-[0.14em] text-white/35 uppercase">
            ORDER PORTFOLIO
          </div>
          <p className="text-xs text-white/50 mt-1">
            All purchases and fulfilment records.
          </p>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {filterOptions.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => onFilterChange(filter)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer min-h-[36px] ${
                  isActive
                    ? 'bg-accent-cyan text-obsidian-950 shadow-sm shadow-accent-cyan/20'
                    : 'bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/10'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.ref}
              order={order}
              onReorder={onReorder}
              onCancelOrder={onCancelOrder}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center text-white/40 text-xs border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
          <PackageSearch size={36} className="text-white/20 mb-3" />
          <p className="font-medium text-white/60 text-sm">
            No {activeFilter.toLowerCase()} orders found.
          </p>
          <p className="text-white/40 mt-1">
            Try switching filter tabs to view your other purchases.
          </p>
        </div>
      )}
    </div>
  );
}
