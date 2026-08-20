/* ═══════════════════════════════════════════════════════════════════════════
   nexCommerce — AI-06 Smart Reorder Engine (Luxury Atelier Edition)
   Feature: AI-Recommended Shopping List (Atelier Curation & Replenishment)
   Capabilities:
     1. Curated Look Switcher & 120fps Animation Track (Auto-rotation & Pause)
     2. Interactive Repurchase Cadence Popover (Custom Cycle Adjuster)
     3. Persistent Interval Customization (localStorage)
     4. Unified Action Row (Stepper + Move to Bag)
     5. Category Filter Pills with Cross-Fade Stagger & Sync
     6. Live Curation Valuation Metric
     7. 5-Second Interactive Undo Toast on Dismissal
     8. Atelier Concierge Styling Bridge
     9. All 4 Motion Standards Fully Integrated
   ═══════════════════════════════════════════════════════════════════════════ */

'use strict';

/* ─── Storage Keys ─────────────────────────────────────────────────────────── */
const SL_KEYS = {
  enabled:   'nex_sl_enabled',   // admin kill switch — 'false' = disabled
  optout:    'nex_sl_optout',    // buyer opt-out — 'true' = opted out
  dismissed: 'nex_sl_dismissed', // {id: isoExpiresAt} map
  intervals: 'nex_sl_intervals'  // {id: days} custom cycle map
};

/* ─── Active State ────────────────────────────────────────────────────────── */
let activeCategoryFilter = 'all';

