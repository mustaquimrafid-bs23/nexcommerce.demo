import { create } from 'zustand';
import { Product } from '@/types/catalog';
import { MASTER_PRODUCTS } from '@/data/products';

export interface ConciergeMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  products?: Product[];
  bundle?: {
    title: string;
    products: Product[];
    totalPrice: number;
    discountedPrice: number;
  };
  timestamp: string;
}

interface ConciergeState {
  isOpen: boolean;
  messages: ConciergeMessage[];
  isTyping: boolean;
  openConcierge: () => void;
  closeConcierge: () => void;
  sendMessage: (query: string) => void;
  clearChat: () => void;
}

const INITIAL_MESSAGES: ConciergeMessage[] = [
  {
    id: 'msg-init-1',
    sender: 'assistant',
    text: 'Hello! I am your personal stylist. Here is a favourite matching winter outfit to get you started:',
    bundle: {
      title: 'Classic Winter Outfit',
      products: [
        MASTER_PRODUCTS[0], // Cashmere Sweater
        MASTER_PRODUCTS[1], // Wool Blazer
        MASTER_PRODUCTS[5], // Leather Runner
      ],
      totalPrice: 185 + 245 + 195,
      discountedPrice: Math.round((185 + 245 + 195) * 0.85), // 15% bundle discount
    },
    timestamp: 'Just now',
  },
];

export const useConciergeStore = create<ConciergeState>((set, get) => ({
  isOpen: false,
  messages: INITIAL_MESSAGES,
  isTyping: false,
  openConcierge: () => set({ isOpen: true }),
  closeConcierge: () => set({ isOpen: false }),
  clearChat: () => set({ messages: INITIAL_MESSAGES }),
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

    // Simulated natural styling response in simple UK English
    setTimeout(() => {
      const q = query.toLowerCase();
      let responseText =
        'Here are matching items based on what you need:';
      let matchedProducts: Product[] = [];
      let matchedBundle: ConciergeMessage['bundle'] | undefined = undefined;

      if (/winter|cold|sweater|knit|paris|overcoat|warm|jumper/.test(q)) {
        responseText =
          'For cold weather, I recommend layering this soft cashmere jumper with the tailored wool blazer:';
        matchedBundle = {
          title: 'Winter Warmth Outfit',
          products: [MASTER_PRODUCTS[0], MASTER_PRODUCTS[1]],
          totalPrice: MASTER_PRODUCTS[0].price + MASTER_PRODUCTS[1].price,
          discountedPrice: Math.round(
            (MASTER_PRODUCTS[0].price + MASTER_PRODUCTS[1].price) * 0.9
          ),
        };
      } else if (/dinner|evening|formal|blazer|watch|suit/.test(q)) {
        responseText =
          'For a smart dinner or evening out, this wool blazer and classic watch make a sharp look:';
        matchedBundle = {
          title: 'Smart Evening Outfit',
          products: [MASTER_PRODUCTS[1], MASTER_PRODUCTS[4]],
          totalPrice: MASTER_PRODUCTS[1].price + MASTER_PRODUCTS[4].price,
          discountedPrice: Math.round(
            (MASTER_PRODUCTS[1].price + MASTER_PRODUCTS[4].price) * 0.9
          ),
        };
      } else if (/run|shoe|sneaker|walk|footwear|trainer/.test(q)) {
        responseText =
          'These leather trainers and noise-cancelling headphones are great for everyday comfort:';
        matchedProducts = [MASTER_PRODUCTS[5], MASTER_PRODUCTS[3]];
      } else if (/travel|bag|tote|carry|weekend/.test(q)) {
        responseText =
          'For weekend trips, this sturdy canvas and leather tote bag pairs well with casual trainers:';
        matchedProducts = [MASTER_PRODUCTS[6], MASTER_PRODUCTS[5]];
      } else {
        responseText =
          'Here are some of our most popular everyday basics:';
        matchedProducts = [MASTER_PRODUCTS[0], MASTER_PRODUCTS[2], MASTER_PRODUCTS[4]];
      }

      const assistantMsg: ConciergeMessage = {
        id: `msg-ast-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        products: matchedProducts.length > 0 ? matchedProducts : undefined,
        bundle: matchedBundle,
        timestamp: 'Just now',
      };

      set((state) => ({
        messages: [...state.messages, assistantMsg],
        isTyping: false,
      }));
    }, 700);
  },
}));
