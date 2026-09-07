/**
 * nexCommerce — Visual Search & Shop by Photo UI Engine
 * Clean Single-Upload & Instant Demo Workflow (Zero Clutter).
 */

(function(window, document) {
  'use strict';

  // ── 1. Universal Path Helpers ──────────────────────────────────────────────
  function _isPagesDir() {
    return window.location.pathname.includes('/pages/');
  }

  function _resolveAsset(path) {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) return path;
    const clean = path.replace(/^(\.\.\/)+/, '').replace(/^\//, '');
    return _isPagesDir() ? `../${clean}` : clean;
  }

  // ── 2. Preset Lookbook Fixtures ────────────────────────────────────────────
  const PRESET_LOOKS = {
    knitwear: {
      id: 'knitwear',
      name: 'Cashmere Sweater',
      image: 'assets/images/products/hero_sweater.png',
      queryKey: 'coat knitwear cashmere sweater'
    },
    footwear: {
      id: 'footwear',
      name: 'Leather Sneakers',
      image: 'assets/images/products/prod_runner.png',
      queryKey: 'shoe running sneaker footwear'
    },
    outerwear: {
      id: 'outerwear',
      name: 'Wool Overcoat',
      image: 'assets/images/products/plp_overcoat.png',
      queryKey: 'coat jacket wool outerwear'
    },
    audio: {
      id: 'audio',
      name: 'Headphones',
      image: 'assets/images/products/prod_headphones.png',
      queryKey: 'headphone audio sound studio'
    },
    accessories: {
      id: 'accessories',
      name: 'Canvas Tote',
      image: 'assets/images/products/prod_tote.png',
      queryKey: 'bag tote canvas accessories'
    }
  };

  const FALLBACK_CATALOG = [
    {
      id: 'p1',
      brand: 'Arc',
      title: 'Cashmere Turtleneck',
      price: '€ 185.00',
      numericPrice: 185,
      category: 'Apparel',
      img: 'assets/images/products/hero_sweater.png',
      visualScore: 0.96
    },
    {
      id: 'p2',
      brand: 'Arc',
      title: 'Structured Wool Blazer',
      price: '€ 245.00',
      numericPrice: 245,
      category: 'Apparel',
      img: 'assets/images/products/plp_blazer.png',
      visualScore: 0.91
    },
    {
      id: 'p3',
      brand: 'Arc',
      title: 'Fine-Knit Cashmere Crew',
      price: '€ 160.00',
      numericPrice: 160,
      category: 'Apparel',
      img: 'assets/images/products/plp_crewneck.png',
      visualScore: 0.88
    },
    {
      id: 'p6',
      brand: 'Apex',
      title: 'Minimalist Leather Runner',
      price: '€ 198.00',
      numericPrice: 198,
      category: 'Footwear',
      img: 'assets/images/products/prod_runner.png',
      visualScore: 0.95
    },
    {
      id: 'p4',
      brand: 'Form',
      title: 'Studio Acoustics Headphone GT',
      price: '€ 320.00',
      numericPrice: 320,
      category: 'Acoustics',
      img: 'assets/images/products/prod_headphones.png',
      visualScore: 0.97
    }
  ];

  let modalEl = null;
  let activePresetKey = null;
  let lastFocusedEl = null;

  // ── 3. Modal Template Generation (Minimalist Single Upload) ────────────────
  function _buildModalMarkup() {
    return `
      <div class="nex-visual-modal-backdrop" id="nexVisualSearchBackdrop" aria-hidden="true">
        <div class="nex-visual-modal-dialog nex-visual-v2-dialog" id="nexVisualSearchDialog" role="dialog" aria-modal="true" aria-labelledby="nexVisualSearchTitle" data-lenis-prevent>
          <input type="file" id="nexVisualFileInput" accept="image/*" style="display:none;" />
          
          <!-- Clean Header -->
          <div class="nex-visual-modal-header">
            <div>
              <h2 class="nex-visual-title" id="nexVisualSearchTitle">Shop by Photo</h2>
              <p class="nex-visual-subtitle">Upload a photo to find similar clothes in our store.</p>
            </div>
            <button type="button" class="nex-visual-close-btn" id="nexVisualCloseBtn" aria-label="Close Visual Search (Esc)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <!-- Active Photo Bar (Visible only when a photo is active) -->
          <div class="nex-visual-lens-bar" id="nexVisualLensBar" style="display:none;">
            <div class="nex-visual-lens-chip" id="nexVisualActiveChip">
              <img id="nexVisualChipThumb" src="" alt="Selected Photo" />
              <span id="nexVisualChipLabel">Photo</span>
            </div>

            <div class="nex-visual-lens-status" id="nexVisualLensStatus">
              Showing matching items...
            </div>

            <button type="button" class="nex-visual-lens-upload-btn" id="nexVisualUploadTrigger" aria-label="Change photo">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/><line x1="16" x2="22" y1="5" y2="5"/><line x1="19" x2="19" y1="2" y2="8"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
              <span>Change Photo</span>
            </button>
          </div>

          <!-- Matching Products Results or Initial Center Dropzone -->
          <div class="nex-visual-results-grid" id="nexVisualResultsGrid">
            <!-- Rendered dynamically -->
          </div>

        </div>
      </div>
    `;
  }

  // ── 4. Mounting Component ──────────────────────────────────────────────────
  function _ensureModalMounted() {
    if (modalEl) return;
    const existing = document.getElementById('nexVisualSearchBackdrop');
    if (existing) {
      modalEl = existing;
      _bindModalEvents();
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.innerHTML = _buildModalMarkup().trim();
    modalEl = wrapper.firstElementChild;
    document.body.appendChild(modalEl);
    _bindModalEvents();
  }

  // ── 5. Event Listeners ────────────────────────────────────────────────────
  function _bindModalEvents() {
    if (!modalEl) return;

    const closeBtn = modalEl.querySelector('#nexVisualCloseBtn');
    if (closeBtn) closeBtn.addEventListener('click', close);

    modalEl.addEventListener('click', function(e) {
      if (e.target === modalEl) close();
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modalEl && modalEl.classList.contains('active')) {
        close();
      }
    });

    // File Input change handler
    const fileInput = modalEl.querySelector('#nexVisualFileInput');
    const uploadTrigger = modalEl.querySelector('#nexVisualUploadTrigger');

    if (uploadTrigger && fileInput) {
      uploadTrigger.addEventListener('click', function(e) {
        e.stopPropagation();
        fileInput.click();
      });
    }

    if (fileInput) {
      fileInput.addEventListener('change', function(e) {
        const file = e.target.files && e.target.files[0];
        if (file) analyzeUploadedFile(file);
      });
    }
  }

  // ── 6. Initial Blank / Empty State (Single Upload Dropzone) ────────────────
  function _renderInitialEmptyState() {
    if (!modalEl) return;

    activePresetKey = null;

    // Hide the top lens bar completely in the initial empty state
    const lensBar = modalEl.querySelector('#nexVisualLensBar');
    if (lensBar) lensBar.style.display = 'none';

    // Render the single, interactive center dropzone
    const grid = modalEl.querySelector('#nexVisualResultsGrid');
    if (grid) {
      grid.innerHTML = `
        <div class="nex-visual-initial-prompt" id="nexVisualDropzonePrompt" role="button" tabindex="0" aria-label="Click or drop an image here to search">
          <div class="nex-visual-prompt-icon">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/>
              <line x1="16" x2="22" y1="5" y2="5"/>
              <line x1="19" x2="19" y1="2" y2="8"/>
              <circle cx="9" cy="9" r="2"/>
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
            </svg>
          </div>
          <h3 class="nex-visual-prompt-title">Click or drop any photo here</h3>
          <p class="nex-visual-prompt-desc">Upload an outfit image to find matching pieces, or run an instant demo.</p>
          
          <div class="nex-visual-prompt-actions">
            <button type="button" class="nex-visual-browse-btn" id="nexVisualBrowseBtn" aria-label="Browse photos on your device">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/><line x1="16" x2="22" y1="5" y2="5"/><line x1="19" x2="19" y1="2" y2="8"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
              <span>Browse Photos</span>
            </button>
            <button type="button" class="nex-visual-demo-btn" id="nexVisualDemoBtn" aria-label="Run instant demo with sample outfit photo">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              <span>✨ Try Demo</span>
            </button>
          </div>
        </div>
      `;

      const promptBox = grid.querySelector('#nexVisualDropzonePrompt');
      const fileInput = modalEl.querySelector('#nexVisualFileInput');
      const browseBtn = grid.querySelector('#nexVisualBrowseBtn');
      const demoBtn = grid.querySelector('#nexVisualDemoBtn');

      if (browseBtn && fileInput) {
        browseBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          fileInput.click();
        });
      }

      if (demoBtn) {
        demoBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          searchPreset('knitwear');
        });
      }

      if (promptBox && fileInput) {
        promptBox.addEventListener('click', function(e) {
          fileInput.click();
        });

        promptBox.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInput.click();
          }
        });

        ['dragenter', 'dragover'].forEach(eventName => {
          promptBox.addEventListener(eventName, function(e) {
            e.preventDefault();
            e.stopPropagation();
            promptBox.classList.add('dragover');
          }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
          promptBox.addEventListener(eventName, function(e) {
            e.preventDefault();
            e.stopPropagation();
            promptBox.classList.remove('dragover');
          }, false);
        });

        promptBox.addEventListener('drop', function(e) {
          const dt = e.dataTransfer;
          const file = dt && dt.files && dt.files[0];
          if (file && file.type.startsWith('image/')) {
            analyzeUploadedFile(file);
          }
        }, false);
      }
    }
  }

  // ── 7. Search Pipeline (Active Results State) ──────────────────────────────
  function searchPreset(presetId) {
    _ensureModalMounted();
    const preset = PRESET_LOOKS[presetId];
    if (!preset) return;
    activePresetKey = preset.id;

    // Show the active photo bar
    const lensBar = modalEl.querySelector('#nexVisualLensBar');
    if (lensBar) lensBar.style.display = 'flex';

    // Update Tag Chip & Lens Status
    const chip = modalEl.querySelector('#nexVisualActiveChip');
    const chipThumb = modalEl.querySelector('#nexVisualChipThumb');
    const chipLabel = modalEl.querySelector('#nexVisualChipLabel');
    const lensStatus = modalEl.querySelector('#nexVisualLensStatus');

    if (chip) chip.style.display = 'inline-flex';
    if (chipThumb) {
      chipThumb.src = _resolveAsset(preset.image);
      chipThumb.alt = preset.name;
    }
    if (chipLabel) chipLabel.textContent = preset.name;
    if (lensStatus) lensStatus.textContent = `Showing matches for ${preset.name}...`;

    _executeMatching(preset.queryKey || preset.name);
  }

  function analyzeUploadedFile(file) {
    _ensureModalMounted();
    const reader = new FileReader();
    reader.onload = function(e) {
      const dataUrl = e.target.result;

      // Show the active photo bar
      const lensBar = modalEl.querySelector('#nexVisualLensBar');
      if (lensBar) lensBar.style.display = 'flex';

      const chip = modalEl.querySelector('#nexVisualActiveChip');
      const chipThumb = modalEl.querySelector('#nexVisualChipThumb');
      const chipLabel = modalEl.querySelector('#nexVisualChipLabel');
      const lensStatus = modalEl.querySelector('#nexVisualLensStatus');

      if (chip) chip.style.display = 'inline-flex';
      if (chipThumb) {
        chipThumb.src = dataUrl;
        chipThumb.alt = file.name;
      }
      if (chipLabel) chipLabel.textContent = file.name.replace(/\.[^/.]+$/, '').slice(0, 16);
      if (lensStatus) lensStatus.textContent = `Searching matches for "${file.name}"...`;

      _executeMatching((file.name || '').toLowerCase());
    };
    reader.readAsDataURL(file);
  }

  function _executeMatching(queryKey) {
    let results = [];

    if (window.NexAI && typeof window.NexAI.visualSearch === 'function') {
      results = window.NexAI.visualSearch(queryKey, 3);
    } else {
      const q = (queryKey || '').toLowerCase();
      results = FALLBACK_CATALOG.filter(item => {
        if (/shoe|runner|footwear|sneaker/.test(q)) return item.category === 'Footwear';
        if (/headphone|audio|sound/.test(q)) return item.category === 'Acoustics';
        if (/coat|blazer|outerwear/.test(q)) return item.id === 'p2' || item.id === 'p3';
        return item.category === 'Apparel';
      }).slice(0, 3);

      if (results.length === 0) {
        results = FALLBACK_CATALOG.slice(0, 3);
      }
    }

    _renderResults(results);
  }

  function _renderResults(products) {
    if (!modalEl) return;
    const grid = modalEl.querySelector('#nexVisualResultsGrid');
    if (!grid) return;

    if (!products || products.length === 0) {
      grid.innerHTML = `
        <div class="nex-visual-initial-prompt">
          <p class="nex-visual-prompt-desc">No matching items found. Try uploading a different photo.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = products.map(p => {
      const scorePct = Math.round((p.visualScore || 0.92) * 100);
      const imgSrc = _resolveAsset(p.img || p.image || 'assets/images/products/hero_sweater.png');
      const formattedPrice = p.price || `€ ${Number(p.numericPrice || 185).toFixed(2)}`;
      const title = p.title || p.name || 'Luxury Garment';
      const productId = p.id || 'p1';

      return `
        <div class="nex-visual-result-card" data-product-id="${productId}">
          <div class="nex-visual-card-score">${scorePct}% MATCH</div>
          <div class="nex-visual-card-img-wrap">
            <img src="${imgSrc}" alt="${title}" class="nex-visual-card-img" />
          </div>
          <div class="nex-visual-card-body">
            <div class="nex-visual-card-title">${title}</div>
            <div class="nex-visual-card-price">${formattedPrice}</div>
          </div>
          <button type="button" class="nex-visual-card-add-btn" data-add-id="${productId}" data-name="${title}" data-price="${p.numericPrice || 185}" data-img="${imgSrc}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <span>+ Add to Bag</span>
          </button>
        </div>
      `;
    }).join('');

    // Bind Add to Bag actions
    grid.querySelectorAll('.nex-visual-card-add-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const id = this.getAttribute('data-add-id');
        const name = this.getAttribute('data-name');
        const price = Number(this.getAttribute('data-price')) || 185;
        const image = this.getAttribute('data-img');

        if (window.nexCart && typeof window.nexCart.addItem === 'function') {
          window.nexCart.addItem({
            id: id,
            name: name,
            price: price,
            image: image,
            category: 'Visual Discovery'
          });
        }

        const originalText = this.innerHTML;
        this.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34D399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          <span style="color:#34D399;">Added</span>
        `;
        setTimeout(() => {
          this.innerHTML = originalText;
        }, 1600);
      });
    });
  }

  // ── 8. Public API ──────────────────────────────────────────────────────────
  function open(presetKey) {
    _ensureModalMounted();
    lastFocusedEl = document.activeElement;

    if (window._nexLenis && typeof window._nexLenis.stop === 'function') {
      window._nexLenis.stop();
    }
    document.body.classList.add('nex-modal-open');

    modalEl.classList.add('active');
    modalEl.setAttribute('aria-hidden', 'false');

    if (presetKey && PRESET_LOOKS[presetKey]) {
      searchPreset(presetKey);
    } else {
      _renderInitialEmptyState();
    }

    setTimeout(() => {
      const closeBtn = modalEl.querySelector('#nexVisualCloseBtn');
      if (closeBtn) closeBtn.focus();
    }, 100);
  }

  function close() {
    if (!modalEl) return;
    modalEl.classList.remove('active');
    modalEl.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('nex-modal-open');

    if (window._nexLenis && typeof window._nexLenis.start === 'function') {
      window._nexLenis.start();
    }

    if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
      lastFocusedEl.focus();
    }
  }

  window.nexVisualSearch = {
    open: open,
    close: close,
    searchPreset: searchPreset,
    analyzeFile: analyzeUploadedFile
  };

  document.addEventListener('DOMContentLoaded', function() {
    _ensureModalMounted();

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'visual' || urlParams.get('visual') === '1') {
      const initialLook = urlParams.get('look');
      setTimeout(() => {
        open(initialLook || null);
      }, 300);
    }

    document.querySelectorAll('[data-open-visual-search], #discoveryVisualSearchBtn, #globalVisualSearchTrigger').forEach(el => {
      el.addEventListener('click', function(e) {
        e.preventDefault();
        const preset = this.getAttribute('data-visual-preset') || null;
        open(preset);
      });
    });
  });

})(window, document);