/* ─── Image Path Resolver ─────────────────────────────────────────────────── */
function resolveImgPath(imgPath) {
  if (!imgPath) return '';
  if (imgPath.startsWith('http')) return imgPath;
  const isSubpage = window.location.pathname.includes('/pages/') || window.location.pathname.endsWith('/pages');
  if (isSubpage) {
    return imgPath.startsWith('../') ? imgPath : '../' + imgPath;
  } else {
    return imgPath.startsWith('../') ? imgPath.replace(/^\.\.\//, '') : imgPath;
  }
}

/* ─── Real nexCommerce Atelier Catalog DB ──────────────────────────────────── */
const SL_PRODUCTS = [
  {
    id: 'p1',
    name: 'Pure Cashmere Sweater',
    brand: 'Arc',
    price: 185,
    originalPrice: null,
    image: 'assets/images/products/hero_sweater.png',
    gallery: [
      'assets/images/products/hero_sweater.png',
      'assets/images/products/plp_crewneck.png',
      'assets/images/lifestyle/hero_sweater_landscape.jpg'
    ],
    category: 'Apparel',
    categoryLabel: 'Clothing',
    boughtCount: 4,
    avgIntervalDays: 60,
    daysSinceLast: 58,
    suggestedQty: 1,
    inStock: true,
    reason: 'Purchased 4× · Recommended for winter',
    materials: '100% Grade-A Mongolian Cashmere (2-ply yarn)',
    origin: 'Hand-finished in Biella, Italy',
    care: 'Hand wash cold with wool wash or dry clean',
    variants: {
      finishes: [
        { id: 'charcoal', name: 'Charcoal Grey', color: '#2B323F', priceDelta: 0 },
        { id: 'obsidian', name: 'Deep Obsidian', color: '#0F172A', priceDelta: 0 },
        { id: 'ivory', name: 'Raw Ivory', color: '#F8F6F0', priceDelta: 10 }
      ],
      sizes: [
        { id: 'S', name: 'S', inStock: true },
        { id: 'M', name: 'M', inStock: true, default: true },
        { id: 'L', name: 'L', inStock: true },
        { id: 'XL', name: 'XL', inStock: false }
      ]
    },
    selectedFinish: 'charcoal',
    selectedSize: 'M'
  },
  {
    id: 'p2',
    name: 'Fine-Knit Cashmere Crew',
    brand: 'Arc',
    price: 160,
    originalPrice: null,
    image: 'assets/images/products/plp_crewneck.png',
    gallery: [
      'assets/images/products/plp_crewneck.png',
      'assets/images/products/hero_sweater.png',
      'assets/images/lifestyle/hero_sweater_landscape.jpg'
    ],
    category: 'Apparel',
    categoryLabel: 'Clothing',
    boughtCount: 5,
    avgIntervalDays: 45,
    daysSinceLast: 42,
    suggestedQty: 2,
    inStock: true,
    reason: 'Purchased 5× · Everyday essential',
    materials: '100% Fine Gauge Cashmere (70g/m²)',
    origin: 'Crafted in Florence, Italy',
    care: 'Dry clean or gentle cold wash',
    variants: {
      finishes: [
        { id: 'midnight', name: 'Midnight Navy', color: '#0B192C', priceDelta: 0 },
        { id: 'slate', name: 'Slate Grey', color: '#475569', priceDelta: 0 },
        { id: 'sand', name: 'Warm Sand', color: '#D5C4A1', priceDelta: 0 }
      ],
      sizes: [
        { id: 'S', name: 'S', inStock: true },
        { id: 'M', name: 'M', inStock: true, default: true },
        { id: 'L', name: 'L', inStock: true },
        { id: 'XL', name: 'XL', inStock: true }
      ]
    },
    selectedFinish: 'midnight',
    selectedSize: 'M'
  },
  {
    id: 'p3',
    name: 'Structured Wool Blazer',
    brand: 'Arc',
    price: 245,
    originalPrice: 270,
    image: 'assets/images/products/plp_blazer.png',
    gallery: [
      'assets/images/products/plp_blazer.png',
      'assets/images/products/plp_overcoat.png',
      'assets/images/lifestyle/hero_sweater_landscape.jpg'
    ],
    category: 'Apparel',
    categoryLabel: 'Clothing',
    boughtCount: 3,
    avgIntervalDays: 90,
    daysSinceLast: 86,
    suggestedQty: 1,
    inStock: true,
    reason: 'Purchased 3× · Classic tailoring',
    materials: '100% Virgin Wool, Horn Buttons, Cupro Lining',
    origin: 'Tailored in Milan, Italy',
    care: 'Specialist dry clean only',
    variants: {
      finishes: [
        { id: 'nero', name: 'Classic Black', color: '#111827', priceDelta: 0 },
        { id: 'navy', name: 'Midnight Navy', color: '#1E293B', priceDelta: 0 }
      ],
      sizes: [
        { id: '46', name: '46', inStock: true },
        { id: '48', name: '48', inStock: true, default: true },
        { id: '50', name: '50', inStock: true },
        { id: '52', name: '52', inStock: false }
      ]
    },
    selectedFinish: 'nero',
    selectedSize: '48'
  },
  {
    id: 'p4',
    name: 'Planar Magnetic Studio Headphones',
    brand: 'Form',
    price: 220,
    originalPrice: null,
    image: 'assets/images/products/prod_headphones.png',
    gallery: [
      'assets/images/products/prod_headphones.png',
      'assets/images/products/search_earbuds.png',
      'assets/images/lifestyle/hero_headphone_landscape.jpg'
    ],
    category: 'Acoustics',
    categoryLabel: 'Audio',
    boughtCount: 3,
    avgIntervalDays: 120,
    daysSinceLast: 115,
    suggestedQty: 1,
    inStock: true,
    reason: 'Purchased 3× · Studio audio favorite',
    materials: 'Anodized Aluminum, Lambskin Memory Foam Cushions',
    origin: 'Engineered in Munich, Germany',
    care: 'Wipe with dry microfiber cloth',
    variants: {
      finishes: [
        { id: 'matte_black', name: 'Matte Obsidian', color: '#171717', priceDelta: 0 },
        { id: 'silver', name: 'Anodized Silver', color: '#E2E8F0', priceDelta: 15 }
      ],
      sizes: [
        { id: 'standard', name: 'Over-Ear', inStock: true, default: true }
      ]
    },
    selectedFinish: 'matte_black',
    selectedSize: 'standard'
  },
  {
    id: 'p5',
    name: 'Minimalist Leather Runner',
    brand: 'Apex',
    price: 185,
    originalPrice: null,
    image: 'assets/images/products/prod_runner.png',
    gallery: [
      'assets/images/products/prod_runner.png',
      'assets/images/lifestyle/hero_runner_landscape.jpg',
      'assets/images/products/prod_tote.png'
    ],
    category: 'Footwear',
    categoryLabel: 'Footwear',
    boughtCount: 4,
    avgIntervalDays: 90,
    daysSinceLast: 88,
    suggestedQty: 1,
    inStock: true,
    reason: 'Purchased 4× · Daily footwear essential',
    materials: 'Full-Grain Italian Calfskin, Margom Rubber Outsole',
    origin: 'Handmade in Civitanova Marche, Italy',
    care: 'Condition regularly with neutral leather balm',
    variants: {
      finishes: [
        { id: 'white', name: 'Optic White', color: '#F9FAFB', priceDelta: 0 },
        { id: 'black', name: 'Classic Black', color: '#09090B', priceDelta: 0 }
      ],
      sizes: [
        { id: '40', name: '40', inStock: true },
        { id: '41', name: '41', inStock: true },
        { id: '42', name: '42', inStock: true, default: true },
        { id: '43', name: '43', inStock: true },
        { id: '44', name: '44', inStock: false }
      ]
    },
    selectedFinish: 'white',
    selectedSize: '42'
  },
  {
    id: 'p6',
    name: 'Structured Canvas Tote',
    brand: 'Forma',
    price: 125,
    originalPrice: null,
    image: 'assets/images/products/prod_tote.png',
    gallery: [
      'assets/images/products/prod_tote.png',
      'assets/images/products/prod_runner.png',
      'assets/images/lifestyle/hero_sweater_landscape.jpg'
    ],
    category: 'Accessories',
    categoryLabel: 'Bags & Accessories',
    boughtCount: 3,
    avgIntervalDays: 75,
    daysSinceLast: 70,
    suggestedQty: 1,
    inStock: false,
    reason: 'Purchased 3× · Everyday tote bag',
    materials: '24oz Heavyweight Organic Cotton Duck, Saddle Leather Trim',
    origin: 'Crafted in Porto, Portugal',
    care: 'Spot clean with neutral soap',
    variants: {
      finishes: [
        { id: 'natural', name: 'Raw Canvas', color: '#EFEFEA', priceDelta: 0 },
        { id: 'noir', name: 'Black Canvas', color: '#18181B', priceDelta: 0 }
      ],
      sizes: [
        { id: 'one_size', name: 'Standard 22L', inStock: false, default: true }
      ]
    },
    selectedFinish: 'natural',
    selectedSize: 'one_size'
  },
  {
    id: 'p7',
    name: 'Noise Canceling Earbuds',
    brand: 'Form',
    price: 145,
    originalPrice: null,
    image: 'assets/images/products/search_earbuds.png',
    gallery: [
      'assets/images/products/search_earbuds.png',
      'assets/images/products/prod_headphones.png',
      'assets/images/lifestyle/hero_headphone_landscape.jpg'
    ],
    category: 'Acoustics',
    categoryLabel: 'Audio',
    boughtCount: 4,
    avgIntervalDays: 60,
    daysSinceLast: 56,
    suggestedQty: 1,
    inStock: true,
    reason: 'Purchased 4× · Travel & commute favorite',
    materials: 'Ceramic Sound Chamber, Wireless Qi Charging Case',
    origin: 'Precision Crafted in Munich, Germany',
    care: 'Clean silicone tips in warm water',
    variants: {
      finishes: [
        { id: 'graphite', name: 'Graphite Black', color: '#1F2937', priceDelta: 0 },
        { id: 'sand_stone', name: 'Sandstone Grey', color: '#CBD5E1', priceDelta: 0 }
      ],
      sizes: [
        { id: 'universal', name: 'Universal Fit', inStock: true, default: true }
      ]
    },
    selectedFinish: 'graphite',
    selectedSize: 'universal'
  },
  {
    id: 'p8',
    name: 'Double-Breasted Wool Overcoat',
    brand: 'Arc',
    price: 285,
    originalPrice: 320,
    image: 'assets/images/products/plp_overcoat.png',
    gallery: [
      'assets/images/products/plp_overcoat.png',
      'assets/images/products/plp_blazer.png',
      'assets/images/lifestyle/hero_sweater_landscape.jpg'
    ],
    category: 'Apparel',
    categoryLabel: 'Clothing',
    boughtCount: 2,
    avgIntervalDays: 180,
    daysSinceLast: 175,
    suggestedQty: 1,
    inStock: true,
    reason: 'Purchased 2× · Winter coat staple',
    materials: 'Double-Faced Melton Wool (580g/m²)',
    origin: 'Handcrafted in Milan, Italy',
    care: 'Dry clean only with steam finish',
    variants: {
      finishes: [
        { id: 'camel', name: 'Warm Camel', color: '#9A7B56', priceDelta: 0 },
        { id: 'dark_navy', name: 'Dark Navy', color: '#030712', priceDelta: 0 }
      ],
      sizes: [
        { id: '46', name: '46', inStock: true },
        { id: '48', name: '48', inStock: true, default: true },
        { id: '50', name: '50', inStock: true },
        { id: '52', name: '52', inStock: true }
      ]
    },
    selectedFinish: 'camel',
    selectedSize: '48'
  },
  {
    id: 'p9',
    name: 'Obsidian Automatic Timepiece',
    brand: 'Volta',
    price: 340,
    originalPrice: null,
    image: 'assets/images/products/search_watch.png',
    gallery: [
      'assets/images/products/search_watch.png',
      'assets/images/lifestyle/hero_watch_landscape.jpg',
      'assets/images/products/plp_blazer.png'
    ],
    category: 'Timepieces',
    categoryLabel: 'Watches',
    boughtCount: 2,
    avgIntervalDays: 180,
    daysSinceLast: 170,
    suggestedQty: 1,
    inStock: true,
    reason: 'Purchased 2× · Automatic timepiece',
    materials: '316L Diamond-Like-Carbon Steel, Sapphire Crystal, Automatic Caliber',
    origin: 'Manufactured in Geneva, Switzerland',
    care: 'Water resistant to 10 ATM / 100m',
    variants: {
      finishes: [
        { id: 'dlc_black', name: 'Obsidian Black', color: '#0A0A0A', priceDelta: 0 },
        { id: 'brushed_steel', name: 'Brushed Steel', color: '#E5E7EB', priceDelta: 20 },
        { id: 'rose_gold', name: 'Rose Titanium', color: '#B76E79', priceDelta: 45 }
      ],
      sizes: [
        { id: '39mm', name: '39mm', inStock: true },
        { id: '41mm', name: '41mm', inStock: true, default: true }
      ]
    },
    selectedFinish: 'dlc_black',
    selectedSize: '41mm'
  },
  {
    id: 'p10',
    name: 'Tailored Wool Trousers',
    brand: 'Arc',
    price: 170,
    originalPrice: null,
    image: 'assets/images/products/plp_trousers.png',
    gallery: [
      'assets/images/products/plp_trousers.png',
      'assets/images/products/plp_blazer.png',
      'assets/images/lifestyle/hero_sweater_landscape.jpg'
    ],
    category: 'Apparel',
    categoryLabel: 'Clothing',
    boughtCount: 4,
    avgIntervalDays: 75,
    daysSinceLast: 72,
    suggestedQty: 1,
    inStock: true,
    reason: 'Purchased 4× · Wardrobe staple trousers',
    materials: 'High-Twist Tropical Wool with Natural Stretch',
    origin: 'Tailored in Naples, Italy',
    care: 'Dry clean or steam press',
    variants: {
      finishes: [
        { id: 'anthracite', name: 'Anthracite Grey', color: '#334155', priceDelta: 0 },
        { id: 'black', name: 'Pure Black', color: '#0F172A', priceDelta: 0 }
      ],
      sizes: [
        { id: '46', name: '46', inStock: true },
        { id: '48', name: '48', inStock: true, default: true },
        { id: '50', name: '50', inStock: true },
        { id: '52', name: '52', inStock: false }
      ]
    },
    selectedFinish: 'anthracite',
    selectedSize: '48'
  },
  {
    id: 'p11',
    name: 'Ribbed Silk-Cashmere Turtleneck',
    brand: 'Arc',
    price: 160,
    originalPrice: null,
    image: 'assets/images/products/plp_turtleneck.png',
    gallery: [
      'assets/images/products/plp_turtleneck.png',
      'assets/images/products/hero_sweater.png',
      'assets/images/lifestyle/hero_sweater_landscape.jpg'
    ],
    category: 'Apparel',
    categoryLabel: 'Clothing',
    boughtCount: 3,
    avgIntervalDays: 60,
    daysSinceLast: 57,
    suggestedQty: 1,
    inStock: false,
    reason: 'Purchased 3× · Silk-cashmere knit',
    materials: '70% Mongolian Cashmere, 30% Mulberry Silk',
    origin: 'Knit in Umbria, Italy',
    care: 'Hand wash cold or gentle dry clean',
    variants: {
      finishes: [
        { id: 'cream', name: 'Silk Cream', color: '#FEF9C3', priceDelta: 0 },
        { id: 'espresso', name: 'Dark Espresso', color: '#3B1E08', priceDelta: 0 }
      ],
      sizes: [
        { id: 'S', name: 'S', inStock: false },
        { id: 'M', name: 'M', inStock: false, default: true },
        { id: 'L', name: 'L', inStock: false }
      ]
    },
    selectedFinish: 'cream',
    selectedSize: 'M'
  },
  {
    id: 'p12',
    name: 'Japanese Selvedge Denim Jeans',
    brand: 'Arc',
    price: 190,
    originalPrice: 215,
    image: 'assets/images/products/hero_jeans_rack.png',
    gallery: [
      'assets/images/products/hero_jeans_rack.png',
      'assets/images/products/prod_runner.png',
      'assets/images/lifestyle/hero_sweater_landscape.jpg'
    ],
    category: 'Apparel',
    categoryLabel: 'Clothing',
    boughtCount: 3,
    avgIntervalDays: 90,
    daysSinceLast: 84,
    suggestedQty: 1,
    inStock: true,
    reason: 'Purchased 3× · Raw denim essential',
    materials: '13.5oz Kuroki Mills Raw Indigo Selvedge Denim',
    origin: 'Woven & sewn in Okayama, Japan',
    care: 'Soak inside out in cold water, hang dry',
    variants: {
      finishes: [
        { id: 'raw_indigo', name: 'Raw Indigo', color: '#172554', priceDelta: 0 },
        { id: 'washed_black', name: 'Faded Black', color: '#27272A', priceDelta: 10 }
      ],
      sizes: [
        { id: '30', name: '30', inStock: true },
        { id: '31', name: '31', inStock: true },
        { id: '32', name: '32', inStock: true, default: true },
        { id: '33', name: '33', inStock: true },
        { id: '34', name: '34', inStock: false }
      ]
    },
    selectedFinish: 'raw_indigo',
    selectedSize: '32'
  }
];

/* ─── Centralized SmartListStore State Controller ────────────────────────── */
class SmartListStore {
  constructor(initialItems) {
    this.items = new Map(initialItems.map(item => [item.id, { ...item }]));
    this.selectedIds = new Set();
    this.activeFilter = 'all';
    this.quickLookId = null;
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(event) {
    this.listeners.forEach(fn => fn(event, this));
  }

  getItem(id) {
    return this.items.get(id) || null;
  }

  toggleSelect(id) {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
    this.notify({ type: 'SELECTION_CHANGE', id, selected: this.selectedIds.has(id) });
  }

  selectAll() {
    const visible = this.getVisibleItems();
    visible.forEach(item => {
      if (item.inStock) this.selectedIds.add(item.id);
    });
    this.notify({ type: 'SELECTION_CHANGE' });
  }

  deselectAll() {
    this.selectedIds.clear();
    this.notify({ type: 'SELECTION_CHANGE' });
  }

  setVariant(id, { finishId, sizeId }) {
    const item = this.items.get(id);
    if (!item) return;
    if (finishId) item.selectedFinish = finishId;
    if (sizeId) item.selectedSize = sizeId;
    this.notify({ type: 'VARIANT_CHANGE', id, item });
  }

  getItemPrice(id) {
    const item = this.items.get(id);
    if (!item) return 0;
    const finish = item.variants?.finishes?.find(f => f.id === item.selectedFinish);
    const delta = finish ? (finish.priceDelta || 0) : 0;
    return item.price + delta;
  }

  isSizeInStock(id, sizeId) {
    const item = this.items.get(id);
    if (!item || !item.inStock) return false;
    const size = item.variants?.sizes?.find(s => s.id === sizeId);
    return size ? size.inStock !== false : true;
  }

  getAggregateMetrics() {
    let totalCount = 0;
    let totalValue = 0;
    let selectedCount = 0;
    let selectedValue = 0;
    const selectedItems = [];

    const visibleItems = this.getVisibleItems();
    visibleItems.forEach(item => {
      const price = this.getItemPrice(item.id);
      const qty = (typeof getQty === 'function' ? getQty(item.id) : item.suggestedQty) || 1;
      if (item.inStock) {
        totalCount++;
        totalValue += price * qty;
      }
      if (this.selectedIds.has(item.id)) {
        selectedCount++;
        selectedValue += price * qty;
        selectedItems.push({ ...item, price });
      }
    });

    return {
      // Normalized shape for updateBatchDock
      count: selectedCount,
      subtotal: selectedValue,
      items: selectedItems,
      // Full metrics
      totalCount,
      totalValue,
      selectedCount,
      selectedValue
    };
  }

  getVisibleItems() {
    return Array.from(this.items.values()).filter(item => {
      if (isDismissed(item.id)) return false;
      if (this.activeFilter === 'all') return true;
      return item.category.toLowerCase() === this.activeFilter.toLowerCase();
    });
  }

  openQuickLook(id) {
    this.quickLookId = id;
    this.notify({ type: 'QUICK_LOOK_OPEN', id });
  }

  closeQuickLook() {
    const prevId = this.quickLookId;
    this.quickLookId = null;
    this.notify({ type: 'QUICK_LOOK_CLOSE', prevId });
  }
}

// Global store instance attached to window
window.smartListStore = new SmartListStore(SL_PRODUCTS);


/* ─── Curated Look Switcher Data & State ───────────────────────────────────── */
const CURATED_REPLENISHMENT_LOOKS = [
  {
    index: 0,
    key: 'apparel',
    tabLabel: '01 KNITWEAR',
    eyebrow: 'RECOMMENDED LOOK · 01 OF 04',
    seasonBadge: 'WINTER COLLECTION · AW26',
    title: 'The Winter Tailoring Collection',
    desc: 'Double-faced wool overcoats and structured cashmere layers designed for the colder months.',
    targetCategory: 'Apparel',
    image: 'assets/images/lifestyle/hero_sweater_landscape.jpg',
    featuredProductId: 'p1',
    featuredProductThumb: 'assets/images/products/hero_sweater.png',
    featuredProductTag: 'FEATURED ITEM',
    featuredProductTitle: 'Pure Cashmere Sweater',
    featuredProductPrice: '€ 185.00'
  },
  {
    index: 1,
    key: 'acoustics',
    tabLabel: '02 AUDIO',
    eyebrow: 'AUDIO & SOUND · 02 OF 04',
    seasonBadge: 'STUDIO SOUND · 2026',
    title: 'Acoustic Precision & Studio Sound',
    desc: 'Studio-grade planar magnetic drivers and active noise isolation for focused listening.',
    targetCategory: 'Acoustics',
    image: 'assets/images/lifestyle/hero_headphone_landscape.jpg',
    featuredProductId: 'p4',
    featuredProductThumb: 'assets/images/products/prod_headphones.png',
    featuredProductTag: 'STUDIO AUDIO',
    featuredProductTitle: 'Planar Magnetic Studio Headphones',
    featuredProductPrice: '€ 220.00'
  },
  {
    index: 2,
    key: 'footwear',
    tabLabel: '03 FOOTWEAR',
    eyebrow: 'FOOTWEAR · 03 OF 04',
    seasonBadge: 'HANDCRAFTED · 2026',
    title: 'Handcrafted Nappa Leather Sneakers',
    desc: 'Full-grain Italian calfskin handcrafted on ergonomic soles for enduring daily comfort.',
    targetCategory: 'Footwear',
    image: 'assets/images/lifestyle/hero_runner_landscape.jpg',
    featuredProductId: 'p5',
    featuredProductThumb: 'assets/images/products/prod_runner.png',
    featuredProductTag: 'LEATHER SNEAKERS',
    featuredProductTitle: 'Minimalist Leather Runner',
    featuredProductPrice: '€ 185.00'
  },
  {
    index: 3,
    key: 'timepieces',
    tabLabel: '04 WATCHES',
    eyebrow: 'WATCHES · 04 OF 04',
    seasonBadge: 'AUTOMATIC SERIES',
    title: 'Obsidian Automatic Timepieces',
    desc: 'DLC-coated stainless steel timepieces engineered with automatic mechanical movements.',
    targetCategory: 'Timepieces',
    image: 'assets/images/lifestyle/hero_watch_landscape.jpg',
    featuredProductId: 'p9',
    featuredProductThumb: 'assets/images/products/search_watch.png',
    featuredProductTag: 'PREMIUM WATCH',
    featuredProductTitle: 'Obsidian Automatic Timepiece',
    featuredProductPrice: '€ 340.00'
  }
];

let activeLookIndex = 0;
let isLookPaused = false;
let lookTimerRaf = null;
let lookStartTime = null;
let lookElapsed = 0;
let lookSwitcherInitialized = false;
let lookTransitionToken = 0;
const LOOK_ROTATION_MS = 6500;

/* ─── Custom Intervals Management ─────────────────────────────────────────── */
function getCustomIntervals() {
  try { return JSON.parse(localStorage.getItem(SL_KEYS.intervals) || '{}'); }
  catch { return {}; }
}
function setCustomInterval(id, days) {
  const map = getCustomIntervals();
  map[id] = days;
  try { localStorage.setItem(SL_KEYS.intervals, JSON.stringify(map)); } catch {}
}
function getEffectiveInterval(product) {
  const map = getCustomIntervals();
  return map[product.id] || product.avgIntervalDays;
}
function getCadenceLabel(days) {
  if (days <= 30) return 'Monthly (30 Days)';
  if (days <= 60) return 'Bi-Monthly (60 Days)';
  if (days <= 90) return 'Quarterly (90 Days)';
  if (days <= 120) return 'Tri-Annual (120 Days)';
  return 'Seasonal (180 Days)';
}

/* ─── Scoring Algorithm ───────────────────────────────────────────────────── */
function scoreAndSort(products) {
  return products
    .map(p => {
      const interval = getEffectiveInterval(p);
      const recency = p.daysSinceLast / interval;
      return {
        ...p,
        _interval: interval,
        _recency: recency,
        _rank: (p.boughtCount * 0.4) + (recency * 0.6)
      };
    })
    .sort((a, b) => b._rank - a._rank);
}

/* ─── Dismiss Persistence ─────────────────────────────────────────────────── */
function getDismissed() {
  try { return JSON.parse(localStorage.getItem(SL_KEYS.dismissed) || '{}'); }
  catch { return {}; }
}
function saveDismissed(map) {
  try { localStorage.setItem(SL_KEYS.dismissed, JSON.stringify(map)); } catch {}
}
function dismissItem(id) {
  const map = getDismissed();
  const expires = new Date();
  expires.setDate(expires.getDate() + 60);
  map[id] = expires.toISOString();
  saveDismissed(map);
}
function undismissItem(id) {
  const map = getDismissed();
  delete map[id];
  saveDismissed(map);
}
function isDismissed(id) {
  const map = getDismissed();
  if (!map[id]) return false;
  if (new Date(map[id]) < new Date()) {
    delete map[id]; saveDismissed(map); return false;
  }
  return true;
}

/* ─── Feature Gate ────────────────────────────────────────────────────────── */
function getSmartList({ max = 20, category = 'all' } = {}) {
  const enabled  = localStorage.getItem(SL_KEYS.enabled);
  const optedOut = localStorage.getItem(SL_KEYS.optout);
  if (enabled === 'false' || optedOut === 'true') return null;

  let filtered = SL_PRODUCTS.filter(p => !isDismissed(p.id));
  if (category !== 'all') {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  const ranked = scoreAndSort(filtered);
  return ranked.slice(0, max);
}

/* ─── Total Valuation Calculator ─────────────────────────────────────────── */
function calculateCurationValuation(products) {
  return products.reduce((sum, p) => {
    if (!p.inStock) return sum;
    const qty = getQty(p.id);
    return sum + (p.price * qty);
  }, 0);
}

/* ─── Cart Integration ────────────────────────────────────────────────────── */
function addToCart(product, qty) {
  if (typeof CartState !== 'undefined') {
    CartState.addItem({ 
      id: product.id, 
      name: product.name, 
      price: product.price, 
      image: resolveImgPath(product.image), 
      category: product.category 
    }, qty);
    return true;
  }
  if (window.nexCart) {
    window.nexCart.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: resolveImgPath(product.image),
      quantity: qty
    });
    return true;
  }
  return false;
}

/* ─── Ripple Factory (Motion Standard ①) ─────────────────────────────────── */
function attachRipple(btn) {
  if (!btn) return;
  const rect   = btn.getBoundingClientRect();
  const size   = Math.max(rect.width, rect.height) * 2;
  const x      = (rect.width / 2) - size / 2;
  const y      = (rect.height / 2) - size / 2;
  const ripple = document.createElement('span');
  ripple.className = 'sl-ripple';
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
  btn.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
}

/* ─── Qty Stepper Micro-pulse (Motion Standard ①) ────────────────────────── */
function pulseStepper(display) {
  if (!display) return;
  display.style.transform = 'scale(0.82)';
  display.style.transition = 'transform 90ms cubic-bezier(0.34, 1.56, 0.64, 1)';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      display.style.transform = 'scale(1)';
    });
  });
}

