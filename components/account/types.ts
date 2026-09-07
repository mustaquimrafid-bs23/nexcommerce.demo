export interface OrderItem {
  id?: string;
  name: string;
  category: string;
  variant: string;
  qty: number;
  price: number;
  image: string;
}

export interface AccountOrder {
  ref: string;
  date: string;
  status: 'preparing' | 'delivered' | 'cancelled';
  statusLabel?: string;
  items: OrderItem[];
  deliveryMethod?: string;
  expectedDate?: string;
  paymentMethod?: string;
  address?: string;
  subtotal?: number;
  deliveryCost?: number;
  total: number;
  cancellationReason?: string;
  cancelledAt?: string;
}

export interface SavedAddress {
  id: string;
  tag: string;
  isDefault: boolean;
  name: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
  phone: string;
}

export interface StylePreferences {
  style: string;
  fit: string;
  color: string;
  brand: string;
}

export interface ActivitySignal {
  name: string;
  level: string;
}
