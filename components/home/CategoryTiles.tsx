'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

const CATEGORY_TILES = [
  {
    id: 'outerwear',
    title: 'Coats & Knitwear',
    subtitle: 'Pure Cashmere & Merino Wool',
    count: '8 Items',
    image: '/assets/images/products/hero_sweater.png',
    link: '/category?cat=outerwear',
  },
  {
    id: 'tailoring',
    title: 'Jackets & Blazers',
    subtitle: 'Tailored Wool & Clean Cuts',
    count: '6 Items',
    image: '/assets/images/products/plp_blazer.png',
    link: '/category?cat=tailoring',
  },
  {
    id: 'footwear',
    title: 'Shoes & Trainers',
    subtitle: 'Classic Leather & Casual Shoes',
    count: '5 Items',
    image: '/assets/images/products/prod_runner.png',
    link: '/category?cat=footwear',
  },
  {
    id: 'accessories',
    title: 'Bags & Accessories',
    subtitle: 'Leather Bags & Headphones',
    count: '9 Items',
    image: '/assets/images/products/prod_tote.png',
    link: '/category?cat=accessories',
  },
];

export function CategoryTiles() {
  return (
    <section className="py-16 bg-obsidian-950 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-xs font-semibold text-accent-cyan">
              <Sparkles size={12} />
              <span>Browse by Department</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl text-white font-normal">
              Explore by <span className="italic font-normal">Category</span>
            </h2>
          </div>

          <Link
            href="/category"
            className="text-xs font-semibold text-white/70 hover:text-white transition-colors flex items-center gap-1"
          >
            <span>View all collections</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORY_TILES.map((cat) => (
            <Link
              key={cat.id}
              href={cat.link}
              className="group relative rounded-3xl bg-surface-card border border-white/10 overflow-hidden flex flex-col justify-between hover:border-white/30 transition-all duration-300 shadow-xl hover:-translate-y-1"
            >
              {/* Top Tag & Count */}
              <div className="p-5 flex justify-between items-center z-10">
                <span className="text-[10px] uppercase tracking-widest text-accent-pink font-semibold">
                  {cat.count}
                </span>
                <span className="w-7 h-7 rounded-full bg-obsidian-950/70 border border-white/10 text-white flex items-center justify-center group-hover:bg-accent-pink group-hover:border-accent-pink transition-colors">
                  <ArrowRight size={13} />
                </span>
              </div>

              {/* Visual Studio Image Stage */}
              <div className="relative aspect-square p-6 flex items-center justify-center">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Bottom Body */}
              <div className="p-5 border-t border-white/5 bg-obsidian-950/80 space-y-1">
                <h3 className="font-editorial text-lg text-white font-medium group-hover:text-accent-pink transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-white/50">{cat.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
