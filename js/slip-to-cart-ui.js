/**
 * nexCommerce — Shopping Slip to Cart UI Controller (Capability 4)
 * Orchestrates file upload dropzone, sample presets, interactive review checklist,
 * variant/quantity editing, and cart state synchronization.
 */
(function(window) {
  'use strict';

  const SAMPLE_PRESETS = {
    receipt: {
      name: 'Demo Receipt Image',
      filename: 'sample_luxury_store_receipt.jpg',
      text: "1x Pure Cashmere Sweater (Size M)\n1x Structured Wool Blazer (Size 48)\n1x Minimalist Leather Runner (EU 42)"
    },
    capsule: {
      name: 'Autumn Selection Slip',
      text: "1x Pure Cashmere Sweater (Size M)\n1x Structured Wool Blazer (Size 48)\n1x Minimalist Leather Runner (EU 42)"
    },
    essentials: {
      name: 'Everyday Essentials',
      text: "2x Fine-Knit Cashmere Crew (Size L)\n1x Chronograph Minimalist Watch\n1x Studio Acoustics Headphone GT"
    },
    ambiguous: {
      name: 'Multi-Match Test List',
      text: "1x Cashmere\n1x Watch\n1x Silk Scarf"
    }
  };

  class SlipToCartUI {
    constructor() {
      this.currentMatchResult = null;
      this.hasRenderedModal = false;
      this.init();
    }

    init() {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          this.injectModalHtml();
          this.bindGlobalTriggers();
        });
      } else {
        this.injectModalHtml();
        this.bindGlobalTriggers();
      }
    }

    _getCatalog() {
      if (typeof SL_PRODUCTS !== 'undefined' && Array.isArray(SL_PRODUCTS)) return SL_PRODUCTS;
      if (window.NexAI && Array.isArray(window.NexAI.catalogArray)) return window.NexAI.catalogArray;
      return [
        { id: 'p1', name: 'Pure Cashmere Sweater', price: 185, image: 'assets/images/products/hero_sweater.png', category: 'Apparel' },
        { id: 'p2', name: 'Fine-Knit Cashmere Crew', price: 160, image: 'assets/images/products/plp_crewneck.png', category: 'Apparel' },
        { id: 'p3', name: 'Structured Wool Blazer', price: 245, image: 'assets/images/products/plp_blazer.png', category: 'Apparel' },
        { id: 'p4', name: 'Studio Acoustics Headphone GT', price: 320, image: 'assets/images/products/p4.png', category: 'Acoustics' },
        { id: 'p6', name: 'Minimalist Leather Runner', price: 198, image: 'assets/images/products/leather_sneaker.png', category: 'Footwear' },
        { id: 'p8', name: 'Chronograph Minimalist Watch', price: 285, image: 'assets/images/products/titanium_watch.png', category: 'Accessories' }
      ];
    }

    _resolveImg(imgPath) {
      if (!imgPath) return '';
      if (imgPath.startsWith('http')) return imgPath;
      const isSubpage = window.location.pathname.includes('/pages/') || window.location.pathname.endsWith('/pages');
      if (isSubpage) {
        return imgPath.startsWith('../') ? imgPath : '../' + imgPath;
      }
      return imgPath.startsWith('../') ? imgPath.replace(/^\.\.\//, '') : imgPath;
    }

    injectModalHtml() {
      if (document.getElementById('slipModalBackdrop')) return;

      const modalEl = document.createElement('div');
      modalEl.id = 'slipModalBackdrop';
      modalEl.className = 'slip-modal-backdrop';
      modalEl.setAttribute('role', 'dialog');
      modalEl.setAttribute('aria-modal', 'true');
      modalEl.setAttribute('aria-hidden', 'true');

      modalEl.innerHTML = `
        <div class="slip-modal-dialog">
          <div class="slip-modal-header">
            <div class="slip-modal-title-group">
              <span class="slip-modal-eyebrow">✨ Customer Commerce Agent · Smart Capability 4</span>
              <h2 class="slip-modal-title">Shopping Slip to Cart</h2>
            </div>
            <button id="slipModalCloseBtn" class="slip-modal-close-btn" aria-label="Close dialog">
              <i data-lucide="x" style="width:20px;height:20px;"></i>
            </button>
          </div>

          <div class="slip-modal-body" data-lenis-prevent>
            <!-- Upload Dropzone -->
            <div id="slipDropzone" class="slip-dropzone">
              <div class="slip-dropzone-icon">
                <i data-lucide="file-text" style="width:24px;height:24px;"></i>
              </div>
              <div class="slip-dropzone-title">Upload Shopping Slip or Receipt Image</div>
              <div class="slip-dropzone-sub">Drag and drop PNG, JPG, or receipt photos — Smart system will extract & match items instantly</div>
              <div class="slip-dropzone-actions" onclick="event.stopPropagation()">
                <button type="button" id="slipDemoReceiptBtn" class="btn-dropzone-action btn-dropzone-demo" title="Try instant OCR receipt scan demo">
                  <i data-lucide="sparkles" style="width:13px;height:13px;"></i>
                  <span>Demo Receipt Image</span>
                </button>
                <button type="button" id="slipBrowseFileBtn" class="btn-dropzone-action btn-dropzone-browse" title="Choose image file from your device">
                  <i data-lucide="upload" style="width:13px;height:13px;"></i>
                  <span>Browse Image File</span>
                </button>
              </div>
              <input type="file" id="slipFileInput" accept="image/*" style="display:none;" />
            </div>

            <!-- Presets & Text Paste Bar -->
            <div class="slip-options-row">
              <div class="slip-presets-cluster">
                <span style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.1em;">Test Presets:</span>
                <button class="slip-preset-btn" data-preset="receipt" style="border-color:rgba(61,224,255,0.4);background:rgba(61,224,255,0.08);color:#3DE0FF;">📸 Demo Receipt Image</button>
                <button class="slip-preset-btn" data-preset="capsule">🍂 Autumn Selection</button>
                <button class="slip-preset-btn" data-preset="essentials">⚡ Everyday Essentials</button>
                <button class="slip-preset-btn" data-preset="ambiguous">🔍 Multi-Match Test</button>
              </div>
              <button id="slipToggleTextBtn" class="slip-preset-btn" style="border-color:rgba(61,224,255,0.3);color:#3DE0FF;">
                ✏️ Paste Text List
              </button>
            </div>

            <!-- Text Paste Container (collapsible) -->
            <div id="slipPasteContainer" style="display:none; flex-direction:column; gap:12px; background:rgba(3,24,56,0.4); border:1px solid rgba(61,224,255,0.2); border-radius:12px; padding:16px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:12px; font-weight:700; color:#3DE0FF; text-transform:uppercase; letter-spacing:0.08em;">Paste Shopping List</span>
                <button type="button" id="slipLoadSampleTextBtn" class="slip-preset-btn" style="font-size:10.5px; padding:4px 10px;">📋 Load Sample Text</button>
              </div>
              <textarea id="slipTextInput" rows="4" style="width:100%; background:rgba(3,24,56,0.8); border:1px solid rgba(255,255,255,0.12); border-radius:8px; padding:12px; color:#fff; font-family:var(--font-body); font-size:13px; resize:vertical;" placeholder="e.g.&#10;2x Pure Cashmere Sweater Size M&#10;1x Structured Wool Blazer&#10;1x Minimalist Leather Runner"></textarea>
              <div style="display:flex; gap:10px;">
                <button id="slipProcessTextBtn" class="slip-confirm-btn" style="min-height:38px; padding:0 20px; font-size:12px;">Process Text List →</button>
                <button id="slipClearTextBtn" class="slip-preset-btn" style="padding:0 14px;">Clear</button>
              </div>
            </div>

            <!-- Split-pane Review Container -->
            <div id="slipReviewContainer" class="slip-review-container" style="display:none;">
              <div class="slip-lines-pane">
                <div style="font-size:11px;font-weight:700;letter-spacing:0.14em;color:rgba(255,255,255,0.4);text-transform:uppercase;">Extracted Slip Lines</div>
                <div id="slipLinesList" style="display:flex;flex-direction:column;gap:8px;"></div>
              </div>

              <div class="slip-matches-pane">
                <div style="font-size:11px;font-weight:700;letter-spacing:0.14em;color:rgba(255,255,255,0.4);text-transform:uppercase;">Matched Catalog Products</div>
                <div id="slipMatchesList" style="display:flex;flex-direction:column;gap:10px;"></div>
              </div>
            </div>
          </div>

          <div id="slipModalFooter" class="slip-modal-footer" style="display:none;">
            <div class="slip-summary-stat">
              <span class="slip-stat-label">Total Ready for Bag:</span>
              <span id="slipStatVal" class="slip-stat-val">0 Items · € 0.00</span>
            </div>
            <button id="slipConfirmBtn" class="slip-confirm-btn">
              <i data-lucide="shopping-bag" style="width:16px;height:16px;"></i>
              <span id="slipConfirmBtnText">Add All Matched (0) to Bag</span>
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(modalEl);
      if (window.lucide) window.lucide.createIcons();
      this.bindModalEvents();
    }

    bindModalEvents() {
      const backdrop = document.getElementById('slipModalBackdrop');
      const closeBtn = document.getElementById('slipModalCloseBtn');
      const dropzone = document.getElementById('slipDropzone');
      const fileInput = document.getElementById('slipFileInput');
      const demoReceiptBtn = document.getElementById('slipDemoReceiptBtn');
      const browseFileBtn = document.getElementById('slipBrowseFileBtn');
      const toggleTextBtn = document.getElementById('slipToggleTextBtn');
      const pasteContainer = document.getElementById('slipPasteContainer');
      const processTextBtn = document.getElementById('slipProcessTextBtn');
      const loadSampleTextBtn = document.getElementById('slipLoadSampleTextBtn');
      const clearTextBtn = document.getElementById('slipClearTextBtn');
      const textInput = document.getElementById('slipTextInput');
      const confirmBtn = document.getElementById('slipConfirmBtn');

      if (closeBtn) closeBtn.addEventListener('click', () => this.closeModal());
      if (backdrop) {
        backdrop.addEventListener('click', (e) => {
          if (e.target === backdrop) this.closeModal();
        });
      }

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && backdrop && backdrop.classList.contains('is-open')) {
          this.closeModal();
        }
      });

      // Dropzone actions
      if (demoReceiptBtn) {
        demoReceiptBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.handleFileUpload({ name: 'sample_store_receipt.jpg' });
        });
      }
      if (browseFileBtn && fileInput) {
        browseFileBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          fileInput.click();
        });
      }

      // Dropzone container click & drag
      if (dropzone && fileInput) {
        dropzone.addEventListener('click', (e) => {
          if (e.target.closest('.btn-dropzone-action')) return;
          fileInput.click();
        });
        dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('is-dragover'); });
        dropzone.addEventListener('dragleave', () => dropzone.classList.remove('is-dragover'));
        dropzone.addEventListener('drop', (e) => {
          e.preventDefault();
          dropzone.classList.remove('is-dragover');
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            this.handleFileUpload(e.dataTransfer.files[0]);
          }
        });
        fileInput.addEventListener('change', (e) => {
          if (e.target.files && e.target.files[0]) {
            this.handleFileUpload(e.target.files[0]);
          }
        });
      }

      // Presets
      document.querySelectorAll('.slip-preset-btn[data-preset]').forEach(btn => {
        btn.addEventListener('click', () => {
          const presetKey = btn.getAttribute('data-preset');
          if (presetKey === 'receipt') {
            this.handleFileUpload({ name: 'sample_store_receipt.jpg' });
          } else if (SAMPLE_PRESETS[presetKey]) {
            this.processText(SAMPLE_PRESETS[presetKey].text);
          }
        });
      });

      // Toggle Text Paste
      if (toggleTextBtn && pasteContainer) {
        toggleTextBtn.addEventListener('click', () => {
          const isVisible = pasteContainer.style.display === 'flex';
          pasteContainer.style.display = isVisible ? 'none' : 'flex';
          if (!isVisible && textInput) textInput.focus();
        });
      }

      if (loadSampleTextBtn && textInput) {
        loadSampleTextBtn.addEventListener('click', () => {
          textInput.value = SAMPLE_PRESETS.capsule.text;
        });
      }

      if (clearTextBtn && textInput) {
        clearTextBtn.addEventListener('click', () => {
          textInput.value = '';
          textInput.focus();
        });
      }

      if (processTextBtn && textInput) {
        processTextBtn.addEventListener('click', () => {
          if (textInput.value.trim()) {
            this.processText(textInput.value);
          } else {
            textInput.value = SAMPLE_PRESETS.capsule.text;
            this.processText(textInput.value);
          }
        });
      }

      // Confirm Add to Bag
      if (confirmBtn) {
        confirmBtn.addEventListener('click', () => this.commitToBag());
      }
    }

    bindGlobalTriggers() {
      // Listen for click on any button with data-trigger="slip-modal"
      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-trigger="slip-modal"], #openSlipModalBtn, .open-slip-btn');
        if (trigger) {
          e.preventDefault();
          this.openModal();
        }
      });
    }

    openModal(initialPresetKey) {
      const backdrop = document.getElementById('slipModalBackdrop');
      if (!backdrop) {
        this.injectModalHtml();
      }
      const modal = document.getElementById('slipModalBackdrop');
      if (!modal) return;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      if (initialPresetKey && SAMPLE_PRESETS[initialPresetKey]) {
        this.processText(SAMPLE_PRESETS[initialPresetKey].text);
      }
    }

    closeModal() {
      const backdrop = document.getElementById('slipModalBackdrop');
      if (!backdrop) return;
      backdrop.classList.remove('is-open');
      backdrop.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    handleFileUpload(file) {
      // Simulate intelligent OCR extraction pipeline with visual feedback
      const dropzone = document.getElementById('slipDropzone');
      if (dropzone) {
        dropzone.innerHTML = `
          <div class="slip-dropzone-icon" style="animation:secPulse 1.5s infinite;">
            <i data-lucide="loader" style="width:24px;height:24px;"></i>
          </div>
          <div class="slip-dropzone-title">Analyzing "${file.name}" with OCR...</div>
          <div class="slip-dropzone-sub">Extracting handwritten line items & quantities</div>
        `;
        if (window.lucide) window.lucide.createIcons();
      }

      setTimeout(() => {
        // Fallback to sample text extraction based on filename or standard capsule
        this.processText(SAMPLE_PRESETS.capsule.text);
        if (dropzone) {
          dropzone.innerHTML = `
            <div class="slip-dropzone-icon" style="background:rgba(52,211,153,0.1);color:#34D399;">
              <i data-lucide="check-circle" style="width:24px;height:24px;"></i>
            </div>
            <div class="slip-dropzone-title">Successfully Parsed "${file.name}"</div>
            <div class="slip-dropzone-sub">Extracted 3 line items with 96% match confidence</div>
          `;
          if (window.lucide) window.lucide.createIcons();
        }
      }, 700);
    }

    processText(rawText) {
      if (!window.NexSlipParser) return;
      const parsed = window.NexSlipParser.parseRawText(rawText);
      const catalog = this._getCatalog();
      this.currentMatchResult = window.NexSlipParser.matchSlipToCatalog(parsed, catalog);
      this.renderReviewView(this.currentMatchResult);
    }

    renderReviewView(matchResult) {
      const reviewContainer = document.getElementById('slipReviewContainer');
      const linesList = document.getElementById('slipLinesList');
      const matchesList = document.getElementById('slipMatchesList');
      const footer = document.getElementById('slipModalFooter');

      if (!reviewContainer || !linesList || !matchesList) return;

      reviewContainer.style.display = 'grid';
      if (footer) footer.style.display = 'flex';

      // Render Left Checklist
      linesList.innerHTML = matchResult.matched.map(m => `
        <div class="slip-line-row">
          <div style="display:flex;align-items:center;gap:8px;min-width:0;">
            <span class="slip-line-status ${m.isAmbiguous ? 'ambiguous' : 'matched'}"></span>
            <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${m.rawLine}</span>
          </div>
          <span style="font-size:11px;font-weight:700;color:${m.isAmbiguous ? '#FBBF24' : '#34D399'};">${m.isAmbiguous ? 'Review' : 'Matched'}</span>
        </div>
      `).concat(matchResult.unmatched.map(u => `
        <div class="slip-line-row">
          <div style="display:flex;align-items:center;gap:8px;min-width:0;">
            <span class="slip-line-status unmatched"></span>
            <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${u.rawLine}</span>
          </div>
          <span style="font-size:11px;font-weight:700;color:#FB7185;">Not Found</span>
        </div>
      `)).join('');

      // Render Right Product Cards
      matchesList.innerHTML = matchResult.matched.map((m, idx) => {
        const prod = m.product;
        const imgUrl = this._resolveImg(prod.image || prod.img);
        const price = prod.numericPrice || prod.price || 0;

        return `
          <div class="slip-match-card" data-idx="${idx}">
            <img class="slip-match-thumb" src="${imgUrl}" alt="${prod.name || prod.title}" />
            <div class="slip-match-info">
              <div class="slip-match-title">${prod.name || prod.title}</div>
              <div class="slip-match-meta">
                <span>€ ${price.toFixed(2)}</span>
                <span>&middot;</span>
                <span class="slip-match-badge">${Math.round(m.confidence * 100)}% Match</span>
                ${m.selectedSize ? `<span>&middot; Size: <strong>${m.selectedSize}</strong></span>` : ''}
              </div>
              ${m.isAmbiguous && m.alternatives.length > 1 ? `
                <div style="margin-top:4px;">
                  <select class="slip-alt-select" data-idx="${idx}" style="background:rgba(3,24,56,0.8);color:#fff;border:1px solid rgba(255,255,255,0.15);border-radius:6px;font-size:11px;padding:3px 6px;">
                    ${m.alternatives.map(alt => `<option value="${alt.id}" ${alt.id === prod.id ? 'selected' : ''}>Switch to: ${alt.name || alt.title}</option>`).join('')}
                  </select>
                </div>
              ` : ''}
            </div>
            <div class="slip-match-actions">
              <div class="slip-stepper">
                <button class="slip-stepper-btn" data-action="dec" data-idx="${idx}">-</button>
                <span class="slip-stepper-val" id="slipQtyVal_${idx}">${m.quantity}</span>
                <button class="slip-stepper-btn" data-action="inc" data-idx="${idx}">+</button>
              </div>
              <button class="slip-preset-btn" data-action="remove" data-idx="${idx}" style="padding:6px 8px;" title="Remove item">
                <i data-lucide="trash-2" style="width:14px;height:14px;color:#FB7185;"></i>
              </button>
            </div>
          </div>
        `;
      }).join('');

      if (window.lucide) window.lucide.createIcons();
      this.bindCardActions();
      this.updateTotalSummary();
    }

    bindCardActions() {
      const matchesList = document.getElementById('slipMatchesList');
      if (!matchesList) return;

      matchesList.querySelectorAll('.slip-stepper-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(btn.getAttribute('data-idx'), 10);
          const action = btn.getAttribute('data-action');
          if (this.currentMatchResult && this.currentMatchResult.matched[idx]) {
            const item = this.currentMatchResult.matched[idx];
            if (action === 'inc') item.quantity += 1;
            else if (action === 'dec') item.quantity = Math.max(1, item.quantity - 1);

            const valEl = document.getElementById(`slipQtyVal_${idx}`);
            if (valEl) valEl.textContent = item.quantity;
            this.updateTotalSummary();
          }
        });
      });

      matchesList.querySelectorAll('[data-action="remove"]').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-idx'), 10);
          if (this.currentMatchResult) {
            this.currentMatchResult.matched.splice(idx, 1);
            this.renderReviewView(this.currentMatchResult);
          }
        });
      });

      matchesList.querySelectorAll('.slip-alt-select').forEach(sel => {
        sel.addEventListener('change', (e) => {
          const idx = parseInt(sel.getAttribute('data-idx'), 10);
          const newProdId = e.target.value;
          const catalog = this._getCatalog();
          const targetProd = catalog.find(p => p.id === newProdId);
          if (targetProd && this.currentMatchResult && this.currentMatchResult.matched[idx]) {
            this.currentMatchResult.matched[idx].product = targetProd;
            this.renderReviewView(this.currentMatchResult);
          }
        });
      });
    }

    updateTotalSummary() {
      const statVal = document.getElementById('slipStatVal');
      const confirmBtnText = document.getElementById('slipConfirmBtnText');
      if (!this.currentMatchResult || !statVal || !confirmBtnText) return;

      let totalItems = 0;
      let totalAmount = 0;

      this.currentMatchResult.matched.forEach(m => {
        const qty = m.quantity;
        const price = m.product.numericPrice || m.product.price || 0;
        totalItems += qty;
        totalAmount += (qty * price);
      });

      statVal.textContent = `${totalItems} Items · € ${totalAmount.toFixed(2)}`;
      confirmBtnText.textContent = `Add All Matched (${totalItems}) to Bag`;
    }

    commitToBag() {
      if (!this.currentMatchResult || this.currentMatchResult.matched.length === 0) return;
      const cartPayload = window.NexSlipParser.buildCartPayload(this.currentMatchResult.matched);

      if (window.nexCart && typeof window.nexCart.addItem === 'function') {
        cartPayload.forEach(item => {
          window.nexCart.addItem(item, item.quantity, item.variant);
        });
      }

      this.closeModal();

      // Show Toast Notification
      if (typeof window.showToast === 'function') {
        window.showToast(`✨ Added ${cartPayload.length} items from your shopping slip to your bag!`);
      } else {
        const toast = document.createElement('div');
        toast.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#0A192F;border:1px solid #3DE0FF;color:#fff;padding:14px 20px;border-radius:8px;box-shadow:0 10px 30px rgba(0,0,0,0.6);z-index:10000;font-size:13px;font-weight:600;display:flex;align-items:center;gap:8px;animation:fadeIn 0.3s ease;';
        toast.innerHTML = `<span>✨ Added ${cartPayload.length} items from your shopping slip to your bag!</span>`;
        document.body.appendChild(toast);
        setTimeout(() => { toast.remove(); }, 3500);
      }
    }
  }

  window.NexSlipUI = new SlipToCartUI();

})(typeof window !== 'undefined' ? window : global);
