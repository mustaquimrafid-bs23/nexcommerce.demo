'use client';

import React from 'react';
import { TrackingOrder, STATUS_TO_STAGE, TELEMETRY_STAGES } from './types';

interface TelemetryMatrixProps {
  order: TrackingOrder;
}

export default function TelemetryMatrix({ order }: TelemetryMatrixProps) {
  const stageIdx = STATUS_TO_STAGE[order.statusKey || order.status] ?? 4;
  const t = TELEMETRY_STAGES[stageIdx] || TELEMETRY_STAGES[4];

  const badges = [
    {
      icon: '📐',
      label: 'PACKAGE SPECS',
      rows: [
        { k: 'Weight', v: t.weight },
        { k: 'Dimensions', v: t.dims },
        { k: 'Handling', v: 'White Glove Priority' },
      ],
    },
    {
      icon: '🌡️',
      label: 'CLIMATE CONTROL',
      rows: [
        { k: 'Temperature', v: t.temp },
        { k: 'Sensor Status', v: t.tempStatus },
        { k: 'Chamber', v: 'Hermetic Vault' },
      ],
    },
    {
      icon: '🌿',
      label: 'CARBON OFFSET',
      rows: [
        { k: 'CO₂ Neutral', v: t.carbon },
        { k: 'Fleet Program', v: 'DHL GoGreen Plus' },
        { k: 'Standard', v: 'ISO 14064' },
      ],
    },
    {
      icon: '✈️',
      label: 'DISPATCH ROUTE',
      rows: [
        { k: 'Carrier Waybill', v: t.flightNo },
        { k: 'Transit State', v: t.flight },
        { k: 'Routing', v: 'MXP → FRA → LHR' },
      ],
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5 text-[9.5px] font-bold tracking-[0.16em] uppercase text-white/60">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan inline-block" />
        <span>REAL-TIME PARCEL &amp; SHIPPING DETAILS</span>
      </div>

      <div id="telemetryBadges" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {badges.map((b) => (
          <div
            key={b.label}
            className="p-4 rounded-xl bg-[#08254c]/75 border border-white/15 backdrop-blur-md hover:border-accent-cyan/40 hover:-translate-y-0.5 transition-all duration-200"
          >
            <span className="text-xl mb-2 block">{b.icon}</span>
            <div className="text-[9px] font-bold tracking-[0.14em] uppercase text-accent-cyan mb-2.5">
              {b.label}
            </div>
            <div className="space-y-1.5">
              {b.rows.map((r) => (
                <div key={r.k} className="flex justify-between items-center text-xs">
                  <span className="text-white/60">{r.k}</span>
                  <span className="font-mono text-white/90 font-semibold">{r.v}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
