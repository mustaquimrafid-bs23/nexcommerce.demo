'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, Shield } from 'lucide-react';
import { ServiceChannelsGrid } from '@/components/contact/ServiceChannelsGrid';
import { TicketDispatcherCard } from '@/components/contact/TicketDispatcherCard';
import { AteliersDirectory } from '@/components/contact/AteliersDirectory';

export default function ContactPage() {
  return (
    <main id="mainContent" className="min-h-screen bg-[#01132B] bg-[radial-gradient(120%_80%_at_50%_0%,#032B5E_0%,#01132B_60%,#001838_100%)] text-[#F8FAFF] pb-24 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/50 hover:text-accent-cyan transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Return to Maison</span>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-pink/15 border border-accent-pink/30 text-xs font-semibold uppercase tracking-widest text-accent-pink">
            <Sparkles size={13} />
            <span>Private Concierge &amp; Advisory</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-white font-normal leading-[1.08]">
            Direct Access to the <span className="italic font-normal">Maison</span>
          </h1>

          <p className="text-sm sm:text-base text-white/70 leading-relaxed font-normal">
            Whether inquiring about bespoke tailoring, private commission horology, order dispatch routing, or European statutory returns, our client advisory desk is at your service.
          </p>
        </div>

        {/* 1. Dedicated Service Channels (WhatsApp, Styling, Order Support) */}
        <ServiceChannelsGrid />

        {/* 2. Interactive Ticket Dispatcher Portal */}
        <TicketDispatcherCard />

        {/* 3. Interactive FAQ & Physical Ateliers Directory */}
        <AteliersDirectory />

        {/* Privacy Note */}
        <p className="text-center text-xs text-white/50 flex items-center justify-center gap-2 pt-4">
          <Shield size={13} className="text-emerald-400" />
          <span>All enquiries are transmitted via encrypted European transport and resolved strictly by atelier personnel.</span>
        </p>
      </div>
    </main>
  );
}
