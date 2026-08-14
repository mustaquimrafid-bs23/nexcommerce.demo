/**
 * nexCommerce AI &mdash; Concierge UI Controller (Feature 6)
 * Injects the persistent Side Drawer into the DOM on every page.
 * Wires the ConciergeEngine to the chat stream with rich card rendering & size advice.
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
    <aside id="nexConciergeDrawer" class="concierge-drawer" aria-hidden="true" role="dialog" aria-label="Style Concierge" data-lenis-prevent>
      <!-- Header -->
      <div class="concierge-header">
        <div class="concierge-header-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-sparkles" style="color: #F13365;"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          Style Concierge
        </div>
        <button id="conciergeCloseBtn" class="concierge-close" aria-label="Close Concierge">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      <!-- Scrollable Stream -->
      <div id="conciergeStream" class="concierge-stream" aria-live="polite" data-lenis-prevent>
        <!-- Messages appended here dynamically -->
      </div>

      <!-- Input Area -->
      <div class="concierge-input-area">
        <div id="conciergeChips" class="concierge-chips-container">
          <!-- Suggestion chips injected here -->
        </div>
        <form id="conciergeForm" class="concierge-input-bar">
          <input type="text" id="conciergeInput" placeholder="Ask about a style, size, occasion, or delivery..." autocomplete="off" />
          <button type="submit" class="concierge-send-btn" aria-label="Send message">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
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
  document.querySelectorAll('.concierge-nav-btn, [data-concierge-trigger]').forEach(btn => {
    btn.addEventListener('click', openDrawer);
  });

  if (overlay) overlay.addEventListener('click', closeDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) closeDrawer();
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = input.value.trim();
      if (!val) return;
      input.value = '';
      handleUserMessage(val);
    });
  }

  function openDrawer() {
    if (!drawer || !overlay) return;
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    if (window.dataLayer) window.dataLayer.push({ event: 'nex_concierge_opened' });

    if (!hasInitialized && window.NexConciergeEngine) {
      const initResponse = window.NexConciergeEngine.initialize();
      renderConciergeResponse(initResponse);
      hasInitialized = true;
    }
    
    setTimeout(() => {
      if (input) input.focus();
    }, 300);
  }

  function closeDrawer() {
    if (!drawer || !overlay) return;
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (window.dataLayer) window.dataLayer.push({ event: 'nex_concierge_closed' });
  }

  function handleUserMessage(text) {
    appendUserMessage(text);
    if (window.dataLayer) window.dataLayer.push({ event: 'nex_concierge_message_sent' });
    
    // Simulate natural thinking delay
    const typingId = appendTypingIndicator();
    if (chipsContainer) chipsContainer.innerHTML = '';
    
    setTimeout(() => {
      const typingEl = document.getElementById(typingId);
      if (typingEl) typingEl.remove();
      if (window.NexConciergeEngine) {
        const response = window.NexConciergeEngine.processMessage(text);
        renderConciergeResponse(response);
        if (window.dataLayer) window.dataLayer.push({ event: 'nex_concierge_response_rendered', state: response.type });
      }
    }, 600);
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
    
    const formattedText = formatMarkdownText(response.text || '');
    let html = `<div class="msg-concierge-text">${formattedText}</div>`;

    // Action Link (e.g. Order Tracking)
    if (response.actionLink) {
      html += `
        <div class="concierge-action-wrap">
          <a href="${response.actionLink.url}" class="concierge-action-btn">${escapeHtml(response.actionLink.text)}</a>
        </div>
      `;
    }

    if (response.isBundleLook && response.products && response.products.length > 0) {
      html += renderBundleCard(response.products);
    } else if (response.products && response.products.length > 0) {
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
      const priceStr = p.numericPrice ? 'BDT ' + p.numericPrice.toLocaleString() : (p.price || 'BDT 18,400');
      const reason = p.desc || p.reasoning || 'Designed for effortless comfort.';
      return `
        <div class="concierge-product-card">
          <a href="product.html?id=${p.id}" class="concierge-card-img-link" title="View details for ${escapeHtml(p.title)}">
            <img src="${p.img}" alt="${escapeHtml(p.title)}" loading="lazy" />
          </a>
          <div class="concierge-card-body">
            <div class="concierge-card-cat">${escapeHtml(p.category || 'Apparel')}</div>
            <a href="product.html?id=${p.id}" class="concierge-card-title-link">
              <div class="concierge-card-title">${escapeHtml(p.title)}</div>
            </a>
            <div class="concierge-card-price">${priceStr}</div>
            <div class="concierge-card-why" title="${escapeHtml(reason)}">✦ ${escapeHtml(reason.length > 65 ? reason.slice(0, 62) + '...' : reason)}</div>
            <button class="concierge-add-btn" onclick="window.conciergeAdd(this, '${p.id}', '${escapeHtml(p.title)}', ${p.numericPrice || 18400}, '${p.img}')">ADD TO BAG</button>
          </div>
        </div>
      `;
    }).join('');

    return `<div class="concierge-product-grid" data-lenis-prevent>${cards}</div>`;
  }

  function renderBundleCard(products) {
    let total = 0;
    const itemsHtml = products.map(p => {
      const pNum = p.numericPrice || parseInt((p.price||'0').replace(/[^0-9]/g,'')) || 18400;
      total += pNum;
      return `
        <div class="bundle-item">
          <a href="product.html?id=${p.id}">
            <img src="${p.img}" alt="" />
          </a>
          <div class="bundle-item-info">
            <div class="bundle-item-cat">${escapeHtml(p.category)}</div>
            <a href="product.html?id=${p.id}" class="bundle-item-title-link">
              <div class="bundle-item-title">${escapeHtml(p.title)}</div>
            </a>
            <div class="bundle-item-price">BDT ${pNum.toLocaleString()}</div>
          </div>
        </div>
      `;
    }).join('');

    const ids = products.map(p => p.id).join(',');

    return `
      <div class="concierge-look-bundle">
        <div class="bundle-header">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #F13365;"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          COMPLETE THE LOOK
        </div>
        <div class="bundle-items">${itemsHtml}</div>
        <div class="bundle-footer">
          <div class="bundle-total">Look Total: <strong>BDT ${total.toLocaleString()}</strong></div>
          <button class="btn-primary-commerce bundle-add-btn" onclick="window.conciergeAddBundle(this, '${ids}')">ADD ALL TO BAG</button>
        </div>
      </div>
    `;
  }

  function renderChips(chips) {
    if (!chipsContainer) return;
    if (!chips || chips.length === 0) {
      chipsContainer.innerHTML = '';
      return;
    }
    const html = chips.map(c => `
      <button type="button" class="concierge-chip" onclick="window.conciergeSendChip('${escapeHtml(c)}')">${escapeHtml(c)}</button>
    `).join('');
    chipsContainer.innerHTML = html;
  }

  function scrollToBottom() {
    setTimeout(() => {
      if (stream) stream.scrollTop = stream.scrollHeight;
    }, 50);
  }

  function escapeHtml(unsafe) {
    return (unsafe||'').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  function formatMarkdownText(str) {
    let s = escapeHtml(str);
    // Bold
    s = s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Bullet list items
    s = s.replace(/•\s*(.*?)(?=\n|$)/g, '<div class="concierge-bullet-item"><span class="concierge-bullet-dot"></span><span>$1</span></div>');
    // Paragraphs / Linebreaks
    s = s.replace(/\n\n/g, '<div class="concierge-p-break"></div>');
    s = s.replace(/\n/g, '<br>');
    return s;
  }

  /* ─── Global Handlers for inline onclick ────────────────────── */

  window.conciergeSendChip = function(text) {
    const inp = document.getElementById('conciergeInput');
    const frm = document.getElementById('conciergeForm');
    if (inp && frm) {
      inp.value = text;
      frm.dispatchEvent(new Event('submit'));
    }
  };

  window.conciergeAdd = function(btn, productId, title, price, img) {
    btn.textContent = 'ADDING...';
    btn.disabled = true;
    
    if (window.NexCart) {
      window.NexCart.addItem({
        id: productId,
        name: title || 'Curated Item',
        price: price || 18400,
        qty: 1,
        image: img || 'hero_sweater.png'
      });
    }

    if (window.dataLayer) window.dataLayer.push({ event: 'nex_concierge_add_to_bag', product_id: productId });

    setTimeout(() => {
      btn.textContent = 'ADDED';
      btn.style.background = 'rgba(52,211,153,0.18)';
      btn.style.color = '#34D399';
    }, 500);
  };

  window.conciergeAddBundle = function(btn, commaIds) {
    btn.textContent = 'ADDING ALL...';
    btn.disabled = true;
    const ids = commaIds.split(',');
    
    if (window.NexCart) {
      ids.forEach(id => {
        const item = (window.NexAI && window.NexAI.catalog && window.NexAI.catalog[id]) || {};
        window.NexCart.addItem({
          id: id,
          name: item.title || 'Curated Look Piece',
          price: item.numericPrice || 18400,
          qty: 1,
          image: item.img || ''
        });
      });
    }

    if (window.dataLayer) window.dataLayer.push({ event: 'nex_concierge_add_look_to_bag' });

    setTimeout(() => {
      btn.textContent = 'ALL ADDED TO BAG';
      btn.style.background = 'linear-gradient(135deg, #F13365, #E60C45)';
      btn.style.color = '#FFFFFF';
    }, 700);
  };

  // Expose for demo pages & navbar triggers
  window.openConciergeDemo = openDrawer;
  window.openConcierge = openDrawer;
}
