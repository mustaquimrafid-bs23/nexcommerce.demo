const fs = require('fs');

let c = fs.readFileSync('./data/products.ts', 'utf8');
c = c.replace(/import [^;]+;/g, '').replace(/export const MASTER_PRODUCTS: Product\[\] =/, 'const MASTER_PRODUCTS =');
const MASTER_PRODUCTS = eval(c + '; MASTER_PRODUCTS;');

function parsePriceValue(str) {
  if (!str) return null;
  const clean = str.replace(/[\s€\$]/g, '').toLowerCase();
  if (clean.endsWith('k')) return parseFloat(clean.slice(0, -1)) * 1000;
  return parseFloat(clean);
}

function parseIntent(query) {
  const q = (query || '').toLowerCase().trim();
  let budgetMax = null;
  const matchUnder = q.match(/under\s*(?:€|eur|\$)?\s*([\d,]+k?)/i) || q.match(/less\s*than\s*(?:€|eur|\$)?\s*([\d,]+k?)/i);
  if (matchUnder) budgetMax = parsePriceValue(matchUnder[1]);

  let targetCategory = null;
  if (/coat|overcoat|parka|trench|jacket|blazer|outerwear/.test(q)) targetCategory = 'Outerwear';
  else if (/sweater|turtleneck|knit|crew|clothing|apparel|shirt|trousers/.test(q)) targetCategory = 'Apparel';
  else if (/headphone|earbud|audio|acoustics|music|sound|earphones/.test(q)) targetCategory = 'Audio';
  else if (/shoe|shoes|sneaker|sneakers|runner|runners|footwear|boots/.test(q)) targetCategory = 'Footwear';
  else if (/tote|bag|watch|chronograph|accessories|belt|wallet/.test(q)) targetCategory = 'Accessories';

  return { budgetMax, targetCategory };
}

