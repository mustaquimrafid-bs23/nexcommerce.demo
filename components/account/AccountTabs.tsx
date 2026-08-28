'use client';

import React from 'react';
import { motion } from 'motion/react';

export type TabKey = 'overview' | 'orders' | 'addresses' | 'style';

interface TabItem {
  key: TabKey;
  label: string;
  count?: number;
}

interface AccountTabsProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  ordersCount?: number;
  addressesCount?: number;
}

export function AccountTabs({
  activeTab,
  onTabChange,
  ordersCount,
  addressesCount,
}: AccountTabsProps) {
  const tabs: TabItem[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'orders', label: 'Orders', count: ordersCount },
    { key: 'addresses', label: 'Addresses', count: addressesCount },
    { key: 'style', label: 'Style DNA' },
  ];

  return (
    <div className="border-b border-white/[0.08] mb-8" role="tablist">
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar -mb-px">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabChange(tab.key)}
              className={`relative px-4 sm:px-5 py-3 text-xs sm:text-[13px] font-medium transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer min-h-[44px] ${
                isActive ? 'text-white font-semibold' : 'text-white/50 hover:text-white/80'
              }`}
            >
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && tab.count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold tabular-nums transition-colors ${
                    isActive
                      ? 'bg-accent-cyan/20 text-accent-cyan'
                      : 'bg-white/[0.06] text-white/40'
                  }`}
                >
                  {tab.count}
                </span>
              )}

              {isActive && (
                <motion.div
                  layoutId="accountTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent-cyan shadow-[0_0_8px_rgba(61,224,255,0.6)]"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
