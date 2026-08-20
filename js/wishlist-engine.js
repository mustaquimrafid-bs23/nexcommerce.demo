/* ═══════════════════════════════════════════════════════════════════════════
   nexCommerce — Wardrobe Vault Core Engine (Modernist Luxury Edition)
   ═══════════════════════════════════════════════════════════════════════════ */

(function(root) {
  'use strict';

  var WISHLIST_KEY = 'nex_curated_wishlist_ids';
  var DEFAULT_SEED = ['p1', 'p4', 'p6'];

  var CATALOG_DB = {
    'p1': {
      id: 'p1',
      title: 'Double-Breasted Wool Overcoat',
      brand: 'MAISON APPAREL',
      price: 285,
      image: 'assets/images/products/plp_overcoat.png',
      gallery: [
        'assets/images/products/plp_overcoat.png',
        'assets/images/products/plp_blazer.png',
        'assets/images/lifestyle/hero_sweater_landscape.jpg'
      ],
      stock: 'Available in Atelier',
      stockStatus: 'in-stock',
      provenance: [
        { label: 'Origin', value: 'Biella, Italy' },
        { label: 'Material', value: '100% Virgin Wool' },
        { label: 'Tailoring', value: 'Atelier Structured' }
      ],
      variants: {
        finishes: [
          { id: 'noir', name: 'Atelier Noir', color: '#121316', priceDelta: 0 },
          { id: 'camel', name: 'Vicugna Camel', color: '#8B6508', priceDelta: 0 },
          { id: 'charcoal', name: 'Charcoal Wool', color: '#2B323F', priceDelta: 0 }
        ],
        sizes: [
          { id: '46', name: '46', inStock: true },
          { id: '48', name: '48', inStock: true, default: true },
          { id: '50', name: '50', inStock: true },
          { id: '52', name: '52', inStock: false }
        ]
      }
    },
    'p2': {
      id: 'p2',
      title: 'Cashmere Blend Crewneck',
      brand: 'MAISON APPAREL',
      price: 142,
      image: 'assets/images/lifestyle/sweater_lifestyle.png',
      gallery: [
        'assets/images/lifestyle/sweater_lifestyle.png',
        'assets/images/products/plp_crewneck.png',
        'assets/images/products/hero_sweater.png'
      ],
      stock: 'Low Stock · 2 Left',
      stockStatus: 'low-stock',
      provenance: [
        { label: 'Origin', value: 'Florence, Italy' },
        { label: 'Material', value: '70% Mongolian Cashmere' },
        { label: 'Knit', value: 'Architectural Ribbed' }
      ],
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
          { id: 'XL', name: 'XL', inStock: false }
        ]
      }
    },
    'p3': {
      id: 'p3',
      title: 'Architectural Wool Trousers',
      brand: 'MAISON APPAREL',
      price: 168,
      image: 'assets/images/products/plp_trousers.png',
      gallery: [
        'assets/images/products/plp_trousers.png',
        'assets/images/products/plp_overcoat.png',
        'assets/images/lifestyle/hero_sweater_landscape.jpg'
      ],
      stock: 'Available in Atelier',
      stockStatus: 'in-stock',
      provenance: [
        { label: 'Origin', value: 'Milan, Italy' },
        { label: 'Material', value: 'Worsted Wool Crepe' },
        { label: 'Cut', value: 'Double Pleated High Waist' }
      ],
      variants: {
        finishes: [
          { id: 'charcoal', name: 'Deep Charcoal', color: '#1F242E', priceDelta: 0 },
          { id: 'black', name: 'Matte Black', color: '#0F172A', priceDelta: 0 }
        ],
        sizes: [
          { id: '46', name: '46', inStock: true },
          { id: '48', name: '48', inStock: true, default: true },
          { id: '50', name: '50', inStock: true }
        ]
      }
    },
    'p4': {
      id: 'p4',
      title: 'Planar Magnetic Studio Headphones',
      brand: 'HIGH ACOUSTICS',
      price: 220,
      image: 'assets/images/products/prod_headphones.png',
      gallery: [
        'assets/images/products/prod_headphones.png',
        'assets/images/products/hero_sweater.png',
        'assets/images/lifestyle/hero_sweater_landscape.jpg'
      ],
      stock: 'Limited Atelier Edition',
      stockStatus: 'in-stock',
      provenance: [
        { label: 'Origin', value: 'Berlin, Germany' },
        { label: 'Acoustics', value: 'Beryllium Planar Drivers' },
        { label: 'Craft', value: 'Lambskin Memory Foam' }
      ],
      variants: {
        finishes: [
          { id: 'obsidian', name: 'Matte Obsidian', color: '#1A1D24', priceDelta: 0 },
          { id: 'silver', name: 'Brushed Aluminum', color: '#94A3B8', priceDelta: 0 }
        ],
        sizes: [
          { id: 'STD', name: 'Standard Studio Spec', inStock: true, default: true }
        ]
      }
    },
    'p5': {
      id: 'p5',
      title: 'Artisanal Suede Tote',
      brand: 'LEATHER & ACCESSORIES',
      price: 195,
      image: 'assets/images/products/prod_tote.png',
      gallery: [
        'assets/images/products/prod_tote.png',
        'assets/images/products/plp_overcoat.png',
        'assets/images/lifestyle/hero_sweater_landscape.jpg'
      ],
      stock: 'Available in Atelier',
      stockStatus: 'in-stock',
      provenance: [
        { label: 'Origin', value: 'Tuscany, Italy' },
        { label: 'Material', value: 'Full-Grain Calf Suede' },
        { label: 'Hardware', value: 'Solid Hand-Cast Brass' }
      ],
      variants: {
        finishes: [
          { id: 'tobacco', name: 'Tobacco Suede', color: '#6E4720', priceDelta: 0 },
          { id: 'noir', name: 'Noir Suede', color: '#181A20', priceDelta: 0 }
        ],
        sizes: [
          { id: 'OS', name: 'One Size (38L)', inStock: true, default: true }
        ]
      }
    },
    'p6': {
      id: 'p6',
      title: 'Minimalist Leather Runner',
      brand: 'ARTISANAL FOOTWEAR',
      price: 184,
      image: 'assets/images/products/prod_runner.png',
      gallery: [
        'assets/images/products/prod_runner.png',
        'assets/images/products/prod_headphones.png',
        'assets/images/lifestyle/hero_sweater_landscape.jpg'
      ],
      stock: 'Available in Atelier',
      stockStatus: 'in-stock',
      provenance: [
        { label: 'Origin', value: 'Civitanova Marche, Italy' },
        { label: 'Upper', value: 'Full-Grain Italian Nappa' },
        { label: 'Sole', value: 'Custom Margom Cupsole' }
      ],
      variants: {
        finishes: [
          { id: 'chalk', name: 'Chalk White', color: '#E8E5DF', priceDelta: 0 },
          { id: 'obsidian', name: 'Deep Obsidian', color: '#161922', priceDelta: 0 }
        ],
        sizes: [
          { id: '41', name: 'EU 41', inStock: true },
          { id: '42', name: 'EU 42', inStock: true },
          { id: '43', name: 'EU 43', inStock: true, default: true },
          { id: '44', name: 'EU 44', inStock: false }
        ]
      }
    },
    'p7': {
      id: 'p7',
      title: 'Obsidian Automatic Timepiece',
      brand: 'HIGH ACOUSTICS & WATCHES',
      price: 340,
      image: 'assets/images/products/search_watch.png',
      gallery: [
        'assets/images/products/search_watch.png',
        'assets/images/products/prod_headphones.png',
        'assets/images/lifestyle/hero_sweater_landscape.jpg'
      ],
      stock: 'Limited Atelier Edition',
      stockStatus: 'in-stock',
      provenance: [
        { label: 'Origin', value: 'Geneva, Switzerland' },
        { label: 'Movement', value: 'Automatic Caliber 28,800 vph' },
        { label: 'Case', value: 'DLC-Coated 316L Steel' }
      ],
      variants: {
        finishes: [
          { id: 'dlc', name: 'Matte DLC Black', color: '#111318', priceDelta: 0 },
          { id: 'titanium', name: 'Brushed Titanium', color: '#687280', priceDelta: 30 }
        ],
        sizes: [
          { id: '40mm', name: '40mm Case', inStock: true, default: true }
        ]
      }
    }
  };

  function getStorage(customStorage) {
    if (customStorage) return customStorage;
    try {
      return window.localStorage;
    } catch (e) {
      return {
        getItem: function() { return null; },
        setItem: function() {},
        removeItem: function() {}
      };
    }
  }

  function getSavedWishlist(storage) {
    var store = getStorage(storage);
    var raw = store.getItem(WISHLIST_KEY);
    if (raw === null) {
      store.setItem(WISHLIST_KEY, JSON.stringify(DEFAULT_SEED));
      return DEFAULT_SEED.slice();
    }
    try {
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveWishlist(ids, storage) {
    var store = getStorage(storage);
    var cleanIds = Array.isArray(ids) ? ids : [];
    store.setItem(WISHLIST_KEY, JSON.stringify(cleanIds));
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      try {
        window.dispatchEvent(new CustomEvent('wishlist:updated', {
          detail: { count: cleanIds.length, ids: cleanIds }
        }));
      } catch (e) {}
    }
    return cleanIds;
  }

  function addToWishlist(id, storage) {
    var ids = getSavedWishlist(storage);
    if (ids.indexOf(id) === -1) {
      ids.push(id);
      saveWishlist(ids, storage);
    }
    return ids;
  }

  function removeFromWishlist(id, storage) {
    var ids = getSavedWishlist(storage);
    var idx = ids.indexOf(id);
    if (idx !== -1) {
      ids.splice(idx, 1);
      saveWishlist(ids, storage);
    }
    return ids;
  }

  function clearWishlist(storage) {
    saveWishlist([], storage);
    return [];
  }

  function categoryKeyForTag(tag) {
    if (!tag) return 'apparel';
    var upper = tag.toUpperCase();
    if (upper.indexOf('ACOUSTICS') !== -1 || upper.indexOf('WATCH') !== -1) return 'acoustics';
    if (upper.indexOf('FOOTWEAR') !== -1 || upper.indexOf('LEATHER') !== -1 || upper.indexOf('ACCESSOR') !== -1) return 'footwear';
    return 'apparel';
  }

  function computeCapsuleStats(ids) {
    var cleanIds = Array.isArray(ids) ? ids : [];
    var stats = {
      all: { count: 0, value: 0 },
      apparel: { count: 0, value: 0 },
      acoustics: { count: 0, value: 0 },
      footwear: { count: 0, value: 0 }
    };

    cleanIds.forEach(function(id) {
      var item = CATALOG_DB[id];
      if (!item) return;
      var cat = categoryKeyForTag(item.brand || '');
      stats.all.count += 1;
      stats.all.value += item.price;
      if (stats[cat]) {
        stats[cat].count += 1;
        stats[cat].value += item.price;
      }
    });

    return stats;
  }

  function createCartPayload(productId, selectedSize, selectedFinish) {
    var item = CATALOG_DB[productId];
    if (!item) return null;

    var size = selectedSize;
    if (!size && item.variants && item.variants.sizes && item.variants.sizes.length > 0) {
      var defSize = item.variants.sizes.find(function(s) { return s.default; }) || item.variants.sizes[0];
      size = defSize.id;
    }

    var finish = selectedFinish;
    var price = item.price;
    if (finish && item.variants && item.variants.finishes) {
      var fObj = item.variants.finishes.find(function(f) { return f.id === finish; });
      if (fObj && fObj.priceDelta) {
        price += fObj.priceDelta;
      }
    }

    return {
      id: item.id,
      name: item.title,
      price: price,
      image: item.image,
      category: item.brand,
      size: size || 'Standard',
      finish: finish || 'Standard',
      quantity: 1
    };
  }

  var Engine = {
    WISHLIST_KEY: WISHLIST_KEY,
    DEFAULT_SEED: DEFAULT_SEED,
    getCatalog: function() { return CATALOG_DB; },
    getProduct: function(id) { return CATALOG_DB[id] || null; },
    getSavedWishlist: getSavedWishlist,
    saveWishlist: saveWishlist,
    addToWishlist: addToWishlist,
    removeFromWishlist: removeFromWishlist,
    clearWishlist: clearWishlist,
    categoryKeyForTag: categoryKeyForTag,
    computeCapsuleStats: computeCapsuleStats,
    createCartPayload: createCartPayload
  };

  root.NexWishlistEngine = Engine;

})(typeof window !== 'undefined' ? window : this);
