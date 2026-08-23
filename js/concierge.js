/**
 * nexCommerce AI &mdash; Elevated Stylist UI Controller (Feature 6)
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
  let micBtnEl = null;
  let voiceCancelBtnEl = null;
  let voiceWaveEl = null;
  let voiceToggleBtnEl = null;
  let hasInitialized = false;
  let lastActiveTrigger = null;
  let isVoiceEnabled = (typeof localStorage !== 'undefined' ? localStorage.getItem('nex_stylist_voice_muted') !== 'true' : true);
  let isListening = false;
  let recognition = null;
  let currentUtterance = null;

  function resolveHref(target) {
    if (!target || target === '#') return '#';
    if (target.startsWith('http://') || target.startsWith('https://') || target.startsWith('mailto:') || target.startsWith('tel:')) return target;

    const isInPages = typeof window !== 'undefined' && (window.location.pathname.includes('/pages/') || window.location.pathname.includes('\\pages\\'));

    // Handle index.html or root
    if (target === 'index.html' || target.startsWith('index.html?')) {
      return isInPages ? '../' + target : target;
    }

    // If target already contains 'pages/', adjust if we are already in pages
    if (target.startsWith('pages/')) {
      return isInPages ? target.substring(6) : target;
    }

    // Target is a sibling page (e.g. 'orders.html', 'tracking.html', 'checkout.html', 'cart.html', 'product.html')
    return isInPages ? target : 'pages/' + target;
  }

  function resolveImg(imgPath) {
    if (!imgPath) return 'assets/images/products/hero_sweater.png';
    const isInPages = typeof window !== 'undefined' && (window.location.pathname.includes('/pages/') || window.location.pathname.includes('\\pages\\'));
    if (isInPages) {
      if (imgPath.startsWith('assets/')) return '../' + imgPath;
      return imgPath;
    } else {
      if (imgPath.startsWith('../assets/')) return imgPath.substring(3);
      return imgPath;
    }
  }

  if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
    document.addEventListener('DOMContentLoaded', function() {
      if (document.getElementById('nexConciergeDrawer')) return; // Already present
      
      injectConciergeHTML();
      initConciergeLogic();
      initVoiceAI();
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
    drawer.setAttribute('aria-label', 'Ask Stylist');
    drawer.setAttribute('data-lenis-prevent', '');

    drawer.innerHTML = `
      <!-- Header -->
      <div class="concierge-header">
        <div class="concierge-header-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-sparkles" style="color: #F13365;"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          Ask Stylist
        </div>
        <div class="concierge-header-actions" style="display:flex;align-items:center;gap:6px;">
          <button type="button" id="conciergeVoiceToggleBtn" class="concierge-voice-toggle-btn ${isVoiceEnabled ? 'active' : ''}" aria-label="Toggle Stylist Voice Audio" title="${isVoiceEnabled ? 'Stylist Voice Active (Click to mute)' : 'Stylist Voice Muted (Click to enable)'}">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
          </button>
          <button type="button" class="concierge-close" aria-label="Close" data-action="close-concierge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
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
          <div id="conciergeListeningWave" class="listening-waveform" style="display:none;" aria-hidden="true">
            <div class="voice-bar-anim"></div>
            <div class="voice-bar-anim"></div>
            <div class="voice-bar-anim"></div>
            <div class="voice-bar-anim"></div>
            <div class="voice-bar-anim"></div>
            <div class="voice-bar-anim"></div>
          </div>
          <input type="text" id="conciergeInput" name="concierge_query" placeholder="Ask about style, size, or tap mic..." autocomplete="off" aria-label="Ask the AI concierge a question" />
          <button type="button" id="conciergeVoiceCancelBtn" class="voice-cancel-btn" style="display:none;" aria-label="Cancel Voice Input" title="Cancel voice input">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
          <button type="button" id="conciergeMicBtn" class="concierge-mic-btn" aria-label="Tap to speak" title="Tap to Speak with Stylist">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
          </button>
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
    floatingPill.setAttribute('aria-label', 'Ask Stylist');
    floatingPill.setAttribute('data-action', 'open-concierge');
    floatingPill.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="lucide-sparkles" style="color: #F13365;"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
      <span>✦ Ask Stylist</span>
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
    micBtnEl = document.getElementById('conciergeMicBtn');
    voiceCancelBtnEl = document.getElementById('conciergeVoiceCancelBtn');
    voiceWaveEl = document.getElementById('conciergeListeningWave');
    voiceToggleBtnEl = document.getElementById('conciergeVoiceToggleBtn');
  }

  function initConciergeLogic() {
    // 1. Floating Pill Scroll Detection
    let lastScrollY = window.scrollY;
    function handleScroll() {
      if (window.scrollY > 200) {
        if (floatingPillEl) floatingPillEl.classList.add('visible');
      } else {
        if (floatingPillEl) floatingPillEl.classList.remove('visible');
      }
      lastScrollY = window.scrollY;
    }

    if (window._nexLenis) {
      window._nexLenis.on('scroll', handleScroll);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // 2. Open Triggers (Global Header Button, Floating Pill, PDP Trigger)
    document.addEventListener('click', function(e) {
      const trigger = e.target.closest('.concierge-nav-btn, [data-concierge-trigger], [data-action="open-concierge"], #conciergeNavTrigger');
      if (trigger) {
        e.preventDefault();
        lastActiveTrigger = trigger;
        
        let ctx = {};
        if (trigger.getAttribute('data-pdp-context') === 'true') {
          ctx.url = window.location.href;
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
        if (text === 'Place an order (Voice Demo)') {
          runVoiceOrderDemo();
        } else if (text === 'Place an order (Text Demo)') {
          runTextOrderDemo();
        } else if (text) {
          handleUserMessage(text);
        }
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
      } else if (action === 'confirm-order-address') {
        const addr = actionEl.getAttribute('data-address') || 'Maximilianstraße 34, 80539 Munich, Germany';
        handleUserMessage('Confirm address: ' + addr);
      } else if (action === 'confirm-custom-address') {
        const s = document.getElementById('quickAddrStreet') ? document.getElementById('quickAddrStreet').value : 'Maximilianstraße 34';
        const c = document.getElementById('quickAddrCity') ? document.getElementById('quickAddrCity').value : 'Munich';
        const p = document.getElementById('quickAddrPostcode') ? document.getElementById('quickAddrPostcode').value : '80539';
        handleUserMessage(`Confirm address: ${s}, ${p} ${c}`);
      } else if (action === 'select-payment-method') {
        const grid = actionEl.closest('.payment-options-grid');
        if (grid) {
          grid.querySelectorAll('.payment-option-card').forEach(card => card.classList.remove('selected'));
          actionEl.classList.add('selected');
          const radio = actionEl.querySelector('input[type="radio"]');
          if (radio) radio.checked = true;
        }
      } else if (action === 'proceed-to-order-review') {
        const selCard = document.querySelector('.payment-option-card.selected input[type="radio"]') || document.querySelector('input[name="order_payment_method"]:checked');
        const val = selCard ? selCard.value : 'card';
        let methodText = 'Card •••• 4242';
        if (val === 'apple_pay') methodText = 'Apple Pay';
        else if (val === 'klarna') methodText = 'Klarna Pay Later';
        else if (val === 'cod') methodText = 'Cash on Delivery';
        handleUserMessage('Pay with ' + methodText);
      } else if (action === 'authorize-order') {
        if (typeof window !== 'undefined' && window.nexCart && typeof window.nexCart.clear === 'function') {
          try { window.nexCart.clear(); } catch (e) {}
        }
        handleUserMessage('Authorize & place order now');
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

    if (window.dataLayer) window.dataLayer.push({ event: 'nex_stylist_opened' });

    if (!hasInitialized && window.NexConciergeEngine) {
      const initResponse = window.NexConciergeEngine.initialize(context);
      renderConciergeResponse(initResponse);
      hasInitialized = true;
    } else if (!hasInitialized) {
      renderConciergeResponse({ text: 'Good to see you. What are you shopping for today?' });
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
    if (window.dataLayer) window.dataLayer.push({ event: 'nex_stylist_closed' });
  }

  async function runVoiceOrderDemo() {
    handleUserMessage('I want to place an order for my bag', true);
    await new Promise(r => setTimeout(r, 2800));
    handleUserMessage('Confirm address: Maximilianstraße 34, 80539 Munich', true);
    await new Promise(r => setTimeout(r, 2800));
    handleUserMessage('Pay with Apple Pay', true);
    await new Promise(r => setTimeout(r, 2800));
    if (typeof window !== 'undefined' && window.nexCart && typeof window.nexCart.clear === 'function') {
      try { window.nexCart.clear(); } catch (e) {}
    }
    handleUserMessage('Authorize & place order now', true);
  }

  async function runTextOrderDemo() {
    handleUserMessage('I want to place an order', false);
    await new Promise(r => setTimeout(r, 2200));
    handleUserMessage('Confirm address: Maximilianstraße 34, 80539 Munich', false);
    await new Promise(r => setTimeout(r, 2200));
    handleUserMessage('Pay with Card •••• 4242', false);
    await new Promise(r => setTimeout(r, 2200));
    if (typeof window !== 'undefined' && window.nexCart && typeof window.nexCart.clear === 'function') {
      try { window.nexCart.clear(); } catch (e) {}
    }
    handleUserMessage('Authorize & place order now', false);
  }

  function handleUserMessage(text, isVoice) {
    appendUserMessage(text, isVoice);
    if (window.dataLayer) window.dataLayer.push({ event: 'nex_stylist_message_sent', query: text, is_voice: !!isVoice });

    // Typing simulation
    const typingId = appendTypingIndicator();
    if (chipsContainerEl) chipsContainerEl.innerHTML = '';

    setTimeout(function() {
      removeTypingIndicator(typingId);
      if (window.NexConciergeEngine) {
        try {
          const response = window.NexConciergeEngine.processMessage(text);
          renderConciergeResponse(response);
        } catch (err) {
          renderConciergeResponse({ text: 'I ran into a hiccup with that request — could you rephrase it?' });
        }
      } else {
        renderConciergeResponse({ text: 'I can help you explore our collection. What are you shopping for?' });
      }
    }, 450);
  }

  function appendUserMessage(text, isVoice) {
    if (!streamEl) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'msg-user-wrapper';
    const voiceTag = isVoice ? `<div class="voice-tag-line"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg> Spoken query</div>` : '';
    wrapper.innerHTML = `<div class="msg-user ${isVoice ? 'spoken-query' : ''}">${voiceTag}${escapeHtml(text)}</div>`;
    streamEl.appendChild(wrapper);
    scrollToBottom();
  }

  function appendTypingIndicator() {
    if (!streamEl) return null;
    const id = 'typing_' + Date.now();
    const typing = document.createElement('div');
    typing.id = id;
    typing.className = 'msg-concierge typing';
    typing.innerHTML = `<span></span><span></span><span></span>`;
    streamEl.appendChild(typing);
    scrollToBottom();
    return id;
  }

  function removeTypingIndicator(id) {
    if (!id) return;
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  function initVoiceAI() {
    // 1. Voice Audio Toggle Button in Header
    if (voiceToggleBtnEl) {
      voiceToggleBtnEl.addEventListener('click', function(e) {
        e.preventDefault();
        isVoiceEnabled = !isVoiceEnabled;
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('nex_stylist_voice_muted', isVoiceEnabled ? 'false' : 'true');
        }
        if (isVoiceEnabled) {
          voiceToggleBtnEl.classList.add('active');
          voiceToggleBtnEl.setAttribute('title', 'Stylist Voice Active (Click to mute)');
        } else {
          voiceToggleBtnEl.classList.remove('active');
          voiceToggleBtnEl.setAttribute('title', 'Stylist Voice Muted (Click to enable)');
          stopVoice();
        }
      });
    }

    // 2. Setup Web Speech Recognition
    const SpeechRecognition = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
    if (SpeechRecognition) {
      try {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = function() {
          isListening = true;
          setListeningUI(true);
        };

        recognition.onresult = function(event) {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
          }
          if (inputEl) inputEl.value = transcript;
          if (event.results[0] && event.results[0].isFinal) {
            stopListening();
            if (transcript.trim()) {
              handleUserMessage(transcript.trim(), true /* isVoice */);
            }
          }
        };

        recognition.onerror = function(err) {
          console.warn('[Voice AI] Speech recognition error:', err.error);
          stopListening();
        };

        recognition.onend = function() {
          stopListening();
        };
      } catch (e) {
        console.warn('[Voice AI] SpeechRecognition init failed:', e);
      }
    }

    // 3. Mic button click trigger
    if (micBtnEl) {
      micBtnEl.addEventListener('click', function(e) {
        e.preventDefault();
        if (!recognition) {
          alert('Speech Recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
          return;
        }
        if (isListening) {
          stopListening();
        } else {
          try {
            recognition.start();
          } catch (err) {
            stopListening();
          }
        }
      });
    }

    // 4. Cancel Voice button
    if (voiceCancelBtnEl) {
      voiceCancelBtnEl.addEventListener('click', function(e) {
        e.preventDefault();
        stopListening();
        if (inputEl) inputEl.value = '';
      });
    }
  }

  function setListeningUI(active) {
    if (!formEl) return;
    if (active) {
      formEl.classList.add('listening');
      if (voiceWaveEl) voiceWaveEl.style.display = 'flex';
      if (voiceCancelBtnEl) voiceCancelBtnEl.style.display = 'flex';
      if (micBtnEl) micBtnEl.style.display = 'none';
      if (inputEl) inputEl.placeholder = 'Listening... Speak now';
    } else {
      formEl.classList.remove('listening');
      if (voiceWaveEl) voiceWaveEl.style.display = 'none';
      if (voiceCancelBtnEl) voiceCancelBtnEl.style.display = 'none';
      if (micBtnEl) micBtnEl.style.display = 'flex';
      if (inputEl) inputEl.placeholder = 'Ask about style, size, or tap mic...';
    }
  }

  function stopListening() {
    isListening = false;
    if (recognition) {
      try { recognition.stop(); } catch (e) {}
    }
    setListeningUI(false);
  }

  function stopVoice() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  let cachedVoices = [];
  function getConciergeVoice() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    if (cachedVoices.length === 0) {
      cachedVoices = window.speechSynthesis.getVoices() || [];
    }
    return cachedVoices.find(v => (v.name.includes('David') || v.name.includes('Mark') || v.name.includes('George') || v.name.includes('Alex')) && v.lang.startsWith('en'))
      || cachedVoices.find(v => v.lang && v.lang.startsWith('en') && !v.name.includes('Zira'))
      || cachedVoices[0]
      || null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = function() {
      cachedVoices = window.speechSynthesis.getVoices() || [];
    };
  }

  function speakVoice(text, audioBarId) {
    if (!isVoiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window) || !text) return;
    stopVoice();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.90; // Relaxed, clear conversational speed
    utterance.pitch = 1.0;

    const preferredVoice = getConciergeVoice();
    if (preferredVoice) utterance.voice = preferredVoice;

    currentUtterance = utterance;

    const audioBarEl = audioBarId ? document.getElementById(audioBarId) : null;
    const playBtn = audioBarEl ? audioBarEl.querySelector('.audio-play-btn') : null;
    const labelEl = audioBarEl ? audioBarEl.querySelector('.audio-time-label') : null;

    utterance.onstart = function() {
      if (labelEl) labelEl.textContent = 'Speaking...';
      if (playBtn) playBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
    };

    utterance.onend = function() {
      if (labelEl) labelEl.textContent = 'Play Voice Summary';
      if (playBtn) playBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
    };

    utterance.onerror = function() {
      if (labelEl) labelEl.textContent = 'Voice Audio';
      if (playBtn) playBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
    };

    window.speechSynthesis.speak(utterance);
  }

  function renderConciergeResponse(response) {
    const wrapper = document.createElement('div');
    wrapper.className = 'msg-concierge-wrapper';

    const formattedText = formatMarkdownText(response.text || '');
    let html = `<div class="msg-concierge-text">${formattedText}</div>`;

    const audioBarId = 'audioBar_' + Date.now();
    if (response.spokenSummary) {
      html += `
        <div id="${audioBarId}" class="stylist-audio-bar" data-spoken="${escapeHtml(response.spokenSummary)}">
          <button type="button" class="audio-play-btn" aria-label="Play or Pause Stylist Voice" title="Play Voice">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </button>
          <div class="mini-waveform" aria-hidden="true">
            <div class="mini-wave-bar"></div>
            <div class="mini-wave-bar"></div>
            <div class="mini-wave-bar"></div>
            <div class="mini-wave-bar"></div>
            <div class="mini-wave-bar"></div>
            <div class="mini-wave-bar"></div>
            <div class="mini-wave-bar"></div>
            <div class="mini-wave-bar"></div>
          </div>
          <span class="audio-time-label">Speaking...</span>
        </div>
      `;
    }

    // 0A. Order Flow Widgets (Step 1 to 4)
    if (response.type === 'order_address' && response.widgetPayload) {
      html += renderOrderAddressWidget(response.widgetPayload);
    } else if (response.type === 'order_payment' && response.widgetPayload) {
      html += renderOrderPaymentWidget(response.widgetPayload);
    } else if (response.type === 'order_review' && response.widgetPayload) {
      html += renderOrderReviewWidget(response.widgetPayload);
    } else if (response.type === 'order_confirmed' && response.widgetPayload) {
      html += renderOrderConfirmedWidget(response.widgetPayload);
    }
    // 1. Look Bundle Widget
    else if (response.type === 'bundle_look' || (response.isBundleLook && response.products && response.products.length > 0)) {
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
      const resolvedUrl = resolveHref(response.actionLink.url);
      html += `
        <div class="concierge-action-wrap">
          <a href="${resolvedUrl}" class="concierge-action-btn">${escapeHtml(response.actionLink.text)}</a>
        </div>
      `;
    }

    wrapper.innerHTML = html;
    streamEl.appendChild(wrapper);

    // Audio Playback Attachment
    if (response.spokenSummary) {
      speakVoice(response.spokenSummary, audioBarId);
      const barEl = document.getElementById(audioBarId);
      if (barEl) {
        const pBtn = barEl.querySelector('.audio-play-btn');
        if (pBtn) {
          pBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.speaking) {
              stopVoice();
              const label = barEl.querySelector('.audio-time-label');
              if (label) label.textContent = 'Play Voice Summary';
              pBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
            } else {
              speakVoice(response.spokenSummary, audioBarId);
            }
          });
        }
      }
    }

    // Update suggested prompt chips
    renderChips(response.suggestedChips || []);
    scrollToBottom();
  }

  function renderOrderAddressWidget(payload) {
    const addr = payload.defaultAddress || {
      name: 'Julian Wright',
      formatted: 'Maximilianstraße 34, 80539 Munich, Germany',
      street: 'Maximilianstraße 34',
      city: 'Munich',
      postcode: '80539'
    };

    return `
      <div class="order-address-box" data-widget="order-address">
        <div class="saved-addr-pill selected" role="button" tabindex="0" data-action="confirm-order-address" data-address="${escapeHtml(addr.formatted)}">
          <span class="addr-tag">Default</span>
          <div class="addr-text">
            <strong>${escapeHtml(addr.name)}</strong><br>
            ${escapeHtml(addr.formatted)}
          </div>
        </div>

        <div style="font-size: 10px; color: #64748b; text-align: center; text-transform: uppercase; letter-spacing: 0.05em;">
          ── or enter a new address ──
        </div>

        <div class="quick-addr-inputs">
          <input type="text" id="quickAddrStreet" class="quick-input" placeholder="Street Address & Apt" value="${escapeHtml(addr.street)}" />
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
            <input type="text" id="quickAddrCity" class="quick-input" placeholder="City" value="${escapeHtml(addr.city)}" />
            <input type="text" id="quickAddrPostcode" class="quick-input" placeholder="Postcode" value="${escapeHtml(addr.postcode)}" />
          </div>
        </div>

        <button type="button" class="btn-step-action" data-action="confirm-custom-address">
          <span>Confirm Address</span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </button>
      </div>
    `;
  }

  function renderOrderPaymentWidget(payload) {
    const methods = payload.paymentMethods || [
      { id: 'card', name: 'Credit / Debit Card', details: '•••• 4242 (Visa / MC)', badge: 'Default', selected: true },
      { id: 'apple_pay', name: 'Apple Pay / Google Pay', details: '1-Touch Biometric', badge: 'Instant', selected: false },
      { id: 'klarna', name: 'Klarna Pay Later', details: 'Pay in 30 Days', badge: '0% APR', selected: false },
      { id: 'cod', name: 'Cash on Delivery', details: 'Direct Courier Payment', badge: 'Courier', selected: false }
    ];

    const methodsHtml = methods.map((m) => `
      <label class="payment-option-card ${m.selected ? 'selected' : ''}" data-pay-id="${m.id}" data-action="select-payment-method">
        <div class="pay-left">
          <input type="radio" name="order_payment_method" value="${m.id}" ${m.selected ? 'checked' : ''} class="pay-radio" />
          <span>${escapeHtml(m.name)} <span style="font-size: 11px; color: #b0c4de; font-weight: 400;">(${escapeHtml(m.details)})</span></span>
        </div>
        <span class="pay-badge">${escapeHtml(m.badge)}</span>
      </label>
    `).join('');

    return `
      <div class="order-payment-box" data-widget="order-payment">
        <div class="payment-options-grid">
          ${methodsHtml}
        </div>
        <button type="button" class="btn-step-action" style="background: #F13365; color: #fff; margin-top: 8px;" data-action="proceed-to-order-review">
          <span>Proceed to Review</span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </button>
      </div>
    `;
  }

  function renderOrderReviewWidget(payload) {
    const items = payload.items || [];
    const itemsRows = items.map(item => `
      <div class="order-line-row">
        <span>${escapeHtml(item.title || item.name || 'Atelier Item')}${item.size ? ` (${escapeHtml(item.size)})` : ''}</span>
        <span>€ ${(item.numericPrice || item.price || 0).toFixed(2)}</span>
      </div>
    `).join('');

    return `
      <div class="order-summary-box" data-widget="order-review">
        ${itemsRows}
        <div class="order-line-row">
          <span>Express Courier Dispatch</span>
          <span style="color: #10b981; font-weight: 700;">FREE</span>
        </div>
        <div class="order-line-row">
          <span>Promo Code (${escapeHtml(payload.discountCode || 'WELCOME10')})</span>
          <span style="color: #F13365; font-weight: 700;">-€ ${(payload.discountAmount || 28.5).toFixed(2)}</span>
        </div>
        <div class="order-line-row total">
          <span>TOTAL DUE</span>
          <span style="color: #3de0ff;">€ ${(payload.totalDue || 256.5).toFixed(2)}</span>
        </div>
        <div style="font-size: 10.5px; color: #64748b; line-height: 1.4; margin-top: 4px;">
          📍 Shipping to ${escapeHtml(payload.address || 'Maximilianstraße 34, Munich')}<br>
          💳 Paid via ${escapeHtml(payload.paymentMethod || 'Card •••• 4242')}
        </div>
        <button type="button" class="btn-authorize-order" data-action="authorize-order">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span>AUTHORIZE & PLACE ORDER NOW</span>
        </button>
      </div>
    `;
  }

  function renderOrderConfirmedWidget(payload) {
    const orderCode = payload.orderCode || 'NX-4829-M';
    const steps = payload.trackingSteps || [
      { label: 'Order Received & Encrypted', time: 'Just now · Verified', done: true },
      { label: 'Quality Inspection in Munich Hub', time: 'In Progress · Expected 23:00', active: true },
      { label: 'Out for Express Courier Dispatch', time: 'Tomorrow, 09:30', pending: true }
    ];

    const stepsHtml = steps.map(s => `
      <div class="track-step-row" style="display:flex;align-items:flex-start;gap:10px;margin-bottom:8px;">
        <div class="step-dot ${s.done ? 'done' : (s.active ? 'active' : '')}" style="width:12px;height:12px;border-radius:50%;background:${s.done ? '#10b981' : (s.active ? '#3de0ff' : 'rgba(255,255,255,0.2)')};margin-top:2px;flex-shrink:0;"></div>
        <div style="display:flex;flex-direction:column;gap:1px;">
          <span style="font-size:11.5px;font-weight:600;color:#fff;">${escapeHtml(s.label)}</span>
          <span style="font-size:10px;color:#64748b;">${escapeHtml(s.time)}</span>
        </div>
      </div>
    `).join('');

    const ordersUrl = resolveHref('orders.html');
    const trackingUrl = resolveHref('tracking.html') + '?order=' + encodeURIComponent(orderCode);

    return `
      <div class="order-confirmed-box" data-widget="order-confirmed" style="display:flex;flex-direction:column;gap:10px;margin-top:6px;">
        <div class="order-confirmed-banner">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <div>Order <strong class="code">${escapeHtml(orderCode)}</strong> placed successfully! Preparing for courier dispatch.</div>
        </div>

        <div style="background:rgba(4,18,42,0.8);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:12px 10px;">
          ${stepsHtml}
        </div>

        <div style="display:flex;flex-direction:column;gap:6px;">
          <a href="${ordersUrl}" class="btn-step-action" style="background:rgba(61,224,255,0.12);border:1px solid #3de0ff;color:#3de0ff;">
            <span>View Full Order Details & Invoice</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </a>
        </div>
      </div>
    `;
  }

  function renderBundleCard(products) {
    let total = 0;
    const itemsHtml = products.map((p, idx) => {
      const pNum = p.numericPrice || parseInt((p.price || '0').replace(/[^0-9]/g, ''), 10) || 184;
      total += pNum;
      const imgSrc = resolveImg(p.img || 'assets/images/products/hero_sweater.png');
      return `
        <div class="bundle-item" data-bundle-item data-id="${p.id}" data-title="${escapeHtml(p.title)}" data-price="${pNum}" data-img="${imgSrc}">
          <label class="bundle-item-label">
            <input type="checkbox" checked class="bundle-checkbox" data-action="toggle-bundle-item" aria-label="Select ${escapeHtml(p.title)}" />
            <span class="bundle-item-thumb-link">
              <img src="${imgSrc}" alt="${escapeHtml(p.title)}" />
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
    const catPills = (payload.categories || ['Tops & Sweaters', 'Footwear']).map((cat, idx) => `
      <button type="button" class="size-pill ${idx === 0 ? 'active' : ''}" data-action="select-size-category" data-val="${escapeHtml(cat)}">${escapeHtml(cat)}</button>
    `).join('');

    const sizePills = (payload.availableSizes || ['XS (36")', 'S (38")', 'M (40")', 'L (42")', 'XL (44")']).map((s, idx) => `
      <button type="button" class="size-pill ${idx === 2 ? 'active' : ''}" data-action="select-size-measurement" data-val="${escapeHtml(s)}">${escapeHtml(s)}</button>
    `).join('');

    const fitPills = (payload.fits || ['True to size (Regular fit)', 'Size up (Relaxed fit for layering)']).map((f, idx) => `
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
      const productHref = resolveHref(`product.html?id=${p.id}`);
      const imgSrc = resolveImg(p.img || 'assets/images/products/hero_sweater.png');
      return `
        <div class="concierge-product-card">
          <a href="${productHref}" class="concierge-card-img-link" title="View details for ${escapeHtml(p.title)}">
            <img src="${imgSrc}" alt="${escapeHtml(p.title)}" loading="lazy" />
          </a>
          <div class="concierge-card-body">
            <div class="concierge-card-cat">${escapeHtml(p.category || 'Apparel')}</div>
            <a href="${productHref}" class="concierge-card-title-link">
              <div class="concierge-card-title">${escapeHtml(p.title)}</div>
            </a>
            <div class="concierge-card-price tabular-nums">${priceStr}</div>
            <button type="button" class="concierge-add-btn" data-action="add-to-bag" data-id="${p.id}" data-title="${escapeHtml(p.title)}" data-price="${p.numericPrice || 184}" data-img="${imgSrc}">
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
    if (!streamEl) return;
    setTimeout(function() {
      streamEl.scrollTo({
        top: streamEl.scrollHeight,
        behavior: 'smooth'
      });
    }, 60);
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
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

    const cart = window.nexCart || window.NexCart;
    if (cart && typeof cart.addItem === 'function') {
      cart.addItem({
        id: id,
        name: title,
        title: title,
        price: price,
        qty: 1,
        quantity: 1,
        image: img,
        img: img
      });
    } else {
      try {
        const stored = JSON.parse(localStorage.getItem('nex_cart') || '[]');
        const existing = stored.find(i => i.id === id);
        if (existing) existing.quantity = (existing.quantity || 1) + 1;
        else stored.push({ id, name: title, title, price, quantity: 1, image: img });
        localStorage.setItem('nex_cart', JSON.stringify(stored));
        const count = stored.reduce((sum, item) => sum + (item.quantity || 1), 0);
        document.querySelectorAll('#headerCartCount, #mobileCartCount, .bag-count-badge').forEach(b => {
          b.textContent = count;
          b.style.display = 'inline-flex';
        });
      } catch (e) {}
    }

    if (window.dataLayer) window.dataLayer.push({ event: 'nex_stylist_add_to_bag', product_id: id });

    setTimeout(function() {
      btn.textContent = 'ADDED ✓';
      btn.classList.add('added');
      setTimeout(function() {
        btn.textContent = 'ADD TO BAG';
        btn.classList.remove('added');
        btn.disabled = false;
      }, 2000);
    }, 350);
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
      addBtn.textContent = `ADD SELECTED ITEMS TO BAG (${checkedItems.length} Items · € ${subtotal.toFixed(2)})`;
      addBtn.disabled = checkedItems.length === 0;
    }
  }

  function handleAddBundleToCart(btn) {
    const bundleCard = btn.closest('.concierge-look-bundle');
    if (!bundleCard) return;

    const checkedItems = bundleCard.querySelectorAll('.bundle-item input[type="checkbox"]:checked');
    if (checkedItems.length === 0) return;

    btn.textContent = 'ADDING OUTFIT...';
    btn.disabled = true;

    const cart = window.nexCart || window.NexCart;
    checkedItems.forEach(cb => {
      const itemEl = cb.closest('[data-bundle-item]');
      if (itemEl) {
        const id = itemEl.getAttribute('data-id');
        const title = itemEl.getAttribute('data-title');
        const price = parseFloat(itemEl.getAttribute('data-price')) || 184;
        const img = itemEl.getAttribute('data-img');

        if (cart && typeof cart.addItem === 'function') {
          cart.addItem({
            id: id,
            name: title,
            title: title,
            price: price,
            qty: 1,
            quantity: 1,
            image: img,
            img: img
          });
        } else {
          try {
            const stored = JSON.parse(localStorage.getItem('nex_cart') || '[]');
            const existing = stored.find(i => i.id === id);
            if (existing) existing.quantity = (existing.quantity || 1) + 1;
            else stored.push({ id, name: title, title, price, quantity: 1, image: img });
            localStorage.setItem('nex_cart', JSON.stringify(stored));
          } catch (e) {}
        }
      }
    });

    if (!cart) {
      try {
        const stored = JSON.parse(localStorage.getItem('nex_cart') || '[]');
        const count = stored.reduce((sum, item) => sum + (item.quantity || 1), 0);
        document.querySelectorAll('#headerCartCount, #mobileCartCount, .bag-count-badge').forEach(b => {
          b.textContent = count;
          b.style.display = 'inline-flex';
        });
      } catch (e) {}
    }

    if (window.dataLayer) window.dataLayer.push({ event: 'nex_stylist_add_look_to_bag' });

    setTimeout(function() {
      btn.textContent = 'ALL ADDED TO BAG ✓';
      btn.classList.add('added');
      setTimeout(function() {
        updateBundleSubtotal(bundleCard);
        btn.classList.remove('added');
        btn.disabled = false;
      }, 2500);
    }, 450);
  }

  function handleSizeInteractiveSelect(btn, action) {
    const sizeWidget = btn.closest('[data-size-widget]');
    if (!sizeWidget) return;

    // Highlight clicked pill in its section
    const row = btn.closest('.size-pills-row');
    if (row) {
      row.querySelectorAll('.size-pill').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
    }

    // Category change: switch measurement pills if category is Footwear vs Apparel
    if (action === 'select-size-category') {
      const catVal = btn.getAttribute('data-val') || '';
      const measurementsRow = sizeWidget.querySelector('.size-pills-measurements');
      if (measurementsRow) {
        if (catVal.includes('Footwear') || catVal.includes('Shoes') || catVal.includes('Sneakers')) {
          measurementsRow.innerHTML = `
            <button type="button" class="size-pill" data-action="select-size-measurement" data-val="EU 40">EU 40</button>
            <button type="button" class="size-pill" data-action="select-size-measurement" data-val="EU 41">EU 41</button>
            <button type="button" class="size-pill active" data-action="select-size-measurement" data-val="EU 42">EU 42</button>
            <button type="button" class="size-pill" data-action="select-size-measurement" data-val="EU 43">EU 43</button>
            <button type="button" class="size-pill" data-action="select-size-measurement" data-val="EU 44">EU 44</button>
            <button type="button" class="size-pill" data-action="select-size-measurement" data-val="EU 45">EU 45</button>
          `;
        } else {
          measurementsRow.innerHTML = `
            <button type="button" class="size-pill" data-action="select-size-measurement" data-val="XS (36&quot;)">XS (36")</button>
            <button type="button" class="size-pill" data-action="select-size-measurement" data-val="S (38&quot;)">S (38")</button>
            <button type="button" class="size-pill active" data-action="select-size-measurement" data-val="M (40&quot;)">M (40")</button>
            <button type="button" class="size-pill" data-action="select-size-measurement" data-val="L (42&quot;)">L (42")</button>
            <button type="button" class="size-pill" data-action="select-size-measurement" data-val="XL (44&quot;)">XL (44")</button>
          `;
        }
      }
    }

    // Recompute recommendation
    const activeCat = sizeWidget.querySelector('[data-action="select-size-category"].active')?.getAttribute('data-val') || 'Tops & Sweaters';
    const activeSize = sizeWidget.querySelector('[data-action="select-size-measurement"].active')?.getAttribute('data-val') || 'M (40")';
    const activeFit = sizeWidget.querySelector('[data-action="select-size-fit"].active')?.getAttribute('data-val') || 'True to size';

    if (window.NexConciergeEngine) {
      const calc = window.NexConciergeEngine.calculateSize(activeCat, activeSize, activeFit);
      const textEl = sizeWidget.querySelector('.size-result-text');
      const noteEl = sizeWidget.querySelector('.size-result-note');
      if (textEl) {
        textEl.innerHTML = `<strong>Recommended Size: ${escapeHtml(calc.recommendedSize)}</strong> · ${calc.confidence}% Match`;
      }
      if (noteEl) {
        noteEl.textContent = calc.advice;
      }
    }
  }

  function handleTrackOrderSubmit(btn) {
    const trackerCard = btn.closest('.concierge-tracker-stepper');
    if (!trackerCard) return;
    const input = trackerCard.querySelector('input');
    if (!input || !input.value.trim()) return;
    handleUserMessage('Track order ' + input.value.trim());
  }

})(typeof window !== 'undefined' ? window : global, typeof document !== 'undefined' ? document : {});
