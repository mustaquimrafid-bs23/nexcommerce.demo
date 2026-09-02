'use client';

import React from 'react';
import { Sparkles, Camera, User, ZoomIn } from 'lucide-react';

export type PerspectiveMode = 'silhouette' | 'model' | 'macro';

interface PerspectiveSwitcherProps {
  activeMode: PerspectiveMode;
  onChange: (mode: PerspectiveMode) => void;
}

export function PerspectiveSwitcher({ activeMode, onChange }: PerspectiveSwitcherProps) {
  return (
    <div className="flex items-center gap-2 p-1 rounded-2xl bg-obsidian-950/80 border border-white/10 backdrop-blur-md">
      <button
        type="button"
        onClick={() => onChange('silhouette')}
        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
          activeMode === 'silhouette'
            ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/40 shadow-sm'
            : 'text-white/60 hover:text-white'
        }`}
      >
        <Camera size={13} />
        <span>Perspective: Silhouette</span>
      </button>

      <button
        type="button"
        onClick={() => onChange('model')}
        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
          activeMode === 'model'
            ? 'bg-accent-pink/20 text-accent-pink border border-accent-pink/40 shadow-sm'
            : 'text-white/60 hover:text-white'
        }`}
      >
        <User size={13} />
        <span>Perspective: Model / Styling</span>
      </button>

      <button
        type="button"
        onClick={() => onChange('macro')}
        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
          activeMode === 'macro'
            ? 'bg-white/20 text-white border border-white/30 shadow-sm'
            : 'text-white/60 hover:text-white'
        }`}
      >
        <ZoomIn size={13} />
        <span>Perspective: Macro / Texture</span>
      </button>
    </div>
  );
}
