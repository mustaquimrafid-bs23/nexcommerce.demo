'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Clock, Compass, HelpCircle, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

const ATELIERS = [
  {
    city: 'Paris Le Marais',
    country: 'France',
    address: 'Rue Saint-Honoré 228, 75001 Paris',
    phone: '+33 1 42 68 55 00',
    hours: 'Mon – Sat, 10:00 – 19:30 CET',
    tag: 'Flagship Atelier & Haute Tailoring',
    mapsQuery: 'https://maps.google.com/?query=228+Rue+Saint-Honore+Paris',
  },
  {
    city: 'Milan Quadrilatero',
    country: 'Italy',
    address: 'Via Montenapoleone 18, 20121 Milano',
    phone: '+39 02 8842 1190',
    hours: 'Mon – Sat, 10:00 – 19:30 CET',
    tag: 'Tuscan Leather & Cashmere Studio',
    mapsQuery: 'https://maps.google.com/?query=Via+Montenapoleone+18+Milano',
  },
  {
    city: 'London Mayfair',
    country: 'United Kingdom',
    address: 'Bond Street 88, London W1S 1SR',
    phone: '+44 20 7946 0912',
    hours: 'Mon – Sat, 10:00 – 19:00 GMT',
    tag: 'Savile Row Tailoring Direction',
    mapsQuery: 'https://maps.google.com/?query=Bond+Street+88+London',
  },
  {
    city: 'Berlin Mitte',
    country: 'Germany',
    address: 'Torstraße 140, 10115 Berlin',
    phone: '+49 30 8920 1140',
    hours: 'Mon – Sat, 11:00 – 20:00 CET',
    tag: 'Acoustics Lab & Continental Dispatch',
    mapsQuery: 'https://maps.google.com/?query=Torstrasse+140+Berlin',
  },
  {
    city: 'Tokyo Ginza',
    country: 'Japan',
    address: 'Ginza 6-Chome 10-1, Chuo-ku, Tokyo',
    phone: '+81 3 5537 2026',
    hours: 'Daily, 11:00 – 20:00 JST',
    tag: 'Asia-Pacific Private Client Salon',
    mapsQuery: 'https://maps.google.com/?query=Ginza+6-Chome+Tokyo',
  },
];

const FAQS = [
  {
    q: 'How do I arrange bespoke alterations or personal garment fittings?',
    a: 'Bespoke tailoring appointments may be booked directly at our Paris, Milan, or London salons, or requested online via our Client Concierge Inquiry Dispatcher. Complimentary hem and sleeve adjustments are included with all structured outerwear purchases.',
  },
  {
    q: 'Are customs duties and European statutory taxes included in order totals?',
    a: 'Yes. All European deliveries include German statutory 19% VAT or local statutory duties at checkout with zero unexpected delivery fees or destination charges.',
  },
  {
    q: 'Can I book a private styling session for an evening gala or wardrobe refresh?',
    a: 'Our senior stylists offer one-on-one virtual consultations via WhatsApp as well as private showroom appointments. Select the "Styling & Wardrobe" domain in our enquiry dispatcher to reserve a dedicated slot.',
  },
  {
    q: 'What is your return and exchange policy for atelier pieces?',
    a: 'We offer 14-day complimentary returns on all unworn garments in original condition with security tags intact. Return couriers may be scheduled directly through our tracking portal.',
  },
];

export function AteliersDirectory() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="space-y-12 pt-6">
      {/* 1. Interactive FAQ Section */}
      <section className="space-y-6">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-accent-pink flex items-center gap-1.5">
            <HelpCircle size={13} />
            <span>Frequently Asked Questions</span>
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl text-white font-normal">
            Client Advisory &amp; Services Guidance
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0A2A54]/80 to-[#01132B]/90 overflow-hidden backdrop-blur-md transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-sm sm:text-base font-semibold text-white leading-snug">
                    {faq.q}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-accent-cyan shrink-0">
                    {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-white/70 font-normal leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Global Ateliers Directory */}
      <section className="space-y-6">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-accent-cyan flex items-center gap-1.5">
            <Compass size={13} />
            <span>Physical Presence</span>
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl text-white font-normal">
            Continental &amp; Global Ateliers
          </h2>
          <p className="text-xs text-white/70 font-normal">
            Visit our private salons for fitting sessions, bespoke tailoring, and collection viewings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ATELIERS.map((a, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#0A2A54]/95 via-[#012148]/98 to-[#00142E] border border-white/10 hover:border-white/25 transition-all space-y-4 shadow-xl flex flex-col justify-between backdrop-blur-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-accent-cyan/15 text-accent-cyan text-[10px] font-semibold uppercase tracking-wider">
                    {a.country}
                  </span>
                  <span className="text-white/40 font-mono text-[11px]">{a.city.split(' ')[0]}</span>
                </div>

                <div>
                  <h3 className="font-editorial text-xl text-white font-normal">{a.city}</h3>
                  <span className="text-[11px] text-accent-pink/90 font-medium block">{a.tag}</span>
                </div>

                <div className="space-y-2.5 text-xs text-white/75 font-normal pt-3 border-t border-white/10">
                  <a
                    href={a.mapsQuery}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 hover:text-accent-cyan transition-colors"
                  >
                    <MapPin size={14} className="text-accent-cyan shrink-0 mt-0.5" />
                    <span className="underline decoration-white/20 underline-offset-2">{a.address}</span>
                  </a>
                  <a
                    href={`tel:${a.phone.replace(/\s+/g, '')}`}
                    className="flex items-center gap-2 font-mono text-white/90 hover:text-accent-cyan transition-colors"
                  >
                    <Phone size={13} className="text-white/50 shrink-0" />
                    <span>{a.phone}</span>
                  </a>
                  <div className="flex items-center gap-2 text-white/50">
                    <Clock size={13} className="text-white/40 shrink-0" />
                    <span>{a.hours}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
