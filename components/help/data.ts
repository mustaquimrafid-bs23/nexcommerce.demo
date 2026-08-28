import {
  ServiceChannel,
  CuratedLookItem,
  FAQItem,
  AtelierLocation,
  InquiryDomain,
} from './types';

export const SERVICE_CHANNELS: ServiceChannel[] = [
  {
    id: 'styling',
    title: 'Personal Styling Advice',
    badge: 'ONLINE 24/7',
    badgeType: 'live',
    description:
      'Get styling tips, outfit ideas, and size recommendations from our friendly style advisors.',
    actionText: 'Start Stylist Chat →',
    actionHref: '/concierge',
    actionType: 'concierge',
    iconName: 'Sparkles',
  },
  {
    id: 'logistics',
    title: 'Order Support & Tracking',
    badge: 'FAST SUPPORT',
    badgeType: 'sla',
    description:
      'Track your parcel in real time, see live delivery checkpoints, or request address changes.',
    actionText: 'Track Your Order →',
    actionHref: '/tracking',
    actionType: 'tracking',
    iconName: 'Truck',
  },
  {
    id: 'trust',
    title: 'Returns & Exchanges',
    badge: '30-DAY RETURNS',
    badgeType: 'trust',
    description:
      'Simple 30-day returns, size exchanges, refunds, and general customer care enquiries.',
    actionText: 'Send a Message ↓',
    actionType: 'scroll_form',
    iconName: 'ShieldCheck',
  },
];

export const CURATED_LOOKS: CuratedLookItem[] = [
  {
    id: 'look-1',
    num: '01',
    tabLabel: '01 TAILORING',
    title: 'Hand-Finished Double-Faced Cashmere',
    description:
      'Crafted from 2-ply Grade-A Mongolian cashmere with bespoke dropped shoulder silhouette and hand-stitched silk lapels.',
    pieceName: 'Architectural Cashmere Sweater',
    price: 185,
    currency: 'EUR',
    formattedPrice: '€ 185.00',
    image: '/assets/images/products/hero_sweater.png',
    lifestyleImage: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1200&q=85',
    category: 'Apparel',
    variant: 'Midnight / Medium',
    productId: 'p1',
  },
  {
    id: 'look-2',
    num: '02',
    tabLabel: '02 ACOUSTICS',
    title: 'Bespoke Acoustic Over-Ear Studio Monitors',
    description:
      'Engineered with 40mm beryllium diaphragm drivers, hand-wrapped memory lambskin cushions, and active noise suppression.',
    pieceName: 'Spatial Audio Headphones',
    price: 320,
    currency: 'EUR',
    formattedPrice: '€ 320.00',
    image: '/assets/images/products/plp_headphones.png',
    lifestyleImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=85',
    category: 'Audio',
    variant: 'Anodized Silver / Lambskin',
    productId: 'p4',
  },
  {
    id: 'look-3',
    num: '03',
    tabLabel: '03 LEATHER',
    title: 'Artisanal Full-Grain Calfskin Weekender',
    description:
      'Vegetable-tanned Florentine leather with hand-burnished edge beveling, solid brass hardware, and sovereign serial stamp.',
    pieceName: 'Artisanal Minimalist Weekend Bag',
    price: 310,
    currency: 'EUR',
    formattedPrice: '€ 310.00',
    image: '/assets/images/products/plp_bag.png',
    lifestyleImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85',
    category: 'Leather Goods',
    variant: 'Cognac Full-Grain Leather',
    productId: 'p8',
  },
  {
    id: 'look-4',
    num: '04',
    tabLabel: '04 FOOTWEAR',
    title: 'Blake-Stitched Nappa Leather Low-Tops',
    description:
      'Buttery Italian calfskin upper lined with breathable vachetta leather on lightweight Margom rubber cup soles.',
    pieceName: 'Monochrome Minimalist Trainers',
    price: 165,
    currency: 'EUR',
    formattedPrice: '€ 165.00',
    image: '/assets/images/products/plp_sneakers.png',
    lifestyleImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=85',
    category: 'Footwear',
    variant: 'Pristine White / EU 42',
    productId: 'p3',
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'orders',
    categoryLabel: 'Orders & Tracking',
    question: 'How do I track my order and delivery status?',
    answer:
      'You can track your parcel anytime on our Track Your Order page (/tracking). Simply enter your order number (e.g. ORD-9428-NX) to see live delivery updates.',
    helpfulCount: 48,
  },
  {
    id: 'faq-2',
    category: 'delivery',
    categoryLabel: 'Shipping & Delivery',
    question: 'How long does delivery take and how much does it cost?',
    answer:
      'We offer free standard delivery across the UK and Europe on all orders over €150 (takes 2–4 working days). Express delivery is available if you need your items sooner. Worldwide shipping takes 3–5 working days.',
    helpfulCount: 39,
  },
  {
    id: 'faq-3',
    category: 'returns',
    categoryLabel: 'Returns & Refunds',
    question: 'What is your returns policy?',
    answer:
      'You can return any unworn item in its original condition with tags attached within 30 days for a full refund or exchange. Returns are free and easy to arrange.',
    helpfulCount: 56,
  },
  {
    id: 'faq-4',
    category: 'sizing',
    categoryLabel: 'Sizing & Fit',
    question: 'How do I find the right size?',
    answer:
      'Every product page includes a simple size chart with chest, waist, and length measurements in centimetres and inches. If you are between sizes, we suggest sizing up, or you can chat with our online stylist for personal advice.',
    helpfulCount: 31,
  },
  {
    id: 'faq-5',
    category: 'payments',
    categoryLabel: 'Payments & Security',
    question: 'What payment methods do you accept?',
    answer:
      'We accept Visa, Mastercard, American Express, Apple Pay, Google Pay, and Klarna (Pay in 30 days). All payments are processed securely with banking-grade encryption.',
    helpfulCount: 42,
  },
  {
    id: 'faq-6',
    category: 'orders',
    categoryLabel: 'Orders & Tracking',
    question: 'Can I change or cancel my order after placing it?',
    answer:
      'You can change or cancel your order from your Account page within 60 minutes of placing it. After that, our team begins packing your order, but you can easily return any item once it arrives.',
    helpfulCount: 27,
  },
  {
    id: 'faq-7',
    category: 'returns',
    categoryLabel: 'Returns & Refunds',
    question: 'Do you offer tax refunds for international orders?',
    answer:
      'If you are ordering from outside the UK or EU, applicable taxes are calculated automatically at checkout so there are no unexpected customs charges upon delivery.',
    helpfulCount: 22,
  },
  {
    id: 'faq-8',
    category: 'sizing',
    categoryLabel: 'Sizing & Fit',
    question: 'How can I contact your customer support team?',
    answer:
      'You can send us a message using the form on this page, start a live chat with our stylist, or email us at support@nexcommerce.com. We usually reply within 15 minutes.',
    helpfulCount: 35,
  },
];

