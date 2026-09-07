'use client';

import React from 'react';
import { Settings2 } from 'lucide-react';

export type AuthState = 'signed_in' | 'empty_account' | 'signed_out';

interface DevStateSwitcherProps {
  currentAuthState: AuthState;
  onStateChange: (state: AuthState) => void;
}

export function DevStateSwitcher({ currentAuthState, onStateChange }: DevStateSwitcherProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-white/[0.03] border border-dashed border-white/15 rounded-xl px-4 py-2.5 mb-8 text-xs text-white/50">
      <div className="flex items-center gap-2 font-medium tracking-wide">
        <Settings2 size={14} className="text-accent-cyan" />
        <span className="uppercase text-[11px] font-semibold text-white/60">⚙ DEV STATE SWITCHER:</span>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="devAuthStateSelect" className="sr-only">
          Select customer account state
        </label>
        <select
          id="devAuthStateSelect"
          value={currentAuthState}
          onChange={(e) => onStateChange(e.target.value as AuthState)}
          className="bg-obsidian-950 border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-accent-cyan transition-colors cursor-pointer min-h-[36px]"
        >
          <option value="signed_in">Signed In (With Orders &amp; Profile)</option>
          <option value="empty_account">Signed In (Empty State &mdash; No Orders)</option>
          <option value="signed_out">Signed Out (Sign-In Screen)</option>
        </select>
      </div>
    </div>
  );
}
