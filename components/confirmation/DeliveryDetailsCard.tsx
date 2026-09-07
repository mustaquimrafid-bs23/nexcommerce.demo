'use client';

import React from 'react';
import { Truck } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface DeliveryDetailsCardProps {
  deliveryMethod?: string;
  shippingCost?: number;
  client?: {
    name: string;
    email: string;
    phone?: string;
    street: string;
    city: string;
    postcode: string;
    country: string;
  };
}

export function DeliveryDetailsCard({
  deliveryMethod = 'Standard Free Delivery',
  shippingCost = 0,
  client = {
    name: 'Julian Wright',
    email: 'julian@example.com',
    phone: '+49 152 9876 5432',
    street: 'Friedrichstraße 42',
    city: 'Berlin',
    postcode: '10117',
    country: 'Germany (Deutschland)',
  },
}: DeliveryDetailsCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0A2A54]/35 p-6 backdrop-blur-md">
      <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] uppercase text-white/50 mb-4">
        <Truck className="w-4 h-4 text-accent-cyan" />
        <span>Delivery &amp; Destination</span>
      </div>

      {/* Method & ETA Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-5 border-b border-white/10">
        <div>
          <h4 id="conf-delivery-method" className="text-sm font-semibold text-white mb-1.5">
            {deliveryMethod}
          </h4>
          <div
            id="conf-delivery-eta"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-accent-cyan/30 bg-accent-cyan/[0.08] text-xs font-medium text-accent-cyan"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>In 2–4 Business Days (DHL Tracked)</span>
          </div>
        </div>

        <div id="conf-shipping-cost" className="text-sm font-bold text-emerald-400">
          {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
        </div>
      </div>

      {/* Address & Contact Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-5 text-xs text-white/70">
        {/* Address */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/40 block mb-1.5">
            Delivery Address
          </span>
          <div id="conf-address" className="space-y-0.5 text-white/80 leading-relaxed">
            <div className="text-white font-medium">{client.street}</div>
            <div>{client.postcode} {client.city}</div>
            <div>{client.country}</div>
          </div>
        </div>

        {/* Contact */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/40 block mb-1.5">
            Contact Details
          </span>
          <div className="space-y-0.5 text-white/80 leading-relaxed">
            <div id="conf-recipient-name" className="text-white font-semibold">
              {client.name}
            </div>
            {client.phone && <div id="conf-phone">{client.phone}</div>}
            <div id="conf-email" className="break-all text-white/60">
              {client.email}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
