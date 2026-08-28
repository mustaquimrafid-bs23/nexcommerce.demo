'use client';

import React from 'react';
import { Sliders } from 'lucide-react';
import { AccountOrder, OrderItem } from './types';
import { OrderCard } from './OrderCard';

interface OverviewPanelProps {
  orders: AccountOrder[];
  onReorder: (orderRef: string, item: OrderItem) => void;
  onCancelOrder: (orderRef: string) => void;
  onNavigateStyleTab: () => void;
}

export function OverviewPanel({
  orders,
  onReorder,
  onCancelOrder,
  onNavigateStyleTab,
}: OverviewPanelProps) {
  const activeOrder = orders.find((o) => o.status === 'preparing');
  const recentOrders = orders.filter((o) => o.status !== 'preparing').slice(0, 2);

  return (
    <div className="space-y-10">
      {/* Active Shipment Section */}
      {activeOrder && (
        <section>
          <div className="text-[9px] font-bold tracking-[0.14em] text-white/35 uppercase mb-3">
            ACTIVE SHIPMENT
          </div>
          <OrderCard
            order={activeOrder}
            onReorder={onReorder}
            onCancelOrder={onCancelOrder}
          />
        </section>
      )}

      {/* Recent Orders Section */}
      {recentOrders.length > 0 && (
        <section>
          <div className="text-[9px] font-bold tracking-[0.14em] text-white/35 uppercase mb-3">
            RECENT ORDERS
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <OrderCard
                key={order.ref}
                order={order}
                onReorder={onReorder}
                onCancelOrder={onCancelOrder}
              />
            ))}
          </div>
        </section>
      )}

      {/* Style Profile Banner Widget */}
      <section className="bg-gradient-to-br from-accent-cyan/[0.06] to-accent-pink/[0.04] border border-accent-cyan/15 rounded-2xl p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[9px] font-bold tracking-[0.14em] text-accent-cyan uppercase block">
              ACTIVE STYLE PROFILE
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
              Quiet Luxury &amp; Nordic Minimal
            </h2>
            <p className="text-xs sm:text-[13px] text-white/60 leading-relaxed">
              Your style preferences are actively tailoring catalog recommendations across tailoring, knitwear, and everyday essentials.
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateStyleTab}
            className="h-10 px-5 rounded-lg bg-accent-cyan text-obsidian-950 hover:bg-accent-cyan/90 font-semibold text-xs tracking-wider uppercase transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer shadow-md shadow-accent-cyan/20"
          >
            <Sliders size={13} />
            <span>Customise Style Profile</span>
          </button>
        </div>
      </section>
    </div>
  );
}
