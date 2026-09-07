'use client';

import React, { useState, useMemo, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { SMART_LIST_PRODUCTS, SmartListProduct } from '@/data/smartListProducts';
import { useCartStore } from '@/store/useCartStore';
import { SmartListHeroBanner } from '@/components/smart-list/SmartListHeroBanner';
import { SmartListToolbar, SmartListCategoryTab } from '@/components/smart-list/SmartListToolbar';
import { SmartListProductGrid } from '@/components/smart-list/SmartListProductGrid';
import { SmartListBatchDock } from '@/components/smart-list/SmartListBatchDock';
import { SmartListQuickLookDrawer } from '@/components/smart-list/SmartListQuickLookDrawer';
import { SmartListScrollTop } from '@/components/smart-list/SmartListScrollTop';

function SmartListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname() || '/smart-list';

  const catParam = searchParams ? searchParams.get('cat') || 'all' : 'all';

  const [selectedCategory, setSelectedCategory] = useState<string>(catParam);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [quickLookProduct, setQuickLookProduct] = useState<SmartListProduct | null>(null);
  const [isQuickLookOpen, setIsQuickLookOpen] = useState<boolean>(false);
  const [isAddingAll, setIsAddingAll] = useState<boolean>(false);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [undoToast, setUndoToast] = useState<{ productId: string; productName: string } | null>(null);
  const undoTimerRef = useRef<NodeJS.Timeout | null>(null);

  const addCartItem = useCartStore((state) => state.addItem);

  // Load dismissed items from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('nex_sl_dismissed');
      if (stored) {
        setDismissedIds(new Set(JSON.parse(stored)));
      }
    } catch (_) {}
  }, []);

  // Sync category state with URL search param
  useEffect(() => {
    if (catParam && catParam !== selectedCategory) {
      setSelectedCategory(catParam);
    }
  }, [catParam]);

  const handleDismiss = (productId: string) => {
    const prod = SMART_LIST_PRODUCTS.find((p) => p.id === productId);
    if (!prod) return;

    setDismissedIds((prev) => {
      const next = new Set(prev).add(productId);
      try {
        localStorage.setItem('nex_sl_dismissed', JSON.stringify(Array.from(next)));
      } catch (_) {}
      return next;
    });

    setUndoToast({ productId, productName: prod.name });
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    undoTimerRef.current = setTimeout(() => {
      setUndoToast(null);
    }, 5000);
  };

  const handleUndo = () => {
    if (!undoToast) return;
    const idToRestore = undoToast.productId;
    setDismissedIds((prev) => {
      const next = new Set(prev);
      next.delete(idToRestore);
      try {
        localStorage.setItem('nex_sl_dismissed', JSON.stringify(Array.from(next)));
      } catch (_) {}
      return next;
    });
    setUndoToast(null);
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
  };

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
    router.push(pathname, { scroll: false });
  };

  // Compute filtered products excluding dismissed items
  const filteredProducts = useMemo(() => {
    return SMART_LIST_PRODUCTS.filter((product) => {
      if (dismissedIds.has(product.id)) return false;
      if (selectedCategory === 'all') return true;
      return product.category.toLowerCase() === selectedCategory.toLowerCase();
    });
  }, [selectedCategory, dismissedIds]);


  // Compute category tab counts
  const categoryTabs: SmartListCategoryTab[] = useMemo(() => {
    const counts: Record<string, number> = {
      all: SMART_LIST_PRODUCTS.length,
      Apparel: 0,
      Acoustics: 0,
      Footwear: 0,
      Timepieces: 0,
      Accessories: 0,
    };

    SMART_LIST_PRODUCTS.forEach((p) => {
      if (counts[p.category] !== undefined) {
        counts[p.category]++;
      }
    });

    return [
      { id: 'all', label: 'ALL ITEMS', count: counts.all },
      { id: 'Apparel', label: 'CLOTHING', count: counts.Apparel },
      { id: 'Acoustics', label: 'AUDIO', count: counts.Acoustics },
      { id: 'Footwear', label: 'FOOTWEAR', count: counts.Footwear },
      { id: 'Timepieces', label: 'WATCHES', count: counts.Timepieces },
      { id: 'Accessories', label: 'BAGS & ACCESSORIES', count: counts.Accessories },
    ];
  }, []);

  // Compute available in-stock items
  const inStockProducts = useMemo(() => {
    return filteredProducts.filter((p) => p.inStock);
  }, [filteredProducts]);

  const totalInStockAll = useMemo(() => {
    return SMART_LIST_PRODUCTS.filter((p) => p.inStock).length;
  }, []);

  const isAllSelected =
    inStockProducts.length > 0 &&
    inStockProducts.every((p) => selectedIds.has(p.id));

  // Toggle single item selection
  const handleToggleSelect = (productId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  // Toggle select all available in-stock items
  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      const newSelected = new Set(selectedIds);
      inStockProducts.forEach((p) => newSelected.add(p.id));
      setSelectedIds(newSelected);
    }
  };

  // Selected products array
  const selectedProducts = useMemo(() => {
    return SMART_LIST_PRODUCTS.filter((p) => selectedIds.has(p.id));
  }, [selectedIds]);

  // Estimated Total Valuation (sum of in-stock items or recommended total: € 2,285.00)
  const estimatedTotal = useMemo(() => {
    return SMART_LIST_PRODUCTS.filter((p) => p.inStock).reduce(
      (sum, p) => sum + p.price,
      0
    );
  }, []);

  const estimatedTotalFormatted = `€ ${estimatedTotal.toFixed(2)}`;

  // 1-Click "Add All to Bag"
  const handleAddAllToBag = () => {
    setIsAddingAll(true);
    const inStockAll = SMART_LIST_PRODUCTS.filter((p) => p.inStock);

    inStockAll.forEach((product) => {
      const defaultSize = product.variants?.sizes?.find((s) => s.default)?.name;
      const defaultFinish = product.variants?.finishes?.[0]?.name;
      addCartItem(
        {
          id: product.id,
          name: product.name,
          brand: product.brand,
          category: product.category,
          price: product.price,
          formattedPrice: `€ ${product.price.toFixed(2)}`,
          currency: 'EUR',
          description: product.materials,
          image: product.image,
          inStock: product.inStock,
        },
        defaultSize,
        defaultFinish
      );
    });

    setTimeout(() => {
      setIsAddingAll(false);
    }, 1000);
  };

  // Batch Add Selected to Bag
  const handleAddSelectedToBag = () => {
    selectedProducts.forEach((product) => {
      if (product.inStock) {
        const defaultSize = product.variants?.sizes?.find((s) => s.default)?.name;
        const defaultFinish = product.variants?.finishes?.[0]?.name;
        addCartItem(
          {
            id: product.id,
            name: product.name,
            brand: product.brand,
            category: product.category,
            price: product.price,
            formattedPrice: `€ ${product.price.toFixed(2)}`,
            currency: 'EUR',
            description: product.materials,
            image: product.image,
            inStock: product.inStock,
          },
          defaultSize,
          defaultFinish
        );
      }
    });

    setSelectedIds(new Set());
  };

  const handleOpenQuickLook = (product: SmartListProduct) => {
    setQuickLookProduct(product);
    setIsQuickLookOpen(true);
  };

  const handleCloseQuickLook = () => {
    setIsQuickLookOpen(false);
  };

  return (
    <div className="min-h-screen pb-32 bg-transparent text-white">
      <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* 1. Cinema Pure Hero Lifestyle Banner */}
        <SmartListHeroBanner />

        {/* 2. Stats & Filter Toolbar */}
        <SmartListToolbar
          categories={categoryTabs}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryChange}
          totalCount={SMART_LIST_PRODUCTS.length}
          inStockCount={totalInStockAll}
          selectedCount={selectedIds.size}
          isAllSelected={isAllSelected}
          onToggleSelectAll={handleToggleSelectAll}
          estimatedTotalFormatted={estimatedTotalFormatted}
          onAddAllToBag={handleAddAllToBag}
          isAddingAll={isAddingAll}
        />

        {/* 3. Luxury 4-Column Product Grid */}
        <SmartListProductGrid
          products={filteredProducts}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onOpenQuickLook={handleOpenQuickLook}
          onResetFilters={handleResetFilters}
          onDismiss={handleDismiss}
        />

        {/* 4. Floating Obsidian Island Batch Dock */}
        <SmartListBatchDock
          selectedProducts={selectedProducts}
          onClearSelection={() => setSelectedIds(new Set())}
          onAddSelectedToBag={handleAddSelectedToBag}
        />

        {/* 5. Full Mini-PDP Quick Look Slide-over Drawer */}
        <SmartListQuickLookDrawer
          product={quickLookProduct}
          isOpen={isQuickLookOpen}
          onClose={handleCloseQuickLook}
        />

        {/* 6. Floating Tactile Scroll-to-Top Button */}
        <SmartListScrollTop />

        {/* 7. Floating Undo Toast */}
        {undoToast && (
          <div
            id="smartListUndoToast"
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-5 py-3.5 rounded-2xl bg-[#06152D] border border-accent-pink/50 text-white text-xs shadow-2xl backdrop-blur-xl flex items-center justify-between gap-4 min-w-[320px] animate-in slide-in-from-bottom-5 duration-300"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center gap-2.5 truncate">
              <Trash2 size={15} className="text-accent-pink shrink-0" />
              <span className="truncate">
                <strong>{undoToast.productName}</strong> removed from list
              </span>
            </div>
            <button
              type="button"
              id="slToastUndoBtn"
              onClick={handleUndo}
              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white text-white hover:text-obsidian-950 font-bold uppercase tracking-wider text-[11px] transition-colors cursor-pointer shrink-0 border border-white/20"
            >
              Undo
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function SmartListPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-transparent flex items-center justify-center text-white/50 text-xs">
          Loading Smart List…
        </div>
      }
    >
      <SmartListContent />
    </Suspense>
  );
}
