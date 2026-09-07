export interface TrackingItem {
  name: string;
  category?: string;
  variant?: string;
  qty: number;
  price: number;
  image: string;
}

export interface TrackingCustomer {
  name: string;
  address: string;
}

export interface TrackingOrder {
  id: string;
  ref: string;
  date: string;
  placedDate: string;
  status: string;
  statusLabel: string;
  statusKey: string;
  expectedDate: string;
  expectedRange?: string;
  progress: number;
  total: number;
  subtotal: number;
  deliveryCost: number;
  discountAmt?: number;
  paymentMethod: string;
  paymentStatus?: string;
  paidOnline?: boolean;
  previouslyCOD?: boolean;
  courier: string;
  customer: TrackingCustomer;
  items: TrackingItem[];
  carrierReason?: string;
  scenario?: string;
  isPartial?: boolean;
  cancellationReason?: string;
  cancelledAt?: string;
  lastUpdateTime?: string;
}

export interface TrackingStage {
  id: string;
  label: string;
  statusKey: string;
  beaconPos: number;
  location: string;
  ts: string;
}

export const STAGES: TrackingStage[] = [
  { id: 'confirmed', label: 'Confirmed', statusKey: 'ORDER_CONFIRMED', beaconPos: 0.00, location: 'Milan Workshop', ts: '10:32 AM' },
  { id: 'preparing', label: 'Preparing', statusKey: 'PREPARING', beaconPos: 0.18, location: 'Milan Workshop', ts: '11:45 AM' },
  { id: 'handed', label: 'Handed to Courier', statusKey: 'SHIPPED', beaconPos: 0.38, location: 'Milan Parcel Depot', ts: '1:20 PM' },
  { id: 'in_transit', label: 'In Transit', statusKey: 'IN_TRANSIT', beaconPos: 0.62, location: 'Central European Hub', ts: '3:10 PM' },
  { id: 'out_for_delivery', label: 'Out for Delivery', statusKey: 'OUT_FOR_DELIVERY', beaconPos: 0.85, location: 'London Delivery Depot', ts: '4:45 PM' },
  { id: 'delivered', label: 'Delivered', statusKey: 'DELIVERED', beaconPos: 1.00, location: 'London, UK', ts: '5:30 PM' },
];

export const STATUS_TO_STAGE: Record<string, number> = {
  ORDER_CONFIRMED: 0,
  CONFIRMED: 0,
  confirmed: 0,
  PREPARING: 1,
  preparing: 1,
  SHIPPED: 2,
  HANDED: 2,
  handed: 2,
  shipped: 2,
  IN_TRANSIT: 3,
  in_transit: 3,
  NEARING_DESTINATION: 3,
  DELAYED: 3,
  delayed: 3,
  EXCEPTION: 3,
  FAILED_ATTEMPT: 3,
  ACTION_REQUIRED: 3,
  OUT_FOR_DELIVERY: 4,
  out_for_delivery: 4,
  TRANSIT: 4,
  transit: 4,
  DELIVERED: 5,
  delivered: 5,
  RETURNED: 5,
  returned: 5,
  CANCELLED: 0,
  cancelled: 0,
};

