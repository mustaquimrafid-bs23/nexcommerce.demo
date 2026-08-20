(function(window) {
  'use strict';

  var STORAGE_KEY = 'nexcommerce_style_profile';

  var ALLOWED_STYLES = ['minimal', 'classic', 'casual', 'formal', 'trendy', 'sporty',
    'quiet-luxury', 'alpine-thermal', 'nordic-minimal', 'nocturne', 'transit-ease', 'atelier-craft'];
  var ALLOWED_FITS = ['fitted', 'regular', 'relaxed', 'oversized'];
  var ALLOWED_COLORS = ['black', 'white', 'neutral', 'earth tones', 'blue', 'bright colors', 'pastels',
    'obsidian', 'charcoal', 'slate', 'pearl', 'ivory', 'oatmeal', 'tuscan clay', 'forest', 'navy',
    'cyan mist', 'lilac', 'rose'];
  var ALLOWED_LIFESTYLES = ['office', 'everyday', 'travel', 'fitness', 'outdoor', 'social', 'formal events'];

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  }

  function validateArray(arr, allowed) {
    if (!Array.isArray(arr)) return [];
    return arr.filter(function(item) {
      return allowed.includes(item.toLowerCase());
    });
  }

  function validateSingle(val, allowed) {
    if (!val) return null;
    var lower = val.toLowerCase();
    return allowed.includes(lower) ? lower : null;
  }

  function save(profileData) {
    var validated = {
      customerId: 'guest_or_auth_id',
      stylePreferences: validateArray(profileData.stylePreferences, ALLOWED_STYLES),
      fitPreference: validateSingle(profileData.fitPreference, ALLOWED_FITS),
      colorPreferences: validateArray(profileData.colorPreferences, ALLOWED_COLORS),
      lifestylePreferences: validateArray(profileData.lifestylePreferences, ALLOWED_LIFESTYLES),
      personalizationEnabled: profileData.personalizationEnabled !== false,
      updatedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
      if (window.dataLayer) window.dataLayer.push({ event: 'ai_profile_saved' });
      return true;
    } catch (e) {
      if (window.dataLayer) window.dataLayer.push({ event: 'ai_profile_save_failed' });
      return false;
    }
  }

  function remove() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      if (window.dataLayer) window.dataLayer.push({ event: 'ai_profile_deleted' });
      return true;
    } catch (e) {
      return false;
    }
  }

  function getActiveProfile() {
    var profile = load();
    if (profile && profile.personalizationEnabled) {
      return profile;
    }
    return null;
  }

  window.NexStyleProfile = {
    load: load,
    save: save,
    remove: remove,
    getActiveProfile: getActiveProfile
  };

  /* ── UI Logic for profile.html ──────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProfileUI);
  } else {
    initProfileUI();
  }

  function initProfileUI() {
    if (!document.getElementById('aiProfileContainer')) return;

    if (window.dataLayer) window.dataLayer.push({ event: 'ai_profile_opened' });

    /* ── Data constants ──────────────────────────────────────────────── */
    const ARCHETYPES = [
      { id: 'quiet-luxury',   label: 'Quiet Luxury',   icon: '◆', axes: [9, 3, 7, 5, 2, 8] },
      { id: 'alpine-thermal', label: 'Alpine Thermal',  icon: '❄', axes: [4, 8, 5, 9, 6, 3] },
      { id: 'nordic-minimal', label: 'Nordic Minimal',  icon: '▲', axes: [10, 2, 8, 4, 3, 6] },
      { id: 'nocturne',       label: 'Nocturne',        icon: '◉', axes: [6, 5, 4, 8, 9, 5] },
      { id: 'transit-ease',   label: 'Transit Ease',    icon: '◈', axes: [5, 7, 6, 4, 7, 8] },
      { id: 'atelier-craft',  label: 'Atelier Craft',   icon: '✦', axes: [8, 4, 9, 6, 2, 7] }
    ];

    const RADAR_AXES = [
      { label: 'TAILORING', angle: -90 },
      { label: 'ACOUSTICS', angle: -30 },
      { label: 'CRAFT',     angle: 30  },
      { label: 'FOOTWEAR',  angle: 90  },
      { label: 'LIFESTYLE', angle: 150 },
      { label: 'MINIMAL',   angle: 210 }
    ];

    const COLOURS = [
      { name: 'Obsidian',    hex: '#0D131F' },
      { name: 'Charcoal',    hex: '#374151' },
      { name: 'Slate',       hex: '#64748B' },
      { name: 'Pearl',       hex: '#F1F5F9' },
      { name: 'Ivory',       hex: '#FFFBEB' },
      { name: 'Oatmeal',     hex: '#D6C7B2' },
      { name: 'Tuscan Clay', hex: '#92400E' },
      { name: 'Forest',      hex: '#14532D' },
      { name: 'Navy',        hex: '#1E3A5F' },
      { name: 'Cyan Mist',   hex: '#3DE0FF' },
      { name: 'Lilac',       hex: '#A78BFA' },
      { name: 'Rose',        hex: '#FB7185' }
    ];

    const LIFESTYLE_AXES = [
      { id: 'travel',   label: 'Travel',   defaultVal: 7 },
      { id: 'office',   label: 'Office',   defaultVal: 5 },
      { id: 'fitness',  label: 'Fitness',  defaultVal: 4 },
      { id: 'social',   label: 'Social',   defaultVal: 6 },
      { id: 'outdoor',  label: 'Outdoor',  defaultVal: 3 },
      { id: 'everyday', label: 'Everyday', defaultVal: 9 }
    ];

    const CURATED_LOOKS = [
      {
        id: 'look-tailoring',
        tag: 'FOR YOUR DNA',
        title: 'The Tailoring Capsule',
        price: 'From € 185.00',
        image: '../assets/images/lifestyle/hero_sweater_landscape.jpg',
        href: 'category.html?cat=outerwear'
      },
      {
        id: 'look-acoustics',
        tag: 'ACOUSTIC EDIT',
        title: 'Studio Acoustics Series',
        price: 'From € 165.00',
        image: '../assets/images/lifestyle/hero_headphone_landscape.jpg',
        href: 'category.html?cat=acoustics'
      },
      {
        id: 'look-footwear',
        tag: 'YOUR ARCHETYPE',
        title: 'The Architectural Runner',
        price: 'From € 198.00',
        image: '../assets/images/lifestyle/hero_runner_landscape.jpg',
        href: 'category.html?cat=footwear'
      }
    ];

    /* ── Mutable state ───────────────────────────────────────────────── */
    let activeArchetypeId = 'quiet-luxury';
    let activeColours = new Set();
    const lifestyleValues = {};
    LIFESTYLE_AXES.forEach(a => { lifestyleValues[a.id] = a.defaultVal; });

    /* ── Radar engine ────────────────────────────────────────────────── */
    function polarToXY(angleDeg, radius, cx, cy) {
      const rad = (angleDeg - 90) * (Math.PI / 180);
      return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
    }

    function renderRadarChart(axisValues) {
      const svg = document.getElementById('radarSvgCanvas');
      if (!svg) return;
      const cx = 160, cy = 160, maxR = 120;
      svg.innerHTML = '';

      [0.33, 0.66, 1].forEach(scale => {
        const pts = RADAR_AXES.map(a => {
          const { x, y } = polarToXY(a.angle, maxR * scale, cx, cy);
          return `${x},${y}`;
        }).join(' ');
        const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        poly.setAttribute('points', pts);
        poly.setAttribute('fill', 'none');
        poly.setAttribute('stroke', 'rgba(255,255,255,0.06)');
        poly.setAttribute('stroke-width', '1');
        svg.appendChild(poly);
      });

      RADAR_AXES.forEach(a => {
        const { x, y } = polarToXY(a.angle, maxR, cx, cy);
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', cx); line.setAttribute('y1', cy);
        line.setAttribute('x2', x);  line.setAttribute('y2', y);
        line.setAttribute('stroke', 'rgba(255,255,255,0.08)');
        line.setAttribute('stroke-width', '1');
        svg.appendChild(line);
      });

      const dataPoints = axisValues.map((val, i) => {
        const r = (val / 10) * maxR;
        return polarToXY(RADAR_AXES[i].angle, r, cx, cy);
      });
      const dataPoly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      dataPoly.setAttribute('points', dataPoints.map(p => `${p.x},${p.y}`).join(' '));
      dataPoly.setAttribute('fill', 'rgba(61, 224, 255, 0.12)');
      dataPoly.setAttribute('stroke', '#3DE0FF');
      dataPoly.setAttribute('stroke-width', '1.5');
      dataPoly.setAttribute('stroke-linejoin', 'round');
      svg.appendChild(dataPoly);

      dataPoints.forEach(pt => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', pt.x); circle.setAttribute('cy', pt.y);
        circle.setAttribute('r', '4');
        circle.setAttribute('fill', '#3DE0FF');
        circle.setAttribute('stroke', '#020B18');
        circle.setAttribute('stroke-width', '2');
        svg.appendChild(circle);
      });

      /* Axis labels as foreignObject-free SVG text */
      RADAR_AXES.forEach(a => {
        const { x, y } = polarToXY(a.angle, maxR + 22, cx, cy);
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('fill', 'rgba(255,255,255,0.35)');
        text.setAttribute('font-family', 'Inter, sans-serif');
        text.setAttribute('font-size', '8');
        text.setAttribute('font-weight', '600');
        text.setAttribute('letter-spacing', '0.1em');
        text.textContent = a.label;
        svg.appendChild(text);
      });
    }

    /* ── Archetype grid ──────────────────────────────────────────────── */
    function renderArchetypeGrid() {
      const grid = document.getElementById('aestheticArchetypeGrid');
      if (!grid) return;
      grid.innerHTML = ARCHETYPES.map(a => `
        <button class="archetype-card${a.id === activeArchetypeId ? ' active' : ''}"
          data-archetype="${a.id}" aria-pressed="${a.id === activeArchetypeId}"
          type="button" title="${a.label}">
          <span class="archetype-icon" aria-hidden="true">${a.icon}</span>
          <span class="archetype-label">${a.label}</span>
        </button>
      `).join('');
    }

    /* ── Colour wheel ────────────────────────────────────────────────── */
    function renderColourWheel() {
      const wheel = document.getElementById('colourDnaWheel');
      if (!wheel) return;
      const lightSwatches = ['#F1F5F9', '#FFFBEB', '#D6C7B2'];
      wheel.innerHTML = COLOURS.map(c => {
        const isLight = lightSwatches.includes(c.hex);
        const borderStyle = isLight ? 'border: 1px solid rgba(255,255,255,0.15);' : '';
        const isActive = activeColours.has(c.name);
        return `<button class="colour-dna-swatch${isActive ? ' active' : ''}"
          data-colour="${c.name}"
          style="background-color: ${c.hex}; ${borderStyle}"
          title="${c.name}" aria-label="${c.name}" aria-pressed="${isActive}"
          type="button"></button>`;
      }).join('');
    }

    /* ── Lifestyle grid ──────────────────────────────────────────────── */
    function renderLifestyleGrid() {
      const grid = document.getElementById('lifestyleIntensityGrid');
      if (!grid) return;
      grid.innerHTML = LIFESTYLE_AXES.map(a => {
        const pct = (lifestyleValues[a.id] / 10) * 100;
        return `
          <div class="lifestyle-row">
            <span class="lifestyle-row-label">${a.label}</span>
            <div class="lifestyle-intensity-track" data-axis="${a.id}" role="slider"
              aria-label="${a.label} intensity" aria-valuenow="${lifestyleValues[a.id]}"
              aria-valuemin="0" aria-valuemax="10" tabindex="0">
              <div class="lifestyle-intensity-fill" style="width: ${pct}%;"></div>
              <div class="lifestyle-intensity-thumb" style="left: calc(${pct}% - 7px);"></div>
            </div>
            <span class="lifestyle-intensity-value">${lifestyleValues[a.id]}</span>
          </div>`;
      }).join('');
    }

    /* ── AI Look Pinboard ────────────────────────────────────────────── */
    function renderAiLookPinboard() {
      const pinboard = document.getElementById('aiLookPinboard');
      if (!pinboard) return;
      pinboard.innerHTML = CURATED_LOOKS.map(look => `
        <a href="${look.href}" class="look-pin-card" data-look="${look.id}" aria-label="Explore ${look.title}">
          <img src="${look.image}" alt="${look.title}" class="look-pin-img" loading="lazy">
          <div class="look-pin-meta">
            <span class="look-pin-tag">${look.tag}</span>
            <div class="look-pin-title">${look.title}</div>
            <div class="look-pin-price">${look.price}</div>
          </div>
        </a>
      `).join('');
    }

    /* ── Event delegation ────────────────────────────────────────────── */
    const archetypeGrid = document.getElementById('aestheticArchetypeGrid');
    if (archetypeGrid) {
      archetypeGrid.addEventListener('click', e => {
        const card = e.target.closest('.archetype-card');
        if (!card) return;
        const id = card.getAttribute('data-archetype');
        activeArchetypeId = id;
        const archetype = ARCHETYPES.find(a => a.id === id);
        if (archetype) {
          renderRadarChart(archetype.axes);
          renderArchetypeGrid();
          const badge = document.getElementById('radarArchetypeBadge');
          if (badge) badge.textContent = archetype.label.toUpperCase();
        }
      });
    }

    const colourWheel = document.getElementById('colourDnaWheel');
    if (colourWheel) {
      colourWheel.addEventListener('click', e => {
        const swatch = e.target.closest('.colour-dna-swatch');
        if (!swatch) return;
        const name = swatch.getAttribute('data-colour');
        if (activeColours.has(name)) {
          activeColours.delete(name);
        } else {
          activeColours.add(name);
        }
        renderColourWheel();
      });
    }

    const lifestyleGrid = document.getElementById('lifestyleIntensityGrid');
    if (lifestyleGrid) {
      lifestyleGrid.addEventListener('click', e => {
        const track = e.target.closest('.lifestyle-intensity-track');
        if (!track) return;
        const rect = track.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const val = Math.round(ratio * 10);
        const axis = track.getAttribute('data-axis');
        lifestyleValues[axis] = val;
        renderLifestyleGrid();
      });
    }

    const saveBtn = document.getElementById('profileSaveBtn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const archetype = ARCHETYPES.find(a => a.id === activeArchetypeId);
        const profileData = {
          stylePreferences: archetype ? [archetype.id] : [],
          fitPreference: 'regular',
          colorPreferences: Array.from(activeColours),
          lifestylePreferences: Object.entries(lifestyleValues)
            .filter(([, v]) => v >= 6)
            .map(([k]) => k),
          personalizationEnabled: document.getElementById('togglePersonalization')?.checked !== false
        };
        const ok = window.NexStyleProfile.save(profileData);
        const msgBox = document.getElementById('profileMsg');
        if (msgBox) {
          msgBox.textContent = ok ? 'DNA profile saved.' : 'Could not save. Try again.';
          msgBox.style.display = 'block';
          msgBox.style.color = ok ? '#34D399' : '#FB7185';
          setTimeout(() => { msgBox.style.display = 'none'; }, 4000);
        }
      });
    }

    const resetBtn = document.getElementById('profileResetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        activeArchetypeId = 'quiet-luxury';
        activeColours.clear();
        LIFESTYLE_AXES.forEach(a => { lifestyleValues[a.id] = a.defaultVal; });
        const archetype = ARCHETYPES.find(a => a.id === 'quiet-luxury');
        renderRadarChart(archetype.axes);
        renderArchetypeGrid();
        renderColourWheel();
        renderLifestyleGrid();
        const badge = document.getElementById('radarArchetypeBadge');
        if (badge) badge.textContent = 'QUIET LUXURY';
      });
    }

    /* ── Populate from saved profile ─────────────────────────────────── */
    const existingProfile = window.NexStyleProfile.load();
    if (existingProfile) {
      if (existingProfile.stylePreferences && existingProfile.stylePreferences[0]) {
        const match = ARCHETYPES.find(a => a.id === existingProfile.stylePreferences[0]);
        if (match) activeArchetypeId = match.id;
      }
      (existingProfile.colorPreferences || []).forEach(c => {
        const match = COLOURS.find(col => col.name.toLowerCase() === c.toLowerCase());
        if (match) activeColours.add(match.name);
      });
      (existingProfile.lifestylePreferences || []).forEach(id => {
        if (lifestyleValues[id] !== undefined) lifestyleValues[id] = 8;
      });
      const toggle = document.getElementById('togglePersonalization');
      if (toggle) toggle.checked = existingProfile.personalizationEnabled !== false;
    }

    /* ── Initial render ──────────────────────────────────────────────── */
    const initialArchetype = ARCHETYPES.find(a => a.id === activeArchetypeId) || ARCHETYPES[0];
    renderRadarChart(initialArchetype.axes);
    renderArchetypeGrid();
    renderColourWheel();
    renderLifestyleGrid();
    renderAiLookPinboard();
    const initBadge = document.getElementById('radarArchetypeBadge');
    if (initBadge) initBadge.textContent = initialArchetype.label.toUpperCase();
  }

})(window);
