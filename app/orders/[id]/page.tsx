'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { PackageSearch, ArrowLeft } from 'lucide-react';
import { OrderDetailHeader } from '@/components/orders/OrderDetailHeader';
import { OrderTrackingCard } from '@/components/orders/OrderTrackingCard';
import { OrderItemsList } from '@/components/orders/OrderItemsList';
import { OrderDeliveryInfo } from '@/components/orders/OrderDeliveryInfo';
import { OrderPaymentSummary } from '@/components/orders/OrderPaymentSummary';
import { OrderActionHub } from '@/components/orders/OrderActionHub';
import { CartItem } from '@/types/catalog';

interface OrderDetailParams {
  params: Promise<{ id: string }>;
}

const KNOWN_ORDERS_MAP: Record<string, any> = {
  'ORD-9428-NX': {
    ref: 'ORD-9428-NX',
    orderDate: 'August 31, 2026',
    customerName: 'Julian Wright',
    email: 'julian@example.com',
    phone: '+49 152 9876 5432',
    street: 'Leopoldstraße 42',
    city: 'Munich',
    postcode: '80802',
    country: 'Germany (Deutschland)',
    deliveryMethod: 'DHL Express On-Demand Delivery',
    estimatedDelivery: 'Today · By 6:00 PM',
    trackingNumber: 'DHL-9428-NX-DE',
    shippingCost: 0,
    subtotal: 285,
    discount: 0,
    discountCode: '',
    total: 285,
    paymentMethod: 'klarna',
    stage: 4, // Out for delivery
    isDelivered: false,
    statusLabel: 'Out for Delivery',
    items: [
      {
        product: {
          id: 'item-overcoat',
          name: 'Double-Breasted Wool Overcoat',
          brand: 'nexCommerce Atelier',
          category: 'apparel',
          price: 285,
          currency: 'EUR',
          description: 'Charcoal brushed wool tailoring.',
          image: '/assets/images/products/plp_overcoat.png',
        },
        quantity: 1,
        selectedSize: '48',
      },
    ],
  },
  'ORD-8712-NX': {
    ref: 'ORD-8712-NX',
    orderDate: 'July 27, 2026',
    customerName: 'Julian Wright',
    email: 'julian@example.com',
    phone: '+49 152 9876 5432',
    street: 'Avenue Montaigne 18',
    city: 'Paris',
    postcode: '75008',
    country: 'France',
    deliveryMethod: 'DHL Express Carbon-Neutral',
    estimatedDelivery: 'Delivered on July 29, 2026',
    trackingNumber: 'DHL-8712-NX-FR',
    shippingCost: 0,
    subtotal: 320,
    discount: 0,
    discountCode: '',
    total: 320,
    paymentMethod: 'applepay',
    stage: 4,
    isDelivered: true,
    statusLabel: 'Delivered',
    items: [
      {
        product: {
          id: 'item-headphones',
          name: 'Studio Acoustics Headphone GT',
          brand: 'Form',
          category: 'acoustics',
          price: 320,
          currency: 'EUR',
          description: 'Lambskin & beryllium acoustic drivers.',
          image: '/assets/images/products/prod_headphones.png',
        },
        quantity: 1,
        selectedSize: 'Standard',
      },
    ],
  },
  'ORD-7601-NX': {
    ref: 'ORD-7601-NX',
    orderDate: 'June 12, 2026',
    customerName: 'Julian Wright',
    email: 'julian@example.com',
    phone: '+49 152 9876 5432',
    street: 'Herengracht 244',
    city: 'Amsterdam',
    postcode: '1016 BT',
    country: 'Netherlands',
    deliveryMethod: 'DPD European Priority',
    estimatedDelivery: 'Delivered on June 15, 2026',
    trackingNumber: 'DPD-7601-NX-NL',
    shippingCost: 0,
    subtotal: 185,
    discount: 0,
    discountCode: '',
    total: 185,
    paymentMethod: 'ideal',
    stage: 4,
    isDelivered: true,
    statusLabel: 'Delivered',
    items: [
      {
        product: {
          id: 'item-runner',
          name: 'Minimalist Leather Runner',
          brand: 'Apex',
          category: 'footwear',
          price: 185,
          currency: 'EUR',
          description: 'Chalk white calfskin runner.',
          image: '/assets/images/products/prod_runner.png',
        },
        quantity: 1,
        selectedSize: '42',
      },
    ],
  },
  'NX-EU-D3H23': {
    ref: 'NX-EU-D3H23',
    orderDate: 'August 30, 2026',
    customerName: 'Julian Wright',
    email: 'julian@example.com',
    phone: '+49 152 9876 5432',
    street: 'Friedrichstraße 42',
    city: 'Berlin',
    postcode: '10117',
    country: 'Germany (Deutschland)',
    deliveryMethod: 'Standard Free Delivery',
    estimatedDelivery: 'In 2–4 Business Days (DHL Tracked)',
    trackingNumber: 'DHL-D3H23-DE',
    shippingCost: 0,
    subtotal: 449,
    discount: 89.8,
    discountCode: 'VIP20',
    total: 359.2,
    paymentMethod: 'klarna',
    stage: 2, // Preparing
    isDelivered: false,
    statusLabel: 'Preparing Order',
    items: [
      {
        product: {
          id: 'conf-item-1',
          name: 'Cashmere Turtleneck Sweater',
          brand: 'nexCommerce Atelier',
          category: 'apparel',
          price: 185,
          currency: 'EUR',
          description: 'Ultra-fine spun Mongolian cashmere.',
          image: '/assets/images/products/p3.png',
        },
        quantity: 1,
        selectedSize: 'Standard',
      },
      {
        product: {
          id: 'conf-item-2',
          name: 'Structured Wool Blazer',
          brand: 'nexCommerce Atelier',
          category: 'apparel',
          price: 264,
          currency: 'EUR',
          description: 'Tailored wool silhouette with hand-finished edges.',
          image: '/assets/images/products/p4.png',
        },
        quantity: 1,
        selectedSize: 'Standard',
      },
    ],
  },
};

