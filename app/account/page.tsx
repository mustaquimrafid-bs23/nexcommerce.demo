'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronRight, Check } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCartStore } from '@/store/useCartStore';
import { MASTER_PRODUCTS } from '@/data/products';
import { Product } from '@/types/catalog';

import {
  AccountOrder,
  OrderItem,
  SavedAddress,
  StylePreferences,
  ActivitySignal,
} from '@/components/account/types';
import { DevStateSwitcher, AuthState } from '@/components/account/DevStateSwitcher';
import { AccountHero } from '@/components/account/AccountHero';
import { AccountTabs, TabKey } from '@/components/account/AccountTabs';
import { OverviewPanel } from '@/components/account/OverviewPanel';
import { OrdersPanel, OrderFilter } from '@/components/account/OrdersPanel';
import { AddressesPanel } from '@/components/account/AddressesPanel';
import { StyleProfilePanel } from '@/components/account/StyleProfilePanel';
import { OrderCancelModal } from '@/components/account/OrderCancelModal';
import { EmptyAccountView } from '@/components/account/EmptyAccountView';
import { SignedOutView } from '@/components/account/SignedOutView';

const INITIAL_USER = {
  name: 'Julian Voss',
  email: 'julian.voss@atelier-client.de',
  phone: '+49 89 1234 5678',
};

const INITIAL_ORDERS: AccountOrder[] = [
  {
    ref: 'NX-M4KZ9',
    date: '11 Aug 2026',
    status: 'preparing',
    statusLabel: 'Preparing',
    items: [
      {
        name: 'Architectural Cashmere Sweater',
        category: 'APPAREL',
        variant: 'Midnight / M',
        qty: 1,
        price: 184.0,
        image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=200&q=80',
      },
    ],
    deliveryMethod: 'DHL Express European Delivery',
    expectedDate: '19 August 2026',
    paymentMethod: 'Klarna Pay in 30 Days',
    address: 'Maximilianstraße 35, 80539 Munich, Germany',
    subtotal: 184.0,
    deliveryCost: 0,
    total: 184.0,
  },
  {
    ref: 'NX-K82P1',
    date: '02 Aug 2026',
    status: 'delivered',
    statusLabel: 'Delivered',
    items: [
      {
        name: 'Merino Layer Top',
        category: 'APPAREL',
        variant: 'Charcoal / L',
        qty: 1,
        price: 89.0,
        image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=200&q=80',
      },
    ],
    deliveryMethod: 'Standard DPD Delivery',
    expectedDate: '04 August 2026',
    paymentMethod: 'Apple Pay',
    address: 'Maximilianstraße 35, 80539 Munich, Germany',
    subtotal: 89.0,
    deliveryCost: 0,
    total: 89.0,
  },
  {
    ref: 'NX-J71Q4',
    date: '27 Jul 2026',
    status: 'delivered',
    statusLabel: 'Delivered',
    items: [
      {
        name: 'Structured Leather Tote',
        category: 'ACCESSORIES',
        variant: 'Black / One Size',
        qty: 1,
        price: 142.0,
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=200&q=80',
      },
    ],
    deliveryMethod: 'DHL Express European Delivery',
    expectedDate: '29 July 2026',
    paymentMethod: 'iDEAL',
    address: 'Maximilianstraße 35, 80539 Munich, Germany',
    subtotal: 142.0,
    deliveryCost: 0,
    total: 142.0,
  },
];

const INITIAL_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr-1',
    tag: 'PRIMARY RESIDENCE',
    isDefault: true,
    name: 'Julian Voss',
    address: 'Maximilianstraße 35',
    city: 'Munich',
    postcode: '80539',
    country: 'Germany',
    phone: '+49 89 1234 5678',
  },
  {
    id: 'addr-2',
    tag: 'STUDIO',
    isDefault: false,
    name: 'Julian Voss',
    address: 'Boulevard Saint-Germain 120',
    city: 'Paris',
    postcode: '75006',
    country: 'France',
    phone: '+33 1 42 68 55 00',
  },
];

const INITIAL_SIGNALS: ActivitySignal[] = [
  { name: 'Minimal silhouettes', level: 'Strong preference' },
  { name: 'Neutral colours', level: 'Frequent choice' },
  { name: 'Relaxed fit', level: 'Frequent choice' },
  { name: 'Layering', level: 'Occasional choice' },
];

