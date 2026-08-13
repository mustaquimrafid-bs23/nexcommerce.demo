/**
 * nexCommerce AI &mdash; Concierge UI Controller (Feature 6)
 * Injects the persistent Side Drawer into the DOM on every page.
 * Wires the ConciergeEngine to the chat stream.
 */

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('nexConciergeDrawer')) return; // Already injected
  
  injectConciergeHTML();
  initConciergeLogic();
});

function injectConciergeHTML() {
  const html = `
    <!-- Overlay -->
    <div id="nexConciergeOverlay" class="concierge-overlay" aria-hidden="true"></div>
    
    <!-- Drawer -->
    <aside id="nexConciergeDrawer" class="concierge-drawer" aria-hidden="true" role="dialog" aria-label="Style Concierge">
      <!-- Header -->
      <div class="concierge-header">
        <div class="concierge-header-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-sparkles"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          Style Concierge
        </div>
        <button id="conciergeCloseBtn" class="concierge-close" aria-label="Close Concierge">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      <!-- Scrollable Stream -->
      <div id="conciergeStream" class="concierge-stream" aria-live="polite">
        <!-- Messages appended here dynamically -->
      </div>

      <!-- Input Area -->
      <div class="concierge-input-area">
        <div id="conciergeChips" class="concierge-chips-container">
          <!-- Suggestion chips injected here -->
        </div>
        <form id="conciergeForm" class="concierge-input-bar">
          <input type="text" id="conciergeInput" placeholder="Ask about a style, occasion, or budget..." autocomplete="off" />
          <button type="submit" class="concierge-send-btn" aria-label="Send message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        </form>
      </div>
    </aside>
  `;
  document.body.insertAdjacentHTML('beforeend', html);
}