export default function OrderDetailPage({ params }: OrderDetailParams) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const [mounted, setMounted] = useState(false);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      try {
        // 1. Check known mock map first
        if (KNOWN_ORDERS_MAP[orderId]) {
          setOrder(KNOWN_ORDERS_MAP[orderId]);
          return;
        }

        const mapRawOrder = (raw: any) => {
          const isDeliv = raw.status === 'delivered' || raw.isDelivered;
          const isTr = raw.status === 'transit' || raw.stage === 3;
          const items: CartItem[] = (raw.items || []).map((it: any, idx: number) => ({
            product: {
              id: it.product?.id || it.id || `it-${idx}`,
              name: it.product?.name || it.name || 'Luxury Piece',
              brand: it.product?.brand || it.brand || 'nexCommerce Atelier',
              category: it.product?.category || it.category || 'apparel',
              price: Number(it.product?.price || it.price || 0),
              currency: it.product?.currency || it.currency || 'EUR',
              description: it.product?.description || it.description || '',
              image: it.product?.image || it.image || '/assets/images/products/p1.png',
            },
            quantity: Number(it.quantity || 1),
            selectedSize: it.selectedSize || 'Standard',
          }));

          return {
            ref: raw.ref || raw.orderId || raw.id || orderId,
            orderDate: raw.orderDate || raw.date || 'Today',
            customerName: raw.customerName || raw.client?.name || 'Julian Wright',
            email: raw.customerEmail || raw.email || raw.client?.email || 'julian@example.com',
            phone: raw.customerPhone || raw.phone || raw.client?.phone || '+49 152 9876 5432',
            street: raw.street || raw.address || raw.client?.street || raw.destination?.split(',')[0] || 'Friedrichstraße 42',
            city: raw.city || raw.client?.city || raw.destination?.split(',')[1]?.trim() || 'Berlin',
            postcode: raw.postcode || raw.client?.postcode || '10117',
            country: raw.country || raw.client?.country || 'Germany (Deutschland)',
            deliveryMethod: raw.deliveryMethod || raw.courier || 'Standard Tracked Delivery',
            estimatedDelivery: raw.estimatedDelivery || raw.eta || (isDeliv ? 'Delivered' : 'In 2–4 Business Days'),
            trackingNumber: raw.trackingNumber || `DHL-${orderId.replace(/[^A-Z0-9]/gi, '')}-EU`,
            shippingCost: Number(raw.shippingCost ?? raw.shipping ?? 0),
            subtotal: Number(raw.subtotal || raw.total || 0),
            discount: Number(raw.discount || raw.discountAmt || 0),
            discountCode: raw.discountCode || '',
            total: Number(raw.total || 0),
            paymentMethod: raw.paymentMethod || raw.payment || 'klarna',
            stage: isDeliv ? 4 : isTr ? 3 : (raw.stage || 2),
            isDelivered: isDeliv,
            statusLabel: raw.statusLabel || (isDeliv ? 'Delivered' : isTr ? 'In Transit' : 'Order Confirmed'),
            items: items.length > 0 ? items : KNOWN_ORDERS_MAP['NX-EU-D3H23']?.items || [],
          };
        };

        // 2. Check local stored orders list (nex_placed_orders & nex_orders)
        const checkList = (key: string) => {
          const raw = localStorage.getItem(key);
          if (!raw) return null;
          try {
            const list = JSON.parse(raw);
            if (Array.isArray(list)) {
              return list.find((o: any) => o.id === orderId || o.ref === orderId || o.orderId === orderId);
            }
          } catch (e) {}
          return null;
        };

        const foundInPlaced = checkList('nex_placed_orders') || checkList('nex_orders');
        if (foundInPlaced) {
          setOrder(mapRawOrder(foundInPlaced));
          return;
        }

        // 3. Check sessionStorage latest_order & nex_confirmed_order
        const checkSession = (key: string) => {
          const raw = sessionStorage.getItem(key);
          if (!raw) return null;
          try {
            const parsed = JSON.parse(raw);
            if (parsed.orderId === orderId || parsed.ref === orderId || parsed.id === orderId || !orderId) {
              return parsed;
            }
          } catch (e) {}
          return null;
        };

        const foundSession = checkSession('latest_order') || checkSession('nex_confirmed_order');
        if (foundSession) {
          setOrder(mapRawOrder(foundSession));
          return;
        }
      } catch (e) {
        console.error('Failed to parse order details', e);
      }

      // Default fallback if order id is unknown
      setOrder({
        ...KNOWN_ORDERS_MAP['ORD-9428-NX'],
        ref: orderId,
      });
    }
  }, [orderId]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#01132B] bg-[radial-gradient(120%_80%_at_50%_0%,#032B5E_0%,#01132B_60%,#001838_100%)] text-[#F8FAFF] pt-6 pb-24 relative overflow-hidden">
      {/* Background Atmosphere Glows matching checkout and orders */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent-cyan/[0.05] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-emerald-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

      <main className="max-w-[1180px] mx-auto px-4 sm:px-6 relative z-10 pt-2">
        {!order ? (
          <div className="max-w-md mx-auto text-center py-20 px-6 rounded-2xl bg-[#0A2A54]/30 border border-white/10 backdrop-blur-md my-8">
            <PackageSearch className="w-10 h-10 text-accent-cyan mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Order Not Found</h2>
            <p className="text-xs text-white/60 mb-6">
              We could not find an order matching reference &ldquo;{orderId}&rdquo;.
            </p>
            <Link
              href="/orders"
              className="px-6 py-2.5 rounded-xl bg-accent-cyan text-[#000B1A] text-xs font-bold inline-flex items-center gap-2 shadow-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to All Orders</span>
            </Link>
          </div>
        ) : (
          <>
            {/* 1. Order Detail Header (ID, Date, Status Badge, Quick PDF/Print) */}
            <OrderDetailHeader
              orderRef={order.ref}
              orderDate={order.orderDate}
              stage={order.stage || 4}
              statusLabel={order.statusLabel}
              isDelivered={order.isDelivered}
            />

            {/* 2. Modern Split Studio Layout (1.4fr : 1fr) */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.45fr_1fr] gap-6 items-start">
              {/* Left Column: Tracking, Items Ordered, Delivery Info */}
              <div className="space-y-6">
                {/* Real-time Courier Tracking & Milestones */}
                <OrderTrackingCard
                  orderRef={order.ref}
                  stage={order.stage || 4}
                  courier={order.deliveryMethod}
                  trackingNumber={order.trackingNumber}
                  estimatedDelivery={order.estimatedDelivery}
                  destinationCity={order.city}
                  isDelivered={order.isDelivered}
                />

                {/* Ordered Items with Buy Again & Reviews */}
                <OrderItemsList items={order.items || []} />

                {/* Delivery & Destination Specs */}
                <OrderDeliveryInfo
                  deliveryMethod={order.deliveryMethod}
                  shippingCost={order.shippingCost}
                  client={{
                    name: order.customerName,
                    email: order.email,
                    phone: order.phone,
                    street: order.street,
                    city: order.city,
                    postcode: order.postcode,
                    country: order.country,
                  }}
                />
              </div>

              {/* Right Column: Payment Breakdown & Action Hub */}
              <div className="space-y-6">
                {/* Financial Summary & Payment Method */}
                <OrderPaymentSummary
                  subtotal={order.subtotal}
                  discount={order.discount}
                  discountCode={order.discountCode}
                  shipping={order.shippingCost}
                  total={order.total}
                  paymentMethod={order.paymentMethod}
                />

                {/* Order Management & Services Hub */}
                <OrderActionHub
                  orderRef={order.ref}
                  stage={order.stage || 4}
                  courier={order.deliveryMethod}
                  trackingNumber={order.trackingNumber}
                />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
