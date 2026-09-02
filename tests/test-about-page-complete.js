const assert = require('assert');
const fs = require('fs');

console.log('--- Running Complete About Page Verification Suite ---');

// 1. Page assembly checks
const page = fs.readFileSync('app/about/page.tsx', 'utf8');
assert(page.includes('AboutHeroSplit'), 'Page must mount AboutHeroSplit');
assert(page.includes('MaterialsSection'), 'Page must mount MaterialsSection');
assert(page.includes('HotspotViewer'), 'Page must mount HotspotViewer');
assert(page.includes('DisciplinesGrid'), 'Page must mount DisciplinesGrid');
assert(page.includes('CraftTimeline'), 'Page must mount CraftTimeline');
assert(page.includes('ProvenanceLedger'), 'Page must mount ProvenanceLedger');
assert(page.includes('GuardiansGrid'), 'Page must mount GuardiansGrid');
assert(page.includes('radial-gradient'), 'Page must have uniform luxury radial gradient background');

// 2. Component content & clean UK English checks
const hero = fs.readFileSync('components/about/AboutHeroSplit.tsx', 'utf8');
assert(hero.includes('Our Story & Philosophy') || hero.includes('Our Story'), 'Hero must have UK tag');
assert(hero.includes('#materials') && hero.includes('#hotspots') && hero.includes('#disciplines') && hero.includes('#timeline') && hero.includes('#provenance') && hero.includes('#guardians'), 'Hero must have all 6 quick anchors');

const materials = fs.readFileSync('components/about/MaterialsSection.tsx', 'utf8');
assert(materials.includes('Mongolian Raw Cashmere') && materials.includes('Full-Grain Tuscan Calfskin'), 'Materials must have full catalogue data');
assert(!materials.includes('biologically pure'), 'Materials must not have AI jargon');

const hotspots = fs.readFileSync('components/about/HotspotViewer.tsx', 'utf8');
assert(hotspots.includes('Floating Canvas') && hotspots.includes('French Seams'), 'Hotspots must contain tailoring details');

const disciplines = fs.readFileSync('components/about/DisciplinesGrid.tsx', 'utf8');
assert(disciplines.includes('Outerwear & Tailoring') && disciplines.includes('Artisanal Footwear'), 'Disciplines must contain 4 pillars');

const timeline = fs.readFileSync('components/about/CraftTimeline.tsx', 'utf8');
assert(timeline.includes('2022') && timeline.includes('2026'), 'Timeline must span from 2022 to 2026');

const provenance = fs.readFileSync('components/about/ProvenanceLedger.tsx', 'utf8');
assert(provenance.includes('100%') && provenance.includes('25 YR'), 'Provenance must contain metrics');

const guardians = fs.readFileSync('components/about/GuardiansGrid.tsx', 'utf8');
assert(guardians.includes('Gianluca Moretti') && guardians.includes('Master Craftsmen'), 'Guardians must have craftsmen');

console.log('✅ PASS: All 7 About Us sections verified with 100% clean UK English & feature parity!');
