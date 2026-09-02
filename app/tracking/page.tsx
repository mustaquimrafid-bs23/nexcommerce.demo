'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  TrackingOrder,
  DEFAULT_ORDERS,
  STAGES,
  STATUS_TO_STAGE,
} from '@/components/tracking/types';
import TrackingHeroHeader from '@/components/tracking/TrackingHeroHeader';
import OrderSwitcherStrip from '@/components/tracking/OrderSwitcherStrip';
import StageSimulatorBar from '@/components/tracking/StageSimulatorBar';
import PaymentGatewayCard from '@/components/tracking/PaymentGatewayCard';
import ETABanner from '@/components/tracking/ETABanner';
import RouteMapSVG from '@/components/tracking/RouteMapSVG';
import TelemetryMatrix from '@/components/tracking/TelemetryMatrix';
import DeliveryGuidanceCard from '@/components/tracking/DeliveryGuidanceCard';
import OrderSummaryCard from '@/components/tracking/OrderSummaryCard';
import OrderLookupModal from '@/components/tracking/OrderLookupModal';
import { AILogisticsConcierge } from '@/components/tracking/AILogisticsConcierge';
import { DeliveryRescheduleModal } from '@/components/tracking/DeliveryRescheduleModal';

function resolveOrder(rawId: string | null): TrackingOrder {
  const cleanId = rawId ? String(rawId).trim() : '';

  if (cleanId) {
    // 1. Search in localStorage placed orders (nex_placed_orders & nex_orders)
    if (typeof window !== 'undefined') {
      try {
        const localKeys = ['nex_placed_orders', 'nex_orders'];
        for (const k of localKeys) {
          const stored = localStorage.getItem(k);
          if (stored) {
            const list = JSON.parse(stored);
            if (Array.isArray(list)) {
              const match = list.find((o) => {
                const oId = String(o.id || o.ref || o.orderId || '').toUpperCase();
                return oId === cleanId.toUpperCase();
              });
              if (match) return normalizeOrder(match);
            }
          }
        }
      } catch (_) {}

      // 2. Search in sessionStorage confirmed order (nex_confirmed_order & latest_order)
      try {
        const sessionKeys = ['nex_confirmed_order', 'latest_order'];
        for (const k of sessionKeys) {
          const conf = sessionStorage.getItem(k);
          if (conf) {
            const parsed = JSON.parse(conf);
            if (parsed && String(parsed.ref || parsed.id || parsed.orderId || '').toUpperCase() === cleanId.toUpperCase()) {
              return normalizeOrder(parsed);
            }
          }
        }
      } catch (_) {}
    }

    // 3. Search in DEFAULT_ORDERS catalogue
    const defaultMatch = DEFAULT_ORDERS.find((o) => {
      return (
        String(o.id).toUpperCase() === cleanId.toUpperCase() ||
        String(o.ref).toUpperCase() === cleanId.toUpperCase()
      );
    });
    if (defaultMatch) return normalizeOrder(defaultMatch);

    // 4. Construct dynamic fallback order for valid code patterns
    const isCOD = cleanId.toUpperCase().startsWith('NX-');
    return {
      id: cleanId,
      ref: cleanId,
      date: '24 August 2026',
      placedDate: '24 August 2026',
      status: 'in_transit',
      statusLabel: 'In Transit',
      statusKey: 'IN_TRANSIT',
      expectedDate: 'Tomorrow · By 12:00 PM',
      expectedRange: 'Tomorrow',
      progress: 50,
      total: 256.5,
      subtotal: 285.0,
      deliveryCost: 0,
      paymentMethod: isCOD
        ? 'Cash on Delivery (Pay on Arrival)'
        : 'Paid with Klarna (Pay Later in 30 Days)',
      paymentStatus: isCOD ? 'pending_cod' : 'paid',
      courier: 'DHL Express Priority Courier',
      customer: {
        name: 'Julian Mercer',
        address: '42 Kensington High Street, London W8 4PE, UK',
      },
      items: [
        {
          name: 'Architectural Cashmere Sweater',
          category: 'APPAREL',
          variant: 'Midnight / Medium',
          price: 185,
          image: '/assets/images/products/hero_sweater.png',
          qty: 1,
        },
      ],
    };
  }

  // If no ID param provided in URL, check storage or default to #ORD-9428-NX
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('nex_placed_orders');
      if (stored) {
        const list = JSON.parse(stored);
        if (Array.isArray(list) && list.length > 0) {
          return normalizeOrder(list[0]);
        }
      }
    } catch (_) {}
  }

  return normalizeOrder(DEFAULT_ORDERS[0]);
}

