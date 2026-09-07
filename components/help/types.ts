export type InquiryDomain =
  | 'styling'
  | 'logistics'
  | 'alterations'
  | 'provenance'
  | 'vip'
  | 'orders';

export interface ServiceChannel {
  id: string;
  title: string;
  badge: string;
  badgeType: 'live' | 'sla' | 'trust';
  description: string;
  actionText: string;
  actionHref?: string;
  actionType: 'concierge' | 'tracking' | 'scroll_form' | 'phone';
  iconName: 'Sparkles' | 'Truck' | 'ShieldCheck' | 'MessageSquare';
}

export interface CuratedLookItem {
  id: string;
  num: string;
  tabLabel: string;
  title: string;
  description: string;
  pieceName: string;
  price: number;
  currency: string;
  formattedPrice: string;
  image: string;
  lifestyleImage: string;
  category: string;
  variant: string;
  productId: string;
}

export interface DispatchTicket {
  reference: string;
  clientName: string;
  clientEmail: string;
  domain: InquiryDomain;
  domainLabel: string;
  orderRef?: string;
  message: string;
  createdAt: string;
  status: 'received' | 'in_review' | 'resolved';
  sla: string;
}

export interface FAQItem {
  id: string;
  category: 'orders' | 'delivery' | 'returns' | 'sizing' | 'payments';
  categoryLabel: string;
  question: string;
  answer: string;
  helpfulCount?: number;
}

export interface AtelierLocation {
  id: string;
  city: string;
  title: string;
  address: string;
  phone: string;
  hours: string;
  timezone: string;
  timezoneOffset: number;
  mapsQuery: string;
  isFlagship?: boolean;
}
