'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Package,
  ChevronRight,
  Sparkles,
  Search,
} from 'lucide-react';
import { MASTER_PRODUCTS } from '@/data/products';
import { formatPrice } from '@/lib/utils';

const TRACKING_STAGES = [
  {
    stage: 1,
    title: 'Order Authorization & Authentication',
    location: 'Milan Atelier Hub',
    time: 'Oct 24, 09:15 AM',
    status: 'completed',
    description: 'Cryptographic settlement verified and inventory locked.',
  },
  {
    stage: 2,
    title: 'Artisanal Piece Allocation & Multi-Point QA',
    location: 'Florence Workshop',
    time: 'Oct 24, 11:30 AM',
    status: 'completed',
    description: 'Master leatherworkers calibrated stitching and hardware.',
  },
  {
    stage: 3,
    title: 'Bespoke Climate-Controlled Packaging',
    location: 'Florence Workshop',
    time: 'Oct 24, 02:45 PM',
    status: 'completed',
    description: 'Encased in sustainable cedar boxes with archival dustbags.',
  },
  {
    stage: 4,
    title: 'International Express Priority Dispatch',
    location: 'Frankfurt Air Cargo Terminal',
    time: 'Oct 25, 08:20 AM',
    status: 'completed',
    description: 'Dispatched via dedicated air courier line.',
  },
  {
    stage: 5,
    title: 'Out for White-Glove Residential Delivery',
    location: 'Dhaka Metropolitan Depot',
    time: 'Today, 02:15 PM (In-Transit)',
    status: 'active',
    description: 'Courier en route to residence. Contactless handover ready.',
  },
  {
    stage: 6,
    title: 'Client Signature & Handover',
    location: 'Client Residence',
    time: 'Est. Today, 04:30 PM',
    status: 'pending',
    description: 'Final physical handover with authenticity documentation.',
  },
];