/* ─── 120fps Look Switcher & Animation Track Controller ───────────────────── */
function updateProgressBar(progress) {
  const bar = document.getElementById('slSpotlightProgressBar');
  if (bar) {
    bar.style.transform = `scaleX(${Math.max(0, Math.min(1, progress)).toFixed(4)})`;
  }
}

function tickLookTimer(now) {
  if (!lookStartTime) lookStartTime = now - lookElapsed;
  lookElapsed = now - lookStartTime;
  const progress = lookElapsed / LOOK_ROTATION_MS;

  updateProgressBar(progress);

  if (progress >= 1) {
    updateProgressBar(1);
    lookStartTime = null;
    lookElapsed = 0;
    const nextIndex = (activeLookIndex + 1) % CURATED_REPLENISHMENT_LOOKS.length;
    setCuratedLook(nextIndex, false);
    return;
  }

  lookTimerRaf = requestAnimationFrame(tickLookTimer);
}

// Starts a fresh rotation cycle (elapsed = 0). Does not run the rAF loop
// while paused — pauseLookTimer()/resumeLookTimer() own that transition so
// the elapsed clock never counts wall-clock time spent paused.
function startLookTimer() {
  if (lookTimerRaf) cancelAnimationFrame(lookTimerRaf);
  lookTimerRaf = null;
  lookStartTime = null;
  lookElapsed = 0;
  updateProgressBar(0);
  if (!isLookPaused) {
    lookStartTime = performance.now();
    lookTimerRaf = requestAnimationFrame(tickLookTimer);
  }
}

// Stops the rAF loop entirely so no time accrues while paused.
function pauseLookTimer() {
  if (isLookPaused) return;
  isLookPaused = true;
  if (lookTimerRaf) { cancelAnimationFrame(lookTimerRaf); lookTimerRaf = null; }
}

// Re-anchors lookStartTime against the current clock before resuming, so the
// paused duration is never counted as rotation progress.
function resumeLookTimer() {
  if (!isLookPaused) return;
  isLookPaused = false;
  lookStartTime = performance.now() - lookElapsed;
  lookTimerRaf = requestAnimationFrame(tickLookTimer);
}