export default function AccountPage() {
  const [mounted, setMounted] = useState(false);
  const [currentAuthState, setCurrentAuthState] = useState<AuthState>('signed_in');
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [orderFilter, setOrderFilter] = useState<OrderFilter>('ALL');

  const [orders, setOrders] = useState<AccountOrder[]>(INITIAL_ORDERS);
  const [addresses, setAddresses] = useState<SavedAddress[]>(INITIAL_ADDRESSES);
  const [preferences, setPreferences] = useState<StylePreferences>({
    style: 'Minimal',
    fit: 'Relaxed',
    color: 'Monochrome',
    brand: 'Loro Piana',
  });
  const [signals, setSignals] = useState<ActivitySignal[]>(INITIAL_SIGNALS);

  const [cancellingOrderRef, setCancellingOrderRef] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const addItemToCart = useCartStore((state) => state.addItem);

  // Sync hash and check confirmed order from session storage on mount
  useEffect(() => {
    setMounted(true);

    try {
      const hash = window.location.hash.replace('#', '') as string;
      if (['overview', 'orders', 'addresses', 'style', 'style-dna'].includes(hash)) {
        setActiveTab(hash === 'style-dna' ? 'style' : (hash as TabKey));
      }

      const confirmed = sessionStorage.getItem('nex_confirmed_order');
      if (confirmed) {
        const parsed = JSON.parse(confirmed);
        if (parsed && parsed.ref) {
          setOrders((prev) => {
            const idx = prev.findIndex((o) => o.ref === parsed.ref);
            const newOrder: AccountOrder = {
              ref: parsed.ref,
              date: 'Today',
              status: 'preparing',
              statusLabel: 'Preparing',
              items: parsed.items || prev[0]?.items || [],
              deliveryMethod: parsed.deliveryMethod || 'DHL Express European Delivery',
              expectedDate: parsed.expectedDate || '19 August 2026',
              paymentMethod: parsed.paymentMethod || 'Klarna Pay in 30 Days',
              address: parsed.customer?.address || 'Maximilianstraße 35, 80539 Munich, Germany',
              subtotal: parsed.subtotal || 184.0,
              deliveryCost: parsed.deliveryCost || 0,
              total: parsed.total || 184.0,
            };
            if (idx >= 0) {
              const updated = [...prev];
              updated[idx] = newOrder;
              return updated;
            }
            return [newOrder, ...prev];
          });
        }
      }
    } catch {
      // Ignored
    }

    const handleHashChange = () => {
      const h = window.location.hash.replace('#', '');
      if (['overview', 'orders', 'addresses', 'style', 'style-dna'].includes(h)) {
        setActiveTab(h === 'style-dna' ? 'style' : (h as TabKey));
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = useCallback((tab: TabKey) => {
    setActiveTab(tab);
    window.location.hash = tab === 'style' ? 'style-dna' : tab;
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3000);
  }, []);

  // Reorder flow
  const handleReorder = useCallback(
    (orderRef: string, item: OrderItem) => {
      const matched = MASTER_PRODUCTS.find(
        (p) => p.name.toLowerCase() === item.name.toLowerCase()
      ) || ({
        id: `p-${orderRef}`,
        name: item.name,
        category: item.category.toLowerCase(),
        price: item.price,
        formattedPrice: `€ ${item.price.toFixed(2)}`,
        currency: 'EUR',
        description: `High-quality ${item.name}`,
        image: item.image,
      } as Product);

      const size = item.variant ? item.variant.split('/')[1]?.trim() || 'M' : 'M';
      addItemToCart(matched, size, undefined, 1);
      showToast(`"${item.name}" added to your shopping bag.`);
    },
    [addItemToCart, showToast]
  );

  // Cancellation flow
  const handleConfirmCancel = useCallback(
    (orderRef: string, reason: string) => {
      setOrders((prev) =>
        prev.map((o) => {
          if (o.ref === orderRef) {
            return {
              ...o,
              status: 'cancelled',
              statusLabel: 'Cancelled',
              cancellationReason: reason,
              cancelledAt: new Date().toISOString(),
            };
          }
          return o;
        })
      );
      showToast(`Order ${orderRef} has been cancelled. 100% refund credited.`);
    },
    [showToast]
  );

  // Address operations
  const handleAddAddress = useCallback((newAddr: Omit<SavedAddress, 'id'>) => {
    const id = `addr-${Date.now()}`;
    setAddresses((prev) => [...prev, { ...newAddr, id }]);
    showToast('Delivery address saved successfully.');
  }, [showToast]);

  const handleRemoveAddress = useCallback((id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    showToast('Delivery address removed.');
  }, [showToast]);

  // Style operations
  const handleUpdatePreference = useCallback((key: keyof StylePreferences, val: string) => {
    setPreferences((prev) => ({ ...prev, [key]: val }));
  }, []);

  const handleClearProfile = useCallback(() => {
    if (
      window.confirm(
        'Are you sure you want to clear your personal style profile? This will reset your recommendations.'
      )
    ) {
      setPreferences({ style: '', fit: '', color: '', brand: '' });
      setSignals([]);
      showToast('Personal style profile reset.');
    }
  }, [showToast]);

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-accent-cyan border-t-transparent animate-spin" />
      </div>
    );
  }

  // Calculated metrics
  const activeOrdersCount = orders.filter(
    (o) => o.status === 'preparing'
  ).length;
  const totalSpent = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  return (
    <main className="min-h-screen bg-transparent text-white pb-24 pt-6 sm:pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-white/50 mb-6">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight size={12} className="text-white/30" />
          <span className="text-white font-medium">Customer Account</span>
          {currentAuthState === 'signed_in' && (
            <>
              <ChevronRight size={12} className="text-white/30" />
              <span className="text-accent-cyan capitalize">
                {activeTab === 'style' ? 'Style DNA' : activeTab}
              </span>
            </>
          )}
        </nav>

        {/* Developer State Switcher */}
        <DevStateSwitcher
          currentAuthState={currentAuthState}
          onStateChange={setCurrentAuthState}
        />

        {/* Conditional Auth State Rendering */}
        {currentAuthState === 'signed_out' ? (
          <SignedOutView
            onSignIn={(email) => {
              setCurrentAuthState('signed_in');
              showToast(`Welcome back, ${email.split('@')[0]}!`);
            }}
          />
        ) : currentAuthState === 'empty_account' ? (
          <EmptyAccountView
            user={INITIAL_USER}
            onSignOut={() => setCurrentAuthState('signed_out')}
          />
        ) : (
          <div>
            {/* VIP Client Hero */}
            <AccountHero
              user={INITIAL_USER}
              totalOrders={orders.length}
              activeShipments={activeOrdersCount}
              totalSpent={totalSpent}
              onSignOut={() => setCurrentAuthState('signed_out')}
            />

            {/* Navigation Tabs */}
            <AccountTabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
              ordersCount={orders.length}
              addressesCount={addresses.length}
            />

            {/* Tab Panel Content with Animated Transitions */}
            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="tab-overview"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <OverviewPanel
                      orders={orders}
                      onReorder={handleReorder}
                      onCancelOrder={(ref) => setCancellingOrderRef(ref)}
                      onNavigateStyleTab={() => handleTabChange('style')}
                    />
                  </motion.div>
                )}

                {activeTab === 'orders' && (
                  <motion.div
                    key="tab-orders"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <OrdersPanel
                      orders={orders}
                      activeFilter={orderFilter}
                      onFilterChange={setOrderFilter}
                      onReorder={handleReorder}
                      onCancelOrder={(ref) => setCancellingOrderRef(ref)}
                    />
                  </motion.div>
                )}

                {activeTab === 'addresses' && (
                  <motion.div
                    key="tab-addresses"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AddressesPanel
                      addresses={addresses}
                      onAddAddress={handleAddAddress}
                      onRemoveAddress={handleRemoveAddress}
                      userName={INITIAL_USER.name}
                      userPhone={INITIAL_USER.phone}
                    />
                  </motion.div>
                )}

                {activeTab === 'style' && (
                  <motion.div
                    key="tab-style"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <StyleProfilePanel
                      preferences={preferences}
                      onUpdatePreference={handleUpdatePreference}
                      signals={signals}
                      onClearProfile={handleClearProfile}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Cancellation Modal */}
      <OrderCancelModal
        orderRef={cancellingOrderRef}
        isOpen={Boolean(cancellingOrderRef)}
        onClose={() => setCancellingOrderRef(null)}
        onConfirmCancel={handleConfirmCancel}
      />

      {/* Floating Action Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 15, x: '-50%' }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-surface-navy/95 border border-accent-cyan/40 text-white text-xs px-5 py-3 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-2.5 pointer-events-none"
          >
            <div className="w-5 h-5 rounded-full bg-accent-cyan/20 text-accent-cyan flex items-center justify-center flex-shrink-0">
              <Check size={12} />
            </div>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
