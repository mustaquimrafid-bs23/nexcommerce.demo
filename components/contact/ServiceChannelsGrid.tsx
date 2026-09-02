'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Truck, Award, MessageSquare, ArrowRight, Clock, MessageCircle } from 'lucide-react';
import { useConciergeStore } from '@/store/useConciergeStore';

export function ServiceChannelsGrid() {
  const { openConcierge, sendMessage } = useConciergeStore();
  const [parisTime, setParisTime] = useState('');
  const [milanTime, setMilanTime] = useState('');

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setParisTime(
        now.toLocaleTimeString('en-GB', {
          timeZone: 'Europe/Paris',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setMilanTime(
        now.toLocaleTimeString('en-GB', {
          timeZone: 'Europe/Rome',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLaunchConcierge = () => {
    openConcierge();
    sendMessage('Hello! I would like personal styling advice and wardrobe curation.');
  };

  return (
    <section className="space-y-6">
      {/* Live Clocks & Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#0A2A54]/80 to-[#012148]/90 border border-white/10 backdrop-blur-md shadow-lg">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-widest text-white/90">
            ATELIER CLIENT SERVICES &middot; LIVE DESK
          </span>
        </div>
        <div className="flex items-center gap-6 text-xs text-white/70 font-mono">
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="text-accent-cyan" />
            <span>Paris (CET):</span>
            <strong id="parisClock" className="text-white">{parisTime || '14:28:00'}</strong>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="text-accent-pink" />
            <span>Milan (CET):</span>
            <strong id="milanClock" className="text-white">{milanTime || '14:28:00'}</strong>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-accent-pink flex items-center gap-1.5">
          <Sparkles size={13} />
          <span>Dedicated Advisory Channels</span>
        </span>
        <h2 className="font-editorial text-2xl sm:text-3xl text-white font-normal">
          Three Pathways to Personal Care
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Channel 1: Direct WhatsApp */}
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#0A2A54]/95 via-[#012148]/98 to-[#00142E] border border-white/10 hover:border-emerald-500/40 transition-all space-y-4 shadow-xl flex flex-col justify-between backdrop-blur-xl">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <MessageCircle size={20} />
            </div>
            <div>
              <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
                Live Chat &middot; Rapid Response
              </div>
              <h3 className="font-editorial text-xl text-white font-normal">
                Direct Atelier WhatsApp
              </h3>
            </div>
            <p className="text-xs text-white/70 font-normal leading-relaxed">
              Connect instantly with a private client advisor in Milan for product availability, instant styling queries, and private consultations.
            </p>
          </div>

          <a
            href="https://wa.me/390288421190?text=Hello%20nexCommerce%20Atelier%2C%20I%20would%20like%20to%20inquire%20about%20a%20piece."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border border-emerald-500/40"
          >
            <span>Open WhatsApp (+39 02 8842 1190)</span>
            <ArrowRight size={13} />
          </a>
        </div>

        {/* Channel 2: Bespoke Styling Session */}
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#0A2A54]/95 via-[#012148]/98 to-[#00142E] border border-white/10 hover:border-accent-pink/40 transition-all space-y-4 shadow-xl flex flex-col justify-between backdrop-blur-xl">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-accent-pink/15 text-accent-pink flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="text-[10px] font-mono text-accent-pink uppercase font-bold tracking-wider">
                Available 24/7 &middot; Immediate
              </div>
              <h3 className="font-editorial text-xl text-white font-normal">
                Bespoke Styling Session
              </h3>
            </div>
            <p className="text-xs text-white/70 font-normal leading-relaxed">
              Personal sizing advice, capsule wardrobe curation, and styling recommendations from our dedicated luxury stylists.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLaunchConcierge}
            className="w-full py-3 rounded-xl bg-accent-pink/20 hover:bg-accent-pink text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border border-accent-pink/40"
          >
            <span>Launch Style Concierge</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* Channel 3: White-Glove Order Support */}
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#0A2A54]/95 via-[#012148]/98 to-[#00142E] border border-white/10 hover:border-accent-cyan/40 transition-all space-y-4 shadow-xl flex flex-col justify-between backdrop-blur-xl">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-accent-cyan/15 text-accent-cyan flex items-center justify-center">
              <Truck size={18} />
            </div>
            <div>
              <div className="text-[10px] font-mono text-accent-cyan uppercase font-bold tracking-wider">
                &lt;15m Response SLA
              </div>
              <h3 className="font-editorial text-xl text-white font-normal">
                White-Glove Order Support
              </h3>
            </div>
            <p className="text-xs text-white/70 font-normal leading-relaxed">
              European courier tracking, customs clearance, statutory VAT receipts, and destination address re-routing.
            </p>
          </div>

          <a
            href="#ticketDispatcher"
            className="w-full py-3 rounded-xl bg-accent-cyan/15 hover:bg-accent-cyan/25 text-accent-cyan text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-accent-cyan/30"
          >
            <span>Dispatch Support Ticket</span>
            <ArrowRight size={13} />
          </a>
        </div>
      </div>
    </section>
  );
}