function setCuratedLook(index, userInitiated = true) {
  activeLookIndex = index;
  const look = CURATED_REPLENISHMENT_LOOKS[index];
  if (!look) return;

  // Update tabs active state
  const tabs = document.querySelectorAll('#slSpotlightTabs .spotlight-tab-btn');
  tabs.forEach((tab, i) => {
    const isActive = i === index;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    tab.tabIndex = isActive ? 0 : -1;
  });

  // Update Look Content
  const eyebrowEl   = document.getElementById('slSpotlightLookEyebrow');
  const badgeEl     = document.getElementById('slSpotlightSeasonBadge');
  const titleEl     = document.getElementById('slSpotlightCapsuleTitle');
  const descEl      = document.getElementById('slSpotlightCapsuleDesc');
  const counterEl   = document.getElementById('slSpotlightPieceCount');
  const filterSync  = document.getElementById('slSpotlightSyncFilterBtn');

  if (eyebrowEl) eyebrowEl.textContent = look.eyebrow;
  if (badgeEl)   badgeEl.textContent   = look.seasonBadge;
  if (titleEl)   titleEl.textContent   = look.title;
  if (descEl)    descEl.textContent    = look.desc;

  if (filterSync) {
    filterSync.setAttribute('data-target-category', look.targetCategory);
  }

  // Count matching replenishment pieces
  const allAvailable = getSmartList({ max: 20, category: 'all' }) || [];
  const matchCount = allAvailable.filter(p => p.category.toLowerCase() === look.targetCategory.toLowerCase()).length;
  if (counterEl) {
    counterEl.textContent = `${matchCount} Matching Piece${matchCount === 1 ? '' : 's'}`;
  }

  // Update Visual Image Frame with smooth cross-dissolve. Guarded with a
  // transition token: if setCuratedLook() is called again (e.g. rapid tab
  // clicks, or an auto-rotation tick landing inside another look's 120ms
  // swap window) before this timeout fires, its callback is now stale and
  // must no-op instead of overwriting the newer look's text with this
  // look's image.
  const featuredImg = document.getElementById('slSpotlightFeaturedImg');
  if (featuredImg) {
    const transitionToken = ++lookTransitionToken;
    featuredImg.style.opacity = '0';
    featuredImg.style.transform = 'scale(1.02)';
    setTimeout(() => {
      if (transitionToken !== lookTransitionToken) return;
      featuredImg.src = resolveImgPath(look.image);
      featuredImg.alt = look.title;
      featuredImg.style.opacity = '1';
      featuredImg.style.transform = 'scale(1)';
    }, 120);
  }

  // Update Shoppable Look Capsule
  const pill       = document.getElementById('slSpotlightShoppablePill');
  const pillThumb  = document.getElementById('slSpotlightPillThumb');
  const pillTag    = document.getElementById('slSpotlightPillTag');
  const pillTitle  = document.getElementById('slSpotlightPillTitle');
  const pillPrice  = document.getElementById('slSpotlightPillPrice');
  const quickAddBtn = document.getElementById('slSpotlightQuickAddBtn');

  if (pill)        pill.setAttribute('data-id', look.featuredProductId);
  if (pillThumb)   pillThumb.src = resolveImgPath(look.featuredProductThumb);
  if (pillTag)     pillTag.textContent = look.featuredProductTag;
  if (pillTitle)   pillTitle.textContent = look.featuredProductTitle;
  if (pillPrice)   pillPrice.textContent = look.featuredProductPrice;
  if (quickAddBtn) quickAddBtn.setAttribute('data-id', look.featuredProductId);

  if (window.lucide) window.lucide.createIcons();

  // Reset 120fps progress timer
  startLookTimer();
}

function initLookSwitcher() {
  const spotlightSection = document.getElementById('slSpotlightSection');
  if (!spotlightSection) return;

  // renderSmartListPage() re-runs this on every dismiss/undo/cadence-save,
  // but the spotlight DOM is static — guard so listeners bind exactly once
  // (otherwise every re-render stacks another click handler on the same
  // buttons, causing quick-add/filter-sync/tab clicks to fire N times).
  if (lookSwitcherInitialized) return;
  lookSwitcherInitialized = true;

  const tabsContainer = document.getElementById('slSpotlightTabs');
  if (tabsContainer) {
    tabsContainer.addEventListener('click', e => {
      const tab = e.target.closest('.spotlight-tab-btn');
      if (!tab) return;
      const lookIdx = parseInt(tab.getAttribute('data-look'), 10);
      if (!isNaN(lookIdx)) {
        setCuratedLook(lookIdx, true);
      }
    });

    // ARIA Tabs keyboard pattern: Arrow/Home/End move focus AND activate,
    // since inactive tabs carry tabIndex=-1 and are otherwise unreachable.
    tabsContainer.addEventListener('keydown', e => {
      const tabs = Array.from(tabsContainer.querySelectorAll('.spotlight-tab-btn'));
      const currentIndex = tabs.indexOf(document.activeElement);
      if (currentIndex === -1) return;

      let newIndex = null;
      if (e.key === 'ArrowRight') newIndex = (currentIndex + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') newIndex = 0;
      else if (e.key === 'End') newIndex = tabs.length - 1;
      else return;

      e.preventDefault();
      setCuratedLook(newIndex, true);
      tabs[newIndex].focus();
    });
  }

  // Pause toggle button
  const pauseBtn = document.getElementById('slSpotlightPauseToggleBtn');
  const pauseIcon = document.getElementById('slSpotlightPauseIcon');
  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      if (isLookPaused) resumeLookTimer(); else pauseLookTimer();
      pauseBtn.setAttribute('aria-pressed', isLookPaused ? 'true' : 'false');
      pauseBtn.setAttribute('aria-label', isLookPaused ? 'Resume automatic rotation' : 'Pause automatic rotation');
      if (pauseIcon) {
        pauseIcon.setAttribute('data-lucide', isLookPaused ? 'play' : 'pause');
        if (window.lucide) window.lucide.createIcons();
      }
    });
  }

  // Hover pause on visual frame or story pane
  spotlightSection.addEventListener('mouseenter', () => { pauseLookTimer(); });
  spotlightSection.addEventListener('mouseleave', () => {
    const isExplicitlyPaused = pauseBtn && pauseBtn.getAttribute('aria-pressed') === 'true';
    if (!isExplicitlyPaused) resumeLookTimer();
  });

  // Stop burning rAF/layout work while the spotlight is scrolled off-screen;
  // resume on return unless the user explicitly paused it.
  if ('IntersectionObserver' in window) {
    const spotlightVisibilityObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const isExplicitlyPaused = pauseBtn && pauseBtn.getAttribute('aria-pressed') === 'true';
          if (!isExplicitlyPaused) resumeLookTimer();
        } else {
          pauseLookTimer();
        }
      });
    }, { threshold: 0.1 });
    spotlightVisibilityObserver.observe(spotlightSection);
  }

  // Filter Sync Button Click
  const filterSyncBtn = document.getElementById('slSpotlightSyncFilterBtn');
  if (filterSyncBtn) {
    filterSyncBtn.addEventListener('click', () => {
      const targetCat = filterSyncBtn.getAttribute('data-target-category');
      if (targetCat) {
        applyCategoryFilter(targetCat);
      }
    });
  }

  // Shoppable Pill Quick Add
  const quickAddBtn = document.getElementById('slSpotlightQuickAddBtn');
  if (quickAddBtn) {
    quickAddBtn.addEventListener('click', () => {
      attachRipple(quickAddBtn);
      const prodId = quickAddBtn.getAttribute('data-id');
      const product = SL_PRODUCTS.find(p => p.id === prodId);
      if (product) {
        addToCart(product, 1);
        showToast(`${product.name} added to shopping bag`, 'success');
      }
    });
  }

  // Boot initial look
  setCuratedLook(0, false);
}

/* ─── Repurchase Cadence Customizer Modal ─────────────────────────────────── */
function openCadenceModal(productId) {
  const product = SL_PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const currentInterval = getEffectiveInterval(product);

  const existing = document.getElementById('slCadenceModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'slCadenceModal';
  modal.className = 'sl-cadence-overlay';
  modal.innerHTML = `
    <div class="sl-cadence-dialog" role="dialog" aria-modal="true" aria-labelledby="slCadenceTitle">
      <div class="sl-cadence-header">
        <div>
          <span class="sl-ai-chip" style="margin-bottom: 6px; font-size: 9px;">REORDER SCHEDULE</span>
          <h3 id="slCadenceTitle" style="font-family: 'Manrope', sans-serif; font-size: 18px; margin: 0; color: #FFFFFF; font-weight: 600;">
            Adjust Reorder Frequency
          </h3>
          <div style="font-size: 12px; color: var(--text-secondary, #94A3B8); margin-top: 4px;">${product.name}</div>
        </div>
        <button class="sl-cadence-close" id="slCadenceCloseBtn" aria-label="Close dialog">&times;</button>
      </div>

      <div class="sl-cadence-body">
        <p style="font-size: 12.5px; color: var(--text-secondary, #94A3B8); line-height: 1.5; margin: 0 0 16px;">
          Choose how often you would like to reorder this item. We will remind you when it is time for a refresh:
        </p>

        <div class="sl-cadence-options">
          <label class="sl-cadence-option ${currentInterval === 30 ? 'selected' : ''}">
            <input type="radio" name="slInterval" value="30" ${currentInterval === 30 ? 'checked' : ''} />
            <div class="sl-cadence-opt-text">
              <strong>Monthly</strong>
              <span>Every 30 days &middot; Frequent restock</span>
            </div>
            <i data-lucide="check" class="sl-cadence-check"></i>
          </label>

          <label class="sl-cadence-option ${currentInterval === 60 ? 'selected' : ''}">
            <input type="radio" name="slInterval" value="60" ${currentInterval === 60 ? 'checked' : ''} />
            <div class="sl-cadence-opt-text">
              <strong>Bi-Monthly</strong>
              <span>Every 60 days &middot; Most popular</span>
            </div>
            <i data-lucide="check" class="sl-cadence-check"></i>
          </label>

          <label class="sl-cadence-option ${currentInterval === 90 ? 'selected' : ''}">
            <input type="radio" name="slInterval" value="90" ${currentInterval === 90 ? 'checked' : ''} />
            <div class="sl-cadence-opt-text">
              <strong>Quarterly</strong>
              <span>Every 90 days &middot; Seasonal staple</span>
            </div>
            <i data-lucide="check" class="sl-cadence-check"></i>
          </label>

          <label class="sl-cadence-option ${currentInterval === 180 ? 'selected' : ''}">
            <input type="radio" name="slInterval" value="180" ${currentInterval === 180 ? 'checked' : ''} />
            <div class="sl-cadence-opt-text">
              <strong>Every 6 Months</strong>
              <span>Every 180 days &middot; Twice a year</span>
            </div>
            <i data-lucide="check" class="sl-cadence-check"></i>
          </label>
        </div>
      </div>

      <div class="sl-cadence-footer">
        <button class="sl-btn-cadence-cancel" id="slCadenceCancelBtn">Cancel</button>
        <button class="sl-btn-cadence-save" id="slCadenceSaveBtn">Save Schedule</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [modal] });

  modal.querySelectorAll('.sl-cadence-option').forEach(opt => {
    opt.addEventListener('click', () => {
      modal.querySelectorAll('.sl-cadence-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 250);
  };

  modal.querySelector('#slCadenceCloseBtn').addEventListener('click', closeModal);
  modal.querySelector('#slCadenceCancelBtn').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  modal.querySelector('#slCadenceSaveBtn').addEventListener('click', () => {
    const selected = modal.querySelector('input[name="slInterval"]:checked');
    if (selected) {
      const days = parseInt(selected.value, 10);
      setCustomInterval(product.id, days);
      closeModal();
      renderSmartListPage();
      showToast(`Reorder schedule for ${product.name} updated to every ${days} days`, 'success');
    }
  });

  requestAnimationFrame(() => modal.classList.add('active'));
}

/* ─── Interactive Undo Toast ──────────────────────────────────────────────── */
function showUndoToast(productName, onUndo) {
  const existing = document.querySelector('.sl-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'sl-toast sl-toast--undo';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <i data-lucide="trash-2" class="sl-toast-icon" style="color: var(--accent-pink, #FB7185);"></i>
      <span><strong>${productName}</strong> removed from list</span>
    </div>
    <button class="sl-toast-undo-btn" id="slToastUndoBtn">Undo</button>
  `;
  document.body.appendChild(toast);
  if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [toast] });

  const undoBtn = toast.querySelector('#slToastUndoBtn');
  let isHandled = false;

  undoBtn.addEventListener('click', () => {
    if (isHandled) return;
    isHandled = true;
    onUndo();
    toast.classList.remove('sl-toast--visible');
    setTimeout(() => toast.remove(), 250);
  });

  requestAnimationFrame(() => {
    toast.classList.add('sl-toast--visible');
  });

  setTimeout(() => {
    if (!isHandled) {
      toast.classList.remove('sl-toast--visible');
      setTimeout(() => toast.remove(), 350);
    }
  }, 5000);
}

