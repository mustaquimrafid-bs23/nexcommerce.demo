/**
 * nexCommerce Minimal Glass Header & 3-Dot Overflow Controller
 */
(function () {
  'use strict';

  function initHeader() {
    const header = document.querySelector('.site-header') || document.getElementById('siteHeader');
    if (!header) return;

    // Scroll quieting effect
    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // 3-Dot Overflow Menu Dropdown
    const moreMenus = document.querySelectorAll('.nav-more-menu');
    moreMenus.forEach(menu => {
      const trigger = menu.querySelector('.nav-more-trigger, [data-dropdown-trigger]');
      const dropdown = menu.querySelector('.nav-more-dropdown, .shadcn-dropdown-content');
      if (!trigger || !dropdown) return;

      // Prevent attaching duplicate listeners
      if (trigger.dataset.initialized === 'true') return;
      trigger.dataset.initialized = 'true';

      const toggleMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = dropdown.getAttribute('data-state') === 'open';
        if (isOpen) {
          dropdown.setAttribute('data-state', 'closed');
          trigger.setAttribute('aria-expanded', 'false');
        } else {
          // Close other open dropdowns first
          document.querySelectorAll('.nav-more-dropdown[data-state="open"]').forEach(d => {
            d.setAttribute('data-state', 'closed');
            const parentTrigger = d.parentElement?.querySelector('[data-dropdown-trigger], .nav-more-trigger');
            if (parentTrigger) parentTrigger.setAttribute('aria-expanded', 'false');
          });
          dropdown.setAttribute('data-state', 'open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      };

      trigger.addEventListener('click', toggleMenu);
    });

    // Global click outside listener to close popovers
    if (!window.__headerClickOutsideBound) {
      window.__headerClickOutsideBound = true;
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-more-menu')) {
          document.querySelectorAll('.nav-more-dropdown[data-state="open"]').forEach(d => {
            d.setAttribute('data-state', 'closed');
            const parentTrigger = d.parentElement?.querySelector('[data-dropdown-trigger], .nav-more-trigger');
            if (parentTrigger) parentTrigger.setAttribute('aria-expanded', 'false');
          });
        }
      });

      // Escape key closes open popovers
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          document.querySelectorAll('.nav-more-dropdown[data-state="open"]').forEach(d => {
            d.setAttribute('data-state', 'closed');
            const parentTrigger = d.parentElement?.querySelector('[data-dropdown-trigger], .nav-more-trigger');
            if (parentTrigger) parentTrigger.setAttribute('aria-expanded', 'false');
          });
        }
      });
    }

    // Mobile navigation drawer toggle
    const mobileBtn = document.getElementById('mobileMenuBtn') || document.getElementById('mobile-menu-toggle');
    const closeMobileBtn = document.getElementById('closeMobileDrawerBtn');
    const mobileDrawer = document.getElementById('mobileNavDrawer') || document.getElementById('mobile-nav-drawer');

    if (mobileBtn && mobileDrawer && !mobileBtn.dataset.initialized) {
      mobileBtn.dataset.initialized = 'true';
      mobileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = mobileDrawer.classList.toggle('active');
        mobileDrawer.classList.toggle('open', isOpen);
        mobileBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });
    }

    if (closeMobileBtn && mobileDrawer && !closeMobileBtn.dataset.initialized) {
      closeMobileBtn.dataset.initialized = 'true';
      closeMobileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        mobileDrawer.classList.remove('active', 'open');
        if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    }

    // Wishlist Count Badge Sync
    updateWishlistBadge();

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  function updateWishlistBadge() {
    try {
      const stored = localStorage.getItem('nex_curated_wishlist_ids') || '[]';
      const list = JSON.parse(stored);
      const count = Array.isArray(list) ? list.length : 0;
      const badges = document.querySelectorAll('.wishlist-count-badge, #headerWishlistCount, #mobileWishlistCount');
      badges.forEach(b => {
        b.textContent = count;
        b.style.display = count > 0 ? 'inline-flex' : 'none';
      });
    } catch (e) {}
  }

  window.nexUpdateWishlistBadge = updateWishlistBadge;
  window.initHeader = initHeader;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeader);
  } else {
    initHeader();
  }
})();
