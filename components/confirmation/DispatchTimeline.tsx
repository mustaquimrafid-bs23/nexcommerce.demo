'use client';

import React from 'react';
import { PackageCheck, Check } from 'lucide-react';

interface DispatchTimelineProps {
  currentStage?: number; // 1 = Confirmed, 2 = Preparing, 3 = Shipped, 4 = Out for delivery
}

export function DispatchTimeline({ currentStage = 2 }: DispatchTimelineProps) {
  const stages = [
    { name: 'Order Confirmed', time: 'Completed Today', step: 1 },
    { name: 'Preparing Your Order', time: 'In Progress', step: 2 },
    { name: 'Shipped', time: 'Expected Tomorrow', step: 3 },
    { name: 'Out for Delivery', time: 'Final Step', step: 4 },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0A2A54]/35 p-6 backdrop-blur-md">
      <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] uppercase text-white/50 mb-6">
        <PackageCheck className="w-4 h-4 text-accent-cyan" />
        <span>ORDER STATUS</span>
      </div>

      <div id="dispatchTimelineTrack" className="flex items-start justify-between relative py-2">
        {stages.map((stage, idx) => {
          const isCompleted = stage.step < currentStage;
          const isCurrent = stage.step === currentStage;
          const isPending = stage.step > currentStage;

          return (
            <React.Fragment key={stage.step}>
              {/* Step Node */}
              <div className="flex flex-col items-center gap-2.5 text-center flex-1 max-w-[100px] z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-emerald-500/15 border-2 border-emerald-400 text-emerald-400'
                      : isCurrent
                      ? 'bg-accent-cyan/10 border-2 border-accent-cyan'
                      : 'bg-white/[0.03] border-2 border-white/12 text-white/40'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : isCurrent ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-accent-cyan animate-ping" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  )}
                </div>

                <div className="flex flex-col items-center gap-0.5">
                  <span
                    className={`text-[11px] font-semibold leading-snug ${
                      isCompleted
                        ? 'text-emerald-400'
                        : isCurrent
                        ? 'text-accent-cyan'
                        : 'text-white/50'
                    }`}
                  >
                    {stage.name}
                  </span>
                  <span
                    className={`text-[9.5px] ${
                      isCurrent ? 'text-accent-cyan/80' : 'text-white/35'
                    }`}
                  >
                    {stage.time}
                  </span>
                </div>
              </div>

              {/* Connecting Line */}
              {idx < stages.length - 1 && (
                <div
                  className={`flex-1 h-[2px] mt-4 -mx-2 transition-all ${
                    stage.step < currentStage
                      ? 'bg-gradient-to-r from-emerald-400 to-accent-cyan'
                      : 'bg-white/10'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
