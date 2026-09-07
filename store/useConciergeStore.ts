import { create } from 'zustand';
import { Product } from '@/types/catalog';
import { MASTER_PRODUCTS } from '@/data/products';
import { useBudgetCartStore } from '@/store/useBudgetCartStore';
import { useComparisonStore } from '@/store/useComparisonStore';

export interface TrackingStep {
  label: string;
  date: string;
  done?: boolean;
  active?: boolean;
  pending?: boolean;
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

export interface OrderAddress {
  name: string;
  street: string;
  city: string;
  postcode: string;
  formatted: string;
}

export interface ConciergeMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  widgetType?:
    | 'sizing_advisor'
    | 'order_tracking'
    | 'delivery'
    | 'returns'
    | 'materials'
    | 'bundle_look'
    | 'pdp_context'
    | 'order_auth_required'
    | 'order_address'
    | 'order_payment'
    | 'order_review'
    | 'order_confirmed'
    | 'none';
  widgetPayload?: any;
  actionLink?: {
    text: string;
    url: string;
  };
  spokenSummary?: string;
  suggestedChips?: string[];
  products?: Product[];
  bundle?: {
    title: string;
    products: Product[];
    totalPrice: number;
    discountedPrice: number;
  };
  timestamp: string;
  isVoice?: boolean;
}

export interface ConciergeState {
  isOpen: boolean;
  messages: ConciergeMessage[];
  isTyping: boolean;
  pdpContext: Product | null;

  // Reactive Look Canvas state
  currentLookTitle: string;
  currentLookProducts: Product[];
  harmonyScore: string;

  // Interactive Size Advisor state
  selectedCategory: string;
  selectedSize: string;
  selectedFit: string;

  // In-Drawer Order Flow State
  isAuthenticated: boolean;
  orderAddress: OrderAddress;
  orderPaymentMethod: string;
  orderDiscountCode: string;
  orderDiscountAmount: number;
  lastOrderCode: string;

  // Actions
  openConcierge: (initialPrompt?: string | unknown) => void;
  closeConcierge: () => void;
  setPDPContext: (product: Product | null) => void;
  sendMessage: (query: string, isVoice?: boolean) => void;
  clearChat: () => void;
  updateLook: (products: Product[], title?: string) => void;
  setSizeCategory: (category: string) => void;
  setSizeMeasurement: (size: string) => void;
  setSizeFit: (fit: string) => void;
  calculateSize: () => { recommendedSize: string; confidence: number; note: string };
  signInWithDemo: () => void;
  setOrderAddress: (addr: Partial<OrderAddress>) => void;
  setOrderPaymentMethod: (method: string) => void;
  runTextOrderDemo: () => Promise<void>;
  runVoiceOrderDemo: () => Promise<void>;
}

// Initial 3-product curated catalog matching feature/storefront-elevation
const INITIAL_CURATED_PRODUCTS: Product[] = [
  MASTER_PRODUCTS.find((p) => p.id === 'p1') || MASTER_PRODUCTS[0], // Architectural Cashmere Sweater (€ 185)
  MASTER_PRODUCTS.find((p) => p.id === 'p2') || MASTER_PRODUCTS[1], // Structured Wool Blazer (€ 245)
  MASTER_PRODUCTS.find((p) => p.id === 'p3') || MASTER_PRODUCTS[2], // Fine-Knit Cashmere Crew (€ 160)
];

const DEFAULT_SUGGESTED_CHIPS = [
  'Place an order (Voice Demo)',
  'Build cart by budget',
];

const DEFAULT_ADDRESS: OrderAddress = {
  name: 'Julian Wright',
  street: 'Maximilianstraße 34',
  city: 'Munich',
  postcode: '80539',
  formatted: 'Maximilianstraße 34, 80539 Munich, Germany',
};

