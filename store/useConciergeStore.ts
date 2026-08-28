import { create } from 'zustand';
import { Product } from '@/types/catalog';
import { MASTER_PRODUCTS } from '@/data/products';

export interface TrackingStep {
  label: string;
  date: string;
}

export interface TrackingPayload {
  orderCode: string;
  destination: string;
  estimatedDelivery: string;
  carrier: string;
  currentStep: number;
  steps: TrackingStep[];
}

export interface SizeAdvicePayload {
  categories: string[];
  defaultCategory: string;
  availableSizes: string[];
  footwearSizes: string[];
  fits: string[];
}

export interface ConciergeMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  widgetType?: 'sizing_advisor' | 'order_tracking' | 'delivery' | 'returns' | 'materials' | 'bundle_look' | 'none';
  widgetPayload?: any;
  actionLink?: {
    text: string;
    url: string;
  };
  products?: Product[];
  bundle?: {
    title: string;
    products: Product[];
    totalPrice: number;
    discountedPrice: number;
  };
  timestamp: string;
}

export interface ConciergeState {
  isOpen: boolean;
  messages: ConciergeMessage[];
  isTyping: boolean;
  
  // Reactive Look Canvas state
  currentLookTitle: string;
  currentLookProducts: Product[];
  harmonyScore: string;
  
  // Interactive Size Advisor state
  selectedCategory: string;
  selectedSize: string;
  selectedFit: string;
  
  // Actions
  openConcierge: () => void;
  closeConcierge: () => void;
  sendMessage: (query: string) => void;
  clearChat: () => void;
  updateLook: (products: Product[], title?: string) => void;
  setSizeCategory: (category: string) => void;
  setSizeMeasurement: (size: string) => void;
  setSizeFit: (fit: string) => void;
  calculateSize: () => { recommendedSize: string; confidence: number; note: string };
}

const DEFAULT_LOOK_PRODUCTS = [
  MASTER_PRODUCTS[0], // Cashmere Turtleneck Sweater (€ 185)
  MASTER_PRODUCTS[1], // Structured Wool Blazer (€ 264)
  MASTER_PRODUCTS[2], // Tailored Charcoal Overcoat (€ 380)
];

const INITIAL_MESSAGES: ConciergeMessage[] = [];

