'use client';

import React from 'react';
import { MapPin, Phone, Clock, ExternalLink, Globe } from 'lucide-react';
import { ATELIER_LOCATIONS } from './data';

export function AtelierDirectory() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.07]">
      <div className="flex flex-col gap-2 mb-8">
        <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#3DE0FF] flex items-center gap-2">
          <span className="w-4 h-[1px] bg-[#3DE0FF]" />
          Store Locations
        </span>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
          Our Stores &amp; Studios
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {ATELIER_LOCATIONS.map((loc) => (
          <div
            key={loc.id}
            className="p-6 rounded-2xl bg-[#08254c]/60 hover:bg-[#0A2A54]/80 border border-white/12 hover:border-[#3DE0FF]/30 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#00142e]/60 flex flex-col justify-between"
          >
            <div>
              {/* City Badge & Flagship Pill */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#3DE0FF]">
                  {loc.city}
                </span>
                {loc.isFlagship && (
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-white/80">
                    Flagship
                  </span>
                )}
              </div>

              {/* Title & Address */}
              <h3 className="text-base font-semibold text-white mb-2 leading-snug">
                {loc.title}
              </h3>
              <p className="text-xs text-white/60 leading-relaxed font-normal mb-5 flex items-start gap-1.5">
                <MapPin size={14} className="text-white/40 flex-shrink-0 mt-0.5" />
                <span>{loc.address}</span>
              </p>
            </div>

            <div className="pt-4 border-t border-white/[0.06] space-y-2.5">
              {/* Hours */}
              <div className="flex items-center gap-2 text-xs text-white/50">
                <Clock size={13} className="text-white/35 flex-shrink-0" />
                <span>{loc.hours}</span>
              </div>

              {/* Phone & Directions */}
              <div className="flex items-center justify-between pt-1">
                <a
                  href={`tel:${loc.phone.replace(/\s+/g, '')}`}
                  className="inline-flex items-center gap-1.5 text-xs text-white/80 hover:text-white font-medium transition-colors"
                  aria-label={`Call ${loc.city} atelier at ${loc.phone}`}
                >
                  <Phone size={13} className="text-[#00E096]" />
                  <span>{loc.phone}</span>
                </a>

                <a
                  href={`https://maps.google.com/?q=${loc.mapsQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-[#3DE0FF] hover:underline"
                  aria-label={`Get directions to ${loc.city} atelier`}
                >
                  <span>Directions</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
