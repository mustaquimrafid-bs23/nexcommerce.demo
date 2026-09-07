'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, RotateCcw, Lock, ArrowRight } from 'lucide-react';

const TRUST_CARDS = [
  {
    icon: ShieldCheck,
    title: '100% Genuine Items',
    desc: 'Every item is checked for quality and guaranteed authentic straight from trusted makers.',
    link: '/category',
    color: 'text-emerald-400',
  },
  {
    icon: Truck,
    title: 'Free Express Delivery',
    desc: 'Fast, tracked courier delivery across the UK and Europe on all orders over €150.00.',
    link: '/tracking',
    color: 'text-accent-cyan',
  },
  {
    icon: RotateCcw,
    title: '14-Day Free Returns',
    desc: 'Pre-paid return label included in every box. Return any item hassle-free within 14 days.',
    link: '/cart',
    color: 'text-accent-pink',
  },
  {
    icon: Lock,
    title: 'Safe & Secure Shopping',
    desc: 'Your details and payment information are always kept completely private and protected.',
    link: '/privacy',
    color: 'text-amber-400',
  },
];

export function TrustStrip() {
  return (
    <section className="py-16 bg-obsidian-950 border-b border-white/10" id="trustStripSection">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_CARDS.map((card, idx) => {
            const Icon = card.icon;
            return (
              <Link
                key={idx}
                href={card.link}
                className="p-6 rounded-3xl bg-surface-card border border-white/10 hover:border-white/25 transition-all duration-300 space-y-3 group shadow-xl hover:-translate-y-1 block"
              >
                <div className="w-12 h-12 rounded-2xl bg-surface-navy/80 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon size={22} className={card.color} />
                </div>

                <h3 className="font-editorial text-lg text-white font-medium group-hover:text-accent-pink transition-colors">
                  {card.title}
                </h3>

                <p className="text-xs text-white/60 leading-relaxed">
                  {card.desc}
                </p>

                <div className="pt-1 flex items-center gap-1.5 text-xs text-accent-pink font-semibold">
                  <span>Learn more</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
