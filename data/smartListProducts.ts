export interface SmartListFinish {
  id: string;
  name: string;
  color: string;
  priceDelta: number;
  img?: string;
}

export interface SmartListSize {
  id: string;
  name: string;
  inStock: boolean;
  default?: boolean;
}

export interface SmartListProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number | null;
  image: string;
  gallery: string[];
  category: 'Apparel' | 'Acoustics' | 'Footwear' | 'Accessories' | 'Timepieces' | string;
  categoryLabel: string;
  boughtCount: number;
  avgIntervalDays: number;
  daysSinceLast: number;
  suggestedQty: number;
  inStock: boolean;
  reason: string;
  materials: string;
  origin: string;
  care: string;
  variants: {
    finishes: SmartListFinish[];
    sizes: SmartListSize[];
  };
  selectedFinish?: string;
  selectedSize?: string;
  tag?: string;
}

export const SMART_LIST_PRODUCTS: SmartListProduct[] = [
  {
    "id": "p1",
    "name": "Pure Cashmere Sweater",
    "brand": "Arc",
    "price": 185,
    "originalPrice": null,
    "image": "/assets/images/products/hero_sweater.png",
    "gallery": [
      "/assets/images/products/hero_sweater.png",
      "/assets/images/products/plp_crewneck.png",
      "/assets/images/lifestyle/hero_sweater_landscape.jpg"
    ],
    "category": "Apparel",
    "categoryLabel": "Clothing",
    "boughtCount": 4,
    "avgIntervalDays": 60,
    "daysSinceLast": 58,
    "suggestedQty": 1,
    "inStock": true,
    "reason": "Purchased 4× · Recommended for winter",
    "materials": "100% Grade-A Mongolian Cashmere (2-ply yarn)",
    "origin": "Hand-finished in Biella, Italy",
    "care": "Hand wash cold with wool wash or dry clean",
    "variants": {
      "finishes": [
        {
          "id": "charcoal",
          "name": "Charcoal Grey",
          "color": "#2B323F",
          "priceDelta": 0
        },
        {
          "id": "obsidian",
          "name": "Deep Obsidian",
          "color": "#0F172A",
          "priceDelta": 0
        },
        {
          "id": "ivory",
          "name": "Raw Ivory",
          "color": "#F8F6F0",
          "priceDelta": 10
        }
      ],
      "sizes": [
        {
          "id": "S",
          "name": "S",
          "inStock": true
        },
        {
          "id": "M",
          "name": "M",
          "inStock": true,
          "default": true
        },
        {
          "id": "L",
          "name": "L",
          "inStock": true
        },
        {
          "id": "XL",
          "name": "XL",
          "inStock": false
        }
      ]
    },
    "selectedFinish": "charcoal",
    "selectedSize": "M"
  },
  {
    "id": "p2",
    "name": "Fine-Knit Cashmere Crew",
    "brand": "Arc",
    "price": 160,
    "originalPrice": null,
    "image": "/assets/images/products/plp_crewneck.png",
    "gallery": [
      "/assets/images/products/plp_crewneck.png",
      "/assets/images/products/hero_sweater.png",
      "/assets/images/lifestyle/hero_sweater_landscape.jpg"
    ],
    "category": "Apparel",
    "categoryLabel": "Clothing",
    "boughtCount": 5,
    "avgIntervalDays": 45,
    "daysSinceLast": 42,
    "suggestedQty": 2,
    "inStock": true,
    "reason": "Purchased 5× · Everyday essential",
    "materials": "100% Fine Gauge Cashmere (70g/m²)",
    "origin": "Crafted in Florence, Italy",
    "care": "Dry clean or gentle cold wash",
    "variants": {
      "finishes": [
        {
          "id": "midnight",
          "name": "Midnight Navy",
          "color": "#0B192C",
          "priceDelta": 0
        },
        {
          "id": "slate",
          "name": "Slate Grey",
          "color": "#475569",
          "priceDelta": 0
        },
        {
          "id": "sand",
          "name": "Warm Sand",
          "color": "#D5C4A1",
          "priceDelta": 0
        }
      ],
      "sizes": [
        {
          "id": "S",
          "name": "S",
          "inStock": true
        },
        {
          "id": "M",
          "name": "M",
          "inStock": true,
          "default": true
        },
        {
          "id": "L",
          "name": "L",
          "inStock": true
        },
        {
          "id": "XL",
          "name": "XL",
          "inStock": true
        }
      ]
    },
    "selectedFinish": "midnight",
    "selectedSize": "M"
  },
  {
    "id": "p3",
    "name": "Structured Wool Blazer",
    "brand": "Arc",
    "price": 245,
    "originalPrice": 270,
    "image": "/assets/images/products/plp_blazer.png",
    "gallery": [
      "/assets/images/products/plp_blazer.png",
      "/assets/images/products/plp_overcoat.png",
      "/assets/images/lifestyle/hero_sweater_landscape.jpg"
    ],
    "category": "Apparel",
    "categoryLabel": "Clothing",
    "boughtCount": 3,
    "avgIntervalDays": 90,
    "daysSinceLast": 86,
    "suggestedQty": 1,
    "inStock": true,
    "reason": "Purchased 3× · Classic tailoring",
    "materials": "100% Virgin Wool, Horn Buttons, Cupro Lining",
    "origin": "Tailored in Milan, Italy",
    "care": "Specialist dry clean only",
    "variants": {
      "finishes": [
        {
          "id": "nero",
          "name": "Classic Black",
          "color": "#111827",
          "priceDelta": 0
        },
        {
          "id": "navy",
          "name": "Midnight Navy",
          "color": "#1E293B",
          "priceDelta": 0
        }
      ],
      "sizes": [
        {
          "id": "46",
          "name": "46",
          "inStock": true
        },
        {
          "id": "48",
          "name": "48",
          "inStock": true,
          "default": true
        },
        {
          "id": "50",
          "name": "50",
          "inStock": true
        },
        {
          "id": "52",
          "name": "52",
          "inStock": false
        }
      ]
    },
    "selectedFinish": "nero",
    "selectedSize": "48"
  },
  {
    "id": "p4",
    "name": "Planar Magnetic Studio Headphones",
    "brand": "Form",
    "price": 220,
    "originalPrice": null,
    "image": "/assets/images/products/prod_headphones.png",
    "gallery": [
      "/assets/images/products/prod_headphones.png",
      "/assets/images/products/search_earbuds.png",
      "/assets/images/lifestyle/hero_headphone_landscape.jpg"
    ],
    "category": "Acoustics",
    "categoryLabel": "Audio",
    "boughtCount": 3,
    "avgIntervalDays": 120,
    "daysSinceLast": 115,
    "suggestedQty": 1,
    "inStock": true,
    "reason": "Purchased 3× · Studio audio favorite",
    "materials": "Anodized Aluminum, Lambskin Memory Foam Cushions",
    "origin": "Engineered in Munich, Germany",
    "care": "Wipe with dry microfiber cloth",
    "variants": {
      "finishes": [
        {
          "id": "matte_black",
          "name": "Matte Obsidian",
          "color": "#171717",
          "priceDelta": 0
        },
        {
          "id": "silver",
          "name": "Anodized Silver",
          "color": "#E2E8F0",
          "priceDelta": 15
        }
      ],
      "sizes": [
        {
          "id": "standard",
          "name": "Over-Ear",
          "inStock": true,
          "default": true
        }
      ]
    },
    "selectedFinish": "matte_black",
    "selectedSize": "standard"
  },
  {
    "id": "p5",
    "name": "Minimalist Leather Runner",
    "brand": "Apex",
    "price": 185,
    "originalPrice": null,
    "image": "/assets/images/products/prod_runner.png",
    "gallery": [
      "/assets/images/products/prod_runner.png",
      "/assets/images/lifestyle/hero_runner_landscape.jpg",
      "/assets/images/products/prod_tote.png"
    ],
    "category": "Footwear",
    "categoryLabel": "Footwear",
    "boughtCount": 4,
    "avgIntervalDays": 90,
    "daysSinceLast": 88,
    "suggestedQty": 1,
    "inStock": true,
    "reason": "Purchased 4× · Daily footwear essential",
    "materials": "Full-Grain Italian Calfskin, Margom Rubber Outsole",
    "origin": "Handmade in Civitanova Marche, Italy",
    "care": "Condition regularly with neutral leather balm",
    "variants": {
      "finishes": [
        {
          "id": "white",
          "name": "Optic White",
          "color": "#F9FAFB",
          "priceDelta": 0
        },
        {
          "id": "black",
          "name": "Classic Black",
          "color": "#09090B",
          "priceDelta": 0
        }
      ],
      "sizes": [
        {
          "id": "40",
          "name": "40",
          "inStock": true
        },
        {
          "id": "41",
          "name": "41",
          "inStock": true
        },
        {
          "id": "42",
          "name": "42",
          "inStock": true,
          "default": true
        },
        {
          "id": "43",
          "name": "43",
          "inStock": true
        },
        {
          "id": "44",
          "name": "44",
          "inStock": false
        }
      ]
    },
    "selectedFinish": "white",
    "selectedSize": "42"
  },
  {
    "id": "p6",
    "name": "Structured Canvas Tote",
    "brand": "Forma",
    "price": 125,
    "originalPrice": null,
    "image": "/assets/images/products/prod_tote.png",
    "gallery": [
      "/assets/images/products/prod_tote.png",
      "/assets/images/products/prod_runner.png",
      "/assets/images/lifestyle/hero_sweater_landscape.jpg"
    ],
    "category": "Accessories",
    "categoryLabel": "Bags & Accessories",
    "boughtCount": 3,
    "avgIntervalDays": 75,
    "daysSinceLast": 70,
    "suggestedQty": 1,
    "inStock": false,
    "reason": "Purchased 3× · Everyday tote bag",
    "materials": "24oz Heavyweight Organic Cotton Duck, Saddle Leather Trim",
    "origin": "Crafted in Porto, Portugal",
    "care": "Spot clean with neutral soap",
    "variants": {
      "finishes": [
        {
          "id": "natural",
          "name": "Raw Canvas",
          "color": "#EFEFEA",
          "priceDelta": 0
        },
        {
          "id": "noir",
          "name": "Black Canvas",
          "color": "#18181B",
          "priceDelta": 0
        }
      ],
      "sizes": [
        {
          "id": "one_size",
          "name": "Standard 22L",
          "inStock": false,
          "default": true
        }
      ]
    },
    "selectedFinish": "natural",
    "selectedSize": "one_size"
  },
  {
    "id": "p7",
    "name": "Noise Canceling Earbuds",
    "brand": "Form",
    "price": 145,
    "originalPrice": null,
    "image": "/assets/images/products/search_earbuds.png",
    "gallery": [
      "/assets/images/products/search_earbuds.png",
      "/assets/images/products/prod_headphones.png",
      "/assets/images/lifestyle/hero_headphone_landscape.jpg"
    ],
    "category": "Acoustics",
    "categoryLabel": "Audio",
    "boughtCount": 4,
    "avgIntervalDays": 60,
    "daysSinceLast": 56,
    "suggestedQty": 1,
    "inStock": true,
    "reason": "Purchased 4× · Travel & commute favorite",
    "materials": "Ceramic Sound Chamber, Wireless Qi Charging Case",
    "origin": "Precision Crafted in Munich, Germany",
    "care": "Clean silicone tips in warm water",
    "variants": {
      "finishes": [
        {
          "id": "graphite",
          "name": "Graphite Black",
          "color": "#1F2937",
          "priceDelta": 0
        },
        {
          "id": "sand_stone",
          "name": "Sandstone Grey",
          "color": "#CBD5E1",
          "priceDelta": 0
        }
      ],
      "sizes": [
        {
          "id": "universal",
          "name": "Universal Fit",
          "inStock": true,
          "default": true
        }
      ]
    },
    "selectedFinish": "graphite",
    "selectedSize": "universal"
  },
  {
    "id": "p8",
    "name": "Double-Breasted Wool Overcoat",
    "brand": "Arc",
    "price": 285,
    "originalPrice": 320,
    "image": "/assets/images/products/plp_overcoat.png",
    "gallery": [
      "/assets/images/products/plp_overcoat.png",
      "/assets/images/products/plp_blazer.png",
      "/assets/images/lifestyle/hero_sweater_landscape.jpg"
    ],
    "category": "Apparel",
    "categoryLabel": "Clothing",
    "boughtCount": 2,
    "avgIntervalDays": 180,
    "daysSinceLast": 175,
    "suggestedQty": 1,
    "inStock": true,
    "reason": "Purchased 2× · Winter coat staple",
    "materials": "Double-Faced Melton Wool (580g/m²)",
    "origin": "Handcrafted in Milan, Italy",
    "care": "Dry clean only with steam finish",
    "variants": {
      "finishes": [
        {
          "id": "camel",
          "name": "Warm Camel",
          "color": "#9A7B56",
          "priceDelta": 0
        },
        {
          "id": "dark_navy",
          "name": "Dark Navy",
          "color": "#030712",
          "priceDelta": 0
        }
      ],
      "sizes": [
        {
          "id": "46",
          "name": "46",
          "inStock": true
        },
        {
          "id": "48",
          "name": "48",
          "inStock": true,
          "default": true
        },
        {
          "id": "50",
          "name": "50",
          "inStock": true
        },
        {
          "id": "52",
          "name": "52",
          "inStock": true
        }
      ]
    },
    "selectedFinish": "camel",
    "selectedSize": "48"
  },
  {
    "id": "p9",
    "name": "Obsidian Automatic Timepiece",
    "brand": "Volta",
    "price": 340,
    "originalPrice": null,
    "image": "/assets/images/products/search_watch.png",
    "gallery": [
      "/assets/images/products/search_watch.png",
      "/assets/images/lifestyle/hero_watch_landscape.jpg",
      "/assets/images/products/plp_blazer.png"
    ],
    "category": "Timepieces",
    "categoryLabel": "Watches",
    "boughtCount": 2,
    "avgIntervalDays": 180,
    "daysSinceLast": 170,
    "suggestedQty": 1,
    "inStock": true,
    "reason": "Purchased 2× · Automatic timepiece",
    "materials": "316L Diamond-Like-Carbon Steel, Sapphire Crystal, Automatic Caliber",
    "origin": "Manufactured in Geneva, Switzerland",
    "care": "Water resistant to 10 ATM / 100m",
    "variants": {
      "finishes": [
        {
          "id": "dlc_black",
          "name": "Obsidian Black",
          "color": "#0A0A0A",
          "priceDelta": 0
        },
        {
          "id": "brushed_steel",
          "name": "Brushed Steel",
          "color": "#E5E7EB",
          "priceDelta": 20
        },
        {
          "id": "rose_gold",
          "name": "Rose Titanium",
          "color": "#B76E79",
          "priceDelta": 45
        }
      ],
      "sizes": [
        {
          "id": "39mm",
          "name": "39mm",
          "inStock": true
        },
        {
          "id": "41mm",
          "name": "41mm",
          "inStock": true,
          "default": true
        }
      ]
    },
    "selectedFinish": "dlc_black",
    "selectedSize": "41mm"
  },
  {
    "id": "p10",
    "name": "Tailored Wool Trousers",
    "brand": "Arc",
    "price": 170,
    "originalPrice": null,
    "image": "/assets/images/products/plp_trousers.png",
    "gallery": [
      "/assets/images/products/plp_trousers.png",
      "/assets/images/products/plp_blazer.png",
      "/assets/images/lifestyle/hero_sweater_landscape.jpg"
    ],
    "category": "Apparel",
    "categoryLabel": "Clothing",
    "boughtCount": 4,
    "avgIntervalDays": 75,
    "daysSinceLast": 72,
    "suggestedQty": 1,
    "inStock": true,
    "reason": "Purchased 4× · Wardrobe staple trousers",
    "materials": "High-Twist Tropical Wool with Natural Stretch",
    "origin": "Tailored in Naples, Italy",
    "care": "Dry clean or steam press",
    "variants": {
      "finishes": [
        {
          "id": "anthracite",
          "name": "Anthracite Grey",
          "color": "#334155",
          "priceDelta": 0
        },
        {
          "id": "black",
          "name": "Pure Black",
          "color": "#0F172A",
          "priceDelta": 0
        }
      ],
      "sizes": [
        {
          "id": "46",
          "name": "46",
          "inStock": true
        },
        {
          "id": "48",
          "name": "48",
          "inStock": true,
          "default": true
        },
        {
          "id": "50",
          "name": "50",
          "inStock": true
        },
        {
          "id": "52",
          "name": "52",
          "inStock": false
        }
      ]
    },
    "selectedFinish": "anthracite",
    "selectedSize": "48"
  },
  {
    "id": "p11",
    "name": "Ribbed Silk-Cashmere Turtleneck",
    "brand": "Arc",
    "price": 160,
    "originalPrice": null,
    "image": "/assets/images/products/plp_turtleneck.png",
    "gallery": [
      "/assets/images/products/plp_turtleneck.png",
      "/assets/images/products/hero_sweater.png",
      "/assets/images/lifestyle/hero_sweater_landscape.jpg"
    ],
    "category": "Apparel",
    "categoryLabel": "Clothing",
    "boughtCount": 3,
    "avgIntervalDays": 60,
    "daysSinceLast": 57,
    "suggestedQty": 1,
    "inStock": false,
    "reason": "Purchased 3× · Silk-cashmere knit",
    "materials": "70% Mongolian Cashmere, 30% Mulberry Silk",
    "origin": "Knit in Umbria, Italy",
    "care": "Hand wash cold or gentle dry clean",
    "variants": {
      "finishes": [
        {
          "id": "cream",
          "name": "Silk Cream",
          "color": "#FEF9C3",
          "priceDelta": 0
        },
        {
          "id": "espresso",
          "name": "Dark Espresso",
          "color": "#3B1E08",
          "priceDelta": 0
        }
      ],
      "sizes": [
        {
          "id": "S",
          "name": "S",
          "inStock": false
        },
        {
          "id": "M",
          "name": "M",
          "inStock": false,
          "default": true
        },
        {
          "id": "L",
          "name": "L",
          "inStock": false
        }
      ]
    },
    "selectedFinish": "cream",
    "selectedSize": "M"
  },
  {
    "id": "p12",
    "name": "Japanese Selvedge Denim Jeans",
    "brand": "Arc",
    "price": 190,
    "originalPrice": 215,
    "image": "/assets/images/products/hero_jeans_rack.png",
    "gallery": [
      "/assets/images/products/hero_jeans_rack.png",
      "/assets/images/products/prod_runner.png",
      "/assets/images/lifestyle/hero_sweater_landscape.jpg"
    ],
    "category": "Apparel",
    "categoryLabel": "Clothing",
    "boughtCount": 3,
    "avgIntervalDays": 90,
    "daysSinceLast": 84,
    "suggestedQty": 1,
    "inStock": true,
    "reason": "Purchased 3× · Raw denim essential",
    "materials": "13.5oz Kuroki Mills Raw Indigo Selvedge Denim",
    "origin": "Woven & sewn in Okayama, Japan",
    "care": "Soak inside out in cold water, hang dry",
    "variants": {
      "finishes": [
        {
          "id": "raw_indigo",
          "name": "Raw Indigo",
          "color": "#172554",
          "priceDelta": 0
        },
        {
          "id": "washed_black",
          "name": "Faded Black",
          "color": "#27272A",
          "priceDelta": 10
        }
      ],
      "sizes": [
        {
          "id": "30",
          "name": "30",
          "inStock": true
        },
        {
          "id": "31",
          "name": "31",
          "inStock": true
        },
        {
          "id": "32",
          "name": "32",
          "inStock": true,
          "default": true
        },
        {
          "id": "33",
          "name": "33",
          "inStock": true
        },
        {
          "id": "34",
          "name": "34",
          "inStock": false
        }
      ]
    },
    "selectedFinish": "raw_indigo",
    "selectedSize": "32"
  }
];