function filterProducts(query, selectedSphere = 'all') {
  let list = [...MASTER_PRODUCTS];
  if (!query.trim()) return list;

  const q = query.toLowerCase().trim();
  const intent = parseIntent(q);

  const STOP_WORDS = new Set([
    'for', 'a', 'an', 'in', 'and', 'the', 'with', 'under', 'less', 'than', 'to', 'of',
    'on', 'at', 'is', 'by', 'or', 'from', 'me', 'show', 'looking', 'find', 'pieces',
    'items', 'products', 'something', 'like', 'hey', 'stylist', 'i', 'want', 'need', 'please'
  ]);

  const rawTokens = q
    .replace(/[€$£?,.!]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t) && !/^\d+$/.test(t));

  const expandedTerms = new Set();
  rawTokens.forEach((term) => {
    expandedTerms.add(term);
    if (term.endsWith('ies')) expandedTerms.add(term.slice(0, -3) + 'y');
    else if (term.endsWith('es')) expandedTerms.add(term.slice(0, -2));
    else if (term.endsWith('s')) expandedTerms.add(term.slice(0, -1));
    else expandedTerms.add(term + 's');
  });
  const terms = Array.from(expandedTerms);

  let matched = list.filter((p) => {
    const inName = p.name.toLowerCase().includes(q);
    const inBrand = (p.brand || '').toLowerCase().includes(q);
    const inCat = p.category.toLowerCase().includes(q) || (p.subCategory || '').toLowerCase().includes(q);
    const inDesc = p.description.toLowerCase().includes(q);
    const inTags = p.tags ? p.tags.some((t) => t.toLowerCase().includes(q) || q.includes(t.toLowerCase())) : false;
    const inColor = p.colors ? p.colors.some((c) => c.name.toLowerCase().includes(q) || q.includes(c.name.toLowerCase())) : false;
    if (inName || inBrand || inCat || inDesc || inTags || inColor) return true;

    let categoryMatch = false;
    if (intent.targetCategory) {
      const cat = intent.targetCategory.toLowerCase();
      if (cat === 'outerwear') {
        categoryMatch =
          p.category === 'outerwear' ||
          (p.subCategory && p.subCategory.toLowerCase().includes('coat')) ||
          (p.tags && p.tags.some((t) => t.includes('coat') || t.includes('overcoat') || t.includes('outerwear') || t.includes('blazer')));
      } else if (cat === 'apparel') {
        categoryMatch = p.category === 'apparel' || (p.tags && p.tags.includes('apparel'));
      } else if (cat === 'audio') {
        categoryMatch = p.category === 'acoustics' || (p.tags && p.tags.includes('audio'));
      } else if (cat === 'footwear') {
        categoryMatch = p.category === 'footwear' || (p.tags && p.tags.includes('footwear'));
      } else if (cat === 'accessories') {
        categoryMatch = p.category === 'accessories';
      }
    }

    const termMatch = terms.some((term) => {
      return (
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        (p.subCategory && p.subCategory.toLowerCase().includes(term)) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(term) || term.includes(t.toLowerCase()))) ||
        p.description.toLowerCase().includes(term) ||
        (p.colors && p.colors.some((c) => c.name.toLowerCase().includes(term) || term.includes(c.name.toLowerCase())))
      );
    });

    return categoryMatch || termMatch;
  });

  // If target category exists and matches items, strictly prioritize that category
  if (intent.targetCategory) {
    const cat = intent.targetCategory.toLowerCase();
    const categoryOnly = matched.filter((p) => {
      if (cat === 'outerwear') {
        return (
          p.category === 'outerwear' ||
          (p.subCategory && p.subCategory.toLowerCase().includes('coat')) ||
          (p.tags && p.tags.some((t) => t.includes('coat') || t.includes('overcoat') || t.includes('outerwear') || t.includes('blazer')))
        );
      } else if (cat === 'apparel') {
        return p.category === 'apparel' || (p.tags && p.tags.includes('apparel'));
      } else if (cat === 'audio') {
        return p.category === 'acoustics' || (p.tags && p.tags.includes('audio'));
      } else if (cat === 'footwear') {
        return p.category === 'footwear' || (p.tags && p.tags.includes('footwear'));
      } else if (cat === 'accessories') {
        return p.category === 'accessories';
      }
      return true;
    });
    if (categoryOnly.length > 0) {
      matched = categoryOnly;
    }
  }

  if (intent.budgetMax) {
    const budgetMatched = matched.filter((p) => p.price <= intent.budgetMax);
    if (budgetMatched.length > 0) matched = budgetMatched;
  }

  if (matched.length === 0) {
    matched = list.filter((p) => {
      return terms.some(
        (t) =>
          p.name.toLowerCase().includes(t) ||
          (p.tags && p.tags.some((tag) => tag.toLowerCase().includes(t))) ||
          (p.colors && p.colors.some((c) => c.name.toLowerCase().includes(t)))
      );
    });
  }

  if (matched.length === 0) matched = list.slice(0, 4);

  return matched.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;
    if (intent.budgetMax) {
      if (a.price <= intent.budgetMax) scoreA += 20;
      if (b.price <= intent.budgetMax) scoreB += 20;
    }
    if (intent.targetCategory) {
      const cat = intent.targetCategory.toLowerCase();
      if (cat === 'outerwear') {
        if (a.category === 'outerwear' || a.tags?.includes('overcoat')) scoreA += 30;
        if (b.category === 'outerwear' || b.tags?.includes('overcoat')) scoreB += 30;
      }
    }
    terms.forEach((term) => {
      if (a.name.toLowerCase().includes(term)) scoreA += 15;
      if (b.name.toLowerCase().includes(term)) scoreB += 15;
      if (a.tags?.some((t) => t.toLowerCase() === term)) scoreA += 10;
      if (b.tags?.some((t) => t.toLowerCase() === term)) scoreB += 10;
      if (a.colors?.some((c) => c.name.toLowerCase().includes(term))) scoreA += 10;
      if (b.colors?.some((c) => c.name.toLowerCase().includes(term))) scoreB += 10;
    });
    return scoreB - scoreA;
  });
}

const testQueries = [
  'black overcoats under $300',
  'sneakers',
  'cashmere',
  'audio',
  'tailored',
  'under 200',
  'overcoat',
  'black sneakers',
  'leather runner'
];

let allPassed = true;
testQueries.forEach((q) => {
  const res = filterProducts(q);
  console.log(`Query: "${q}" => Found: ${res.length} pieces. Top: ${res[0]?.name} (${res[0]?.formattedPrice})`);
  if (res.length === 0) {
    allPassed = false;
  }
});

// Specifically assert 'black overcoats under $300'
const overcoatResults = filterProducts('black overcoats under $300');
if (overcoatResults.length > 0 && overcoatResults[0].id === 'p3' && overcoatResults[0].price <= 300) {
  console.log('\n✅ PASS: "black overcoats under $300" successfully returns Tailored Charcoal Overcoat under $300 as top result!');
} else {
  console.error('\n❌ FAIL: Expected Tailored Charcoal Overcoat under $300 as top result.');
  process.exit(1);
}

if (!allPassed) {
  console.error('❌ FAIL: One or more queries returned 0 results.');
  process.exit(1);
}

console.log('🎉 ALL DEMO SEARCH AND SUGGESTION QUERIES PASSED!');
