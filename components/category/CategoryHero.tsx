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
    title: 'Apparel & Collections — nexCommerce',
    subtitle: 'Pieces designed around natural comfort, architectural tailoring, and enduring quality.',
    eyebrow: 'COLLECTIONS · AW26',
  },
  apparel: {
    title: 'Apparel & Knitwear — nexCommerce',
    subtitle: 'Precision cashmere, structured merino wool, and relaxed silhouettes crafted for modern living.',
    eyebrow: 'APPAREL · AW26',
  },
  outerwear: {
    title: 'Outerwear & Tailoring — nexCommerce',
    subtitle: 'Double-faced wool overcoats, tailored blazers, and architectural cold-weather layers.',
    eyebrow: 'OUTERWEAR · AW26',
  },
  acoustics: {
    title: 'Acoustic Engineering — nexCommerce',
    subtitle: 'Studio-grade spatial drivers and active acoustic isolation wrapped in lambskin and titanium.',
    eyebrow: 'ACOUSTIC ENGINEERING',
  },
  accessories: {
    title: 'Fine Accessories & Horology — nexCommerce',
    subtitle: 'Minimalist chronographs, full-grain leather goods, and refined essentials.',
    eyebrow: 'FINE ACCESSORIES',
  },
  footwear: {
    title: 'Footwear & Runners — nexCommerce',
    subtitle: 'Italian calfskin runners and architectural footwear built with ergonomic Vibram cushioning.',
    eyebrow: 'FOOTWEAR · ARTISANAL',
  },
  new: {
    title: 'New Arrivals — nexCommerce',
    subtitle: 'The latest seasonal drops, limited releases, and handpicked luxury essentials.',
    eyebrow: 'NEW ARRIVALS · AW26',
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

      {/* PURE FULL-WIDTH CATEGORY HERO BANNER */}
      <section className="plp-pure-banner-section mb-6" id="plpPureBannerSection">
        <div className="plp-pure-banner-frame w-full aspect-[21/9] sm:aspect-[28/9] md:aspect-[32/9] rounded-xl overflow-hidden border border-white/10 bg-obsidian-950 shadow-2xl relative">
          <img
            src={bannerSrc}
            alt={meta.title}
            className="plp-pure-banner-img w-full h-full object-cover object-center transition-all duration-700 ease-out brightness-90"
            id="plpCategoryBannerImg"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/40 via-transparent to-transparent pointer-events-none" />
        </div>
      </section>
    </div>
  );
}