export const useConciergeStore = create<ConciergeState>((set, get) => ({
  isOpen: false,
  messages: INITIAL_MESSAGES,
  isTyping: false,
  
  currentLookTitle: 'Featured Collection',
  currentLookProducts: DEFAULT_LOOK_PRODUCTS,
  harmonyScore: 'Great Match',
  
  selectedCategory: 'Tops & Sweaters',
  selectedSize: 'M (40")',
  selectedFit: 'True to size (Clean silhouette)',
  
  openConcierge: () => set({ isOpen: true }),
  closeConcierge: () => set({ isOpen: false }),
  
  clearChat: () =>
    set({
      messages: INITIAL_MESSAGES,
      currentLookTitle: 'Featured Collection',
      currentLookProducts: DEFAULT_LOOK_PRODUCTS,
      harmonyScore: 'Great Match',
    }),
    
  updateLook: (products: Product[], title?: string) =>
    set({
      currentLookProducts: products,
      currentLookTitle: title || get().currentLookTitle,
    }),
    
  setSizeCategory: (category: string) => {
    const isShoes = category.includes('Shoe') || category.includes('Footwear') || category.includes('Trainer');
    set({
      selectedCategory: category,
      selectedSize: isShoes ? 'EU 42' : 'M (40")',
    });
  },
  
  setSizeMeasurement: (size: string) => set({ selectedSize: size }),
  setSizeFit: (fit: string) => set({ selectedFit: fit }),
  
  calculateSize: () => {
    const { selectedCategory, selectedSize, selectedFit } = get();
    const isShoes = selectedCategory.includes('Shoe') || selectedCategory.includes('Footwear') || selectedCategory.includes('Trainer');
    
    if (isShoes) {
      return {
        recommendedSize: selectedSize || 'EU 42',
        confidence: 96,
        note: 'Our Minimalist Leather Runner fits true to standard European shoe sizes with a comfortable cushioned insole.',
      };
    }
    
    const isLayering = selectedFit.includes('Size up') || selectedFit.includes('Relaxed');
    let baseSize = 'EU 48 / Medium';
    
    if (selectedSize.includes('XS') || selectedSize.includes('36')) {
      baseSize = isLayering ? 'EU 46 / Small' : 'EU 44 / XS';
    } else if (selectedSize.includes('S') || selectedSize.includes('38')) {
      baseSize = isLayering ? 'EU 48 / Medium' : 'EU 46 / Small';
    } else if (selectedSize.includes('M') || selectedSize.includes('40')) {
      baseSize = isLayering ? 'EU 50 / Large' : 'EU 48 / Medium';
    } else if (selectedSize.includes('L') || selectedSize.includes('42')) {
      baseSize = isLayering ? 'EU 52 / XL' : 'EU 50 / Large';
    } else if (selectedSize.includes('XL') || selectedSize.includes('44')) {
      baseSize = 'EU 52 / XL';
    }
    
    return {
      recommendedSize: baseSize,
      confidence: 96,
      note: isLayering
        ? 'Cut with generous room for wearing jumpers or shirts underneath.'
        : 'Fits true to standard European sizing with a clean, comfortable silhouette.',
    };
  },

  sendMessage: (query: string) => {
    if (!query.trim()) return;

    const userMsg: ConciergeMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now',
    };

    set((state) => ({
      messages: [...state.messages, userMsg],
      isTyping: true,
    }));

    setTimeout(() => {
      const q = query.toLowerCase().trim();
      let responseText = 'Here are matching pieces based on what you need:';
      let widgetType: ConciergeMessage['widgetType'] = 'none';
      let widgetPayload: any = undefined;
      let actionLink: ConciergeMessage['actionLink'] = undefined;
      let newLookProducts = get().currentLookProducts;
      let newLookTitle = get().currentLookTitle;

      // 1. Sizing / Fit Advice (High Priority)
      if (/size|sizing|fit|guide|measure|measurement|chest|waist|shoe size/.test(q)) {
        responseText =
          '**Interactive Size & Fit Guide**\n\nSelect your garment category and typical chest or shoe size below for instant tailored sizing guidance:';
        widgetType = 'sizing_advisor';
        widgetPayload = {
          categories: ['Tops & Sweaters', 'Jackets & Tailoring', 'Shoes & Trainers'],
          defaultCategory: 'Tops & Sweaters',
          availableSizes: ['XS (36")', 'S (38")', 'M (40")', 'L (42")', 'XL (44")'],
          footwearSizes: ['EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45'],
          fits: ['True to size (Clean silhouette)', 'Size up (Relaxed drape)'],
        };
        newLookProducts = [
          MASTER_PRODUCTS[0], // Cashmere Turtleneck
          MASTER_PRODUCTS[1], // Structured Wool Blazer
        ];
        newLookTitle = 'Cashmere Sizing & Fit';
      }
      // 2. Winter trip / Alpine / St. Moritz / Cold weather
      else if (/winter|alpine|moritz|cold|trip|snow|overcoat/.test(q)) {
        responseText =
          '**3-Day Winter Alpine Trip** · Complete Outfit\n\nFor crisp mountain air and cold winter days, we have put together this insulating cashmere turtleneck jumper, tailored wool blazer, and charcoal overcoat:';
        newLookProducts = [
          MASTER_PRODUCTS[0], // Cashmere Turtleneck
          MASTER_PRODUCTS[1], // Structured Wool Blazer
          MASTER_PRODUCTS[2], // Tailored Charcoal Overcoat
        ];
        newLookTitle = 'St. Moritz Winter Alpine Outfit';
        widgetType = 'none';
      }
      // 3. Knitwear / Sweaters / Blazers / Tailoring
      else if (/knitwear|sweater|jumper|cashmere|blazer|tailoring|suit/.test(q)) {
        responseText =
          '**Knitwear & Tailoring** · Featured Collection\n\nHere are our finest Italian cashmere jumpers and structured wool blazers, crafted for easy layering from day to evening:';
        newLookProducts = [
          MASTER_PRODUCTS[0], // Cashmere Turtleneck
          MASTER_PRODUCTS[1], // Structured Wool Blazer
          MASTER_PRODUCTS[5], // Minimalist Leather Runner
        ];
        newLookTitle = 'Knitwear & Tailored Pieces';
        widgetType = 'none';
      }
      // 4. Delivery / Shipping / Timelines / Courier
      else if (/delivery|shipping|timeline|courier|fast|dispatch|express|arrive|dhl/.test(q)) {
        responseText =
          '**Delivery & Shipping Times**\n\n' +
          '• **DHL Express Courier**: 24–48 hours across the UK & Europe.\n' +
          '• **Complimentary Delivery**: On all orders over **€ 150.00**.\n' +
          '• **Standard Delivery**: 2–4 working days with live GPS tracking.\n' +
          '• **Tracked Courier**: Real-time status direct to your inbox.';
        widgetType = 'delivery';
        actionLink = {
          text: 'TRACK LIVE ORDER →',
          url: '/tracking',
        };
        newLookProducts = [
          MASTER_PRODUCTS[0],
          MASTER_PRODUCTS[5],
          MASTER_PRODUCTS[6],
        ];
        newLookTitle = 'Express Delivery Collection';
      }
      // 5. Order Tracking / NX-8921-X
      else if (/track|order status|find my order|where is my order|package|nx-/.test(q)) {
        const codeMatch = query.match(/NX-\d{4}-[A-Z0-9]+/i);
        const orderCode = codeMatch ? codeMatch[0].toUpperCase() : 'NX-8921-X';
        responseText = `**Live Order Tracking** · Order **\`${orderCode}\`**\n\nYour order has been dispatched from our central hub and is currently on schedule with DHL Express Priority.`;
        widgetType = 'order_tracking';
        widgetPayload = {
          orderCode: orderCode,
          destination: 'London, UK',
          estimatedDelivery: 'Tomorrow, by 18:00',
          carrier: 'DHL Express Priority',
          currentStep: 3,
          steps: [
            { label: 'Order Placed', date: 'Yesterday, 14:20' },
            { label: 'Quality Checked', date: 'Today, 08:30' },
            { label: 'Dispatched with DHL Express', date: 'Today, 11:45 (In Transit)' },
            { label: 'Out for Delivery', date: 'Expected Tomorrow' },
          ],
        };
        actionLink = {
          text: 'OPEN FULL TRACKING PAGE →',
          url: `/tracking?order=${encodeURIComponent(orderCode)}`,
        };
        newLookTitle = 'Order Tracking Collection';
      }
      // 6. Returns / Refunds / Exchange
      else if (/return|refund|exchange|guarantee|warranty|policy/.test(q)) {
        responseText =
          '**14-Day Free Returns & Refunds**\n\n' +
          '• **14-Day Return Window**: Return any unworn piece within 14 days.\n' +
          '• **Prepaid Return Label**: Included inside every parcel.\n' +
          '• **Prompt Refunds**: Credited within 24 hours of inspection.';
        widgetType = 'returns';
      }
      // 7. Fabric / Care / Materials / Cashmere / Wool / Leather
      else if (/fabric|care|wash|clean|merino|leather|titanium|canvas/.test(q)) {
        responseText =
          '**Fabric & Care Instructions**\n\n' +
          '• **Cashmere**: Cold hand-wash or dry clean with a wool-safe detergent.\n' +
          '• **Merino Wool**: Naturally breathable; steam or dry clean.\n' +
          '• **Italian Leather**: Wipe with a soft dry cloth and apply leather balm.\n' +
          '• **Titanium**: Water and scratch resistant for everyday wear.';
        widgetType = 'materials';
        newLookProducts = [
          MASTER_PRODUCTS[0],
          MASTER_PRODUCTS[1],
          MASTER_PRODUCTS[7],
        ];
        newLookTitle = 'Artisanal Materials';
      }
      // 8. Dinner / Formal / Evening outfit
      else if (/dinner|evening|formal|gala|party/.test(q)) {
        responseText =
          '**Smart Evening Dinner Outfit** · Complete Look\n\nFor evening dinners and formal events, pair our tailored Italian wool blazer with a minimalist chronograph timepiece and calfskin runners:';
        newLookProducts = [
          MASTER_PRODUCTS[1], // Blazer
          MASTER_PRODUCTS[7], // Watch
          MASTER_PRODUCTS[5], // Leather Runner
        ];
        newLookTitle = 'Smart Evening Dinner Outfit';
      }
      // 9. Everyday basics / Shoes / Travel
      else if (/shoe|trainer|runner|sneaker|walk|travel|bag|tote/.test(q)) {
        responseText =
          '**Everyday Travel & Comfort** · Selected Essentials\n\nHand-crafted calfskin trainers and durable waxed canvas tote bag designed for city walking and weekend travel:';
        newLookProducts = [
          MASTER_PRODUCTS[5], // Leather Runner
          MASTER_PRODUCTS[6], // Canvas Tote
          MASTER_PRODUCTS[3], // Studio Headphones
        ];
        newLookTitle = 'Everyday Travel Essentials';
      }
      // 10. Default / General inquiry
      else {
        responseText =
          'Here are some of our most popular wardrobe essentials hand-picked for you:';
        newLookProducts = [
          MASTER_PRODUCTS[0],
          MASTER_PRODUCTS[1],
          MASTER_PRODUCTS[5],
        ];
        newLookTitle = 'Featured Collection';
      }

      const assistantMsg: ConciergeMessage = {
        id: `msg-ast-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        widgetType,
        widgetPayload,
        actionLink,
        timestamp: 'Just now',
      };

      set((state) => ({
        messages: [...state.messages, assistantMsg],
        isTyping: false,
        currentLookProducts: newLookProducts,
        currentLookTitle: newLookTitle,
      }));
    }, 450);
  },
}));
