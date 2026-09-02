'use client';

import React from 'react';
import { Sparkles, Truck, Award, MessageSquare, ArrowRight } from 'lucide-react';
import { useConciergeStore } from '@/store/useConciergeStore';

export function ServiceChannelsGrid() {
  const { openConcierge } = useConciergeStore();

  return (
    <section className="space-y-6">
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
        {/* Channel 1 */}
        <div className="p-6 rounded-3xl bg-surface-card border border-white/10 hover:border-accent-pink/40 transition-all space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-accent-pink/15 text-accent-pink flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="text-[10px] font-mono text-accent-pink uppercase font-bold tracking-wider">
                Live 24/7 &middot; Zero Wait
              </div>
              <h3 className="font-editorial text-xl text-white font-normal">
                Styling &amp; Wardrobe Direction
              </h3>
            </div>
            <p className="text-xs text-white/60 font-light leading-relaxed">
              Real-time sizing calculations, capsule assembly, and tailored advice via our on-device neural stylist.
            </p>
          </div>

          <button
            type="button"
            onClick={() => openConcierge('Hello, I would like personal styling advice.')}
            className="w-full py-2.5 rounded-xl bg-accent-pink/15 hover:bg-accent-pink text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border border-accent-pink/30"
          >
            <span>Launch Style Concierge</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* Channel 2 */}
        <div className="p-6 rounded-3xl bg-surface-card border border-white/10 hover:border-accent-cyan/40 transition-all space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-accent-cyan/15 text-accent-cyan flex items-center justify-center">
              <Truck size={18} />
            </div>
            <div>
              <div className="text-[10px] font-mono text-accent-cyan uppercase font-bold tracking-wider">
                &lt;15m Response SLA
              </div>
              <h3 className="font-editorial text-xl text-white font-normal">
                Order Logistics &amp; Courier
              </h3>
            </div>
            <p className="text-xs text-white/60 font-light leading-relaxed">
              Real-time European courier tracking, customs clearance documents, and destination address re-routing.
            </p>
          </div>

          <a
            href="#ticketDispatcher"
            className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-white/10"
          >
            <span>Dispatch Courier Ticket</span>
            <ArrowRight size={13} />
          </a>
        </div>

        {/* Channel 3 */}
        <div className="p-6 rounded-3xl bg-surface-card border border-white/10 hover:border-white/25 transition-all space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 text-white flex items-center justify-center">
              <Award size={18} />
            </div>
            <div>
              <div className="text-[10px] font-mono text-white/40 uppercase font-bold tracking-wider">
                Bespoke Appointments
              </div>
              <h3 className="font-editorial text-xl text-white font-normal">
                Bespoke Commissions &amp; Horology
              </h3>
            </div>
            <p className="text-xs text-white/60 font-light leading-relaxed">
              One-on-one atelier fittings in Paris, Milan, or Berlin for made-to-measure suits and private watch releases.
            </p>
          </div>

          <a
            href="#ticketDispatcher"
            className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-white/10"
          >
            <span>Request Fitting</span>
            <ArrowRight size={13} />
          </a>
        </div>
      </div>
    </section>
  );
}