function TrackingContent() {
  const searchParams = useSearchParams();
  const queryOrderId = searchParams ? searchParams.get('orderId') || 'NX-ORD-982412' : 'NX-ORD-982412';
  const [orderInput, setOrderInput] = useState(queryOrderId);
  const [activeOrderId, setActiveOrderId] = useState(queryOrderId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderInput.trim()) return;
    setActiveOrderId(orderInput.trim().toUpperCase());
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header Banner */}
      <section className="bg-obsidian-950 border-b border-white/10 pt-10 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs text-white/50">
            <Link href="/" className="hover:text-white transition-colors">
              Maison
            </Link>
            <ChevronRight size={12} />
            <span className="text-white">Live Courier Journey</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-xs font-semibold text-accent-cyan mb-2">
                <Truck size={12} />
                <span>Live White-Glove Telemetry</span>
              </div>
              <h1 className="font-editorial text-3xl sm:text-4xl text-white font-normal">
                Live Courier <span className="italic">Journey &amp; Telemetry</span>
              </h1>
            </div>

            {/* Order Reference Input */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  value={orderInput}
                  onChange={(e) => setOrderInput(e.target.value)}
                  placeholder="e.g. NX-ORD-982412"
                  className="bg-surface-navy/70 border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white uppercase tracking-wider focus:outline-none focus:border-accent-pink w-48 sm:w-60"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white text-white hover:text-obsidian-950 text-xs font-semibold transition-colors"
              >
                Track
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Main Tracking Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: 6-Stage Timeline (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-surface-navy/35 border border-white/10 space-y-8">
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <div>
                  <span className="text-[11px] text-white/50 uppercase tracking-wider block">
                    Tracking Identifier
                  </span>
                  <span className="font-editorial text-xl text-white font-semibold">
                    {activeOrderId}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-white/50 uppercase tracking-wider block">
                    Estimated Delivery
                  </span>
                  <span className="text-sm font-semibold text-emerald-400">
                    Today &bull; 04:30 PM
                  </span>
                </div>
              </div>

              {/* 6-Stage Vertical Timeline */}
              <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                {TRACKING_STAGES.map((stage) => {
                  const isDone = stage.status === 'completed';
                  const isActive = stage.status === 'active';

                  return (
                    <div key={stage.stage} className="relative group">
                      {/* Node Indicator */}
                      <div
                        className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                          isDone
                            ? 'bg-emerald-500 text-obsidian-950 shadow-md shadow-emerald-500/30'
                            : isActive
                            ? 'bg-accent-cyan text-obsidian-950 ring-4 ring-accent-cyan/30 animate-pulse'
                            : 'bg-surface-navy border border-white/20 text-white/40'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 size={12} strokeWidth={3} />
                        ) : isActive ? (
                          <span className="w-2 h-2 rounded-full bg-obsidian-950" />
                        ) : (
                          <span className="text-[9px] font-bold">{stage.stage}</span>
                        )}
                      </div>

                      {/* Content Card */}
                      <div
                        className={`p-4 rounded-2xl border transition-all ${
                          isActive
                            ? 'bg-surface-navy/70 border-accent-cyan/40 shadow-lg shadow-accent-cyan/5'
                            : 'bg-surface-navy/20 border-white/5'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                          <h3
                            className={`text-sm font-semibold ${
                              isActive ? 'text-accent-cyan' : isDone ? 'text-white' : 'text-white/60'
                            }`}
                          >
                            {stage.title}
                          </h3>
                          <span className="text-[11px] text-white/50 font-mono">
                            {stage.time}
                          </span>
                        </div>

                        <div className="text-xs text-white/50 flex items-center gap-1 mb-2">
                          <MapPin size={11} className="text-accent-pink" />
                          <span>{stage.location}</span>
                        </div>

                        <p className="text-xs text-white/70 leading-relaxed">
                          {stage.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Driver Telemetry & Package Contents (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Master Courier Card */}
            <div className="p-6 rounded-3xl bg-surface-navy/40 border border-white/10 space-y-5 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-semibold uppercase tracking-wider text-accent-cyan">
                  Dedicated Courier Dispatch
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                  EN ROUTE &bull; 3 STOPS AWAY
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-accent-pink to-accent-cyan p-0.5 shadow-lg">
                  <div className="w-full h-full rounded-2xl bg-obsidian-950 flex items-center justify-center">
                    <Truck size={24} className="text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-editorial text-lg text-white font-medium">
                    Master Courier Jean-Luc
                  </h3>
                  <p className="text-xs text-white/50">Maison Dedicated Fleet #AT-402</p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-emerald-400">
                    <ShieldCheck size={13} />
                    <span>Identity &amp; Biometrics Verified</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-obsidian-950/80 border border-white/10 text-xs space-y-2">
                <div className="flex justify-between text-white/60">
                  <span>Vehicle:</span>
                  <span className="text-white font-medium">Mercedes-Benz Sprinter Atelier</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Current Sector:</span>
                  <span className="text-accent-cyan font-medium">Gulshan-2 North Hub</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white text-white hover:text-obsidian-950 text-xs font-semibold transition-colors flex items-center justify-center gap-2">
                  <Phone size={14} />
                  <span>Call Courier</span>
                </button>
                <button className="flex-1 py-3 rounded-xl bg-surface-navy border border-white/15 text-white text-xs font-semibold hover:border-white/30 transition-colors">
                  Contactless Handover
                </button>
              </div>
            </div>

            {/* Package Contents */}
            <div className="p-6 rounded-3xl bg-surface-navy/40 border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-semibold text-white">Parcels in Shipment (3 Pieces)</span>
                <Package size={16} className="text-white/40" />
              </div>

              <div className="space-y-3">
                {MASTER_PRODUCTS.slice(0, 3).map((p) => (
                  <div key={p.id} className="flex items-center gap-3 text-xs">
                    <div className="w-10 h-12 rounded-lg bg-surface-card overflow-hidden flex-shrink-0">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="truncate flex-1">
                      <div className="text-white font-medium truncate">{p.name}</div>
                      <div className="text-white/50 text-[11px]">Bespoke Cedar Box Packaging</div>
                    </div>
                    <span className="text-white font-semibold flex-shrink-0">
                      {formatPrice(p.price, p.currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-accent-pink border-t-transparent animate-spin" />
        </div>
      }
    >
      <TrackingContent />
    </Suspense>
  );
}
