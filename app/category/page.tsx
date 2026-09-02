'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { MASTER_PRODUCTS } from '@/data/products';
import { CategoryHero } from '@/components/category/CategoryHero';
import { CategoryToolbar } from '@/components/category/CategoryToolbar';
import { CategoryProductGrid } from '@/components/category/CategoryProductGrid';

function CategoryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname() || '/category';

  const catParam = searchParams ? searchParams.get('cat') || 'all' : 'all';

  const [selectedCategory, setSelectedCategory] = useState<string>(catParam);
  const [sortBy, setSortBy] = useState<string>('recommended');

  // Sync state if URL search params change
  useEffect(() => {
    if (catParam && catParam !== selectedCategory) {
      setSelectedCategory(catParam);
    }
  }, [catParam]);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
    if (catId === 'all') {
      params.delete('cat');
    } else {
      params.set('cat', catId);
    }
    const newQuery = params.toString();
    router.push(newQuery ? `${pathname}?${newQuery}` : pathname, { scroll: false });
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSortBy('recommended');
    router.push(pathname, { scroll: false });
  };

  const filteredProducts = useMemo(() => {
    return MASTER_PRODUCTS.filter((product) => {
      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'new') return product.isNew === true;
      return product.category === selectedCategory;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });
  }, [selectedCategory, sortBy]);

  return (
    <div className="min-h-screen pb-28 bg-transparent text-white">
      <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: '24px' }}>
        {/* 1. Category Hero Banner */}
        <CategoryHero selectedCategory={selectedCategory} />

        {/* 2. Product Count & Sort Toolbar + Category Filter Bar (Pills) */}
        <CategoryToolbar
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryChange}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalCount={filteredProducts.length}
        />

        {/* 3. Luxury Product Grid */}
        <CategoryProductGrid
          products={filteredProducts}
          onResetFilters={handleResetFilters}
        />
      </main>
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-transparent flex items-center justify-center text-white/50 text-xs">
          Loading Collections…
        </div>
      }
    >
      <CategoryContent />
    </Suspense>
  );
}
