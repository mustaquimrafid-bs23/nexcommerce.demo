'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { Search, X, PackageSearch, Compass, RotateCcw } from 'lucide-react';
import { OrdersHero } from '@/components/orders/OrdersHero';
import { OrderCard, PlacedOrder } from '@/components/orders/OrderCard';

const ORDERS_KEY = 'nex_placed_orders';

const DEFAULT_ORDERS: PlacedOrder[] = [
  {
    id: 'ORD-9428-NX',
    date: 'August 16, 2026',
    status: 'transit',
    statusLabel: 'Out for Delivery',
    eta: 'Today · By 6:00 PM',
    progress: 75,
    total: 285,
    subtotal: 285,
    shipping: 0,
    items: [
      {
        name: 'Double-Breasted Wool Overcoat',
        tag: 'Apparel · Charcoal · Size 48',
        price: 285,
        image: '/assets/images/products/plp_overcoat.png',
        quantity: 1,
        selectedSize: '48',
      },
    ],
    destination: 'Leopoldstraße 42, 80802 Munich, Germany',
    courier: 'DHL Express On-Demand Delivery',
    payment: 'Paid with Klarna Pay Later',
    customerName: 'Julian Wright',
    email: 'julian@example.com',
    phone: '+49 152 9876 5432',
  },
  {
    id: 'ORD-8712-NX',
    date: 'July 28, 2026',
    status: 'delivered',
    statusLabel: 'Delivered',
    eta: 'Delivered on July 29, 2026',
    progress: 100,
    total: 320,
    subtotal: 320,
    shipping: 0,
    items: [
      {
        name: 'Studio Acoustics Headphone GT',
        tag: 'High Acoustics · Lambskin & Beryllium',
        price: 320,
        image: '/assets/images/products/prod_headphones.png',
        quantity: 1,
        selectedSize: 'Standard',
      },
    ],
    destination: 'Avenue Montaigne 18, 75008 Paris, France',
    courier: 'DHL Express Carbon-Neutral',
    payment: 'Settled via Apple Pay / Visa 3DS',
    customerName: 'Julian Wright',
    email: 'julian@example.com',
    phone: '+49 152 9876 5432',
  },
  {
    id: 'ORD-7601-NX',
    date: 'June 14, 2026',
    status: 'delivered',
    statusLabel: 'Delivered · Completed Delivery',
    eta: 'Delivered on June 15, 2026',
    progress: 100,
    total: 185,
    subtotal: 185,
    shipping: 0,
    items: [
      {
        name: 'Minimalist Leather Runner',
        tag: 'Artisanal Footwear · Chalk White · Size 42',
        price: 185,
        image: '/assets/images/products/prod_runner.png',
        quantity: 1,
        selectedSize: '42',
      },
    ],
    destination: 'Herengracht 244, 1016 BT Amsterdam, Netherlands',
    courier: 'DPD European Priority',
    payment: 'Settled via iDEAL (ABN AMRO)',
    customerName: 'Julian Wright',
    email: 'julian@example.com',
    phone: '+49 152 9876 5432',
  },
];