export const ATELIER_LOCATIONS: AtelierLocation[] = [
  {
    id: 'paris',
    city: 'Paris',
    title: 'Paris Store · Rue Saint-Honoré',
    address: '228 Rue Saint-Honoré, 75001 Paris, France',
    phone: '+33 1 42 68 55 00',
    hours: 'Mon – Sat: 10:00 – 19:30',
    timezone: 'Europe/Paris',
    timezoneOffset: 1,
    mapsQuery: '228+Rue+Saint-Honore+75001+Paris',
    isFlagship: true,
  },
  {
    id: 'milan',
    city: 'Milan',
    title: 'Milan Studio · Quadrilatero della Moda',
    address: 'Via Montenapoleone 18, 20121 Milano, Italy',
    phone: '+39 02 8842 1190',
    hours: 'Mon – Sat: 10:00 – 19:00',
    timezone: 'Europe/Rome',
    timezoneOffset: 1,
    mapsQuery: 'Via+Montenapoleone+18+20121+Milano',
    isFlagship: true,
  },
  {
    id: 'london',
    city: 'London',
    title: 'London Store · Kensington High Street',
    address: '42 Kensington High Street, London W8 4PE, United Kingdom',
    phone: '+44 20 7946 0912',
    hours: 'Mon – Sat: 09:30 – 18:30',
    timezone: 'Europe/London',
    timezoneOffset: 0,
    mapsQuery: '42+Kensington+High+Street+London+W8+4PE',
  },
  {
    id: 'dhaka',
    city: 'Dhaka',
    title: 'Dhaka Store · Gulshan Avenue',
    address: 'Level 8, Concord Tower, Gulshan 2, Dhaka 1212, Bangladesh',
    phone: '+880 1700 889900',
    hours: 'Sat – Thu: 10:00 – 20:00',
    timezone: 'Asia/Dhaka',
    timezoneOffset: 6,
    mapsQuery: 'Gulshan+2+Dhaka+1212',
  },
];

export const DOMAIN_OPTIONS: { id: InquiryDomain; label: string; placeholder: string }[] = [
  {
    id: 'styling',
    label: 'Styling Advice',
    placeholder: 'Ask about sizes, colours, or outfit recommendations...',
  },
  {
    id: 'logistics',
    label: 'Delivery & Shipping',
    placeholder: 'Ask about order tracking, delivery times, or address changes...',
  },
  {
    id: 'alterations',
    label: 'Returns & Exchanges',
    placeholder: 'Ask about returning an item, exchanges, or sizing adjustments...',
  },
  {
    id: 'provenance',
    label: 'Product Details',
    placeholder: 'Ask about materials, care instructions, or item authenticity...',
  },
  {
    id: 'vip',
    label: 'General Help',
    placeholder: 'How can our team help you today?',
  },
];

export const DEMO_CLIENT_INQUIRY = {
  name: 'Eleanor Vance',
  email: 'eleanor.vance@example.co.uk',
  domain: 'styling' as InquiryDomain,
  orderRef: 'ORD-9428-NX',
  message:
    'Hello, I would like to check if my order ORD-9428-NX has been dispatched, and if I can update my delivery instructions. Thank you!',
};
