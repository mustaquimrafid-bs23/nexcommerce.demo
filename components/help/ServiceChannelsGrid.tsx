'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Truck, ShieldCheck, ArrowRight, Clock } from 'lucide-react';
import { SERVICE_CHANNELS } from './data';
import { useConciergeStore } from '@/store/useConciergeStore';

export function ServiceChannelsGrid() {
  const { openConcierge } = useConciergeStore();

  const handleAction = (
    channel: (typeof SERVICE_CHANNELS)[number],
    e: React.MouseEvent
  ) => {
    if (channel.actionType === 'concierge') {
      // Open personal stylist drawer directly if available
      openConcierge();
    } else if (channel.actionType === 'scroll_form') {
      e.preventDefault();
      const el = document.getElementById('directDispatchPortal');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'Sparkles':
        return <Sparkles size={22} className="text-[#3DE0FF]" />;
      case 'Truck':
        return <Truck size={22} className="text-[#00E096]" />;
      case 'ShieldCheck':
        return <ShieldCheck size={22} className="text-[#FFAA00]" />;
      default:
        return <Sparkles size={22} className="text-[#3DE0FF]" />;
    }
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'live':
        return 'text-[#00E096] bg-[#00E096]/10 border-[#00E096]/25';
      case 'sla':
        return 'text-[#3DE0FF] bg-[#3DE0FF]/10 border-[#3DE0FF]/25';
      case 'trust':
        return 'text-[#FFAA00] bg-[#FFAA00]/10 border-[#FFAA00]/25';
      default:
        return 'text-white/80 bg-white/10 border-white/20';
    }
  };

  const getIconBoxStyle = (name: string) => {
    switch (name) {
      case 'Sparkles':
        return 'bg-[#3DE0FF]/10 border-[#3DE0FF]/25';
      case 'Truck':
        return 'bg-[#00E096]/10 border-[#00E096]/25';
      case 'ShieldCheck':
        return 'bg-[#FFAA00]/10 border-[#FFAA00]/25';
      default:
        return 'bg-white/10 border-white/20';
    }
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2 mb-8">
        <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#3DE0FF] flex items-center gap-2">
          <span className="w-4 h-[1px] bg-[#3DE0FF]" />
          Direct Assistance Channels
        </span>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
          Dedicated Concierge Services
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SERVICE_CHANNELS.map((channel) => (
          <div
            key={channel.id}
            className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-[#0A2A54]/60 border border-white/12 hover:border-[#3DE0FF]/40 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#00142e]/70 overflow-hidden"
          >
            {/* Ambient card top subtle glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#3DE0FF]/[0.03] rounded-full blur-2xl group-hover:bg-[#3DE0FF]/10 transition-colors pointer-events-none" />

            <div>
              {/* Top Row: Icon + Badge */}
              <div className="flex items-center justify-between mb-5">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-105 ${getIconBoxStyle(
                    channel.iconName
                  )}`}
                >
                  {getIcon(channel.iconName)}
                </div>

                <span
                  className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border ${getBadgeStyle(
                    channel.badgeType
                  )}`}
                >
                  {channel.badge}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2.5 group-hover:text-white transition-colors">
                {channel.title}
              </h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-normal mb-6">
                {channel.description}
              </p>
            </div>

            {/* Action Trigger */}
            <div className="pt-2 border-t border-white/10">
              {channel.actionHref && channel.actionType !== 'scroll_form' ? (
                <Link
                  href={channel.actionHref}
                  onClick={(e) => handleAction(channel, e)}
                  className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-[#3DE0FF] group-hover:text-white transition-colors pt-2"
                >
                  <span>{channel.actionText}</span>
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={(e) => handleAction(channel, e)}
                  className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-[#3DE0FF] group-hover:text-white transition-colors pt-2 cursor-pointer"
                >
                  <span>{channel.actionText}</span>
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
