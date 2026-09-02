import { create } from 'zustand';
import { Product } from '@/types/catalog';
import { MASTER_PRODUCTS } from '@/data/products';

export interface ExtractedIntent {
  raw: string;
  occasion?: string | null;
  climate?: string | null;
  location?: string | null;
  budgetMax?: number | null;
  targetCategory?: string | null;
}

export interface SearchResultItem {
  product: Product;
  matchScore: number;
  matchReason: string;
  matchBadge?: string;
}

export const POPULAR_DEPARTMENTS = [
  { label: 'Apparel', query: 'apparel' },
  { label: 'Footwear', query: 'footwear' },
  { label: 'Audio', query: 'audio' },
  { label: 'Accessories', query: 'accessories' },
  { label: 'Objects', query: 'accessories' },
];

export const SEASONAL_HIGHLIGHT_IDS = ['p1', 'p6', 'p8'];

function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

function checkTypoCorrection(rawQuery: string): string | null {
  const q = rawQuery.toLowerCase().trim();
  const commonVocabulary = [
    'sweater',
    'cashmere',
    'blazer',
    'overcoat',
    'headphones',
    'earbuds',
    'runner',
    'sneakers',
    'tote',
    'watch',
    'jacket',
    'shoes',
    'audio',
  ];
  const words = q.split(/\s+/);
  let corrected: string | null = null;

  for (const word of words) {
    if (word.length >= 4) {
      for (const target of commonVocabulary) {
        if (word !== target && levenshteinDistance(word, target) <= 2) {
          corrected = q.replace(word, target);
          break;
        }
      }
    }
    if (corrected) break;
  }
  return corrected;
}

function parsePriceValue(val: string): number | null {
  const str = val.toLowerCase().replace(/€|eur|euros?|bdt|\$/gi, '').replace(',', '').trim();
  if (str.endsWith('k')) return parseFloat(str.replace('k', '')) * 1000;
  return parseFloat(str) || null;
}

interface SearchState {
  isOpen: boolean;
  query: string;
  isProcessing: boolean;
  activeDepartment: string;
  recentSearches: string[];
  contextPills: { tag: string; label: string }[];
  openSearch: () => void;
  closeSearch: () => void;
  setQuery: (q: string) => void;
  removeContextPill: (tag: string) => void;
  setActiveDepartment: (dept: string) => void;
  parseIntent: (q: string) => ExtractedIntent;
  getSearchResults: () => SearchResultItem[];
  getTypeaheadResults: () => {
    departments: typeof POPULAR_DEPARTMENTS;
    products: Product[];
    typoCorrection: string | null;
  };
  getSeasonalHighlights: () => Product[];
  loadRecentSearches: () => void;
  saveRecentSearch: (q: string) => void;
  deleteRecentSearch: (q: string) => void;
  clearAllRecentSearches: () => void;
  checkTypo: (q: string) => string | null;
}

const DEFAULT_RECENTS = ['Winter evening in Milan', 'Leather runner sneakers', 'Studio headphones'];

