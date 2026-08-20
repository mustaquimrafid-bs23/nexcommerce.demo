/**
 * nexCommerce AI &mdash; Elevated Concierge UI Controller (Feature 6)
 * Injects the persistent Side Drawer and Floating Pill into the DOM on every page.
 * Wires the ConciergeEngine to the chat stream with rich card rendering, 
 * interactive size advisor, look bundle builder, and live order tracking.
 * Features centralized event delegation with zero inline event handlers.
 */

(function(window, document) {
  'use strict';

  let drawerEl = null;
  let overlayEl = null;
  let floatingPillEl = null;
  let streamEl = null;
  let chipsContainerEl = null;
  let inputEl = null;
  let formEl = null;
  let hasInitialized = false;
  let lastActiveTrigger = null;

  if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
    document.addEventListener('DOMContentLoaded', function() {
      if (document.getElementById('nexConciergeDrawer')) return; // Already present
      
      injectConciergeHTML();
      initConciergeLogic();
    });
  }

  function injectConciergeHTML() {
    // 1. Overlay
    const overlay = document.createElement('div');
    overlay.id = 'nexConciergeOverlay';
    overlay.className = 'concierge-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('data-action', 'close-concierge');

    // 2. Drawer
    const drawer = document.createElement('aside');
    drawer.id = 'nexConciergeDrawer';
    drawer.className = 'concierge-drawer';
    drawer.setAttribute('aria-hidden', 'true');
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-label', 'Style Concierge');
    drawer.setAttribute('data-lenis-prevent', '');

    drawer.innerHTML = `
      <!-- Header -->
      <div class="concierge-header">
        <div class="concierge-header-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-sparkles" style="color: #F13365;"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          Style Concierge
        </div>
        <button type="button" class="concierge-close" aria-label="Close Concierge" data-action="close-concierge">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      <!-- Scrollable Stream -->
      <div id="conciergeStream" class="concierge-stream" aria-live="polite" data-lenis-prevent>
        <!-- Messages appended dynamically -->
      </div>

      <!-- Input Area -->
      <div class="concierge-input-area">
        <div id="conciergeChips" class="concierge-chips-container">
          <!-- Suggestion chips injected here -->
        </div>
        <form id="conciergeForm" class="concierge-input-bar">
          <input type="text" id="conciergeInput" placeholder="Ask about style, size, occasion, or delivery..." autocomplete="off" />
          <button type="submit" class="concierge-send-btn" aria-label="Send message">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        </form>
      </div>
    `;

    // 3. Floating Luxury Pill
    const floatingPill = document.createElement('button');
    floatingPill.id = 'nexConciergeFloatingPill';
    floatingPill.type = 'button';
    floatingPill.className = 'concierge-floating-pill';
    floatingPill.setAttribute('aria-label', 'Open Style Concierge');
    floatingPill.setAttribute('data-action', 'open-concierge');
    floatingPill.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="lucide-sparkles" style="color: #F13365;"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
      <span>✦ Style Concierge</span>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);
    document.body.appendChild(floatingPill);

    drawerEl = drawer;
    overlayEl = overlay;
    floatingPillEl = floatingPill;
    streamEl = document.getElementById('conciergeStream');
    chipsContainerEl = document.getElementById('conciergeChips');
    inputEl = document.getElementById('conciergeInput');
    formEl = document.getElementById('conciergeForm');
  }

  function initConciergeLogic() {
    // 1. Floating Pill Scroll Visibility
    let scrollTimeout;
    window.addEventListener('scroll', function() {
      if (scrollTimeout) return;
      scrollTimeout = setTimeout(function() {
        if (window.scrollY > 200) {
          floatingPillEl.classList.add('visible');
        } else {
          floatingPillEl.classList.remove('visible');
        }
        scrollTimeout = null;
      }, 80);
    }, { passive: true });

    // 2. Global Document Event Delegation for Opening
    document.addEventListener('click', function(e) {
      const trigger = e.target.closest('.concierge-nav-btn, [data-concierge-trigger], [data-action="open-concierge"]');
      if (trigger) {
        e.preventDefault();
        lastActiveTrigger = trigger;
        
        let ctx = {};
        if (trigger.hasAttribute('data-pdp-context') || window.location.pathname.includes('product.html')) {
          const match = window.location.search.match(/[?&]id=([^&#]+)/);
          if (match) ctx.productId = decodeURIComponent(match[1]);
        }
        openDrawer(ctx);
      }
    });

    // 3. Centralized Event Delegation Inside Drawer & Overlay
    document.body.addEventListener('click', function(e) {
      const actionEl = e.target.closest('[data-action]');
      if (!actionEl) return;
      const action = actionEl.getAttribute('data-action');

      if (action === 'close-concierge') {
        closeDrawer();
      } else if (action === 'send-chip') {
        const text = actionEl.getAttribute('data-chip-text');
        if (text) handleUserMessage(text);
      } else if (action === 'add-to-bag') {
        handleAddToCart(actionEl);
      } else if (action === 'add-look-bundle') {
        handleAddBundleToCart(actionEl);
      } else if (action === 'toggle-bundle-item') {
        const bundleCard = actionEl.closest('.concierge-look-bundle');
        if (bundleCard) updateBundleSubtotal(bundleCard);
      } else if (action === 'select-size-category' || action === 'select-size-measurement' || action === 'select-size-fit') {
        handleSizeInteractiveSelect(actionEl, action);
      } else if (action === 'track-order-submit') {
        handleTrackOrderSubmit(actionEl);
      }
    });

    // 4. Keyboard Navigation (Escape Key)
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && drawerEl && drawerEl.classList.contains('open')) {
        closeDrawer();
      }
    });

    // 5. Chat Form Submit
    if (formEl) {
      formEl.addEventListener('submit', function(e) {
        e.preventDefault();
        const val = inputEl.value.trim();
        if (!val) return;
        inputEl.value = '';
        handleUserMessage(val);
      });
    }
  }

  function openDrawer(context) {
    if (!drawerEl || !overlayEl) return;
    drawerEl.classList.add('open');
    overlayEl.classList.add('open');
    drawerEl.setAttribute('aria-hidden', 'false');
    overlayEl.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (window.dataLayer) window.dataLayer.push({ event: 'nex_concierge_opened' });

    if (!hasInitialized && window.NexConciergeEngine) {
      const initResponse = window.NexConciergeEngine.initialize(context);
      renderConciergeResponse(initResponse);
      hasInitialized = true;
    }

    setTimeout(function() {
      if (inputEl) inputEl.focus();
    }, 320);
  }

  function closeDrawer() {
    if (!drawerEl || !overlayEl) return;
    drawerEl.classList.remove('open');
    overlayEl.classList.remove('open');
    drawerEl.setAttribute('aria-hidden', 'true');
    overlayEl.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (lastActiveTrigger && typeof lastActiveTrigger.focus === 'function') {
      lastActiveTrigger.focus();
    }
    if (window.dataLayer) window.dataLayer.push({ event: 'nex_concierge_closed' });
  }

  function handleUserMessage(text) {
    appendUserMessage(text);
    if (window.dataLayer) window.dataLayer.push({ event: 'nex_concierge_message_sent', query: text });

    // Typing simulation
    const typingId = appendTypingIndicator();
    if (chipsContainerEl) chipsContainerEl.innerHTML = '';

    setTimeout(function() {
      const typingEl = document.getElementById(typingId);
      if (typingEl) typingEl.remove();

      if (window.NexConciergeEngine) {
        const response = window.NexConciergeEngine.processMessage(text);
        renderConciergeResponse(response);
        if (window.dataLayer) window.dataLayer.push({ event: 'nex_concierge_response_rendered', state: response.type });
      }
    }, 450);
  }

  /* ─── Rendering Helpers ───────────────────────────────────── */

  function appendUserMessage(text) {
    const el = document.createElement('div');
    el.className = 'msg-user-wrapper';
    el.innerHTML = `<div class="msg-user">${escapeHtml(text)}</div>`;
    streamEl.appendChild(el);
    scrollToBottom();
  }

  function appendTypingIndicator() {
    const id = 'typing-' + Date.now();
    const el = document.createElement('div');
    el.id = id;
    el.className = 'msg-concierge-wrapper';
    el.innerHTML = `
      <div class="msg-concierge typing">
        <span></span><span></span><span></span>
      </div>
    `;
    streamEl.appendChild(el);
    scrollToBottom();
    return id;
  }

  function renderConciergeResponse(response) {
    const wrapper = document.createElement('div');
    wrapper.className = 'msg-concierge-wrapper';

    const formattedText = formatMarkdownText(response.text || '');
    let html = `<div class="msg-concierge-text">${formattedText}</div>`;

    // 1. Look Bundle Widget
    if (response.type === 'bundle_look' || (response.isBundleLook && response.products && response.products.length > 0)) {
      html += renderBundleCard(response.products);
    } 
    // 2. Interactive Sizing Advisor Widget
    else if (response.type === 'sizing_advisor' && response.widgetPayload) {
      html += renderSizingAdvisorWidget(response.widgetPayload);
    } 
    // 3. Live Order Tracking Stepper Widget
    else if (response.type === 'order_tracking' && response.widgetPayload) {
      html += renderOrderTrackerWidget(response.widgetPayload);
    } 
    // 4. Visual Studio Product Grid
    else if (response.products && response.products.length > 0) {
      html += renderProductCards(response.products);
    }

    // Action Link if present
    if (response.actionLink) {
      html += `
        <div class="concierge-action-wrap">
          <a href="${response.actionLink.url}" class="concierge-action-btn">${escapeHtml(response.actionLink.text)}</a>
        </div>
      `;
    }

    wrapper.innerHTML = html;
    streamEl.appendChild(wrapper);

    // Update suggested prompt chips
    renderChips(response.suggestedChips || []);
    scrollToBottom();
  }

  function renderBundleCard(products) {
    let total = 0;
    const itemsHtml = products.map((p, idx) => {
      const pNum = p.numericPrice || parseInt((p.price || '0').replace(/[^0-9]/g, ''), 10) || 184;
      total += pNum;
      return `
        <div class="bundle-item" data-bundle-item data-id="${p.id}" data-title="${escapeHtml(p.title)}" data-price="${pNum}" data-img="${p.img || ''}">
          <label class="bundle-item-label">
            <input type="checkbox" checked class="bundle-checkbox" data-action="toggle-bundle-item" aria-label="Select ${escapeHtml(p.title)}" />
            <span class="bundle-item-thumb-link">
              <img src="${p.img || 'assets/images/products/hero_sweater.png'}" alt="${escapeHtml(p.title)}" />
            </span>
            <div class="bundle-item-info">
              <div class="bundle-item-cat">${escapeHtml(p.category || 'Apparel')}</div>
              <div class="bundle-item-title">${escapeHtml(p.title)}</div>
              <div class="bundle-item-price tabular-nums">€ ${Number(pNum).toFixed(2)}</div>
            </div>
          </label>
        </div>
      `;
    }).join('');

    return `
      <div class="concierge-look-bundle" data-bundle-container>
        <div class="bundle-header">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #F13365;"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          <span>COMPLETE THE LOOK</span>
        </div>
        <div class="bundle-items">${itemsHtml}</div>
        <div class="bundle-footer">
          <div class="bundle-total-row">
            <span>Outfit Subtotal:</span>
            <strong class="bundle-total-val tabular-nums">€ ${Number(total).toFixed(2)}</strong>
          </div>
          <button type="button" class="btn-primary-commerce bundle-add-btn" data-action="add-look-bundle">
            ADD SELECTED ITEMS TO BAG (${products.length} Items)
          </button>
        </div>
      </div>
    `;
  }

  function renderSizingAdvisorWidget(payload) {
    const catPills = (payload.categories || ['Apparel (Knitwear & Tops)', 'Footwear']).map((cat, idx) => `
      <button type="button" class="size-pill ${idx === 0 ? 'active' : ''}" data-action="select-size-category" data-val="${escapeHtml(cat)}">${escapeHtml(cat)}</button>
    `).join('');

    const sizePills = (payload.availableSizes || ['XS (36")', 'S (38")', 'M (40")', 'L (42")', 'XL (44")']).map((s, idx) => `
      <button type="button" class="size-pill ${idx === 2 ? 'active' : ''}" data-action="select-size-measurement" data-val="${escapeHtml(s)}">${escapeHtml(s)}</button>
    `).join('');

    const fitPills = (payload.fits || ['Tailored (True to size)', 'Relaxed Layering (Size up)']).map((f, idx) => `
      <button type="button" class="size-pill ${idx === 0 ? 'active' : ''}" data-action="select-size-fit" data-val="${escapeHtml(f)}">${escapeHtml(f)}</button>
    `).join('');

    return `
      <div class="concierge-size-advisor" data-size-widget>
        <div class="size-advisor-section">
          <div class="size-advisor-label">1. Item Category</div>
          <div class="size-pills-row">${catPills}</div>
        </div>
        <div class="size-advisor-section">
          <div class="size-advisor-label">2. Size / Chest Measurement</div>
          <div class="size-pills-row size-pills-measurements">${sizePills}</div>
        </div>
        <div class="size-advisor-section">
          <div class="size-advisor-label">3. Desired Fit</div>
          <div class="size-pills-row">${fitPills}</div>
        </div>
        <div class="size-advisor-result">
          <div class="size-result-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #34D399;"><path d="M20 6 9 17l-5-5"/></svg>
            <span class="size-result-text"><strong>Recommended Size: EU 48 / Medium</strong> · 96% Match</span>
          </div>
          <div class="size-result-note">Fits true to standard European sizing with a clean, comfortable fit.</div>
        </div>
      </div>
    `;
  }

  function renderOrderTrackerWidget(payload) {
    const stepsHtml = (payload.steps || []).map((s, idx) => {
      const isDone = idx < payload.currentStep;
      const isCurrent = idx === (payload.currentStep - 1);
      const statusClass = isCurrent ? 'current' : (isDone ? 'done' : 'upcoming');
      return `
        <div class="tracker-step ${statusClass}">
          <div class="tracker-node">
            ${isDone ? '✓' : (idx + 1)}
          </div>
          <div class="tracker-info">
            <div class="tracker-label">${escapeHtml(s.label)}</div>
            <div class="tracker-date">${escapeHtml(s.date)}</div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="concierge-tracker-stepper">
        <div class="tracker-card-header">
          <div class="tracker-order-id">Order Code: <strong>${escapeHtml(payload.orderCode)}</strong></div>
          <div class="tracker-carrier-badge">DHL Express Priority</div>
        </div>
        <div class="tracker-eta">Estimated Delivery: <strong>${escapeHtml(payload.estimatedDelivery)}</strong></div>
        <div class="tracker-timeline">${stepsHtml}</div>
      </div>
    `;
  }

  function renderProductCards(products) {
    const cards = products.map(p => {
      const priceStr = p.numericPrice ? '€ ' + Number(p.numericPrice).toFixed(2) : (p.price || '€ 184.00');
      return `
        <div class="concierge-product-card">
          <a href="product.html?id=${p.id}" class="concierge-card-img-link" title="View details for ${escapeHtml(p.title)}">
            <img src="${p.img || 'assets/images/products/hero_sweater.png'}" alt="${escapeHtml(p.title)}" loading="lazy" />
          </a>
          <div class="concierge-card-body">
            <div class="concierge-card-cat">${escapeHtml(p.category || 'Apparel')}</div>
            <a href="product.html?id=${p.id}" class="concierge-card-title-link">
              <div class="concierge-card-title">${escapeHtml(p.title)}</div>
            </a>
            <div class="concierge-card-price tabular-nums">${priceStr}</div>
            <button type="button" class="concierge-add-btn" data-action="add-to-bag" data-id="${p.id}" data-title="${escapeHtml(p.title)}" data-price="${p.numericPrice || 184}" data-img="${p.img || ''}">
              ADD TO BAG
            </button>
          </div>
        </div>
      `;
    }).join('');

    return `<div class="concierge-product-grid" data-lenis-prevent>${cards}</div>`;
  }

  function renderChips(chips) {
    if (!chipsContainerEl) return;
    if (!chips || chips.length === 0) {
      chipsContainerEl.innerHTML = '';
      return;
    }
    const html = chips.map(c => `
      <button type="button" class="concierge-chip" data-action="send-chip" data-chip-text="${escapeHtml(c)}">${escapeHtml(c)}</button>
    `).join('');
    chipsContainerEl.innerHTML = html;
  }

  function scrollToBottom() {
    setTimeout(function() {
      if (streamEl) streamEl.scrollTop = streamEl.scrollHeight;
    }, 60);
  }

  function escapeHtml(unsafe) {
    return (unsafe || '').toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatMarkdownText(str) {
    let s = escapeHtml(str);
    s = s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
    s = s.replace(/•\s*(.*?)(?=\n|$)/g, '<div class="concierge-bullet-item"><span class="concierge-bullet-dot"></span><span>$1</span></div>');
    s = s.replace(/\n\n/g, '<div class="concierge-p-break"></div>');
    s = s.replace(/\n/g, '<br>');
    return s;
  }

  /* ─── Interactive Widget Action Handlers ────────────────────── */

  function handleAddToCart(btn) {
    const id = btn.getAttribute('data-id');
    const title = btn.getAttribute('data-title') || 'Selected Item';
    const price = parseFloat(btn.getAttribute('data-price')) || 184;
    const img = btn.getAttribute('data-img') || 'assets/images/products/hero_sweater.png';

    btn.textContent = 'ADDING...';
    btn.disabled = true;

    if (window.NexCart) {
      window.NexCart.addItem({
        id: id,
        name: title,
        price: price,
        qty: 1,
        image: img
      });
    }

    if (window.dataLayer) window.dataLayer.push({ event: 'nex_concierge_add_to_bag', product_id: id });

    setTimeout(function() {
      btn.textContent = 'ADDED ✓';
      btn.classList.add('added');
      setTimeout(function() {
        btn.textContent = 'ADD TO BAG';
        btn.classList.remove('added');
        btn.disabled = false;
      }, 2000);
    }, 400);
  }

  function updateBundleSubtotal(bundleCard) {
    const checkedItems = bundleCard.querySelectorAll('.bundle-item input[type="checkbox"]:checked');
    let subtotal = 0;
    checkedItems.forEach(cb => {
      const itemEl = cb.closest('[data-bundle-item]');
      if (itemEl) {
        subtotal += parseFloat(itemEl.getAttribute('data-price')) || 0;
      }
    });

    const totalValEl = bundleCard.querySelector('.bundle-total-val');
    const addBtn = bundleCard.querySelector('.bundle-add-btn');

    if (totalValEl) totalValEl.textContent = '€ ' + subtotal.toFixed(2);
    if (addBtn) {
      addBtn.textContent = `ADD SELECTED TO BAG (${checkedItems.length} Pieces · € ${subtotal.toFixed(2)})`;
      addBtn.disabled = checkedItems.length === 0;
    }
  }

  function handleAddBundleToCart(btn) {
    const bundleCard = btn.closest('.concierge-look-bundle');
    if (!bundleCard) return;

    const checkedItems = bundleCard.querySelectorAll('.bundle-item input[type="checkbox"]:checked');
    if (checkedItems.length === 0) return;

    btn.textContent = 'ADDING LOOK...';
    btn.disabled = true;

    if (window.NexCart) {
      checkedItems.forEach(cb => {
        const itemEl = cb.closest('[data-bundle-item]');
        if (itemEl) {
          window.NexCart.addItem({
            id: itemEl.getAttribute('data-id'),
            name: itemEl.getAttribute('data-title'),
            price: parseFloat(itemEl.getAttribute('data-price')) || 184,
            qty: 1,
            image: itemEl.getAttribute('data-img')
          });
        }
      });
    }

    if (window.dataLayer) window.dataLayer.push({ event: 'nex_concierge_add_look_to_bag' });

    setTimeout(function() {
      btn.textContent = 'ALL ADDED TO BAG ✓';
      btn.classList.add('added');
      setTimeout(function() {
        updateBundleSubtotal(bundleCard);
        btn.classList.remove('added');
        btn.disabled = false;
      }, 2500);
    }, 500);
  }

  function handleSizeInteractiveSelect(btn, action) {
    const widget = btn.closest('[data-size-widget]');
    if (!widget) return;

    // Toggle active state in row
    const row = btn.closest('.size-pills-row');
    if (row) {
      row.querySelectorAll('.size-pill').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
    }

    // If changing category, switch between chest measurements and shoe sizes
    if (action === 'select-size-category') {
      const isFootwear = btn.getAttribute('data-val').includes('Footwear');
      const measureContainer = widget.querySelector('.size-pills-measurements');
      if (measureContainer) {
        if (isFootwear) {
          measureContainer.innerHTML = `
            <button type="button" class="size-pill" data-action="select-size-measurement" data-val="EU 41">EU 41</button>
            <button type="button" class="size-pill active" data-action="select-size-measurement" data-val="EU 42">EU 42</button>
            <button type="button" class="size-pill" data-action="select-size-measurement" data-val="EU 43">EU 43</button>
            <button type="button" class="size-pill" data-action="select-size-measurement" data-val="EU 44">EU 44</button>
          `;
        } else {
          measureContainer.innerHTML = `
            <button type="button" class="size-pill" data-action="select-size-measurement" data-val="XS (36&quot;)">XS (36")</button>
            <button type="button" class="size-pill" data-action="select-size-measurement" data-val="S (38&quot;)">S (38")</button>
            <button type="button" class="size-pill active" data-action="select-size-measurement" data-val="M (40&quot;)">M (40")</button>
            <button type="button" class="size-pill" data-action="select-size-measurement" data-val="L (42&quot;)">L (42")</button>
            <button type="button" class="size-pill" data-action="select-size-measurement" data-val="XL (44&quot;)">XL (44")</button>
          `;
        }
      }
    }

    // Read active states
    const activeCat = widget.querySelector('[data-action="select-size-category"].active');
    const activeMeasure = widget.querySelector('[data-action="select-size-measurement"].active');
    const activeFit = widget.querySelector('[data-action="select-size-fit"].active');

    const catVal = activeCat ? activeCat.getAttribute('data-val') : 'Apparel';
    const measureVal = activeMeasure ? activeMeasure.getAttribute('data-val') : 'M';
    const fitVal = activeFit ? activeFit.getAttribute('data-val') : 'Tailored';

    if (window.NexConciergeEngine && typeof window.NexConciergeEngine.calculateSize === 'function') {
      const res = window.NexConciergeEngine.calculateSize(catVal, measureVal, fitVal);
      const resTextEl = widget.querySelector('.size-result-text');
      const resNoteEl = widget.querySelector('.size-result-note');
      if (resTextEl) resTextEl.innerHTML = `<strong>Recommended Size: ${escapeHtml(res.recommendedSize)}</strong> · ${res.confidence}% Match`;
      if (resNoteEl) resNoteEl.textContent = res.advice;
    }
  }

  function handleTrackOrderSubmit(btn) {
    const input = btn.closest('.concierge-tracker-stepper')?.querySelector('input');
    const code = input ? input.value.trim() : 'NX-8921-X';
    handleUserMessage(`Track order ${code}`);
  }

  // Global window methods
  window.openConcierge = openDrawer;
  window.closeConcierge = closeDrawer;

})(typeof window !== 'undefined' ? window : global, typeof document !== 'undefined' ? document : {});