function initConciergeLogic() {
  const drawer = document.getElementById('nexConciergeDrawer');
  const overlay = document.getElementById('nexConciergeOverlay');
  const closeBtn = document.getElementById('conciergeCloseBtn');
  const form = document.getElementById('conciergeForm');
  const input = document.getElementById('conciergeInput');
  const stream = document.getElementById('conciergeStream');
  const chipsContainer = document.getElementById('conciergeChips');

  let hasInitialized = false;

  // Global Triggers (e.g., Header nav buttons)
  document.querySelectorAll('.concierge-nav-btn').forEach(btn => {
    btn.addEventListener('click', openDrawer);
  });

  overlay.addEventListener('click', closeDrawer);
  closeBtn.addEventListener('click', closeDrawer);
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value.trim();
    if (!val) return;
    input.value = '';
    handleUserMessage(val);
  });

  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    if (window.dataLayer) window.dataLayer.push({ event: 'nex_concierge_opened' });

    if (!hasInitialized && window.NexConciergeEngine) {
      const initResponse = window.NexConciergeEngine.initialize();
      renderConciergeResponse(initResponse);
      hasInitialized = true;
    }
    
    setTimeout(() => input.focus(), 300);
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (window.dataLayer) window.dataLayer.push({ event: 'nex_concierge_closed' });
  }

  function handleUserMessage(text) {
    appendUserMessage(text);
    if (window.dataLayer) window.dataLayer.push({ event: 'nex_concierge_message_sent' });
    
    // Simulate thinking delay
    const typingId = appendTypingIndicator();
    chipsContainer.innerHTML = ''; // Clear chips while thinking
    
    setTimeout(() => {
      document.getElementById(typingId)?.remove();
      if (window.NexConciergeEngine) {
        const response = window.NexConciergeEngine.processMessage(text);
        renderConciergeResponse(response);
        if (window.dataLayer) window.dataLayer.push({ event: 'nex_concierge_response_rendered', state: response.type });
      }
    }, 800);
  }

  /* ─── Rendering Helpers ───────────────────────────────────── */
  
  function appendUserMessage(text) {
    const el = document.createElement('div');
    el.className = 'msg-user-wrapper';
    el.innerHTML = `<div class="msg-user">${escapeHtml(text)}</div>`;
    stream.appendChild(el);
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
    stream.appendChild(el);
    scrollToBottom();
    return id;
  }

  function renderConciergeResponse(response) {
    const wrapper = document.createElement('div');
    wrapper.className = 'msg-concierge-wrapper';
    
    let html = `<div class="msg-concierge-text">${escapeHtml(response.text)}</div>`;

    if (response.isBundleLook && response.products.length > 0) {
      // Render Bundle
      html += renderBundleCard(response.products);
    } else if (response.products && response.products.length > 0) {
      // Render Individual Cards
      html += renderProductCards(response.products);
    }

    wrapper.innerHTML = html;
    stream.appendChild(wrapper);

    // Update chips
    renderChips(response.suggestedChips || []);
    scrollToBottom();
  }

  function renderProductCards(products) {
    const cards = products.map(p => {
      const priceStr = p.numericPrice ? 'BDT ' + p.numericPrice.toLocaleString() : p.price;
      return `
        <div class="concierge-product-card">
          <img src="${p.img}" alt="${escapeHtml(p.title)}" />
          <div class="concierge-card-body">
            <div class="concierge-card-cat">${escapeHtml(p.category)}</div>
            <div class="concierge-card-title">${escapeHtml(p.title)}</div>
            <div class="concierge-card-price">${priceStr}</div>
            <button class="concierge-add-btn" onclick="window.conciergeAdd(this, '${p.id}')">ADD TO BAG</button>
          </div>
        </div>
      `;
    }).join('');

    return `<div class="concierge-product-grid">${cards}</div>`;
  }

  function renderBundleCard(products) {
    let total = 0;
    const itemsHtml = products.map(p => {
      total += p.numericPrice || parseInt((p.price||'0').replace(/[^0-9]/g,''));
      return `
        <div class="bundle-item">
          <img src="${p.img}" alt="" />
          <div class="bundle-item-info">
            <div class="bundle-item-cat">${escapeHtml(p.category)}</div>
            <div class="bundle-item-title">${escapeHtml(p.title)}</div>
          </div>
        </div>
      `;
    }).join('');

    const ids = products.map(p => p.id).join(',');

    return `
      <div class="concierge-look-bundle">
        <div class="bundle-header">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          COMPLETE THE LOOK
        </div>
        <div class="bundle-items">${itemsHtml}</div>
        <div class="bundle-footer">
          <div class="bundle-total">Total: BDT ${total.toLocaleString()}</div>
          <button class="btn-primary-commerce bundle-add-btn" onclick="window.conciergeAddBundle(this, '${ids}')">ADD ALL TO BAG</button>
        </div>
      </div>
    `;
  }

  function renderChips(chips) {
    if (!chips || chips.length === 0) {
      chipsContainer.innerHTML = '';
      return;
    }
    const html = chips.map(c => `
      <button class="concierge-chip" onclick="window.conciergeSendChip('${escapeHtml(c)}')">${escapeHtml(c)}</button>
    `).join('');
    chipsContainer.innerHTML = html;
  }

  function scrollToBottom() {
    setTimeout(() => {
      stream.scrollTop = stream.scrollHeight;
    }, 50);
  }

  function escapeHtml(unsafe) {
    return (unsafe||'').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  /* ─── Global Handlers for inline onclick ────────────────────── */

  window.conciergeSendChip = function(text) {
    input.value = text;
    form.dispatchEvent(new Event('submit'));
  };

  window.conciergeAdd = function(btn, productId) {
    btn.textContent = 'ADDING...';
    btn.disabled = true;
    
    // Wire to cart.js
    if (window.NexCart) {
      window.NexCart.addItem({
        id: productId,
        name: 'Item', // NexCart finds it in catalog
        price: 0,
        qty: 1,
        image: ''
      });
    }

    if (window.dataLayer) window.dataLayer.push({ event: 'nex_concierge_add_to_bag', product_id: productId });

    setTimeout(() => {
      btn.textContent = 'ADDED';
      btn.style.background = 'rgba(52,211,153,0.15)';
      btn.style.color = '#34D399';
    }, 600);
  };

  window.conciergeAddBundle = function(btn, commaIds) {
    btn.textContent = 'ADDING ALL...';
    btn.disabled = true;
    const ids = commaIds.split(',');
    
    if (window.NexCart) {
      ids.forEach(id => {
        window.NexCart.addItem({ id: id, qty: 1 });
      });
    }

    if (window.dataLayer) window.dataLayer.push({ event: 'nex_concierge_add_look_to_bag' });

    setTimeout(() => {
      btn.textContent = 'ALL ADDED TO BAG';
      btn.style.background = 'var(--accent-cyan)';
      btn.style.color = 'var(--bg-main)';
    }, 800);
  };

  // Expose for demo pages
  window.openConciergeDemo = openDrawer;
}
