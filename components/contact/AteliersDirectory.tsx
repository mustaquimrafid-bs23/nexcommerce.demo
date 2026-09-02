'use client';

import React from 'react';
import { MapPin, Phone, Clock, Compass } from 'lucide-react';

const ATELIERS = [
  {
    city: 'Paris Le Marais',
    country: 'France',
    address: 'Rue Saint-Honoré 244, 75001 Paris',
    phone: '+33 1 42 68 55 00',
    hours: 'Mon – Sat, 10:00 – 19:30 CET',
    tag: 'Flagship Atelier & Haute Tailoring',
  },
  {
    city: 'Berlin Mitte',
    country: 'Germany',
    address: 'Torstraße 140, 10115 Berlin',
    phone: '+49 30 8920 1140',
    hours: 'Mon – Sat, 11:00 – 20:00 CET',
    tag: 'Acoustics Lab & Continental Dark Store',
  },
  {
    city: 'London Mayfair',
    country: 'United Kingdom',
    address: 'Bond Street 88, London W1S 1SR',
    phone: '+44 20 7946 0912',
    hours: 'Mon – Sat, 10:00 – 19:00 GMT',
    tag: 'Savile Row Tailoring Direction',
  },
  {
    city: 'Milan Quadrilatero',
    country: 'Italy',
    address: 'Via Monte Napoleone 12, 20121 Milano',
    phone: '+39 02 8739 4120',
    hours: 'Mon – Sat, 10:00 – 19:30 CET',
    tag: 'Tuscan Leather & Cashmere Studio',
  },
  {
    city: 'Tokyo Ginza',
    country: 'Japan',
    address: 'Ginza 6-Chome 10-1, Chuo-ku, Tokyo',
    phone: '+81 3 5537 2026',
    hours: 'Daily, 11:00 – 20:00 JST',
    tag: 'Asia-Pacific Private Client Salon',
  },
];

export function AteliersDirectory() {
  return (
    <section className="space-y-6 pt-6">
      <div className="space-y-1">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-accent-cyan flex items-center gap-1.5">
          <Compass size={13} />
          <span>Physical Presence</span>
        </span>
        <h2 className="font-editorial text-2xl sm:text-3xl text-white font-normal">
          Continental &amp; Global Ateliers
        </h2>
        <p className="text-xs text-white/60 font-light">
          Visit our private salons for fitting sessions, leather conditioning, and acoustic auditions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ATELIERS.map((a, idx) => (
          <div
            key={idx}
            className="p-6 rounded-3xl bg-surface-card border border-white/10 hover:border-white/20 transition-all space-y-4 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-1 rounded-full bg-accent-cyan/15 text-accent-cyan text-[10px] font-semibold uppercase">
                  {a.country}
                </span>
                <span className="text-white/40 font-mono text-[11px]">{a.city.split(' ')[0]}</span>
              </div>

              <div>
                <h3 className="font-editorial text-xl text-white font-normal">{a.city}</h3>
                <span className="text-[11px] text-accent-pink/80 font-medium block">{a.tag}</span>
              </div>

              <div className="space-y-2 text-xs text-white/70 font-light pt-2 border-t border-white/5">
                <div className="flex items-start gap-2">
                  <MapPin size={13} className="text-white/40 shrink-0 mt-0.5" />
                  <span>{a.address}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-white/90">
                  <Phone size={13} className="text-white/40 shrink-0" />
                  <span>{a.phone}</span>
                </div>
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
  );
}