function normalizeOrder(raw: any): TrackingOrder {
  const order: TrackingOrder = {
    id: raw.id || raw.ref || 'ORD-9428-NX',
    ref: raw.ref || raw.id || 'ORD-9428-NX',
    date: raw.date || raw.placedDate || '16 August 2026',
    placedDate: raw.placedDate || raw.date || '16 August 2026',
    status: raw.status || 'transit',
    statusLabel: raw.statusLabel || (raw.status === 'delivered' ? 'Delivered' : 'Out for Delivery'),
    statusKey:
      raw.statusKey ||
      (raw.status === 'delivered'
        ? 'DELIVERED'
        : raw.status === 'cancelled'
        ? 'CANCELLED'
        : 'OUT_FOR_DELIVERY'),
    expectedDate: raw.expectedDate || raw.eta || 'Today · By 6:00 PM',
    expectedRange: raw.expectedRange || '16 August 2026',
    progress: raw.progress ?? 85,
    total: Number(raw.total) || 285,
    subtotal: Number(raw.subtotal) || Number(raw.total) || 285,
    deliveryCost: Number(raw.deliveryCost ?? raw.shippingCost ?? 0),
    discountAmt: Number(raw.discountAmt || 0),
    paymentMethod: raw.paymentMethod || raw.payment || 'Paid with Klarna',
    paymentStatus: raw.paymentStatus || 'paid',
    paidOnline: Boolean(raw.paidOnline),
    previouslyCOD: Boolean(raw.previouslyCOD),
    courier: raw.courier || raw.deliveryMethod || 'DHL Express On-Demand Delivery',
    customer: {
      name: raw.customer?.name || raw.customerName || 'Julian Mercer',
      address:
        raw.customer?.address ||
        [raw.address, raw.city, raw.country].filter(Boolean).join(', ') ||
        '42 Kensington High Street, London W8 4PE, UK',
    },
    items:
      Array.isArray(raw.items) && raw.items.length > 0
        ? raw.items.map((i: any) => ({
            name: i.name || 'Luxury Fashion Piece',
            category: i.category || 'APPAREL',
            variant: i.variant || i.tag || i.size || 'Standard',
            qty: Number(i.qty || i.quantity || 1),
            price: Number(i.price || 0),
            image: i.image || '/assets/images/products/plp_overcoat.png',
          }))
        : [
            {
              name: 'Double-Breasted Wool Overcoat',
              category: 'APPAREL',
              variant: 'Charcoal / 48',
              qty: 1,
              price: 285,
              image: '/assets/images/products/plp_overcoat.png',
            },
          ],
    carrierReason: raw.carrierReason,
    scenario: raw.scenario,
    isPartial: Boolean(raw.isPartial),
    cancellationReason: raw.cancellationReason,
    cancelledAt: raw.cancelledAt,
    lastUpdateTime: raw.lastUpdateTime || '4:45 PM',
  };

  return order;
}

function TrackingPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryOrderParam = searchParams
    ? searchParams.get('order') ||
      searchParams.get('ref') ||
      searchParams.get('id') ||
      searchParams.get('orderId')
    : null;

  const [currentOrder, setCurrentOrder] = useState<TrackingOrder>(() =>
    resolveOrder(queryOrderParam)
  );
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);

  // Sync state when URL parameter changes
  useEffect(() => {
    setCurrentOrder(resolveOrder(queryOrderParam));
  }, [queryOrderParam]);

  const handleSelectOrder = useCallback(
    (orderId: string) => {
      router.push(`/tracking?order=${encodeURIComponent(orderId)}`);
    },
    [router]
  );

  const handleSelectStage = useCallback((stageIdx: number) => {
    const stage = STAGES[stageIdx] || STAGES[0];
    setCurrentOrder((prev) => ({
      ...prev,
      statusKey: stage.statusKey,
      status: stage.statusKey.toLowerCase(),
      statusLabel: stage.label,
      progress: Math.round(stage.beaconPos * 100),
      expectedDate:
        stage.statusKey === 'DELIVERED'
          ? `Delivered Today · ${stage.ts}`
          : stage.statusKey === 'OUT_FOR_DELIVERY'
          ? 'Today · By 6:00 PM'
          : stage.statusKey === 'IN_TRANSIT'
          ? 'Tomorrow · By 12:00 PM'
          : 'In 2–3 Business Days',
    }));
  }, []);

  const handleRefreshTelemetry = useCallback(() => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setCurrentOrder((prev) => ({
      ...prev,
      lastUpdateTime: now,
    }));
  }, []);

  const handleCancelOrder = useCallback(() => {
    if (typeof window !== 'undefined') {
      const confirmed = window.confirm(
        `Are you sure you wish to cancel order #${currentOrder.ref}? A 100% refund will be issued immediately.`
      );
      if (confirmed) {
        const updated: TrackingOrder = {
          ...currentOrder,
          status: 'CANCELLED',
          statusKey: 'CANCELLED',
          statusLabel: 'Order Cancelled',
          cancellationReason: 'Cancelled by client request',
          cancelledAt: new Date().toISOString(),
        };

        // Persist cancellation to localStorage if found
        try {
          const stored = localStorage.getItem('nex_placed_orders');
          if (stored) {
            const list = JSON.parse(stored);
            if (Array.isArray(list)) {
              const match = list.find((o) => (o.id || o.ref) === (currentOrder.id || currentOrder.ref));
              if (match) {
                match.status = 'CANCELLED';
                match.statusKey = 'CANCELLED';
                match.statusLabel = 'Order Cancelled';
                match.cancellationReason = 'Cancelled by client request';
                localStorage.setItem('nex_placed_orders', JSON.stringify(list));
              }
            }
          }
        } catch (_) {}

        setCurrentOrder(updated);
      }
    }
  }, [currentOrder]);

  const currentStageIdx = STATUS_TO_STAGE[currentOrder.statusKey || currentOrder.status] ?? 4;

  return (
    <main id="mainContent" className="min-h-screen bg-transparent text-white pb-24 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Hero Section & Toolbar */}
        <TrackingHeroHeader
          order={currentOrder}
          onRefreshTelemetry={handleRefreshTelemetry}
          onCancelOrder={handleCancelOrder}
        />

        {/* Controls Bar: Order Switcher & Stage Simulator */}
        <div className="space-y-3.5">
          <OrderSwitcherStrip
            currentOrder={currentOrder}
            onSelectOrder={handleSelectOrder}
            onOpenLookupModal={() => setIsLookupOpen(true)}
          />

          <StageSimulatorBar
            currentStageIdx={currentStageIdx}
            onSelectStage={handleSelectStage}
          />
        </div>

        {/* Main 2-Column Tracking Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
          {/* Left Column: ETA + Route Map + Telemetry + Guidance (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Online Payment Module (for COD / Deferred Payment Orders) */}
            <PaymentGatewayCard
              order={currentOrder}
              onPaymentSuccess={(updated) => setCurrentOrder(updated)}
            />

            {/* Estimated Arrival Banner */}
            <ETABanner order={currentOrder} />

            {/* Interactive Curved SVG Route Map */}
            <RouteMapSVG order={currentOrder} />

            {/* 4-Badge Parcel Telemetry Matrix */}
            <TelemetryMatrix order={currentOrder} />

            {/* Delivery Guidance & Instant Enquiries */}
            <DeliveryGuidanceCard order={currentOrder} />

            {/* AI Logistics Concierge (Smart Parcel Q&A & Rescheduling) */}
            <AILogisticsConcierge
              order={currentOrder}
              onOpenReschedule={() => setIsRescheduleOpen(true)}
            />
          </div>

          {/* Right Column: Order Summary (5 cols) */}
          <div className="lg:col-span-5">
            <OrderSummaryCard
              order={currentOrder}
              onCancelOrder={handleCancelOrder}
            />
          </div>
        </div>
      </div>

      {/* Order Lookup Modal */}
      <OrderLookupModal
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
        onTrackOrder={handleSelectOrder}
      />

      {/* Delivery Reschedule Modal */}
      <DeliveryRescheduleModal
        isOpen={isRescheduleOpen}
        order={currentOrder}
        onClose={() => setIsRescheduleOpen(false)}
        onConfirmReschedule={(day, slot) => {
          setCurrentOrder((prev) => ({
            ...prev,
            expectedDate: `${day} (${slot})`,
            expectedRange: `${day} (${slot})`,
            estimatedDelivery: `${day} (${slot})`,
          }));
        }}
      />
    </main>
  );
}

export default function TrackingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[65vh] flex items-center justify-center bg-[#012148]">
          <div className="flex flex-col items-center gap-3 text-accent-cyan">
            <div className="w-8 h-8 rounded-full border-2 border-accent-cyan border-t-transparent animate-spin" />
            <span className="text-xs uppercase tracking-widest font-semibold">
              Loading Parcel Updates...
            </span>
          </div>
        </div>
      }
    >
      <TrackingPageInner />
    </Suspense>
  );
}
