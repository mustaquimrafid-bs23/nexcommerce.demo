'use client';

import React from 'react';
import { STAGES, TrackingStage } from './types';

interface StageSimulatorBarProps {
  currentStageIdx: number;
  onSelectStage: (stageIndex: number) => void;
}

export default function StageSimulatorBar({
  currentStageIdx,
  onSelectStage,
}: StageSimulatorBarProps) {
  return (
    <div
      id="stageSimulator"
      className="bg-[#08254c]/70 border border-white/15 rounded-2xl p-4 sm:p-4.5 space-y-2.5 backdrop-blur-md"
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.16em] uppercase text-white/60">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan inline-block" />
          <span>TEST DELIVERY STAGES</span>
        </div>
        <span className="text-xs text-white/50">
          Click any stage to test live route updates &amp; parcel details
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {STAGES.map((stage: TrackingStage, idx: number) => {
          const isActive = idx === currentStageIdx;
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => onSelectStage(idx)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                isActive
                  ? 'bg-accent-cyan text-black border border-accent-cyan font-bold shadow-[0_0_12px_rgba(61,224,255,0.35)]'
                  : 'bg-white/10 hover:bg-white/15 border border-white/15 text-white/80 hover:text-white'
              }`}
              aria-pressed={isActive}
            >
              {stage.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