export const DEFAULT_ORDERS: TrackingOrder[] = [
  {
    id: 'ORD-9428-NX',
    ref: 'ORD-9428-NX',
    date: '16 August 2026',
    placedDate: '16 August 2026',
    status: 'transit',
    statusLabel: 'Out for Delivery',
    statusKey: 'OUT_FOR_DELIVERY',
    expectedDate: 'Today · By 6:00 PM',
    expectedRange: '16 August 2026',
    progress: 85,
    total: 285,
    subtotal: 285,
    deliveryCost: 0,
    paymentMethod: 'Paid with Klarna (Pay Later in 30 Days)',
    courier: 'DHL Express On-Demand Delivery',
    customer: {
      name: 'Julian Mercer',
      address: '42 Kensington High Street, London W8 4PE, UK',
    },
    items: [
      {
        name: 'Double-Breasted Wool Overcoat',
        category: 'APPAREL',
        variant: 'Charcoal / 48',
        price: 285,
        image: '/assets/images/products/plp_overcoat.png',
        qty: 1,
      },
    ],
  },
  {
    id: 'ORD-8712-NX',
    ref: 'ORD-8712-NX',
    date: '28 July 2026',
    placedDate: '28 July 2026',
    status: 'delivered',
    statusLabel: 'Delivered',
    statusKey: 'DELIVERED',
    expectedDate: 'Delivered on 29 July 2026',
    expectedRange: '29 July 2026',
    progress: 100,
    total: 320,
    subtotal: 320,
    deliveryCost: 0,
    paymentMethod: 'Paid via Apple Pay / Visa Debit',
    courier: 'DHL Express Carbon-Neutral',
    customer: {
      name: 'Camille Laurent',
      address: '18 Regent Street, London SW1Y 4PH, UK',
    },
    items: [
      {
        name: 'Studio Acoustics Headphone GT',
        category: 'ACOUSTICS',
        variant: 'Obsidian Black',
        price: 320,
        image: '/assets/images/products/prod_headphones.png',
        qty: 1,
      },
    ],
  },
  {
    id: 'ORD-7601-NX',
    ref: 'ORD-7601-NX',
    date: '14 June 2026',
    placedDate: '14 June 2026',
    status: 'delivered',
    statusLabel: 'Delivered',
    statusKey: 'DELIVERED',
    expectedDate: 'Delivered on 15 June 2026',
    expectedRange: '15 June 2026',
    progress: 100,
    total: 185,
    subtotal: 185,
    deliveryCost: 0,
    paymentMethod: 'Paid with Debit Card (Barclays)',
    courier: 'DPD Express Priority',
    customer: {
      name: 'Oliver Wright',
      address: '14 King’s Parade, Cambridge CB2 1SJ, UK',
    },
    items: [
      {
        name: 'Minimalist Leather Runner',
        category: 'FOOTWEAR',
        variant: 'Chalk White / UK 8.5',
        price: 185,
        image: '/assets/images/products/prod_runner.png',
        qty: 1,
      },
    ],
  },
  {
    id: 'NX-M4KZ9',
    ref: 'NX-M4KZ9',
    date: '11 August 2026',
    placedDate: '11 August 2026',
    status: 'in_transit',
    statusLabel: 'In Transit',
    statusKey: 'IN_TRANSIT',
    expectedDate: 'Tomorrow · By 12:00 PM',
    expectedRange: 'Tomorrow',
    progress: 50,
    total: 185,
    subtotal: 185,
    deliveryCost: 0,
    paymentMethod: 'Cash on Delivery (Pay on Arrival)',
    paymentStatus: 'pending_cod',
    courier: 'DHL Express Priority Courier',
    customer: {
      name: 'Julian Mercer',
      address: '24 Oxford Street, London W1D 1BS, UK',
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
  },
];

export const TELEMETRY_STAGES = [
  { temp: '19°C', tempStatus: 'Optimal', carbon: '0.0 kg', flight: 'Awaiting Dispatch', flightNo: '—', weight: '1.4 kg', dims: '48 × 36 × 10 cm' },
  { temp: '18°C', tempStatus: 'Optimal', carbon: '0.1 kg', flight: 'Packing & Sealing', flightNo: '—', weight: '1.4 kg', dims: '48 × 36 × 10 cm' },
  { temp: '17°C', tempStatus: 'Optimal', carbon: '0.3 kg', flight: 'Dispatched to Air Hub', flightNo: 'BA 9428', weight: '1.4 kg', dims: '48 × 36 × 10 cm' },
  { temp: '16°C', tempStatus: 'Controlled', carbon: '0.8 kg', flight: 'In Transit · Air Freight', flightNo: 'BA 9428', weight: '1.4 kg', dims: '48 × 36 × 10 cm' },
  { temp: '17°C', tempStatus: 'Optimal', carbon: '1.1 kg', flight: 'Delivery Van · London Central', flightNo: 'BA 9428', weight: '1.4 kg', dims: '48 × 36 × 10 cm' },
  { temp: '20°C', tempStatus: 'Delivered', carbon: '1.1 kg', flight: 'Completed', flightNo: 'BA 9428', weight: '1.4 kg', dims: '48 × 36 × 10 cm' },
];
