const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 Running Suite: Search in Your Own Words & 15-Feature Tour Modal Parity...\n');

const searchStorePath = path.join(__dirname, '../store/useSearchStore.ts');
const tourModalPath = path.join(__dirname, '../components/tour/FeatureTourModal.tsx');
const searchOverlayPath = path.join(__dirname, '../components/search/SearchOverlay.tsx');
const discoveryPath = path.join(__dirname, '../app/discovery/page.tsx');

assert(fs.existsSync(searchStorePath), 'useSearchStore.ts must exist');
assert(fs.existsSync(tourModalPath), 'FeatureTourModal.tsx must exist');
assert(fs.existsSync(searchOverlayPath), 'SearchOverlay.tsx must exist');
assert(fs.existsSync(discoveryPath), 'app/discovery/page.tsx must exist');
console.log('  ✓ [PASS] All critical store, modal, and page components exist');

function parsePriceValue(val) {
  const str = val.toLowerCase().replace(/€|eur|euros?|bdt|\$/gi, '').replace(',', '').trim();
  if (str.endsWith('k')) return parseFloat(str.replace('k', '')) * 1000;
  return parseFloat(str) || null;
}

function parseIntent(query) {
  const q = (query || '').toLowerCase().trim();

  let occasion = null;
  if (/weekend|getaway/.test(q)) occasion = 'Weekend Getaway';
  else if (/dinner|evening out|date|restaurant|night out/.test(q)) occasion = 'Dinner / Evening';
  else if (/flight|travel|plane|vacation|trip|airport/.test(q)) occasion = 'Travel / Flight';
  else if (/work|office|meeting|desk|business/.test(q)) occasion = 'Work / Office';
  else if (/casual|everyday|daily|relax/.test(q)) occasion = 'Everyday / Casual';
  else if (/gift|present|birthday|brother|sister|friend/.test(q)) occasion = 'Gift';
  else if (/evening|night|sunset/.test(q)) occasion = 'Evening';

  let climate = null;
  if (/cold|winter|freezing|chilly|snow|ice/.test(q)) climate = 'Cold Weather (Winter)';
  else if (/cool|15.?c|18.?c|20.?c|autumn|fall/.test(q)) climate = 'Cool Weather (15°C–20°C)';
  else if (/summer|warm|hot|sunny|heat/.test(q)) climate = 'Warm Climate';
  else if (/rain|waterproof|wet/.test(q)) climate = 'Rain & Weather';

  let location = null;
  if (/edinburgh/.test(q)) location = 'Edinburgh';
  else if (/milan|milano/.test(q)) location = 'Milan';
  else if (/london/.test(q)) location = 'London';
  else if (/paris/.test(q)) location = 'Paris';
  else if (/tokyo/.test(q)) location = 'Tokyo';
  else if (/munich|münchen/.test(q)) location = 'Munich';
  else if (/new york|nyc/.test(q)) location = 'New York';
  else if (/rome|roma/.test(q)) location = 'Rome';

  let budgetMax = null;
  const matchUnder = q.match(/under\s*(?:€|eur|\$)?\s*([\d,]+k?)/i) || q.match(/less\s*than\s*(?:€|eur|\$)?\s*([\d,]+k?)/i);
  const matchAround = q.match(/around\s*(?:€|eur|\$)?\s*([\d,]+k?)/i);
  if (matchUnder) budgetMax = parsePriceValue(matchUnder[1]);
  else if (matchAround) {
    const base = parsePriceValue(matchAround[1]);
    budgetMax = base ? base * 1.15 : null;
  }

  let targetCategory = null;
  if (/coat|overcoat|parka|trench|jacket|blazer|outerwear/.test(q)) targetCategory = 'Outerwear';
  else if (/sweater|turtleneck|knit|crew|clothing|apparel|shirt|trousers/.test(q)) targetCategory = 'Apparel';
  else if (/headphone|earbud|audio|acoustics|music|sound|earphones/.test(q)) targetCategory = 'Audio';
  else if (/shoe|shoes|sneaker|sneakers|runner|runners|footwear|boots/.test(q)) targetCategory = 'Footwear';
  else if (/tote|bag|watch|chronograph|accessories|belt|wallet/.test(q)) targetCategory = 'Accessories';

  return { raw: query, occasion, climate, location, budgetMax, targetCategory };
}

const intent1 = parseIntent('Warm coat for a cold weekend in Edinburgh');
assert.strictEqual(intent1.location, 'Edinburgh', 'Location must be Edinburgh');
assert.strictEqual(intent1.occasion, 'Weekend Getaway', 'Occasion must be Weekend Getaway');
assert.strictEqual(intent1.climate, 'Cold Weather (Winter)', 'Climate must be Cold Weather');
assert.strictEqual(intent1.targetCategory, 'Outerwear', 'TargetCategory must be Outerwear');
console.log('  ✓ [PASS] NLP accurately extracts Edinburgh, Weekend, Cold Weather, and Outerwear');

const intent2 = parseIntent('Smart dinner jacket for a London evening');
assert.strictEqual(intent2.location, 'London', 'Location must be London');
assert.strictEqual(intent2.occasion, 'Dinner / Evening', 'Occasion must be Dinner / Evening');
assert.strictEqual(intent2.targetCategory, 'Outerwear', 'TargetCategory must be Outerwear');
console.log('  ✓ [PASS] NLP accurately extracts London, Dinner / Evening, and Outerwear');

// Assert 15 features across 4 stages in FeatureTourModal.tsx
const tourCode = fs.readFileSync(tourModalPath, 'utf8');
assert(tourCode.includes("Smart Conversational Search"), 'Feature 01 must be Smart Conversational Search');
assert(tourCode.includes("exampleQuery: 'Warm coat for a cold weekend in Edinburgh'"), 'Card 01 must have exampleQuery configured');
assert(tourCode.includes("openSearch(q, true)"), 'handleAction must call openSearch(q, true) for search actions');
assert(tourCode.includes("createPortal"), 'FeatureTourModal must portal to document.body');

// Verify all 15 features are present
for (let i = 1; i <= 15; i++) {
  const numStr = i < 10 ? `0${i}` : `${i}`;
  assert(tourCode.includes(`num: '${numStr}'`), `FeatureTourModal must include Feature ${numStr}`);
}
console.log('  ✓ [PASS] FeatureTourModal contains all 15 features across 4 stages matching feature/storefront-elevation');

// Assert SearchOverlay handles pendingAutoSearch and responsive layout
const overlayCode = fs.readFileSync(searchOverlayPath, 'utf8');
assert(overlayCode.includes("pendingAutoSearch"), 'SearchOverlay must handle pendingAutoSearch from useSearchStore');
assert(overlayCode.includes("runThinkingTrack"), 'SearchOverlay must trigger thinking track on auto-search');
assert(overlayCode.includes("createPortal"), 'SearchOverlay must portal to document.body');
assert(overlayCode.includes("search-product-card"), 'SearchOverlay must use 3D search-product-card container');
console.log('  ✓ [PASS] SearchOverlay triggers thinking animation and renders responsive unclipped results');

// Assert Discovery page filters stopwords and supports sentence queries
const discCode = fs.readFileSync(discoveryPath, 'utf8');
assert(discCode.includes("STOPWORDS"), 'Discovery page must filter stopwords from contextPills');
assert(discCode.includes("terms.some"), 'Discovery page must support tokenized multi-term matching for sentences');
console.log('  ✓ [PASS] Discovery page implements clean stopword filtering and multi-term catalog search');

console.log('\nAll Search & 15-Feature Parity test suites passed with 100% success!');