export const useConciergeStore = create<ConciergeState>((set, get) => ({
  isOpen: false,
  messages: [],
  isTyping: false,
  pdpContext: null,

  currentLookTitle: 'Featured Collection',
  currentLookProducts: INITIAL_CURATED_PRODUCTS,
  harmonyScore: 'Great Match',

  selectedCategory: 'Tops & Sweaters',
  selectedSize: 'M (40")',
  selectedFit: 'True to size (Regular fit)',

  isAuthenticated: false,
  orderAddress: DEFAULT_ADDRESS,
  orderPaymentMethod: 'cod',
  orderDiscountCode: 'WELCOME10',
  orderDiscountAmount: 31.0,
  lastOrderCode: 'NX-7542-M',

  setPDPContext: (product: Product | null) => {
    set({ pdpContext: product });
  },

  openConcierge: (initialPrompt?: string | unknown) => {
    const state = get();
    const pdp = state.pdpContext;

    // Check if user is logged in from session
    if (typeof window !== 'undefined') {
      const hasSession = !!localStorage.getItem('nex_session') || !!localStorage.getItem('nex_auth_token');
      if (hasSession) {
        set({ isAuthenticated: true });
      }
    }

    // If opening on a PDP and chat is empty, greet with currently viewed product context
    if (pdp && state.messages.length === 0 && !initialPrompt) {
      const pdpMsg: ConciergeMessage = {
        id: `msg-pdp-${Date.now()}`,
        sender: 'assistant',
        text: `Currently viewing: **${pdp.name}**`,
        widgetType: 'pdp_context',
        products: [pdp],
        suggestedChips: [
          'Find my size',
          'Complete the outfit',
          'Fabric & care',
          'Shipping times',
        ],
        timestamp: 'Just now',
      };
      set({ isOpen: true, messages: [pdpMsg] });
      return;
    }

    set({ isOpen: true });
    if (typeof initialPrompt === 'string' && initialPrompt.trim()) {
      const prompt = initialPrompt.trim();
      setTimeout(() => {
        get().sendMessage(prompt);
      }, 150);
    }
  },

  closeConcierge: () => set({ isOpen: false }),

  clearChat: () =>
    set({
      messages: [],
      currentLookTitle: 'Featured Collection',
      currentLookProducts: INITIAL_CURATED_PRODUCTS,
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
        : 'Fits true to standard European sizing with a clean, comfortable fit.',
    };
  },

  signInWithDemo: () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nex_session', JSON.stringify({ email: 'demo@nexcommerce.ai', name: 'Julian Wright' }));
      localStorage.setItem('nex_auth_token', 'demo-token-12345');
    }
    set({ isAuthenticated: true });
    get().sendMessage('I want to place an order');
  },

  setOrderAddress: (addr: Partial<OrderAddress>) => {
    set((state) => {
      const updated = { ...state.orderAddress, ...addr };
      if (addr.street || addr.city || addr.postcode) {
        updated.formatted = `${updated.street}, ${updated.postcode} ${updated.city}, Germany`;
      }
      return { orderAddress: updated };
    });
  },

  setOrderPaymentMethod: (method: string) => {
    set({ orderPaymentMethod: method });
  },

  runTextOrderDemo: async () => {
    const { sendMessage } = get();
    // Step 0/1: Start order flow
    sendMessage('Place an order', false);
    await new Promise((r) => setTimeout(r, 1800));

    // If still in auth gate, trigger demo signin
    if (!get().isAuthenticated) {
      get().signInWithDemo();
      await new Promise((r) => setTimeout(r, 1800));
    }

    // Step 2: Confirm address
    sendMessage('Confirm address: Maximilianstraße 34, 80539 Munich', false);
    await new Promise((r) => setTimeout(r, 1800));

    // Step 3: Pay with Cash on Delivery
    sendMessage('Pay with Cash on Delivery', false);
    await new Promise((r) => setTimeout(r, 1800));

    // Step 4: Authorize
    sendMessage('Authorize & place order now', false);
  },

  runVoiceOrderDemo: async () => {
    const { sendMessage } = get();
    sendMessage('I want to place an order for my bag', true);
    await new Promise((r) => setTimeout(r, 2200));

    if (!get().isAuthenticated) {
      get().signInWithDemo();
      await new Promise((r) => setTimeout(r, 2000));
    }

    sendMessage('Confirm address: Maximilianstraße 34, 80539 Munich', true);
    await new Promise((r) => setTimeout(r, 2200));

    sendMessage('Pay with Cash on Delivery', true);
    await new Promise((r) => setTimeout(r, 2200));

    sendMessage('Authorize & place order now', true);
  },

  sendMessage: (query: string, isVoice = false) => {
    if (!query.trim()) return;

    const userMsg: ConciergeMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now',
      isVoice,
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
      let spokenSummary: string | undefined = undefined;
      let suggestedChips: string[] = DEFAULT_SUGGESTED_CHIPS;
      let bundle: ConciergeMessage['bundle'] = undefined;

      const sweater = MASTER_PRODUCTS.find((p) => p.id === 'p1') || MASTER_PRODUCTS[0];
      const blazer = MASTER_PRODUCTS.find((p) => p.id === 'p2') || MASTER_PRODUCTS[1];
      const crew = MASTER_PRODUCTS.find((p) => p.id === 'p3') || MASTER_PRODUCTS[2];
      const headphones = MASTER_PRODUCTS.find((p) => p.id === 'p4') || MASTER_PRODUCTS[3];
      const overcoat = MASTER_PRODUCTS.find((p) => p.id === 'p5') || MASTER_PRODUCTS[2];
      const runner = MASTER_PRODUCTS.find((p) => p.id === 'p6') || MASTER_PRODUCTS[5];
      const watch = MASTER_PRODUCTS.find((p) => p.id === 'p8') || MASTER_PRODUCTS[7];

      let newLookProducts: Product[] = [sweater, blazer, crew];
      let newLookTitle = 'Featured Collection';

      // ── DLP & SENSITIVE FINANCIAL CREDENTIALS GUARD ─────────────────────
      const isSensitiveCard = /\b(?:\d[ -]*?){13,19}\b/.test(q) || /\b(cvv|cvc|card number|pin code|security code)\b/i.test(q);
      if (isSensitiveCard) {
        responseText =
          '**🔒 Security Guardrail: Never Share Card Details in Chat**\n\nFor your financial protection, our Smart Assistant **never** requests or collects credit card numbers, CVVs, or bank PINs.\n\nAll assistant orders automatically default to **Cash on Delivery (Pay on Arrival)** with zero financial risk. You can also securely settle via Apple Pay or Card on the **Order Details** page anytime before dispatch.';
        spokenSummary = 'For your security, please do not enter card numbers in chat. Orders default to Pay on Delivery, or you can pay securely online from your order details page.';
        newLookProducts = [sweater, blazer];
        suggestedChips = ['Track my order', 'Delivery times'];
      }
      // ── 0A. IN-DRAWER ORDER FLOW: STEP 4 - AUTHORIZE & PLACE ORDER ────────
      else if (/\b(authorize|confirm order|place order now|authorize & place order|pay now|finalize order|complete purchase|buy now|finish order|confirm and pay|confirm purchase|confirm and place order|place the order)\b/i.test(q)) {
        const orderNum = Math.floor(1000 + Math.random() * 9000);
        const orderCode = `NX-${orderNum}-M`;
        set({ lastOrderCode: orderCode });

        responseText = `**Order Confirmed & Placed!** · Code **\`${orderCode}\`**\n\nPlaced with **Cash on Delivery (Pay on Arrival)**. You can pay the courier upon delivery, or switch to Apple Pay / Card online anytime from your Order Details page before dispatch.`;
        widgetType = 'order_confirmed';
        widgetPayload = {
          orderCode,
          totalDue: 279.0,
          subtotal: 310.0,
          discountAmount: 31.0,
          destination: get().orderAddress.formatted,
          trackingSteps: [
            { label: 'Order Received & Encrypted (COD)', time: 'Just now · Verified', done: true },
            { label: 'Quality Inspection in Munich Hub', time: 'In Progress · Expected 23:00', active: true },
            { label: 'Out for Express Courier Dispatch', time: 'Tomorrow, 09:30', pending: true },
          ],
        };
        spokenSummary = `Order ${orderCode} placed successfully! Your pieces are being prepared for express dispatch.`;
        suggestedChips = ['Track my order', 'Delivery times', '14-Day return policy'];

        // Persist order to localStorage
        if (typeof window !== 'undefined') {
          try {
            const existing = JSON.parse(localStorage.getItem('nex_placed_orders') || '[]');
            const newOrder = {
              id: orderCode,
              ref: orderCode,
              date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
              status: 'in_transit',
              statusLabel: 'Confirmed · Preparing for Dispatch',
              expectedDate: 'Tomorrow · By 12:00 PM',
              progress: 25,
              total: 279.0,
              paymentMethod: 'Cash on Delivery (Pay on Arrival)',
              paymentStatus: 'pending_cod',
              courier: 'DHL Express Priority Courier',
              customer: {
                name: get().orderAddress.name,
                address: get().orderAddress.formatted,
              },
              items: [
                { name: sweater.name, price: sweater.price, size: 'M', quantity: 1, image: sweater.image },
                { name: runner.name, price: runner.price, size: '42', quantity: 1, image: runner.image },
              ],
            };
            localStorage.setItem('nex_placed_orders', JSON.stringify([newOrder, ...existing]));
          } catch {}
        }
      }
      // ── 0B. IN-DRAWER ORDER FLOW: STEP 3 - ORDER REVIEW ───────────────────
      else if (/\b(proceed to review|review order|pay with|order review|summary|cash on delivery|apple pay|card|klarna)\b/i.test(q) && (get().isAuthenticated || /\b(pay with|review)\b/i.test(q))) {
        let chosenMethod = 'Cash on Delivery (Pay on Arrival)';
        if (q.includes('apple')) chosenMethod = 'Apple Pay (1-Touch Biometric)';
        else if (q.includes('card')) chosenMethod = 'Credit Card (•••• 4242)';
        else if (q.includes('klarna')) chosenMethod = 'Klarna Pay Later';

        responseText =
          '**Order Summary & Final Authorization**\n\nReview your order details below. Everything is verified and ready for instant authorization with **Cash on Delivery (Pay on Arrival)**:';
        widgetType = 'order_review';
        widgetPayload = {
          items: [
            { title: 'Architectural Cashmere Sweater', size: 'M', price: 185.0 },
            { title: 'Minimalist Leather Runner', size: '42', price: 125.0 },
          ],
          discountCode: 'WELCOME10 (-10%)',
          discountAmount: 31.0,
          totalDue: 279.0,
          address: get().orderAddress.formatted,
          paymentMethod: chosenMethod,
        };
        spokenSummary = 'Here is your order summary totaling € 279. Tap authorize to confirm your order.';
        suggestedChips = ['Authorize & place order now', 'Change address', 'Change payment method'];
      }
      // ── 0C. IN-DRAWER ORDER FLOW: STEP 2 - PAYMENT SELECTION ──────────────
      else if (/\b(confirm address|address confirmed|use this address|delivery address)\b/i.test(q)) {
        responseText =
          '**Payment Method Selection (Default: Cash on Delivery)**\n\nDelivery address confirmed as **Maximilianstraße 34, 80539 Munich, Germany**.\n\nAI Orders default to **Cash on Delivery (Pay on Arrival)** with zero financial risk. You can also settle digitally online anytime before courier dispatch:';
        widgetType = 'order_payment';
        widgetPayload = {
          paymentMethods: [
            { id: 'cod', name: 'Cash on Delivery (Default)', details: 'Pay upon courier arrival / Settle online', badge: 'Recommended', selected: true },
            { id: 'card', name: 'Credit / Debit Card', details: '•••• 4242 (Visa / MC)', badge: 'Instant', selected: false },
            { id: 'apple_pay', name: 'Apple Pay / Google Pay', details: '1-Touch Biometric', badge: 'Instant', selected: false },
            { id: 'klarna', name: 'Klarna Pay Later', details: 'Pay in 30 Days', badge: '0% APR', selected: false },
          ],
        };
        spokenSummary = 'Address confirmed! Please choose how you would like to pay. Orders default to Cash on Delivery.';
        suggestedChips = ['Pay with Cash on Delivery', 'Pay with Apple Pay', 'Pay with Card ••••'];
      }
      // ── 0D. IN-DRAWER ORDER FLOW: STEP 1 - ADDRESS OR AUTH GATE ───────────
      else if (/\b(place (an? )?order|order (my )?(bag|cart|items|now)|buy (this )?(outfit|look|now|cart|bag)|checkout|start order|ready to (pay|order|buy)|i want to (place an order|order|buy)|text order demo|voice order demo)\b/i.test(q)) {
        const isUserAuth = get().isAuthenticated || (typeof window !== 'undefined' && !!localStorage.getItem('nex_session'));

        if (!isUserAuth) {
          responseText =
            '**Authentication Required for Order Placement**\n\nTo secure your transaction, apply private member privileges, and enable real-time courier dispatch tracking, please sign in to your atelier account:';
          widgetType = 'order_auth_required';
          widgetPayload = {
            reason: 'Guest ordering is restricted. Sign in with your account or use the 1-Click Demo Client to complete your purchase.',
          };
          actionLink = {
            text: 'SIGN IN TO COMPLETE ORDER →',
            url: '/signin?next=checkout',
          };
          spokenSummary = 'Please sign in to your atelier account or tap Sign In with Demo Client to complete your order.';
          suggestedChips = ['Sign in with Demo Client', 'Build cart by budget', 'Compare top pieces', 'Upload shopping slip'];
        } else {
          responseText =
            '**Delivery Address & Fulfillment**\n\nWhere should we deliver your order today? You can use your saved default address or enter a new destination:';
          widgetType = 'order_address';
          widgetPayload = {
            defaultAddress: get().orderAddress,
          };
          spokenSummary = 'Where should we deliver your order today? You can use your saved address or enter a new one.';
          suggestedChips = [
            'Confirm address: Maximilianstraße 34, Munich',
            'Enter new address',
          ];
        }
      }
      // ── 1. FEATURE 08: BUDGET CART INTENT ───────────────────────────────
      else if (/budget|under\s*(?:€|\$|£)?\s*\d+|below\s*(?:€|\$|£)?\s*\d+|build.*cart|make.*cart|wardrobe.*cart/i.test(q)) {
        const amountMatch = q.match(/\b(\d{2,4})\b/);
        const amount = amountMatch ? parseInt(amountMatch[1], 10) : 500;
        
        // Open the dedicated Budget Cart Modal
        if (typeof window !== 'undefined') {
          useBudgetCartStore.getState().openBudget(amount, 'autumn');
        }

        responseText =
          `**Smart Target-Budget Cart Builder**\n\nI've configured the Budget Cart Optimizer set to **€ ${amount}**. It has selected synergistic pieces maximizing budget efficiency while preserving headroom:`;
        widgetType = 'bundle_look';
        const bundleProducts = [blazer, runner];
        const tot = bundleProducts.reduce((sum, item) => sum + item.price, 0);
        bundle = {
          title: `€ ${amount} Curated Look`,
          products: bundleProducts,
          totalPrice: tot,
          discountedPrice: tot,
        };
        actionLink = {
          text: 'OPEN BUDGET BUILDER →',
          url: '/cart?open=budget',
        };
        newLookProducts = [blazer, runner];
        newLookTitle = `Target Budget € ${amount} Curated Basket`;
        spokenSummary = `I have opened the Budget Cart Optimizer set to € ${amount} with the structured blazer and minimalist runners.`;
        suggestedChips = ['€ 300 Essentials', '€ 500 Autumn Wardrobe', 'Find my size', 'Delivery times'];
      }
      // ── 1B. COMPARISON MATRIX INTENT ────────────────────────────────────
      else if (/compare|comparison|versus|vs|side by side/i.test(q)) {
        if (typeof window !== 'undefined') {
          useComparisonStore.getState().openComparison(sweater, blazer);
        }
        responseText =
          '**Side-by-Side Product Comparison**\n\nI have launched the comparison matrix comparing the **Architectural Cashmere Sweater** against the **Structured Wool Blazer**:';
        newLookProducts = [sweater, blazer];
        newLookTitle = 'Side-by-Side Comparison';
        spokenSummary = 'I have opened the comparison matrix comparing our cashmere sweater and structured wool blazer.';
        suggestedChips = ['Complete the outfit', 'Find my size', 'Under € 500'];
      }
      // ── 1C. SHOPPING SLIP SCANNER INTENT ────────────────────────────────
      else if (/slip|receipt|shopping slip|upload slip|scan/i.test(q)) {
        responseText =
          '**Smart Shopping Slip Scanner**\n\nUpload or snap a picture of any receipt, fashion lookbook clipping, or shopping list to parse and instantly match atelier inventory:';
        actionLink = {
          text: 'OPEN SLIP SCANNER →',
          url: '/cart?scanner=open',
        };
        newLookProducts = [sweater, blazer, crew];
        newLookTitle = 'Shopping Slip Match';
        spokenSummary = 'You can upload a receipt or fashion clipping to automatically match pieces from our catalog.';
        suggestedChips = ['Build cart by budget', 'Compare top pieces'];
      }
      // ── 2. FEATURE 04 CORE: BLAZER STYLING & COMPLETE THE LOOK ─────────
      else if (/blazer|pants|shoes|match|complete.*(outfit|look)|suggest.*(pants|shoes)|pair with/i.test(q)) {
        responseText =
          '**Modern Everyday Outfit · Complete Outfit**\n\nTo complement the structured lines of your Italian merino wool blazer, we recommend pairing it with our ultra-soft cashmere sweater, studio acoustics headphones, and chronograph watch:';
        widgetType = 'bundle_look';

        const bundleProducts = [sweater, headphones, watch];
        const tot = bundleProducts.reduce((sum, item) => sum + item.price, 0);

        bundle = {
          title: 'Structured Blazer Complete Look',
          products: bundleProducts,
          totalPrice: tot,
          discountedPrice: Math.round(tot * 0.9), // 10% look bundle perk
        };
        newLookProducts = [blazer, sweater, headphones, watch];
        newLookTitle = 'Structured Blazer Outfit';
        spokenSummary = 'I have styled a complete outfit for you totaling € 790. All pieces are ready to add to your bag.';
        suggestedChips = ['Under € 500', 'Find my size', 'Show other jackets', 'Delivery times'];
      }
      // ── 3. SIZING / FIT ADVICE ──────────────────────────────────────────
      else if (/size|sizing|fit|guide|measure|measurement|chest|waist|shoe size/i.test(q)) {
        responseText =
          '**Interactive Size & Fit Guide**\n\nSelect your garment category and typical chest or shoe size below for instant tailored sizing guidance:';
        widgetType = 'sizing_advisor';
        widgetPayload = {
          categories: ['Tops & Sweaters', 'Jackets & Tailoring', 'Shoes & Trainers'],
          defaultCategory: 'Tops & Sweaters',
          availableSizes: ['XS (36")', 'S (38")', 'M (40")', 'L (42")', 'XL (44")'],
          footwearSizes: ['EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45'],
          fits: ['True to size (Regular fit)', 'Size up (Relaxed fit for layering)'],
        };
        newLookProducts = [sweater, blazer];
        newLookTitle = 'Cashmere Sizing & Fit';
        spokenSummary = 'Here is your sizing guidance. Our apparel pieces fit true to standard European sizing with relaxed tailored cuts.';
        suggestedChips = ['Show sweaters', 'Under € 300', 'Complete the outfit', 'Fabric & care'];
      }
      // ── 4. KNITWEAR / SWEATERS / BLAZERS ────────────────────────────────
      else if (/knitwear|sweater|jumper|cashmere/i.test(q)) {
        responseText =
          '**Featured Wardrobe Pieces & Styling Ideas**\n\nHere are our finest Mongolian cashmere pieces and tailored blazers, crafted for seamless layering:';
        newLookProducts = [sweater, blazer, crew];
        newLookTitle = 'Knitwear & Tailored Pieces';
        spokenSummary = 'Here are our finest cashmere knitwear pieces and wool blazers for effortless day-to-evening layering.';
        suggestedChips = ['Complete the outfit', 'Find my size', 'Fabric & care'];
      }
      // ── 5. DELIVERY / SHIPPING ──────────────────────────────────────────
      else if (/delivery|shipping|timeline|courier|fast|dispatch|express|arrive|dhl/i.test(q)) {
        responseText =
          '**Delivery & Shipping Times**\n\n' +
          '• **DHL Express Priority**: 24–48 hours across the UK & Europe.\n' +
          '• **Complimentary Delivery**: On all orders over **€ 150.00**.\n' +
          '• **Standard Delivery**: 2–4 working days with live GPS telemetry.\n' +
          '• **Real-Time Tracking**: GPS tracking and dispatch updates sent direct to your mobile.';
        widgetType = 'delivery';
        actionLink = {
          text: 'TRACK LIVE ORDER →',
          url: '/tracking',
        };
        newLookProducts = [sweater, runner, watch];
        newLookTitle = 'Express Delivery Collection';
        spokenSummary = 'We offer complimentary DHL Express delivery within 24 to 48 hours on all orders over € 150.';
        suggestedChips = ['Track my order', 'Find my size', 'Complete the outfit'];
      }
      // ── 6. ORDER TRACKING ───────────────────────────────────────────────
      else if (/track|order status|find my order|where is my order|package|nx-/i.test(q)) {
        const codeMatch = query.match(/NX-\d{4}-[A-Z0-9]+/i);
        const orderCode = codeMatch ? codeMatch[0].toUpperCase() : get().lastOrderCode || 'NX-7542-M';
        responseText = `**Live Order Tracking** · Order **\`${orderCode}\`**\n\nYour order has been dispatched from our Munich central hub and is currently on schedule with DHL Express Priority.`;
        widgetType = 'order_tracking';
        widgetPayload = {
          orderCode,
          destination: 'Munich, Germany',
          estimatedDelivery: 'Tomorrow, by 12:00 PM',
          carrier: 'DHL Express Priority',
          currentStep: 2,
          steps: [
            { label: 'Order Received & Verified', date: 'Today, 08:30' },
            { label: 'Quality Inspection in Munich Hub', date: 'Today, 11:45 (In Transit)' },
            { label: 'Out for Express Courier Dispatch', date: 'Tomorrow, 09:30' },
          ],
        };
        actionLink = {
          text: 'OPEN FULL TRACKING PAGE →',
          url: `/tracking?order=${encodeURIComponent(orderCode)}`,
        };
        newLookTitle = 'Order Tracking Collection';
        spokenSummary = `Order ${orderCode} is in transit with estimated delivery tomorrow.`;
        suggestedChips = ['Complete the outfit', 'Delivery times', 'Fabric & care'];
      }
      // ── 7. FABRIC / CARE ────────────────────────────────────────────────
      else if (/fabric|care|wash|clean|merino|leather|titanium|canvas/i.test(q)) {
        responseText =
          '**Fabric & Care Instructions**\n\n' +
          '• **Cashmere**: Cold hand-wash or dry clean with a wool-safe detergent.\n' +
          '• **Merino Wool**: Naturally breathable; steam or dry clean.\n' +
          '• **Italian Calfskin**: Wipe with a soft dry cloth and apply leather balm.\n' +
          '• **Grade-5 Titanium**: Scratch and water-resistant for everyday durability.';
        widgetType = 'materials';
        newLookProducts = [sweater, blazer, watch];
        newLookTitle = 'Artisanal Materials';
        spokenSummary = 'Cashmere should be cold hand-washed with wool-safe detergent, while merino wool should be gently steamed or dry cleaned.';
        suggestedChips = ['Complete the outfit', 'Find my size', 'Shipping times'];
      }
      // ── 8. DEFAULT / RECOMMENDATIONS ────────────────────────────────────
      else {
        responseText =
          '**Featured Wardrobe Pieces & Styling Ideas**\n\nHere are hand-picked pieces curated to elevate your personal wardrobe:';
        newLookProducts = INITIAL_CURATED_PRODUCTS;
        newLookTitle = 'Featured Collection';
        spokenSummary = 'Here are hand-picked wardrobe essentials designed for versatile everyday styling.';
        suggestedChips = DEFAULT_SUGGESTED_CHIPS;
      }

      const assistantMsg: ConciergeMessage = {
        id: `msg-ast-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        widgetType,
        widgetPayload,
        actionLink,
        spokenSummary,
        suggestedChips,
        products: newLookProducts,
        bundle,
        timestamp: 'Just now',
      };

      set((state) => ({
        messages: [...state.messages, assistantMsg],
        isTyping: false,
        currentLookProducts: newLookProducts,
        currentLookTitle: newLookTitle,
      }));
    }, 320);
  },
}));
