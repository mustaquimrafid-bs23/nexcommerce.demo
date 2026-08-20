/**
 * nexCommerce Interactive AI Vision Lookbook Engine
 * Provides intelligent hotspot beacons and piece telemetry cards on lifestyle photography.
 */

(function () {
  'use strict';

  function initLookbook() {
    const container = document.getElementById('lookbookBannerContainer');
    if (!container) return;

    const hotspots = container.querySelectorAll('.lookbook-hotspot');

    // ─── 1. Hotspot Pins Toggle ──────────────────────────────────────────────
    hotspots.forEach(hotspot => {
      const pin = hotspot.querySelector('.lookbook-pin');
      if (!pin) return;

      pin.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const isActive = hotspot.classList.contains('is-active');
        // Close other open hotspots
        hotspots.forEach(h => {
          if (h !== hotspot) {
            h.classList.remove('is-active');
            h.querySelector('.lookbook-pin')?.setAttribute('aria-expanded', 'false');
          }
        });

        if (isActive) {
          hotspot.classList.remove('is-active');
          pin.setAttribute('aria-expanded', 'false');
        } else {
          hotspot.classList.add('is-active');
          pin.setAttribute('aria-expanded', 'true');
        }
      });

      // Hover activation on desktop
      hotspot.addEventListener('mouseenter', () => {
        if (window.innerWidth > 900) {
          hotspot.classList.add('is-active');
          pin.setAttribute('aria-expanded', 'true');
        }
      });

      hotspot.addEventListener('mouseleave', () => {
        if (window.innerWidth > 900) {
          hotspot.classList.remove('is-active');
          pin.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Dismiss on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.lookbook-hotspot')) {
        hotspots.forEach(h => {
          h.classList.remove('is-active');
          h.querySelector('.lookbook-pin')?.setAttribute('aria-expanded', 'false');
        });
      }
    });

    // ─── 2. Quick Add Handler ────────────────────────────────────────────────
    function handleQuickAdd(btn) {
      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      const price = parseFloat(btn.getAttribute('data-price') || '0');
      const image = btn.getAttribute('data-image');

      if (!id || !name || !price) return;

      const originalHtml = btn.innerHTML;
      btn.innerHTML = '<span>✓ Added</span>';
      btn.disabled = true;

      if (window.nexCart && typeof window.nexCart.addItem === 'function') {
        window.nexCart.addItem({
          id: id,
          name: name,
          price: price,
          image: image,
          variant: 'Atelier Edition',
          quantity: 1
        });
        if (typeof window.nexCart.openMiniCart === 'function') {
          setTimeout(() => {
            window.nexCart.openMiniCart();
          }, 350);
        }
      }

      setTimeout(() => {
        btn.innerHTML = originalHtml;
        btn.disabled = false;
        if (window.lucide) window.lucide.createIcons();
      }, 1500);
    }

    // Attach to hotspot quick adds
    document.querySelectorAll('.btn-lookbook-quickadd').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleQuickAdd(btn);
      });
    });

    // ─── 3. Keyboard Accessibility ───────────────────────────────────────────
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        hotspots.forEach(h => {
          h.classList.remove('is-active');
          h.querySelector('.lookbook-pin')?.setAttribute('aria-expanded', 'false');
        });
      }
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLookbook);
  } else {
    initLookbook();
  }
})();
