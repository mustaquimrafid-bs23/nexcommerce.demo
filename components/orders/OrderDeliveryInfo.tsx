'use client';

import React from 'react';
import { MapPin, Mail, Phone, ShieldCheck } from 'lucide-react';

interface OrderDeliveryInfoProps {
  deliveryMethod?: string;
  shippingCost?: number;
  client: {
    name?: string;
    email?: string;
    phone?: string;
    street?: string;
    city?: string;
    postcode?: string;
    country?: string;
  };
}

export function OrderDeliveryInfo({
  deliveryMethod = 'DHL Express On-Demand Delivery',
  shippingCost = 0,
  client,
}: OrderDeliveryInfoProps) {
  return (
    <div
      id="orderDeliveryInfoCard"
      className="rounded-2xl border border-white/10 bg-[#0A2A54]/30 backdrop-blur-md p-6 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-5 border-b border-white/10">
        <MapPin className="w-4 h-4 text-accent-cyan" />
        <h3 className="text-xs font-bold tracking-[0.14em] uppercase text-white">
          DELIVERY &amp; DESTINATION
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
        {/* Shipping Address */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold tracking-[0.12em] text-white/40 uppercase block">
            SHIPPING DESTINATION
          </span>
          <div className="text-xs text-white/70 space-y-0.5 leading-relaxed font-medium">
            <div className="text-sm font-semibold text-white">
              {client.name || 'Julian Wright'}
            </div>
            <div>{client.street || 'Leopoldstraße 42'}</div>
            <div>
              {client.postcode || '80802'} {client.city || 'Munich'}
            </div>
            <div className="text-white/50">{client.country || 'Germany (Deutschland)'}</div>
          </div>
        </div>

        {/* Contact & Method Specs */}
        <div className="space-y-4">
          <div>
            <span className="text-[10px] font-bold tracking-[0.12em] text-white/40 uppercase block mb-1">
              CONTACT DETAILS
            </span>
            <div className="space-y-1.5 text-xs text-white/80">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-white/40" />
                <span>{client.email || 'julian@example.com'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-white/40" />
                <span>{client.phone || '+49 152 9876 5432'}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10">
            <span className="text-[10px] font-bold tracking-[0.12em] text-white/40 uppercase block mb-1">
              SERVICE TIER
            </span>
            <div className="text-xs font-semibold text-accent-cyan flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{deliveryMethod} ({shippingCost === 0 ? 'Complimentary' : `€ ${shippingCost.toFixed(2)}`})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
