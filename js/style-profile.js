(function(window) {
  'use strict';

  var STORAGE_KEY = 'nexcommerce_style_profile';

  var ALLOWED_STYLES = ['minimal', 'classic', 'casual', 'formal', 'trendy', 'sporty',
    'quiet-luxury', 'alpine-thermal', 'nordic-minimal', 'nocturne', 'transit-ease', 'atelier-craft'];
  var ALLOWED_FITS = ['fitted', 'regular', 'relaxed', 'oversized', 'slim'];
  var ALLOWED_COLORS = ['black', 'white', 'neutral', 'earth tones', 'blue', 'bright colors', 'pastels',
    'obsidian', 'charcoal', 'slate', 'pearl', 'ivory', 'oatmeal', 'tuscan clay', 'forest', 'navy',
    'cyan mist', 'lilac', 'rose'];
  var ALLOWED_LIFESTYLES = ['office', 'everyday', 'travel', 'fitness', 'outdoor', 'social', 'formal events', 'work', 'weekend', 'active'];

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
      stylePreferences: validateArray(profileData.stylePreferences || [profileData.activeArchetype || 'quiet-luxury'], ALLOWED_STYLES),
      fitPreference: validateSingle(profileData.fitPreference || 'relaxed', ALLOWED_FITS),
      colorPreferences: validateArray(profileData.colorPreferences || [], ALLOWED_COLORS),
      lifestylePreferences: validateArray(profileData.lifestylePreferences || [], ALLOWED_LIFESTYLES),
      lifestyleValues: profileData.lifestyleValues || {},
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

    /* ── 4 Visual Clothing Styles with Everyday Terminology ─────────── */
    const VISUAL_STYLES = [
      {
        id: 'minimalist',
        label: 'Minimalist & Clean',
        desc: 'Timeless monochrome staples, crisp white knits & clean silhouettes without loud logos.',
        photo: '../assets/images/products/hero_sweater.png',
        recommendedLooks: [
          {
            id: 'p3',
            tag: 'MINIMAL ESSENTIAL',
            category: 'Apparel',
            title: 'Fine-Knit Cashmere Crew',
            price: '€ 160.00',
            numericPrice: 160,
            image: '../assets/images/products/plp_crewneck.png',
            reason: '✨ Pure pearl white tone with clean unadorned collar line',
            href: 'pdp.html?id=p3'
          },
          {
            id: 'p1',
            tag: 'SIGNATURE KNIT',
            category: 'Apparel',
            title: 'Architectural Cashmere Sweater',
            price: '€ 185.00',
            numericPrice: 185,
            image: '../assets/images/products/hero_sweater.png',
            reason: '✨ Soft 2-ply neutral cashmere knit with seamless finish',
            href: 'pdp.html?id=p1'
          },
          {
            id: 'p7',
            tag: 'LEATHER GOODS',
            category: 'Accessories',
            title: 'Minimal Leather Card Case',
            price: '€ 65.00',
            numericPrice: 65,
            image: '../assets/images/products/p7.png',
            reason: '✨ Ultra-flat full grain obsidian leather without bulk',
            href: 'pdp.html?id=p7'
          }
        ]
      },
      {
        id: 'tailored',
        label: 'Smart & Tailored',
        desc: 'Structured blazers, sharp wool trousers, and refined pieces for work meetings and dinners.',
        photo: '../assets/images/products/plp_blazer.png',
        recommendedLooks: [
          {
            id: 'p2',
            tag: 'TAILORED EDIT',
            category: 'Apparel',
            title: 'Structured Wool Blazer',
            price: '€ 245.00',
            numericPrice: 245,
            image: '../assets/images/products/plp_blazer.png',
            reason: '✨ Refined merino weave with unstructured shoulders',
            href: 'pdp.html?id=p2'
          },
          {
            id: 'p5',
            tag: 'ATELIER TIMEPIECE',
            category: 'Accessories',
            title: 'Monolith Chronograph Automatic',
            price: '€ 490.00',
            numericPrice: 490,
            image: '../assets/images/products/search_watch.png',
            reason: '✨ Minimal titanium chassis with matte obsidian dial',
            href: 'pdp.html?id=p5'
          },
          {
            id: 'p9',
            tag: 'HANDMADE LEATHER',
            category: 'Bags',
            title: 'Minimalist Leather Tote',
            price: '€ 142.00',
            numericPrice: 142,
            image: '../assets/images/products/prod_tote.png',
            reason: '✨ Hand-stitched full-grain leather with artisanal patina',
            href: 'pdp.html?id=p9'
          }
        ]
      },
      {
        id: 'casual',
        label: 'Relaxed & Everyday',
        desc: 'Comfortable easy-fitting layers, stretch track pants, and all-day sneakers for casual routines.',
        photo: '../assets/images/products/prod_runner.png',
        recommendedLooks: [
          {
            id: 'p12',
            tag: 'TRANSIT COMFORT',
            category: 'Apparel',
            title: 'Smart Track Pants',
            price: '€ 135.00',
            numericPrice: 135,
            image: '../assets/images/products/plp_trousers.png',
            reason: '✨ 4-way technical stretch that never wrinkles during wear',
            href: 'pdp.html?id=p12'
          },
          {
            id: 'p6',
            tag: 'FOOTWEAR',
            category: 'Footwear',
            title: 'Performance Leather Runner',
            price: '€ 220.00',
            numericPrice: 220,
            image: '../assets/images/products/prod_runner.png',
            reason: '✨ Monochrome calfskin profile with stealth cushioning',
            href: 'pdp.html?id=p6'
          },
          {
            id: 'p11',
            tag: 'HANDS-FREE CUSTODY',
            category: 'Bags',
            title: 'Minimal Canvas Crossbody Bag',
            price: '€ 85.00',
            numericPrice: 85,
            image: '../assets/images/products/cat_accessories.jpg',
            reason: '✨ Weather-resistant passport & tech custody sleeve',
            href: 'pdp.html?id=p11'
          }
        ]
      },
      {
        id: 'outerwear',
        label: 'Outdoor & Outerwear',
        desc: 'Technical waterproof jackets, insulated wool overshirts, and protective layers for cold and rain.',
        photo: '../assets/images/products/plp_overcoat.png',
        recommendedLooks: [
          {
            id: 'p10',
            tag: 'WEATHERPROOF SHELL',
            category: 'Outerwear',
            title: 'Technical Waterproof Shell Jacket',
            price: '€ 295.00',
            numericPrice: 295,
            image: '../assets/images/products/plp_overcoat.png',
            reason: '✨ 3-layer breathable storm membrane with taped seams',
            href: 'pdp.html?id=p10'
          },
          {
            id: 'p8',
            tag: 'THERMAL LAYER',
            category: 'Apparel',
            title: 'Merino Wool Overshirt',
            price: '€ 195.00',
            numericPrice: 195,
            image: '../assets/images/products/plp_turtleneck.png',
            reason: '✨ Heavyweight 380gsm merino wool natural insulation',
            href: 'pdp.html?id=p8'
          },
          {
            id: 'p6',
            tag: 'RUGGED RUNNER',
            category: 'Footwear',
            title: 'Performance Leather Runner',
            price: '€ 220.00',
            numericPrice: 220,
            image: '../assets/images/products/prod_runner.png',
            reason: '✨ High-traction Vibram compound for cold conditions',
            href: 'pdp.html?id=p6'
          }
        ]
      }
    ];

    const ARCHETYPES = VISUAL_STYLES;

    const RADAR_AXES = [
      { label: 'TAILORING', angle: -90 },
      { label: 'ACOUSTICS', angle: -30 },
      { label: 'CRAFT',     angle: 30  },
      { label: 'FOOTWEAR',  angle: 90  },
      { label: 'LIFESTYLE', angle: 150 },
      { label: 'MINIMAL',   angle: 210 }
    ];

    const FIT_OPTIONS = [
      {
        id: 'relaxed',
        name: 'Relaxed / Oversized',
        desc: 'Contemporary generous drape with room for layering and easy casual movement.'
      },
      {
        id: 'regular',
        name: 'Classic Regular',
        desc: 'Balanced timeless cut with standard shoulder width and comfortable torso drape.'
      },
      {
        id: 'slim',
        name: 'Tailored Slim',
        desc: 'Clean structured contours tailored closer to the body for sharp lines.'
      }
    ];

    const COLOURS = [
      { name: 'Obsidian',    hex: '#0D131F', group: 'obsidian' },
      { name: 'Charcoal',    hex: '#374151', group: 'obsidian' },
      { name: 'Slate',       hex: '#64748B', group: 'obsidian' },
      { name: 'Pearl',       hex: '#F1F5F9', group: 'neutral' },
      { name: 'Ivory',       hex: '#FFFBEB', group: 'neutral' },
      { name: 'Oatmeal',     hex: '#D6C7B2', group: 'neutral' },
      { name: 'Tuscan Clay', hex: '#92400E', group: 'earth' },
      { name: 'Forest',      hex: '#14532D', group: 'earth' },
      { name: 'Navy',        hex: '#1E3A5F', group: 'earth' },
      { name: 'Cyan Mist',   hex: '#3DE0FF', group: 'accent' },
      { name: 'Lilac',       hex: '#A78BFA', group: 'accent' },
      { name: 'Rose',        hex: '#FB7185', group: 'accent' }
    ];

    const LIFESTYLE_AXES = [
      { id: 'everyday', label: 'Everyday & Weekend',  context: 'Casual daily routine, relaxed weekend wear', defaultVal: 9 },
      { id: 'office',   label: 'Work & Professional', context: 'Office tailoring, meetings, smart-casual',   defaultVal: 6 },
      { id: 'travel',   label: 'Travel & Commute',    context: 'Airport transit, packable wrinkle-free gear', defaultVal: 7 },
      { id: 'social',   label: 'Social & Evening',    context: 'Dinners, exhibitions, evening gatherings',   defaultVal: 6 },
      { id: 'outdoor',  label: 'Active & Outdoor',    context: 'Fitness, weather protection, movement',       defaultVal: 4 }
    ];

    /* ── Load Stored Preferences or Defaults ─────────────────────────── */
    const saved = load();
    let initialStyle = (saved && saved.stylePreferences && saved.stylePreferences[0]) || 'minimalist';
    // Map legacy archetype IDs if present
    const legacyStyleMap = {
      'quiet-luxury': 'minimalist',
      'nordic-minimal': 'minimalist',
      'nocturne': 'tailored',
      'transit-ease': 'casual',
      'alpine-thermal': 'outerwear',
      'atelier-craft': 'tailored'
    };
    let activeArchetypeId = legacyStyleMap[initialStyle] || initialStyle;
    if (!VISUAL_STYLES.find(s => s.id === activeArchetypeId)) {
      activeArchetypeId = 'minimalist';
    }

    let activeFitId = (saved && saved.fitPreference) || 'relaxed';
    let activeColours = new Set((saved && saved.colorPreferences && saved.colorPreferences.length > 0) 
      ? saved.colorPreferences 
      : ['Obsidian', 'Pearl', 'Oatmeal', 'Navy']);
    
    const lifestyleValues = {};
    LIFESTYLE_AXES.forEach(a => {
      lifestyleValues[a.id] = (saved && saved.lifestyleValues && saved.lifestyleValues[a.id] !== undefined)
        ? saved.lifestyleValues[a.id]
        : a.defaultVal;
    });

    /* ── Render Step 1: Visual Style Cards ───────────────────────────── */
    function renderArchetypeGrid() {
      const grid = document.getElementById('visualStyleGrid') || document.getElementById('aestheticArchetypeGrid');
      if (!grid) return;

      grid.innerHTML = VISUAL_STYLES.map(s => {
        const isActive = s.id === activeArchetypeId;
        return `
          <div class="visual-style-card ${isActive ? 'active' : ''}"
               data-style-id="${s.id}"
               onclick="selectStyleMood('${s.id}')"
               role="radio"
               aria-checked="${isActive}"
               tabindex="0">
            <div class="visual-style-photo-wrap">
              <img src="${s.photo}" alt="${s.label}" class="visual-style-photo" loading="lazy">
              <div class="visual-style-badge-check">
                <i data-lucide="check"></i>
              </div>
            </div>
            <div class="visual-style-body">
              <h3 class="visual-style-title">${s.label}</h3>
              <p class="visual-style-desc">${s.desc}</p>
            </div>
          </div>
        `;
      }).join('');

      if (window.lucide) window.lucide.createIcons();
    }

    /* ── Render Step 2: Fit Options ──────────────────────────────────── */
    function renderFitGrid() {
      const grid = document.getElementById('fitOptionsGrid');
      if (!grid) return;

      grid.innerHTML = FIT_OPTIONS.map(f => {
        const isActive = f.id === activeFitId;
        return `
          <div class="fit-choice-card ${isActive ? 'active' : ''}"
               onclick="selectFit('${f.id}')"
               role="radio"
               aria-checked="${isActive}"
               tabindex="0">
            <div class="fit-header-row">
              <h3 class="fit-name">${f.name}</h3>
              <div class="archetype-active-indicator">
                <i data-lucide="check"></i>
              </div>
            </div>
            <p class="fit-desc">${f.desc}</p>
          </div>
        `;
      }).join('');
    }

    /* ── Render Step 3: Named Color Swatches ─────────────────────────── */
    function renderColourGrid() {
      const grid = document.getElementById('colourDnaWheel');
      if (!grid) return;

      grid.innerHTML = COLOURS.map(c => {
        const isSelected = activeColours.has(c.name);
        const isLight = ['#F1F5F9', '#FFFBEB', '#D6C7B2'].includes(c.hex);
        const borderStyle = isLight ? 'border-color: rgba(255,255,255,0.3);' : '';

        return `
          <div class="color-item-box ${isSelected ? 'active' : ''}"
               onclick="toggleColor('${c.name}')"
               title="${c.name}">
            <div class="color-circle-dot" style="background-color: ${c.hex}; ${borderStyle}"></div>
            <span class="color-item-name">${c.name}</span>
          </div>
        `;
      }).join('');
    }

    /* ── Render Step 4: Lifestyle Sliders ────────────────────────────── */
    function renderLifestyleSliders() {
      const container = document.getElementById('lifestyleIntensityGrid');
      if (!container) return;

      container.innerHTML = LIFESTYLE_AXES.map(axis => {
        const val = lifestyleValues[axis.id];
        return `
          <div class="lifestyle-slider-card">
            <div class="lifestyle-meta">
              <h4 class="lifestyle-title">${axis.label}</h4>
              <p class="lifestyle-context">${axis.context}</p>
            </div>
            <div class="lifestyle-track-wrap">
              <input type="range" class="lifestyle-range-input"
                     min="1" max="10" step="1"
                     value="${val}"
                     oninput="updateLifestyleVal('${axis.id}', this.value)"
                     aria-label="${axis.label} Intensity Slider">
            </div>
            <div class="lifestyle-badge-val" id="val_${axis.id}">${val}/10</div>
          </div>
        `;
      }).join('');
    }

    /* ── Render Step 5: Live Dynamic Curated Drops ───────────────────── */
    function renderCuratedLookbook() {
      const container = document.getElementById('aiLookPinboard');
      const subtitle = document.getElementById('curatedSubtitle');
      if (!container) return;

      const current = ARCHETYPES.find(a => a.id === activeArchetypeId) || ARCHETYPES[0];
      const fitObj = FIT_OPTIONS.find(f => f.id === activeFitId) || FIT_OPTIONS[0];

      if (subtitle) {
        subtitle.textContent = `Live drops calibrated for ${current.label} with ${fitObj.name} silhouette.`;
      }

      container.innerHTML = current.recommendedLooks.map(piece => {
        return `
          <article class="curated-piece-card" id="card_${piece.id}">
            <div class="piece-img-container">
              <img src="${piece.image}" alt="${piece.title}" class="piece-img-thumb" loading="lazy">
            </div>
            <div class="piece-content-pane">
              <div class="piece-tag-row">
                <span class="piece-category-tag">${piece.tag}</span>
                <span class="piece-price-tag">${piece.price}</span>
              </div>
              <h3 class="piece-title-link">
                <a href="${piece.href}" style="color: inherit; text-decoration: none;">${piece.title}</a>
              </h3>
              <div class="piece-reason-whisper">
                <i data-lucide="sparkles" style="width: 12px; height: 12px; color: #3DE0FF; flex-shrink: 0;"></i>
                <span>${piece.reason}</span>
              </div>
              <div class="piece-action-row">
                <button type="button" class="btn-piece-add" onclick="quickAddPiece('${piece.id}', '${piece.title}', ${piece.numericPrice}, '${piece.image}')">
                  <i data-lucide="shopping-bag" style="width: 14px; height: 14px;"></i>
                  <span>Quick Add</span>
                </button>
                <a href="${piece.href}" class="btn-piece-view" title="View Full Details">
                  <i data-lucide="arrow-up-right" style="width: 16px; height: 16px;"></i>
                </a>
              </div>
            </div>
          </article>
        `;
      }).join('');

      if (window.lucide) window.lucide.createIcons();
    }

    /* ── Update Header Calibration Status Bar ────────────────────────── */
    function updateCalibrationScore() {
      let score = 80;
      if (activeArchetypeId) score += 5;
      if (activeFitId) score += 5;
      if (activeColours.size >= 3) score += 5;
      if (score > 98) score = 98;

      const scoreEl = document.getElementById('calibrationScoreVal');
      const archChip = document.getElementById('activeArchetypeChip');
      const fitChip = document.getElementById('activeFitChip');
      const colChip = document.getElementById('activeColorsCountChip');

      const arch = ARCHETYPES.find(a => a.id === activeArchetypeId);
      const fit = FIT_OPTIONS.find(f => f.id === activeFitId);

      if (scoreEl) scoreEl.textContent = score + '%';
      if (archChip && arch) archChip.textContent = 'Style: ' + arch.label;
      if (fitChip && fit) fitChip.textContent = 'Fit: ' + fit.name.split('/')[0].trim();
      if (colChip) colChip.textContent = `Colors: ${activeColours.size} Selected`;
    }

    /* ── Global Interactive Handlers ─────────────────────────────────── */
    window.selectArchetype = function(id) {
      activeArchetypeId = id;
      renderArchetypeGrid();
      renderCuratedLookbook();
      updateCalibrationScore();
    };
    window.selectStyleMood = window.selectArchetype;

    window.selectFit = function(id) {
      activeFitId = id;
      renderFitGrid();
      renderCuratedLookbook();
      updateCalibrationScore();
    };

    window.toggleColor = function(name) {
      if (activeColours.has(name)) {
        if (activeColours.size > 1) activeColours.delete(name);
      } else {
        activeColours.add(name);
      }
      renderColourGrid();
      updateCalibrationScore();
    };

    window.applyColorPreset = function(preset) {
      if (preset === 'all') {
        activeColours = new Set(COLOURS.map(c => c.name));
      } else if (preset === 'neutral') {
        activeColours = new Set(['Pearl', 'Ivory', 'Oatmeal', 'Slate', 'Charcoal']);
      } else if (preset === 'obsidian') {
        activeColours = new Set(['Obsidian', 'Charcoal', 'Slate']);
      } else if (preset === 'earth') {
        activeColours = new Set(['Tuscan Clay', 'Forest', 'Navy', 'Oatmeal']);
      }
      renderColourGrid();
      updateCalibrationScore();
    };

    window.updateLifestyleVal = function(id, val) {
      lifestyleValues[id] = Number(val);
      const badge = document.getElementById('val_' + id);
      if (badge) badge.textContent = val + '/10';
      updateCalibrationScore();
    };

    window.quickAddPiece = function(id, name, price, img) {
      if (window.NexCart && typeof window.NexCart.addItem === 'function') {
        window.NexCart.addItem({
          id: id,
          name: name,
          price: price,
          image: img,
          quantity: 1,
          size: activeFitId === 'slim' ? 'S' : (activeFitId === 'oversized' ? 'L' : 'M')
        });
      }
      
      const toast = document.createElement('div');
      toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#020B18;border:1px solid #3DE0FF;color:#fff;font-family:Inter,sans-serif;font-size:13px;padding:12px 24px;border-radius:9999px;z-index:9999;display:flex;align-items:center;gap:8px;box-shadow:0 12px 36px rgba(0,0,0,0.6);';
      toast.innerHTML = `<span style="color:#3DE0FF;font-weight:700;">✨ Added</span> "${name}" to your bag.`;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3200);
    };

    /* ── Save and Reset Actions ──────────────────────────────────────── */
    const saveBtn = document.getElementById('profileSaveBtn');
    if (saveBtn) {
      saveBtn.addEventListener('click', function() {
        const toggle = document.getElementById('togglePersonalization');
        const payload = {
          activeArchetype: activeArchetypeId,
          stylePreferences: [activeArchetypeId],
          fitPreference: activeFitId,
          colorPreferences: Array.from(activeColours),
          lifestylePreferences: Object.keys(lifestyleValues).filter(k => lifestyleValues[k] >= 6),
          lifestyleValues: lifestyleValues,
          personalizationEnabled: toggle ? toggle.checked : true
        };

        const success = save(payload);
        if (success) {
          saveBtn.innerHTML = '<i data-lucide="check-check" style="width:15px;height:15px;margin-right:6px;color:#34D399;"></i> STYLE PROFILE SAVED!';
          saveBtn.style.background = 'rgba(52, 211, 153, 0.15)';
          saveBtn.style.borderColor = '#34D399';
          saveBtn.style.color = '#FFFFFF';

          const scoreEl = document.getElementById('calibrationScoreVal');
          if (scoreEl) scoreEl.textContent = '100%';

          setTimeout(() => {
            saveBtn.innerHTML = '<i data-lucide="check" style="width:15px;height:15px;margin-right:6px;"></i> SAVE STYLE PROFILE';
            saveBtn.style.background = '';
            saveBtn.style.borderColor = '';
            saveBtn.style.color = '';
            if (window.lucide) window.lucide.createIcons();
          }, 2500);

          if (window.lucide) window.lucide.createIcons();
        }
      });
    }

    const resetBtn = document.getElementById('profileResetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', function() {
        if (confirm('Reset your Style DNA profile to standard atelier defaults?')) {
          remove();
          activeArchetypeId = 'quiet-luxury';
          activeFitId = 'relaxed';
          activeColours = new Set(['Obsidian', 'Pearl', 'Oatmeal', 'Navy']);
          LIFESTYLE_AXES.forEach(a => { lifestyleValues[a.id] = a.defaultVal; });

          renderArchetypeGrid();
          renderFitGrid();
          renderColourGrid();
          renderLifestyleSliders();
          renderCuratedLookbook();
          updateCalibrationScore();
        }
      });
    }

    /* Initial Render Sequence */
    renderArchetypeGrid();
    renderFitGrid();
    renderColourGrid();
    renderLifestyleSliders();
    renderCuratedLookbook();
    updateCalibrationScore();

    if (window.lucide) window.lucide.createIcons();
  }

})(window);
