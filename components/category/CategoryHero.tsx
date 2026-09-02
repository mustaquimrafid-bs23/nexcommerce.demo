'use client';

import React from 'react';

interface CategoryHeroProps {
  selectedCategory: string;
}

const CATEGORY_BANNERS: Record<string, string> = {
  all: '/assets/images/lifestyle/category_pure_hero_banner.jpg',
  apparel: '/assets/images/lifestyle/category_pure_hero_banner.jpg',
  outerwear: '/assets/images/lifestyle/category_pure_hero_banner.jpg',
  acoustics: '/assets/images/lifestyle/hero_headphone_landscape.jpg',
  accessories: '/assets/images/lifestyle/hero_tote_landscape.jpg',
  footwear: '/assets/images/lifestyle/hero_runner_landscape.jpg',
  new: '/assets/images/lifestyle/category_pure_hero_banner.jpg',
};

const CATEGORY_TITLES: Record<string, { title: string; subtitle: string; eyebrow: string }> = {
  all: {
    title: 'Autumn & Winter Collection — nexCommerce',
    subtitle: 'Classic clothing, footwear, and accessories made to last.',
    eyebrow: 'NEW SEASON · AUTUMN WINTER',
  },
  apparel: {
    title: 'Knitwear & Everyday Clothing — nexCommerce',
    subtitle: 'Cashmere jumpers, merino wool tops, and relaxed tailored pieces.',
    eyebrow: 'CLOTHING · NEW IN',
  },
  outerwear: {
    title: 'Coats & Winter Jackets — nexCommerce',
    subtitle: 'Wool coats, smart blazers, and warm winter layers.',
    eyebrow: 'OUTERWEAR · NEW SEASON',
  },
  acoustics: {
    title: 'Headphones & Audio — nexCommerce',
    subtitle: 'Over-ear headphones and wireless earphones with clear, rich sound.',
    eyebrow: 'AUDIO & HEADPHONES',
  },
  accessories: {
    title: 'Watches & Leather Bags — nexCommerce',
    subtitle: 'Classic watches, leather bags, and daily accessories.',
    eyebrow: 'ACCESSORIES',
  },
  footwear: {
    title: 'Footwear & Trainers — nexCommerce',
    subtitle: 'Leather trainers and shoes with supportive, comfortable soles.',
    eyebrow: 'FOOTWEAR',
  },
  new: {
    title: 'New Arrivals — nexCommerce',
    subtitle: 'Fresh arrivals and newly released pieces for this season.',
    eyebrow: 'NEW ARRIVALS',
  },
};

export function CategoryHero({ selectedCategory }: CategoryHeroProps) {
  const meta = CATEGORY_TITLES[selectedCategory] || CATEGORY_TITLES.all;
  const bannerSrc = CATEGORY_BANNERS[selectedCategory] || CATEGORY_BANNERS.all;

  return (
    <div>
      {/* ACCESSIBLE CATEGORY TITLE & BREADCRUMB (WCAG 2.1 AA / SEO) */}
      <nav aria-label="Breadcrumb" className="sr-only">
        <ol>
          <li><a href="/">Home</a></li>
          <li><span>Collections</span></li>
          <li aria-current="page"><span>{meta.title}</span></li>
        </ol>
      </nav>
      <h1 className="sr-only" id="plpMainTitle">
        {meta.title}
      </h1>
      <p className="sr-only" id="plpMainSubtitle">
        {meta.subtitle}
      </p>
      <span className="sr-only" id="plpHeroEyebrow">
        {meta.eyebrow}
      </span>

      {/* Pure Full-Width Category Hero Banner */}
      <section className="plp-pure-banner-section mb-6" id="plpPureBannerSection">
        <div className="plp-pure-banner-frame w-full aspect-[21/9] sm:aspect-[28/9] md:aspect-[32/9] rounded-xl overflow-hidden border border-white/10 bg-[#080E1E] shadow-2xl relative">
          <img
            src={bannerSrc}
            alt={meta.title}
            className="plp-pure-banner-img w-full h-full object-cover object-center transition-all duration-700 ease-out brightness-90"
            id="plpCategoryBannerImg"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#01132B]/60 via-transparent to-transparent pointer-events-none" />
        </div>
      </section>
    </div>
  );
}
