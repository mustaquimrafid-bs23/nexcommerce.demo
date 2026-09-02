import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { DealsSection } from '@/components/home/DealsSection';
import { IntentSearchCard } from '@/components/home/IntentSearchCard';
import { ProductGrid } from '@/components/home/ProductGrid';
import { CategoryTiles } from '@/components/home/CategoryTiles';
import { EditorialBanner } from '@/components/home/EditorialBanner';
import { RecentlyViewedRail } from '@/components/home/RecentlyViewedRail';
import { TrustStrip } from '@/components/home/TrustStrip';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      {/* 1. Full-Bleed 3D Editorial Hero with Floating Shoppable Capsule */}
      <HeroSection />

      {/* 2. Today's Deals (Flash Sale & Live Countdown) */}
      <DealsSection />

      {/* 3. Natural Language Intent Discovery Card */}
      <IntentSearchCard />

      {/* 4. Recommended for You (Curated Grid) */}
      <ProductGrid />

      {/* 5. Category Department Tiles */}
      <CategoryTiles />

      {/* 6. Autumn / Winter Editorial Runway Banner with Interactive Hotspot */}
      <EditorialBanner />

      {/* 7. Recently Viewed Pieces Carousel Rail */}
      <RecentlyViewedRail />

      {/* 8. White-Glove Atelier Trust Strip */}
      <TrustStrip />
    </div>
  );
}