export const useSearchStore = create<SearchState>((set, get) => ({
  isOpen: false,
  query: '',
  isProcessing: false,
  activeDepartment: 'apparel',
  recentSearches: DEFAULT_RECENTS,
  contextPills: [],

  openSearch: () => {
    get().loadRecentSearches();
    set({ isOpen: true });
  },

  closeSearch: () => {
    set({ isOpen: false, query: '' });
  },

  setQuery: (query: string) => {
    const pills = query
      .split(/\s+/)
      .filter((w) => w.length > 2)
      .map((w) => ({
        tag: w,
        label: w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
      }));
    set({ query, contextPills: pills });
  },

  removeContextPill: (tagToRemove: string) => {
    const remaining = get().query
      .split(/\s+/)
      .filter((w) => w.toLowerCase() !== tagToRemove.toLowerCase())
      .join(' ');
    get().setQuery(remaining);
  },

  setActiveDepartment: (activeDepartment: string) => {
    set({ activeDepartment });
  },

  loadRecentSearches: () => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('nex_recent_searches');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        set({ recentSearches: Array.isArray(parsed) ? parsed : [] });
      } else {
        set({ recentSearches: DEFAULT_RECENTS });
      }
    } catch {
      set({ recentSearches: DEFAULT_RECENTS });
    }
  },

  saveRecentSearch: (query: string) => {
    if (!query || query.trim().length < 2) return;
    const clean = query.trim();
    try {
      const current = get().recentSearches.filter(
        (q) => q.toLowerCase() !== clean.toLowerCase()
      );
      const updated = [clean, ...current].slice(0, 5);
      set({ recentSearches: updated });
      if (typeof window !== 'undefined') {
        localStorage.setItem('nex_recent_searches', JSON.stringify(updated));
      }
    } catch {}
  },

  deleteRecentSearch: (query: string) => {
    try {
      const updated = get().recentSearches.filter(
        (q) => q.toLowerCase() !== query.toLowerCase()
      );
      set({ recentSearches: updated });
      if (typeof window !== 'undefined') {
        localStorage.setItem('nex_recent_searches', JSON.stringify(updated));
      }
    } catch {}
  },

  clearAllRecentSearches: () => {
    try {
      set({ recentSearches: [] });
      if (typeof window !== 'undefined') {
        localStorage.setItem('nex_recent_searches', JSON.stringify([]));
      }
    } catch {}
  },

  checkTypo: (q: string) => checkTypoCorrection(q),

  parseIntent: (query: string) => {
    const q = (query || '').toLowerCase().trim();

    let occasion: string | null = null;
    if (/dinner|evening out|date|restaurant|night out/.test(q)) occasion = 'Dinner / Evening';
    else if (/flight|travel|plane|vacation|trip|airport/.test(q)) occasion = 'Travel / Flight';
    else if (/work|office|meeting|desk|business/.test(q)) occasion = 'Work / Office';
    else if (/casual|weekend|everyday|daily|relax/.test(q)) occasion = 'Everyday / Casual';
    else if (/gift|present|birthday|brother|sister|friend/.test(q)) occasion = 'Gift';
    else if (/evening|night|sunset/.test(q)) occasion = 'Evening';

    let climate: string | null = null;
    if (/winter|cold|cool|15.?c|18.?c|20.?c|chilly|autumn|fall/.test(q)) climate = 'Cool Weather (15°C–20°C)';
    else if (/summer|warm|hot|sunny|heat/.test(q)) climate = 'Warm Climate';
    else if (/rain|waterproof|wet/.test(q)) climate = 'Rain & Weather';

    let location: string | null = null;
    if (/milan|milano/.test(q)) location = 'Milan';
    else if (/paris/.test(q)) location = 'Paris';
    else if (/london/.test(q)) location = 'London';
    else if (/tokyo/.test(q)) location = 'Tokyo';
    else if (/munich|münchen/.test(q)) location = 'Munich';
    else if (/new york|nyc/.test(q)) location = 'New York';

    let budgetMax: number | null = null;
    const matchUnder = q.match(/under\s*(?:€|eur|\$)?\s*([\d,]+k?)/i) || q.match(/less\s*than\s*(?:€|eur|\$)?\s*([\d,]+k?)/i);
    const matchAround = q.match(/around\s*(?:€|eur|\$)?\s*([\d,]+k?)/i);
    if (matchUnder) budgetMax = parsePriceValue(matchUnder[1]);
    else if (matchAround) {
      const base = parsePriceValue(matchAround[1]);
      budgetMax = base ? base * 1.15 : null;
    }

    let targetCategory: string | null = null;
    if (/sweater|turtleneck|knit|crew|blazer|clothing|apparel|shirt|trousers|jacket|coat|overcoat/.test(q)) targetCategory = 'Apparel';
    else if (/headphone|earbud|audio|acoustics|music|sound|earphones/.test(q)) targetCategory = 'Audio';
    else if (/shoe|shoes|sneaker|sneakers|runner|runners|footwear|boots/.test(q)) targetCategory = 'Footwear';
    else if (/tote|bag|watch|chronograph|accessories|belt|wallet/.test(q)) targetCategory = 'Accessories';

    return { raw: query, occasion, climate, location, budgetMax, targetCategory };
  },

  getTypeaheadResults: () => {
    const q = get().query.toLowerCase().trim();
    if (!q || q.length < 2) {
      return { departments: [], products: [], typoCorrection: null };
    }

    const matchedDepartments = POPULAR_DEPARTMENTS.filter(
      (d) => d.label.toLowerCase().includes(q) || d.query.includes(q)
    );

    const matchedProducts = MASTER_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(q) || q.includes(t.toLowerCase()))) ||
        p.category.toLowerCase().includes(q) ||
        (p.subCategory && p.subCategory.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q)
    ).slice(0, 4);

    const typoCorrection = matchedProducts.length === 0 && matchedDepartments.length === 0 ? checkTypoCorrection(q) : null;

    return {
      departments: matchedDepartments,
      products: matchedProducts,
      typoCorrection,
    };
  },

  getSeasonalHighlights: () => {
    return MASTER_PRODUCTS.filter((p) => SEASONAL_HIGHLIGHT_IDS.includes(p.id));
  },

  getSearchResults: () => {
    const q = get().query.toLowerCase().trim();
    if (!q) {
      return MASTER_PRODUCTS.slice(0, 4).map((product) => ({
        product,
        matchScore: 98,
        matchReason: product.reasoning || 'Featured atelier piece',
        matchBadge: product.matchBadge || 'RECOMMENDED',
      }));
    }

    const intent = get().parseIntent(q);
    let matches = [...MASTER_PRODUCTS];

    if (intent.budgetMax) {
      matches = matches.filter((p) => p.price <= intent.budgetMax!);
    }

    if (intent.targetCategory) {
      const target = intent.targetCategory.toLowerCase();
      matches = matches.filter(
        (p) =>
          p.category.toLowerCase() === target ||
          (p.subCategory && p.subCategory.toLowerCase() === target) ||
          (p.tags && p.tags.some((t) => t.toLowerCase() === target))
      );
    }

    if (!intent.occasion && !intent.climate && !intent.budgetMax && !intent.targetCategory) {
      matches = matches.filter((p) => {
        const inName = p.name.toLowerCase().includes(q);
        const inBrand = (p.brand || '').toLowerCase().includes(q);
        const inCat = p.category.toLowerCase().includes(q) || (p.subCategory || '').toLowerCase().includes(q);
        const inTags = p.tags ? p.tags.some((t) => t.toLowerCase().includes(q) || q.includes(t.toLowerCase())) : false;
        return inName || inBrand || inCat || inTags;
      });
    }

    if (matches.length === 0) {
      const words = q.split(/\s+/).filter((w) => w.length > 2);
      matches = MASTER_PRODUCTS.filter((p) => {
        return words.some(
          (w) =>
            (p.tags && p.tags.some((t) => t.toLowerCase().includes(w))) ||
            p.name.toLowerCase().includes(w) ||
            p.category.toLowerCase().includes(w)
        );
      });
    }

    return matches.map((product) => {
      let score = 92;
      let reason = product.reasoning || `Matches your search for "${q}"`;

      if (intent.occasion && product.tags?.some((t) => t.includes('evening') || t.includes('dinner'))) {
        score = 98;
        reason = product.reasoning || `Ideal choice for ${intent.occasion}`;
      } else if (intent.climate && product.tags?.some((t) => t.includes('warm') || t.includes('winter') || t.includes('cool'))) {
        score = 96;
        reason = product.reasoning || `Engineered for ${intent.climate}`;
      }

      return {
        product,
        matchScore: score,
        matchReason: reason,
        matchBadge: product.matchBadge || 'RECOMMENDED',
      };
    });
  },
}));
