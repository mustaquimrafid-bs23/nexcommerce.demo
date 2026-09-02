'use client';

import React, { useState } from 'react';
import {
  Truck,
  CheckCircle2,
  MapPin,
  Compass,
  ChevronDown,
  ChevronUp,
  Radio,
  Clock,
  ShieldCheck,
} from 'lucide-react';

interface OrderTrackingCardProps {
  orderRef: string;
  stage: number; // 1 to 4
  courier?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  destinationCity?: string;
  isDelivered?: boolean;
}

export function OrderTrackingCard({
  orderRef,
  stage = 4,
  courier = 'DHL Express On-Demand',
  trackingNumber,
  estimatedDelivery = 'Today · By 6:00 PM',
  destinationCity = 'Munich',
  isDelivered = false,
}: OrderTrackingCardProps) {
  const [showFullLogs, setShowFullLogs] = useState(false);
  const generatedTrackingNum = trackingNumber || `DHL-${orderRef.replace(/[^A-Z0-9]/gi, '')}-EU`;

  const steps = [
    {
      stageNumber: 1,
      title: 'Order Confirmed',
      desc: 'Verified & sent to atelier',
      time: '08:15 AM · Aug 31',
    },
    {
      stageNumber: 2,
      title: 'Preparing & Packed',
      desc: 'Quality inspected & sealed',
      time: stage >= 2 ? '02:30 PM · Aug 31' : 'Upcoming',
    },
    {
      stageNumber: 3,
      title: 'In Transit',
      desc: 'European logistics hub',
      time: stage >= 3 ? '05:45 AM · Today' : 'Upcoming',
    },
    {
      stageNumber: 4,
      title: isDelivered ? 'Delivered' : 'Out for Delivery',
      desc: isDelivered ? `Signed at ${destinationCity}` : `With courier in ${destinationCity}`,
      time: isDelivered ? 'Delivered · 02:15 PM' : 'Expected by 6:00 PM',
    },
  ];

  const detailedCheckpoints = [
    {
      time: '10:45 AM',
      date: 'Today',
      location: `${destinationCity} Delivery Sector 4`,
      status: isDelivered ? 'Package safely delivered & signed.' : 'Courier en route to recipient address.',
      highlight: true,
    },
    {
      time: '08:30 AM',
      date: 'Today',
      location: `${destinationCity} Central DHL Logistics Hub`,
      status: 'Loaded onto regional electric delivery van #42.',
      highlight: false,
    },
    {
      time: '05:45 AM',
      date: 'Today',
      location: 'Southern Germany Regional Sort Facility',
      status: 'Customs cleared & sorted for localized priority dispatch.',
      highlight: false,
    },
    {
      time: '02:30 PM',
      date: 'Aug 31',
      location: 'nexCommerce Atelier Logistics Center',
      status: 'Handcrafted garments packaged in climate-neutral atelier boxes.',
      highlight: false,
    },
  ];

  return (
    <div
      id="orderTrackingCard"
      className="rounded-2xl border border-white/10 bg-[#0A2A54]/30 backdrop-blur-md p-6 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.25)] relative overflow-hidden transition-all duration-300"
    >
      {/* Top Courier Details */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan shrink-0 relative">
            <Truck className="w-5 h-5" />
            {/* Live Beacon */}
            {!isDelivered && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-cyan" />
              </span>
            )}
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-white/40 flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-accent-cyan animate-pulse" />
              <span>LIVE CARRIER TELEMETRY</span>
            </div>
            <div className="text-sm font-semibold text-white mt-0.5 flex items-center gap-2 flex-wrap">
              <span>{courier}</span>
              <span className="text-white/30">&middot;</span>
              <span className="font-mono text-xs text-accent-cyan font-bold bg-white/[0.06] border border-white/12 px-2 py-0.5 rounded">
                {generatedTrackingNum}
              </span>
            </div>
          </div>
        </div>

        {/* ETA Badge */}
        <div className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 sm:text-right">
          <span className="text-[9.5px] font-bold tracking-[0.12em] text-white/40 uppercase block mb-0.5">
            {isDelivered ? 'DELIVERY COMPLETED' : 'ESTIMATED ARRIVAL'}
          </span>
          <span className="text-xs sm:text-sm font-bold text-emerald-400 font-mono flex items-center sm:justify-end gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>{estimatedDelivery}</span>
          </span>
        </div>
      </div>

      {/* 4-Stage Live Dispatch Stepper */}
      <div className="pt-6 pb-2 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
          {steps.map((step, idx) => {
            const isCompleted =
              stage > step.stageNumber || (stage === 4 && step.stageNumber === 4 && isDelivered);
            const isCurrent = stage === step.stageNumber && !(stage === 4 && isDelivered);

            return (
              <div key={idx} className="flex flex-col items-start relative group">
                {/* Visual Step Marker */}
                <div className="flex items-center gap-2 w-full mb-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : isCurrent
                        ? 'bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/40 ring-2 ring-accent-cyan/20 animate-pulse'
                        : 'bg-white/[0.04] text-white/30 border border-white/10'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isCurrent ? (
                      <Compass className="w-4 h-4" />
                    ) : (
                      <span className="text-[11px] font-mono">{step.stageNumber}</span>
                    )}
                  </div>

                  {/* Horizontal Line connector (Desktop) */}
                  {idx < steps.length - 1 && (
                    <div
                      className={`hidden sm:block flex-1 h-[2px] rounded ${
                        isCompleted
                          ? 'bg-emerald-500/40'
                          : isCurrent
                          ? 'bg-gradient-to-r from-accent-cyan/60 to-white/10'
                          : 'bg-white/10'
                      }`}
                    />
                  )}
                </div>

                {/* Milestone Text */}
                <div className="space-y-1">
                  <h4
                    className={`text-xs font-bold ${
                      isCurrent
                        ? 'text-accent-cyan'
                        : isCompleted
                        ? 'text-white'
                        : 'text-white/40'
                    }`}
                  >
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-white/60 leading-tight">
                    {step.desc}
                  </p>
                  <span className="text-[10px] font-mono text-white/40 block pt-0.5">
                    {step.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Checkpoint Log Banner */}
      <div className="mt-6 pt-5 border-t border-white/10 bg-white/[0.03] border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs relative z-10">
        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <div className="text-white font-medium">
              {stage === 4
                ? isDelivered
                ? `Package safely delivered and signed at destination address in ${destinationCity}.`
                : `Courier is en route in ${destinationCity} (Electric Van #42).`
              : stage === 3
              ? `Package in transit via European Logistics Express Hub.`
              : `Atelier tailoring and dispatch inspection in progress.`}
            </div>
            <div className="text-[10.5px] text-white/50 font-mono">
              Status Code: {stage === 4 ? (isDelivered ? 'DELIVERED-OK' : 'OUT-FOR-DELIVERY-PRIORITY') : 'TRANSIT-SCAN'} &middot; Verified Telemetry
            </div>
          </div>
        </div>

        {/* Expand Detailed Log Accordion Trigger */}
        <button
          type="button"
          id="btnToggleCheckpoints"
          onClick={() => setShowFullLogs(!showFullLogs)}
          className="shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold text-accent-cyan hover:underline transition-colors cursor-pointer self-start sm:self-center"
        >
          <span>{showFullLogs ? 'Hide Checkpoint Log' : 'View Full Checkpoint Log'}</span>
          {showFullLogs ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expandable Checkpoint History */}
      {showFullLogs && (
        <div
          id="trackingDetailedLogs"
          className="mt-4 pt-4 border-t border-white/10 space-y-3 relative z-10 animate-[fadeIn_0.2s_ease-out]"
        >
          <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40 mb-2">
            DETAILED COURIER MILESTONE TIMELINE
          </div>
          <div className="space-y-2.5">
            {detailedCheckpoints.map((cp, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs transition-all ${
                  cp.highlight
                    ? 'bg-accent-cyan/10 border-accent-cyan/30 text-white'
                    : 'bg-white/[0.03] border-white/10 text-white/70'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-white flex items-center gap-2">
                    <span>{cp.location}</span>
                    {cp.highlight && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-accent-cyan text-[#000B1A] uppercase">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-white/60">{cp.status}</div>
                </div>
                <div className="font-mono text-[11px] text-white/40 shrink-0">
                  {cp.time} &middot; {cp.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