/* ─── Standard Notification Toast ─────────────────────────────────────────── */
function showToast(msg, type = 'info') {
  const existing = document.querySelector('.sl-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `sl-toast sl-toast--${type}`;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.innerHTML = `
    <i data-lucide="${type === 'success' ? 'check-circle' : type === 'warn' ? 'alert-circle' : 'info'}" class="sl-toast-icon"></i>
    <span>${msg}</span>
  `;
  document.body.appendChild(toast);
  if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [toast] });

  requestAnimationFrame(() => {
    toast.classList.add('sl-toast--visible');
  });

  setTimeout(() => {
    toast.classList.remove('sl-toast--visible');
    setTimeout(() => toast.remove(), 350);
  }, 4000);
}

/* ─── Dismiss Animation ───────────────────────────────────────────────────── */
function animateDismiss(cardEl, onDone) {
  cardEl.style.transition = 'transform 320ms cubic-bezier(0.4, 0, 0.6, 1), opacity 280ms ease, max-height 320ms ease, margin 300ms ease, padding 300ms ease';
  cardEl.style.transformOrigin = 'top center';
  cardEl.style.overflow = 'hidden';
  cardEl.style.maxHeight = cardEl.offsetHeight + 'px';
  requestAnimationFrame(() => {
    cardEl.style.transform    = 'scaleY(0)';
    cardEl.style.opacity      = '0';
    cardEl.style.maxHeight    = '0';
    cardEl.style.marginTop    = '0';
    cardEl.style.marginBottom = '0';
    cardEl.style.paddingTop   = '0';
    cardEl.style.paddingBottom = '0';
    setTimeout(onDone, 340);
  });
}

/* ─── Card HTML Builder (Differential Parallax Depth + Clean Copy) ────────── */
function buildCardHTML(product, index = 0, isCompact = false) {
  const oos = !product.inStock;
  const hasSale = product.originalPrice && product.originalPrice > product.price;
  const priceStr = `€ ${Number(product.price).toFixed(2)}`;
  const origStr  = hasSale ? `€ ${Number(product.originalPrice).toFixed(2)}` : '';
  const resolvedImg = resolveImgPath(product.image);

  // Differential parallax depth: alternates across 4 columns (Motion Standard ④)
  const depthValues = [0.6, 1.15, 1.7, 0.85];
  const depth = depthValues[index % 4];

  if (isCompact) {
    return `
      <article class="sl-card sl-card--compact${oos ? ' sl-card--oos' : ''}" data-id="${product.id}" data-parallax-depth="${depth}" aria-label="${product.name}">
        <div class="sl-glare" aria-hidden="true"></div>
        <div class="sl-card-img-wrap">
          <img src="${resolvedImg}" alt="${product.name}" class="sl-card-img" loading="lazy" />
          ${oos ? '<div class="sl-oos-badge">Unavailable</div>' : ''}
        </div>
        <div class="sl-card-body">
          <span class="sl-reason-chip">${product.reason}</span>
          <div class="sl-card-brand">${product.brand}</div>
          <div class="sl-card-name">${product.name}</div>
          <div class="sl-card-price tabular-nums">
            ${priceStr}
            ${hasSale ? `<span class="sl-orig-price">${origStr}</span>` : ''}
          </div>
          ${hasSale ? `<div class="sl-omnibus-prior-price" style="font-size: 9.5px; color: var(--text-secondary); margin-top: 1px;">Lowest in 30d: ${origStr}</div>` : ''}
          <button class="sl-btn-add${oos ? ' sl-btn-add--disabled' : ''}" data-id="${product.id}" ${oos ? 'disabled aria-disabled="true"' : ''}>
            <span class="sl-btn-add-inner">${oos ? 'Out of Stock' : 'Add to Bag'}</span>
          </button>
        </div>
      </article>
    `;
  }

  // Full luxury atelier card with interactive cadence trigger & zero paragraph clutter
  const isSelected = window.smartListStore?.selectedIds?.has(product.id) || false;
  const selectRingHTML = !oos
    ? `<button type="button" class="sl-card-select-btn${isSelected ? ' selected' : ''}" data-action="toggle-select" data-id="${product.id}" role="checkbox" aria-checked="${isSelected}" aria-label="Select ${product.name} for batch actions">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </button>`
    : '';

  const quickAddOverlayHTML = !oos
    ? `<div class="sl-quick-add-overlay">
        <button class="sl-btn-quick-add-slide" data-action="quick-add" data-id="${product.id}" aria-label="Add ${product.name} to bag">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          ADD TO BAG
        </button>
      </div>`
    : '';

  // Finish Swatches HTML
  const finishes = product.variants?.finishes || [];
  const selectedFinish = product.selectedFinish || (finishes[0]?.id);
  const swatchesHTML = finishes.length > 1
    ? `<div class="sl-swatches-strip" role="radiogroup" aria-label="Finish choices for ${product.name}">
        ${finishes.map(f => `
          <button type="button" class="sl-swatch-dot${f.id === selectedFinish ? ' active' : ''}" 
                  data-action="select-finish" data-product-id="${product.id}" data-finish-id="${f.id}" 
                  style="background: ${f.color};" title="${f.name}${f.priceDelta ? ' (+€' + f.priceDelta + ')' : ''}" 
                  aria-label="${f.name}" role="radio" aria-checked="${f.id === selectedFinish}">
          </button>
        `).join('')}
      </div>`
    : '';

  // Size Micro-Pills HTML
  const sizes = product.variants?.sizes || [];
  const selectedSize = product.selectedSize || (sizes[0]?.id);
  const sizesHTML = sizes.length > 1
    ? `<div class="sl-sizes-strip" role="radiogroup" aria-label="Size options for ${product.name}">
        ${sizes.map(s => `
          <button type="button" class="sl-size-btn${s.id === selectedSize ? ' active' : ''}" 
                  data-action="select-size" data-product-id="${product.id}" data-size-id="${s.id}"
                  ${s.inStock === false ? 'disabled' : ''} 
                  aria-label="Size ${s.name}${s.inStock === false ? ' (Out of stock)' : ''}" role="radio" aria-checked="${s.id === selectedSize}">
            ${s.name}
          </button>
        `).join('')}
      </div>`
    : '';

  const isSizeOOS = window.smartListStore && !window.smartListStore.isSizeInStock(product.id, selectedSize);
  const effectiveOOS = oos || isSizeOOS;
  const stockBeaconHTML = effectiveOOS
    ? `<span class="sl-stock-beacon"><span class="sl-stock-dot sold-out"></span>Sold Out</span>`
    : `<span class="sl-stock-beacon"><span class="sl-stock-dot"></span>In Stock</span>`;

  return `
    <article class="sl-card${effectiveOOS ? ' sl-card--oos' : ''}${isSelected ? ' is-selected' : ''}" data-id="${product.id}" data-category="${product.category}" data-parallax-depth="${depth}" role="listitem" aria-label="${product.name}">
      <div class="sl-glare" aria-hidden="true"></div>
      ${selectRingHTML}
      <button class="sl-dismiss-btn" data-dismiss="${product.id}" aria-label="Remove ${product.name} from list" title="Remove from list">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <div class="sl-card-img-wrap">
        <a href="product.html?id=${product.id}" class="sl-card-img-link" aria-label="View ${product.name}">
          <img src="${resolvedImg}" alt="${product.name}" class="sl-card-img" loading="lazy" />
        </a>
        <button type="button" class="sl-card-quick-look-btn" data-action="quick-look" data-id="${product.id}" aria-label="Quick look for ${product.name}" title="Quick Look">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
        ${effectiveOOS ? '<div class="sl-oos-badge">Out of Stock</div>' : ''}
        ${hasSale ? '<div class="sl-sale-badge">Special Offer</div>' : ''}
        ${quickAddOverlayHTML}
      </div>
      <div class="sl-card-body">
        
        <!-- Interactive Reorder Frequency / Reason Pill -->
        <button class="sl-reason-chip sl-reason-chip--interactive" data-cadence-trigger="${product.id}" title="Click to adjust reorder schedule">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
          <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: inline-block; max-width: 200px;">${product.reason}</span>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-left: 2px; opacity: 0.6;"><path d="m6 9 6 6 6-6"/></svg>
        </button>

        <div class="sl-card-brand">${product.brand} &middot; ${product.categoryLabel || product.category}</div>
        <a href="product.html?id=${product.id}" class="sl-card-title-link" style="text-decoration: none; color: inherit;">
          <div class="sl-card-name">${product.name}</div>
        </a>
        <div class="sl-card-price tabular-nums">
          ${priceStr}
          ${hasSale ? `<span class="sl-orig-price">${origStr}</span>` : ''}
        </div>
        ${hasSale ? `<div class="sl-omnibus-prior-price" style="font-size: 9.5px; color: var(--text-secondary); margin-top: 1px; letter-spacing: 0.02em;">Lowest price in last 30 days: ${origStr}</div>` : ''}

        <!-- Tactile Variants Row -->
        <div class="sl-card-variants-row">
          ${swatchesHTML}
          ${sizesHTML || stockBeaconHTML}
        </div>

        <!-- Unified Horizontal Action Row -->
        <div class="sl-action-row">
          <div class="sl-stepper" role="group" aria-label="Quantity for ${product.name}">
            <button class="sl-stepper-btn sl-stepper-dec" data-id="${product.id}" aria-label="Decrease quantity">−</button>
            <span class="sl-stepper-val" data-qty="${product.id}" aria-live="polite">${getQty(product.id)}</span>
            <button class="sl-stepper-btn sl-stepper-inc" data-id="${product.id}" aria-label="Increase quantity">+</button>
          </div>
          <button class="sl-btn-add${effectiveOOS ? ' sl-btn-add--disabled' : ''}" data-id="${product.id}" ${effectiveOOS ? 'disabled aria-disabled="true"' : ''}>
            <span class="sl-btn-add-inner">${effectiveOOS ? 'Out of Stock' : 'Add to Bag'}</span>
          </button>
        </div>
      </div>
    </article>
  `;
}

/* ─── Qty State Map ───────────────────────────────────────────────────────── */
const qtyMap = {};

function getQty(id) {
  return qtyMap[id] ?? (SL_PRODUCTS.find(p => p.id === id)?.suggestedQty ?? 1);
}
function setQty(id, val) {
  qtyMap[id] = Math.max(1, Math.min(10, val));
}

/* ─── Card Event Delegation ───────────────────────────────────────────────── */
function bindCardEvents(container) {
  // Delegated listener lives on the container, which persists across
  // renderSmartListPage() re-renders (only grid.innerHTML changes) — guard
  // so re-renders don't stack duplicate delegated listeners on it.
  if (container._slEventsBound) return;
  container._slEventsBound = true;

  container.addEventListener('click', e => {
    const quickLookBtn = e.target.closest('[data-action="quick-look"]');
    const selectBtn    = e.target.closest('[data-action="toggle-select"]');
    const finishBtn    = e.target.closest('[data-action="select-finish"]');
    const sizeBtn      = e.target.closest('[data-action="select-size"]');
    const quickAddBtn  = e.target.closest('[data-action="quick-add"]');
    const cadenceBtn   = e.target.closest('[data-cadence-trigger]');
    const dismissBtn   = e.target.closest('[data-dismiss]');
    const addBtn       = e.target.closest('.sl-btn-add:not(.sl-btn-add--disabled)');
    const decBtn       = e.target.closest('.sl-stepper-dec');
    const incBtn       = e.target.closest('.sl-stepper-inc');

    if (quickLookBtn) {
      const id = quickLookBtn.dataset.id;
      if (window.smartListStore) {
        window.smartListStore.openQuickLook(id);
      }
      return;
    }

    if (selectBtn) {
      const id = selectBtn.dataset.id;
      if (window.smartListStore) {
        window.smartListStore.toggleSelect(id);
      }
      return;
    }

    if (finishBtn) {
      const pid = finishBtn.dataset.productId;
      const fid = finishBtn.dataset.finishId;
      if (window.smartListStore) {
        window.smartListStore.setVariant(pid, { finishId: fid });
      }
      return;
    }

    if (sizeBtn) {
      const pid = sizeBtn.dataset.productId;
      const sid = sizeBtn.dataset.sizeId;
      if (window.smartListStore) {
        window.smartListStore.setVariant(pid, { sizeId: sid });
      }
      return;
    }

    if (quickAddBtn) {
      attachRipple(quickAddBtn);
      const id = quickAddBtn.dataset.id;
      const product = SL_PRODUCTS.find(p => p.id === id);
      if (product && product.inStock) {
        addToCart(product, getQty(id));
        showToast(`${product.name} added to bag`, 'success');
      }
      return;
    }

    if (cadenceBtn) {
      const id = cadenceBtn.dataset.cadenceTrigger;
      openCadenceModal(id);
      return;
    }

    if (dismissBtn) {
      const id      = dismissBtn.dataset.dismiss;
      const card    = container.querySelector(`.sl-card[data-id="${id}"]`);
      const product = SL_PRODUCTS.find(p => p.id === id);
      if (!card || !product) return;

      dismissItem(id);
      animateDismiss(card, () => {
        card.remove();
        updateListStats();

        // 5-Second Undo Toast
        showUndoToast(product.name, () => {
          undismissItem(id);
          renderSmartListPage();
          showToast(`${product.name} restored to curation`, 'info');
        });
      });
      return;
    }

    if (addBtn) {
      attachRipple(addBtn);
      const id      = addBtn.dataset.id;
      const product = SL_PRODUCTS.find(p => p.id === id);
      if (!product) return;
      const qty = getQty(id);
      const added = addToCart(product, qty);
      if (added) {
        showToast(`${product.name} added to bag`, 'success');
        addBtn.querySelector('.sl-btn-add-inner').textContent = 'Added ✓';
        addBtn.classList.add('sl-btn-add--done');
        setTimeout(() => {
          if (addBtn.isConnected) {
            addBtn.querySelector('.sl-btn-add-inner').textContent = 'Move to Bag';
            addBtn.classList.remove('sl-btn-add--done');
          }
        }, 2200);
      }
      return;
    }

    if (decBtn || incBtn) {
      const id      = (decBtn || incBtn).dataset.id;
      const display = container.querySelector(`.sl-stepper-val[data-qty="${id}"]`);
      if (!display) return;
      const cur = getQty(id);
      setQty(id, cur + (decBtn ? -1 : 1));
      display.textContent = getQty(id);
      pulseStepper(display);
      updateListStats();
    }
  });
}

/* ─── List Stats Update ───────────────────────────────────────────────────── */
function updateListStats() {
  const countEl = document.getElementById('slItemCount');
  const valEl   = document.getElementById('slValuationDisplay');
  const empty   = document.getElementById('slEmptyState');
  const grid    = document.getElementById('slGrid');
  const addAllBtn = document.getElementById('slAddAll');

  const visibleList = getSmartList({ max: 20, category: activeCategoryFilter }) || [];

  if (visibleList.length === 0) {
    if (grid) grid.style.display = 'none';
    if (empty) empty.style.display = 'flex';
  } else {
    if (grid) grid.style.display = 'grid';
    if (empty) empty.style.display = 'none';
  }

  // Stats and the "Move All to Bag" action are scoped to the active filter
  // so the toolbar always reflects what's actually visible/actionable.
  if (countEl) countEl.textContent = visibleList.length;

  if (valEl) {
    const total = calculateCurationValuation(visibleList);
    valEl.textContent = `€ ${Number(total).toFixed(2)}`;
  }

  if (addAllBtn && !addAllBtn.disabled) {
    const span = addAllBtn.querySelector('span');
    if (span) span.textContent = activeCategoryFilter === 'all' ? 'Add All to Bag' : 'Add Filtered to Bag';
  }

  // Update Select All Toggle button in toolbar
  updateSelectAllBtn();
}

/* ─── Select All Button Controller ────────────────────────────────────────── */
function updateSelectAllBtn() {
  const btn = document.getElementById('btnSelectAllToggle');
  const label = document.getElementById('selectAllToggleLabel');
  const icon = btn?.querySelector('.sl-select-toggle-icon');
  if (!btn || !window.smartListStore) return;

  const visible = window.smartListStore.getVisibleItems().filter(p => p.inStock);
  const selectedVisible = visible.filter(p => window.smartListStore.selectedIds.has(p.id));
  const isAllSelected = visible.length > 0 && selectedVisible.length === visible.length;

  btn.classList.toggle('active', isAllSelected);
  btn.setAttribute('aria-pressed', isAllSelected ? 'true' : 'false');
  if (label) label.textContent = isAllSelected ? 'Deselect All' : `Select All (${visible.length})`;
  if (icon) icon.textContent = isAllSelected ? '✕' : '◯';
}

function initSelectAllBtn() {
  const btn = document.getElementById('btnSelectAllToggle');
  if (!btn || btn._hasSelectBound) return;
  btn._hasSelectBound = true;

  btn.addEventListener('click', () => {
    if (!window.smartListStore) return;
    const visible = window.smartListStore.getVisibleItems().filter(p => p.inStock);
    const selectedVisible = visible.filter(p => window.smartListStore.selectedIds.has(p.id));
    const isAllSelected = visible.length > 0 && selectedVisible.length === visible.length;

    if (isAllSelected) {
      window.smartListStore.deselectAll();
    } else {
      window.smartListStore.selectAll();
    }
  });
}

// Subscribe to store selection & variant events to update card states without rebuilding DOM
if (window.smartListStore) {
  window.smartListStore.subscribe((event) => {
    if (event.type === 'SELECTION_CHANGE') {
      const grid = document.getElementById('slGrid');
      if (grid) {
        grid.querySelectorAll('.sl-card').forEach(card => {
          const id = card.dataset.id;
          const isSel = window.smartListStore.selectedIds.has(id);
          card.classList.toggle('is-selected', isSel);
          const selBtn = card.querySelector('.sl-card-select-btn');
          if (selBtn) {
            selBtn.classList.toggle('selected', isSel);
            selBtn.setAttribute('aria-checked', isSel ? 'true' : 'false');
          }
        });
      }
      updateSelectAllBtn();
      updateBatchDock();
    }

    if (event.type === 'VARIANT_CHANGE') {
      const pid = event.id;
      const card = document.querySelector(`.sl-card[data-id="${pid}"]`);
      if (card && window.smartListStore) {
        const item = window.smartListStore.getItem(pid);
        if (item) {
          const price = window.smartListStore.getItemPrice(pid);
          const priceEl = card.querySelector('.sl-card-price');
          if (priceEl) {
            priceEl.innerHTML = `€ ${Number(price).toFixed(2)}${item.originalPrice ? `<span class="sl-orig-price">€ ${Number(item.originalPrice).toFixed(2)}</span>` : ''}`;
          }
          // Update finish swatches active state
          card.querySelectorAll('.sl-swatch-dot').forEach(s => {
            const isActive = s.dataset.finishId === item.selectedFinish;
            s.classList.toggle('active', isActive);
            s.setAttribute('aria-checked', isActive ? 'true' : 'false');
          });
          // Update size buttons active state
          card.querySelectorAll('.sl-size-btn').forEach(s => {
            const isActive = s.dataset.sizeId === item.selectedSize;
            s.classList.toggle('active', isActive);
            s.setAttribute('aria-checked', isActive ? 'true' : 'false');
          });
          // Update stock status & Add button
          const isSizeOOS = !window.smartListStore.isSizeInStock(pid, item.selectedSize);
          const effectiveOOS = !item.inStock || isSizeOOS;
          card.classList.toggle('sl-card--oos', effectiveOOS);
          const addBtn = card.querySelector('.sl-btn-add');
          if (addBtn) {
            addBtn.disabled = effectiveOOS;
            addBtn.classList.toggle('sl-btn-add--disabled', effectiveOOS);
            addBtn.querySelector('.sl-btn-add-inner').textContent = effectiveOOS ? 'Out of Stock' : 'Add to Bag';
          }
        }
      }
      updateListStats();
      updateBatchDock();
    }

    if (event.type === 'QUICK_LOOK_OPEN') {
      updateQuickLookDrawer(event.id);
    }

    if (event.type === 'QUICK_LOOK_CLOSE') {
      updateQuickLookDrawer(null);
    }
  });
}

/* ─── Modernist Quick Look Slide-Over Drawer Controller ───────────────────── */
let quickLookCurrentQty = 1;

function initQuickLookDrawer() {
  const drawer = document.getElementById('slQuickLookDrawer');
  const backdrop = document.getElementById('slQuickLookBackdrop');
  const closeBtn = document.getElementById('slDrawerCloseBtn');
  const decBtn = document.getElementById('slDrawerStepperDec');
  const incBtn = document.getElementById('slDrawerStepperInc');
  const addBtn = document.getElementById('slDrawerAddBtn');

  if (!drawer || drawer._hasQuickLookBound) return;
  drawer._hasQuickLookBound = true;

  const closeDrawer = () => {
    if (window.smartListStore) {
      window.smartListStore.closeQuickLook();
    }
  };

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  if (decBtn) {
    decBtn.addEventListener('click', () => {
      quickLookCurrentQty = Math.max(1, quickLookCurrentQty - 1);
      const val = document.getElementById('slDrawerStepperVal');
      if (val) val.textContent = quickLookCurrentQty;
      if (window.smartListStore && window.smartListStore.quickLookId) {
        const p = window.smartListStore.getItem(window.smartListStore.quickLookId);
        const curPrice = window.smartListStore.getItemPrice(p.id);
        const addBtnLabel = document.getElementById('slDrawerAddBtnLabel');
        if (addBtnLabel && p.inStock) {
          addBtnLabel.textContent = `Add to Bag — € ${Number(curPrice * quickLookCurrentQty).toFixed(2)}`;
        }
      }
    });
  }

  if (incBtn) {
    incBtn.addEventListener('click', () => {
      quickLookCurrentQty = Math.min(10, quickLookCurrentQty + 1);
      const val = document.getElementById('slDrawerStepperVal');
      if (val) val.textContent = quickLookCurrentQty;
      if (window.smartListStore && window.smartListStore.quickLookId) {
        const p = window.smartListStore.getItem(window.smartListStore.quickLookId);
        const curPrice = window.smartListStore.getItemPrice(p.id);
        const addBtnLabel = document.getElementById('slDrawerAddBtnLabel');
        if (addBtnLabel && p.inStock) {
          addBtnLabel.textContent = `Add to Bag — € ${Number(curPrice * quickLookCurrentQty).toFixed(2)}`;
        }
      }
    });
  }

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      if (!window.smartListStore) return;
      const pid = window.smartListStore.quickLookId;
      if (!pid) return;
      const product = window.smartListStore.getItem(pid);
      if (!product) return;

      const isSizeOOS = !window.smartListStore.isSizeInStock(pid, product.selectedSize);
      if (!product.inStock || isSizeOOS) {
        showToast('This variant is currently out of stock', 'warn');
        return;
      }

      attachRipple(addBtn);
      addToCart(product, quickLookCurrentQty);
      showToast(`${product.name} added to bag`, 'success');
      closeDrawer();
    });
  }
}

function updateQuickLookDrawer(productId) {
  const drawer = document.getElementById('slQuickLookDrawer');
  const backdrop = document.getElementById('slQuickLookBackdrop');
  if (!drawer || !backdrop) return;

  if (!productId || !window.smartListStore) {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    backdrop.classList.remove('is-open');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    return;
  }

  const product = window.smartListStore.getItem(productId);
  if (!product) return;

  quickLookCurrentQty = getQty(productId) || 1;
  const stepperVal = document.getElementById('slDrawerStepperVal');
  if (stepperVal) stepperVal.textContent = quickLookCurrentQty;

  const brandEl = document.getElementById('slDrawerBrand');
  const titleEl = document.getElementById('slDrawerTitle');
  const priceEl = document.getElementById('slDrawerPrice');
  const origPriceEl = document.getElementById('slDrawerOrigPrice');
  const omnibusEl = document.getElementById('slDrawerOmnibus');
  const heroImg = document.getElementById('slDrawerHeroImg');
  const filmstrip = document.getElementById('slDrawerFilmstrip');
  const swatchesEl = document.getElementById('slDrawerSwatches');
  const finishNameEl = document.getElementById('slDrawerSelectedFinishName');
  const sizesEl = document.getElementById('slDrawerSizes');
  const sizeNameEl = document.getElementById('slDrawerSelectedSizeName');
  const specsEl = document.getElementById('slDrawerSpecsGrid');
  const pdpLink = document.getElementById('slDrawerPdpLink');
  const addBtn = document.getElementById('slDrawerAddBtn');
  const addBtnLabel = document.getElementById('slDrawerAddBtnLabel');

  if (brandEl) brandEl.textContent = `${product.brand} · ${product.categoryLabel || product.category}`;
  if (titleEl) titleEl.textContent = product.name;

  const currentPrice = window.smartListStore.getItemPrice(productId);
  if (priceEl) priceEl.textContent = `€ ${Number(currentPrice).toFixed(2)}`;

  if (origPriceEl) {
    if (product.originalPrice && product.originalPrice > currentPrice) {
      origPriceEl.textContent = `€ ${Number(product.originalPrice).toFixed(2)}`;
      origPriceEl.style.display = 'inline';
      if (omnibusEl) {
        omnibusEl.textContent = `Lowest price in last 30 days: € ${Number(product.originalPrice).toFixed(2)}`;
        omnibusEl.style.display = 'block';
      }
    } else {
      origPriceEl.textContent = '';
      origPriceEl.style.display = 'none';
      if (omnibusEl) omnibusEl.style.display = 'none';
    }
  }

  // Gallery (3+ assets)
  const gallery = (product.gallery && product.gallery.length > 0) ? product.gallery : [product.image];
  if (heroImg) {
    heroImg.src = resolveImgPath(gallery[0]);
    heroImg.alt = product.name;
  }

  if (filmstrip) {
    filmstrip.innerHTML = gallery.map((img, idx) => `
      <button type="button" class="sl-drawer-thumb-btn${idx === 0 ? ' active' : ''}" data-idx="${idx}" aria-label="View photo ${idx + 1} of ${product.name}">
        <img src="${resolveImgPath(img)}" alt="${product.name} detail ${idx + 1}" />
      </button>
    `).join('');

    filmstrip.querySelectorAll('.sl-drawer-thumb-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx, 10);
        filmstrip.querySelectorAll('.sl-drawer-thumb-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (heroImg && gallery[idx]) {
          heroImg.style.opacity = '0';
          setTimeout(() => {
            heroImg.src = resolveImgPath(gallery[idx]);
            heroImg.style.opacity = '1';
          }, 120);
        }
      });
    });
  }

  // Finishes
  const finishes = product.variants?.finishes || [];
  const selectedFinish = product.selectedFinish || (finishes[0]?.id);
  const curFinishObj = finishes.find(f => f.id === selectedFinish) || finishes[0];
  if (finishNameEl) finishNameEl.textContent = curFinishObj ? curFinishObj.name : 'Standard';

  const finishesSection = document.getElementById('slDrawerFinishesSection');
  if (finishesSection) finishesSection.style.display = finishes.length > 1 ? 'block' : 'none';

  if (swatchesEl) {
    swatchesEl.innerHTML = finishes.map(f => `
      <button type="button" class="sl-swatch-dot${f.id === selectedFinish ? ' active' : ''}" 
              data-drawer-finish="${f.id}" style="background: ${f.color}; width: 22px; height: 22px;" 
              title="${f.name}${f.priceDelta ? ' (+€' + f.priceDelta + ')' : ''}" 
              aria-label="${f.name}" role="radio" aria-checked="${f.id === selectedFinish}">
      </button>
    `).join('');

    swatchesEl.querySelectorAll('.sl-swatch-dot').forEach(btn => {
      btn.addEventListener('click', () => {
        const fid = btn.dataset.drawerFinish;
        window.smartListStore.setVariant(productId, { finishId: fid });
        updateQuickLookDrawer(productId);
      });
    });
  }

  // Sizes
  const sizes = product.variants?.sizes || [];
  const selectedSize = product.selectedSize || (sizes[0]?.id);
  const curSizeObj = sizes.find(s => s.id === selectedSize) || sizes[0];
  if (sizeNameEl) sizeNameEl.textContent = curSizeObj ? curSizeObj.name : 'Standard';

  const sizesSection = document.getElementById('slDrawerSizesSection');
  if (sizesSection) sizesSection.style.display = sizes.length > 1 ? 'block' : 'none';

  if (sizesEl) {
    sizesEl.innerHTML = sizes.map(s => `
      <button type="button" class="sl-size-btn${s.id === selectedSize ? ' active' : ''}" 
              data-drawer-size="${s.id}" ${s.inStock === false ? 'disabled' : ''} 
              style="min-width: 34px; height: 28px; font-size: 11px;"
              aria-label="Size ${s.name}${s.inStock === false ? ' (Out of stock)' : ''}" role="radio" aria-checked="${s.id === selectedSize}">
        ${s.name}
      </button>
    `).join('');

    sizesEl.querySelectorAll('.sl-size-btn:not(:disabled)').forEach(btn => {
      btn.addEventListener('click', () => {
        const sid = btn.dataset.drawerSize;
        window.smartListStore.setVariant(productId, { sizeId: sid });
        updateQuickLookDrawer(productId);
      });
    });
  }

  // Product Details & Specifications
  if (specsEl) {
    const specs = [
      { label: 'Origin', val: product.origin || 'European Union' },
      { label: 'Materials', val: product.materials || product.material || 'Premium Natural Fibers' },
      { label: 'Care', val: product.care || 'Specialist Care Recommended' },
      { label: 'Fit', val: product.fit || 'Tailored Regular Fit' }
    ];
    specsEl.innerHTML = specs.map(sp => `
      <div class="sl-spec-item">
        <span class="sl-spec-label">${sp.label}</span>
        <span class="sl-spec-val">${sp.val}</span>
      </div>
    `).join('');
  }

  // Stock & Add Button
  const isSizeOOS = !window.smartListStore.isSizeInStock(productId, selectedSize);
  const isOOS = !product.inStock || isSizeOOS;
  if (addBtn) {
    addBtn.disabled = isOOS;
    if (addBtnLabel) addBtnLabel.textContent = isOOS ? 'Out of Stock' : `Add to Bag — € ${Number(currentPrice * quickLookCurrentQty).toFixed(2)}`;
  }

  // PDP Link
  if (pdpLink) {
    pdpLink.href = `product.html?id=${productId}`;
  }

  drawer.classList.add('is-open');
  drawer.setAttribute('aria-hidden', 'false');
  backdrop.classList.add('is-open');
  backdrop.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [drawer] });
}

/* ─── Floating Batch Dock Controller (Obsidian Island) ───────────────────── */
function updateBatchDock() {
  const dock = document.getElementById('slBatchDock');
  if (!dock || !window.smartListStore) return;

  const metrics = window.smartListStore.getAggregateMetrics();
  const countEl = document.getElementById('slBatchCount');
  const subtotalEl = document.getElementById('slBatchSubtotal');
  const avatarsEl = document.getElementById('slBatchAvatars');

  if (metrics.count > 0) {
    if (countEl) countEl.textContent = metrics.count;
    if (subtotalEl) subtotalEl.textContent = `€ ${Number(metrics.subtotal).toFixed(2)}`;

    if (avatarsEl) {
      const items = metrics.items.slice(0, 4);
      const overflow = metrics.count - items.length;
      let html = items.map(it => `<img src="${resolveImgPath(it.image)}" alt="${it.name}" class="sl-batch-avatar-img" />`).join('');
      if (overflow > 0) {
        html += `<div class="sl-batch-avatar-overflow">+${overflow}</div>`;
      }
      avatarsEl.innerHTML = html;
    }

    dock.classList.add('is-visible');
    if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [dock] });
  } else {
    dock.classList.remove('is-visible');
  }
}

function initBatchDock() {
  const dock = document.getElementById('slBatchDock');
  if (!dock || dock._hasBatchBound) return;
  dock._hasBatchBound = true;

  const clearBtn = document.getElementById('slBatchClearBtn');
  const addBtn = document.getElementById('slBatchAddBtn');

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (window.smartListStore) {
        window.smartListStore.deselectAll();
      }
    });
  }

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      if (!window.smartListStore) return;
      const metrics = window.smartListStore.getAggregateMetrics();
      const inStockItems = metrics.items.filter(p => {
        const sizeInStock = window.smartListStore.isSizeInStock(p.id, p.selectedSize);
        return p.inStock && sizeInStock;
      });

      if (!inStockItems.length) {
        showToast('Selected items are currently out of stock', 'warn');
        return;
      }

      attachRipple(addBtn);
      inStockItems.forEach(product => {
        const qty = getQty(product.id);
        addToCart(product, qty);
      });

      showToast(`${inStockItems.length} selected ${inStockItems.length === 1 ? 'item' : 'items'} added to your bag`, 'success');
      window.smartListStore.deselectAll();
    });
  }
}

/* ─── Apply Category Filter (Direct & Synchronized) ───────────────────────── */
function applyCategoryFilter(cat) {
  if (!cat) return;
  activeCategoryFilter = cat;

  const filterBar = document.getElementById('slFilterBar');
  if (filterBar) {
    filterBar.querySelectorAll('.sl-filter-pill').forEach(p => {
      const matches = (p.dataset.category || '').toLowerCase() === cat.toLowerCase();
      p.classList.toggle('active', matches);
      p.setAttribute('aria-selected', matches ? 'true' : 'false');
    });
  }

  const grid = document.getElementById('slGrid');
  if (grid) {
    grid.style.transition = 'opacity 180ms ease, transform 180ms ease';
    grid.style.opacity = '0';
    grid.style.transform = 'translateY(6px)';

    setTimeout(() => {
      const filteredList = getSmartList({ max: 20, category: activeCategoryFilter }) || [];
      grid.innerHTML = filteredList.map((p, idx) => buildCardHTML(p, idx, false)).join('');

      if (window.initSmartListCardsMotion) {
        window.initSmartListCardsMotion();
      }

      grid.style.opacity = '1';
      grid.style.transform = 'translateY(0)';
      updateListStats();

      if (typeof lucide !== 'undefined') lucide.createIcons();
    }, 190);
  }
}

/* ─── Filter Bar Controller ───────────────────────────────────────────────── */
function initFilterBar() {
  const filterBar = document.getElementById('slFilterBar');
  if (!filterBar) return;
  if (filterBar._slEventsBound) return;
  filterBar._slEventsBound = true;

  filterBar.addEventListener('click', e => {
    const pill = e.target.closest('.sl-filter-pill');
    if (!pill) return;
    const cat = pill.dataset.category || 'all';
    applyCategoryFilter(cat);
  });
}

/* ══════════════════════════════════════════════════════════════════════════
   SURFACE RENDERER 1: Smart List Full Page (smart-list.html)
   ══════════════════════════════════════════════════════════════════════════ */
function renderSmartListPage() {
  const grid          = document.getElementById('slGrid');
  const toolbar       = document.getElementById('slToolbar');
  const empty         = document.getElementById('slEmptyState');
  const hero          = document.getElementById('slHero');
  const spotlightWrap = document.getElementById('slSpotlightWrap');
  const bridge        = document.getElementById('slConciergeBridge');
  if (!grid) return;

  const list = getSmartList({ max: 20, category: activeCategoryFilter });

  if (!list || list.length === 0) {
    if (grid)          grid.style.display          = 'none';
    if (toolbar)       toolbar.style.display       = 'none';
    if (empty)         empty.style.display         = 'flex';
    if (hero)          hero.style.display          = 'block';
    if (spotlightWrap) spotlightWrap.style.display = 'none';
    if (bridge)        bridge.style.display        = 'none';
    return;
  }

  if (spotlightWrap) spotlightWrap.style.display = 'block';
  if (toolbar)       toolbar.style.display       = 'flex';

  // Render product cards with differential parallax depth index
  grid.innerHTML = list.map((p, idx) => buildCardHTML(p, idx, false)).join('');

  // Bind interaction events
  bindCardEvents(grid);

  // Initialize Curated Look Switcher & 120fps Animation Track
  initLookSwitcher();

  // Initialize filter bar
  initFilterBar();

  // Initialize Select All toolbar toggle
  initSelectAllBtn();

  // Initialize Floating Batch Actions Dock
  initBatchDock();
  updateBatchDock();

  // Initialize Modernist Quick Look Slide-Over Drawer
  initQuickLookDrawer();

  // Update live statistics and valuation
  updateListStats();

  // Initialize / Rebind Central Motion Standards (3D tilt, specular glare, parallax)
  if (window.initSmartListCardsMotion) {
    window.initSmartListCardsMotion();
  }
  if (window.initSmartListPageMotion) {
    window.initSmartListPageMotion();
  }

  // "Move all to bag" button
  const addAllBtn = document.getElementById('slAddAll');
  const progressWrap = document.getElementById('slProgressWrap');
  const progressBar  = document.getElementById('slProgressBar');
  if (addAllBtn && !addAllBtn._hasBound) {
    addAllBtn._hasBound = true;
    addAllBtn.addEventListener('click', () => {
      attachRipple(addAllBtn);
      // Scoped to the active filter so the action matches what's on screen —
      // previously this always added every category regardless of filter.
      const scopedList  = getSmartList({ max: 20, category: activeCategoryFilter }) || [];
      const inStockItems = scopedList.filter(p => p.inStock);
      const oosItems     = scopedList.filter(p => !p.inStock);

      if (!inStockItems.length) {
        showToast('No available items to add', 'warn');
        return;
      }

      addAllBtn.disabled = true;
      const originalText = addAllBtn.querySelector('span').textContent;
      addAllBtn.querySelector('span').textContent = 'Adding to Bag…';
      if (progressWrap) progressWrap.style.display = 'block';

      if (progressBar) {
        progressBar.style.transition = 'transform 850ms cubic-bezier(0.4, 0, 0.2, 1)';
        progressBar.style.transform = 'scaleX(1)';
      }

      setTimeout(() => {
        inStockItems.forEach(p => addToCart(p, getQty(p.id)));

        let msg = `${inStockItems.length} ${inStockItems.length === 1 ? 'item' : 'items'} added to your shopping bag`;
        if (oosItems.length) msg += ` · ${oosItems.length} out of stock`;
        showToast(msg, oosItems.length ? 'warn' : 'success');

        addAllBtn.disabled = false;
        addAllBtn.querySelector('span').textContent = '✓ Added All';
        if (progressWrap) progressWrap.style.display = 'none';
        if (progressBar) { progressBar.style.transform = 'scaleX(0)'; }

        setTimeout(() => {
          if (addAllBtn.isConnected) {
            addAllBtn.querySelector('span').textContent = originalText;
          }
        }, 2000);
      }, 900);
    });
  }

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

/* ══════════════════════════════════════════════════════════════════════════
   SURFACE RENDERER 2: Confirmation Page Widget
   ══════════════════════════════════════════════════════════════════════════ */
function renderConfirmationWidget() {
  const strip = document.getElementById('slConfirmStrip');
  if (!strip) return;

  const list = getSmartList({ max: 5 });
  if (!list || list.length < 3) {
    const widget = document.getElementById('slConfirmWidget');
    if (widget) widget.style.display = 'none';
    return;
  }

  strip.innerHTML = list.slice(0, 5).map((p, idx) => buildCardHTML(p, idx, true)).join('');
  bindCardEvents(strip);

  if (window.initSmartListCardsMotion) window.initSmartListCardsMotion();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

/* ══════════════════════════════════════════════════════════════════════════
   SURFACE RENDERER 3: Homepage Section
   ══════════════════════════════════════════════════════════════════════════ */
function renderHomepageSection() {
  const strip = document.getElementById('slHomeStrip');
  const section = document.getElementById('homeSmartListSection');
  if (!strip) return;

  const list = getSmartList({ max: 6 });
  if (!list || list.length < 3) {
    if (section) section.style.display = 'none';
    return;
  }

  if (section) section.style.display = 'block';
  strip.innerHTML = list.slice(0, 6).map((p, idx) => buildCardHTML(p, idx, true)).join('');
  bindCardEvents(strip);

  if (window.initSmartListCardsMotion) window.initSmartListCardsMotion();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

/* ─── Auto-init on Boot ──────────────────────────────────────────────────── */
function bootSmartReorder() {
  const page = document.body.dataset.slPage;
  if (page === 'smart-list')        renderSmartListPage();
  else if (page === 'confirmation') renderConfirmationWidget();
  else if (page === 'home')          renderHomepageSection();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootSmartReorder);
} else {
  bootSmartReorder();
}