function OrdersPageContent() {
  const [orders, setOrders] = useState<PlacedOrder[]>(DEFAULT_ORDERS);
  const [currentFilter, setCurrentFilter] = useState<'all' | 'transit' | 'delivered' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      try {
        let loadedOrders = [...DEFAULT_ORDERS];
        const stored = localStorage.getItem(ORDERS_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            loadedOrders = parsed;
          }
        }

        // Check if latest_order exists in sessionStorage and prepend if not already in list
        const latestRaw = sessionStorage.getItem('latest_order');
        if (latestRaw) {
          const latest = JSON.parse(latestRaw);
          const ref = latest.orderId || latest.ref || 'NX-EU-D3H23';
          if (!loadedOrders.some((o) => o.id === ref)) {
            const newOrder: PlacedOrder = {
              id: ref,
              date: 'August 31, 2026',
              status: 'transit',
              statusLabel: 'Preparing Your Order',
              eta: 'In 2–4 Business Days (DHL Tracked)',
              progress: 40,
              total: Number(latest.total || 359.2),
              subtotal: Number(latest.subtotal || 449),
              discount: Number(latest.discount || 89.8),
              discountCode: latest.discountCode || 'VIP20',
              shipping: Number(latest.shipping || 0),
              destination: `${latest.client?.street || latest.client?.address || 'Friedrichstraße 42'}, ${latest.client?.postcode || '10117'} ${latest.client?.city || 'Berlin'}`,
              courier: latest.deliveryMethod || 'Standard Free Delivery (DHL Tracked)',
              payment: 'Paid with Klarna Pay Later',
              customerName: latest.client?.name || 'Julian Wright',
              email: latest.client?.email || 'julian@example.com',
              phone: latest.client?.phone || '+49 152 9876 5432',
              items: (latest.items || []).map((it: any) => ({
                name: it.product?.name || it.name || 'Luxury Piece',
                tag: `${it.product?.category || 'Apparel'} &middot; Size ${it.selectedSize || 'M'}`,
                price: Number(it.product?.price || it.price || 0),
                image: it.product?.image || it.image || '/assets/images/products/p3.png',
                quantity: Number(it.quantity || 1),
                selectedSize: it.selectedSize || 'M',
              })),
            };
            loadedOrders = [newOrder, ...loadedOrders];
            localStorage.setItem(ORDERS_KEY, JSON.stringify(loadedOrders));
          }
        }

        setOrders(loadedOrders);
      } catch (e) {
        console.error('Failed to load orders', e);
      }
    }
  }, []);

  const transitCount = useMemo(() => orders.filter((o) => o.status === 'transit').length, [orders]);
  const deliveredCount = useMemo(() => orders.filter((o) => o.status === 'delivered').length, [orders]);
  const cancelledCount = useMemo(() => orders.filter((o) => o.status === 'cancelled').length, [orders]);
  const totalSpent = useMemo(
    () => orders.reduce((sum, o) => (o.status !== 'cancelled' ? sum + Number(o.total || 0) : sum), 0),
    [orders]
  );

  const filteredOrders = useMemo(() => {
    const cleanQuery = searchQuery.trim().toLowerCase();
    return orders.filter((order) => {
      if (currentFilter !== 'all' && order.status !== currentFilter) {
        return false;
      }
      if (cleanQuery) {
        const idMatch = (order.id || '').toLowerCase().includes(cleanQuery);
        const destMatch = (order.destination || '').toLowerCase().includes(cleanQuery);
        const courierMatch = (order.courier || '').toLowerCase().includes(cleanQuery);
        const itemMatch = (order.items || []).some(
          (i) => (i.name || '').toLowerCase().includes(cleanQuery) || (i.tag || '').toLowerCase().includes(cleanQuery)
        );
        return idMatch || destMatch || courierMatch || itemMatch;
      }
      return true;
    });
  }, [orders, currentFilter, searchQuery]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#01132B] bg-[radial-gradient(120%_80%_at_50%_0%,#032B5E_0%,#01132B_60%,#001838_100%)] text-[#F8FAFF] pt-6 pb-24 relative overflow-hidden">
      {/* Background Atmosphere Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent-cyan/[0.04] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-emerald-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <main className="max-w-[1140px] mx-auto px-4 sm:px-6 relative z-10 pt-4">
        {/* 1. KPI Spotlight Hero */}
        <OrdersHero
          totalCount={orders.length}
          inTransitCount={transitCount}
          deliveredCount={deliveredCount}
          totalSpent={totalSpent}
        />

        {/* 2. Controls Bar: Status Filter Tabs + Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          {/* Status Filter Tabs */}
          <div
            className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none"
            role="tablist"
            aria-label="Filter Orders"
          >
            <button
              type="button"
              onClick={() => setCurrentFilter('all')}
              className={`h-10 px-4 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                currentFilter === 'all'
                  ? 'bg-accent-cyan text-[#01132B] font-bold shadow-md shadow-accent-cyan/20'
                  : 'bg-white/[0.04] border border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>All Orders</span>
              <span id="countAll" className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/20">
                {orders.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentFilter('transit')}
              className={`h-10 px-4 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                currentFilter === 'transit'
                  ? 'bg-accent-cyan text-[#01132B] font-bold shadow-md shadow-accent-cyan/20'
                  : 'bg-white/[0.04] border border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>In Transit</span>
              <span id="countTransit" className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/20">
                {transitCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentFilter('delivered')}
              className={`h-10 px-4 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                currentFilter === 'delivered'
                  ? 'bg-accent-cyan text-[#01132B] font-bold shadow-md shadow-accent-cyan/20'
                  : 'bg-white/[0.04] border border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>Delivered</span>
              <span id="countDelivered" className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/20">
                {deliveredCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentFilter('cancelled')}
              className={`h-10 px-4 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                currentFilter === 'cancelled'
                  ? 'bg-accent-cyan text-[#01132B] font-bold shadow-md shadow-accent-cyan/20'
                  : 'bg-white/[0.04] border border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>Cancelled</span>
              <span id="countCancelled" className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/20">
                {cancelledCount}
              </span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[260px] sm:min-w-[320px]">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              id="ordersSearchInput"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order #, piece, or city..."
              className="w-full h-10 rounded-xl border border-white/12 bg-[#041430]/70 pl-9 pr-8 text-xs text-white placeholder-white/40 focus:outline-none focus:border-accent-cyan"
            />
            {searchQuery && (
              <button
                type="button"
                id="ordersSearchClear"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 3. Empty Search / Filter Fallback */}
        {filteredOrders.length === 0 ? (
          <div
            id="ordersEmptyFilter"
            className="max-w-md mx-auto text-center py-16 px-6 rounded-2xl bg-[#0A2A54]/25 border border-white/10 backdrop-blur-md my-8"
          >
            <div className="w-14 h-14 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center mx-auto mb-4 text-accent-cyan">
              <PackageSearch className="w-6 h-6" />
            </div>
            <h2 id="ordersEmptyTitle" className="font-display text-lg font-semibold text-white mb-2">
              No orders found
            </h2>
            <p id="ordersEmptyDesc" className="text-xs text-white/60 leading-relaxed mb-6">
              {searchQuery
                ? `No orders matched your search query "${searchQuery}". Try searching by order number or product name.`
                : 'There are no active orders matching the selected status filter.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setCurrentFilter('all');
                  setSearchQuery('');
                }}
                className="px-5 py-2.5 rounded-xl bg-white/[0.06] border border-white/12 text-xs font-semibold text-white hover:bg-white/10"
              >
                Reset All Filters
              </button>
              <Link
                href="/category"
                className="px-5 py-2.5 rounded-xl bg-accent-cyan text-[#01132B] text-xs font-bold flex items-center gap-1.5 hover:bg-accent-cyan/90"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Explore Collection</span>
              </Link>
            </div>
          </div>
        ) : (
          /* 4. Orders List Cards */
          <div id="ordersList" className="space-y-6">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] bg-[#01132B] flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-accent-cyan border-t-transparent animate-spin" />
        </div>
      }
    >
      <OrdersPageContent />
    </Suspense>
  );
}
