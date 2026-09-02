'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Compass } from 'lucide-react';

const DISCIPLINES = [
  {
    num: '01',
    title: 'Outerwear & Tailoring',
    desc: 'Structured jackets, classic trench coats, and double-breasted blazers hand-canvassed in Biella, Northern Italy.',
    link: '/category?cat=outerwear',
    image: '/assets/images/products/plp_overcoat.png',
  },
  {
    num: '02',
    title: 'Artisanal Footwear',
    desc: 'Goodyear-welted Chelsea boots and minimalist calfskin trainers crafted by master cobblers in Civitanova Marche.',
    link: '/category?cat=footwear',
    image: '/assets/images/products/prod_runner.png',
  },
  {
    num: '03',
    title: 'Acoustics & Sound',
    desc: 'Over-ear studio headphones featuring custom beryllium drivers, lambskin ear cushions, and lightweight titanium frames.',
    link: '/category?cat=acoustics',
    image: '/assets/images/products/prod_headphones.png',
  },
  {
    num: '04',
    title: 'Leather Goods & Horology',
    desc: 'Vegetable-tanned weekender holdalls, slim cardholders, and Swiss automatic timepieces assembled in Geneva.',
    link: '/category?cat=accessories',
    image: '/assets/images/products/prod_tote.png',
  },
];

export function DisciplinesGrid() {
  return (
    <section className="py-16 lg:py-24 border-b border-white/10" id="disciplines" aria-label="Our Four Disciplines">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="space-y-2 text-center max-w-xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-pink flex items-center justify-center gap-1.5">
            <Compass size={13} />
            <span>Our Workshop Disciplines</span>
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-white font-normal">
            Our Four <span className="italic font-normal">Disciplines</span>
          </h2>
          <p className="text-xs text-white/60 font-light">
            Each discipline is overseen by a specialist heritage workshop in its historic European centre of excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DISCIPLINES.map((d) => (
            <Link
              key={d.num}
              href={d.link}
              className="p-6 rounded-3xl bg-surface-card border border-white/10 hover:border-accent-cyan/40 transition-all duration-300 group flex flex-col justify-between space-y-6 shadow-xl hover:-translate-y-1.5"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-white/40 border-b border-white/5 pb-3">
                  <span>DISCIPLINE {d.num}</span>
                  <ArrowUpRight size={16} className="group-hover:text-accent-cyan group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-white/40" />
                </div>

                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-obsidian-950/60 p-4 flex items-center justify-center">
                  <img
                    src={d.image}
                    alt={d.title}
                    className="max-h-full w-auto object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <h3 className="font-editorial text-xl text-white font-normal group-hover:text-accent-cyan transition-colors">
                  {d.title}
                </h3>

                <p className="text-xs text-white/70 leading-relaxed font-light">
                  {d.desc}
                </p>
              </div>

              <span className="text-[11px] font-semibold tracking-wider text-accent-cyan uppercase">
                Explore Discipline &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
