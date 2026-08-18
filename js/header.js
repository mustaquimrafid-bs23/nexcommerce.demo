/**
 * nexCommerce Ultra-Clean Luxury Navigation & Header Controller
 * - Magnetic Liquid Nav Glider
 * - Dynamic Scroll Quieting & Announcement Bar Collapse
 * - 3D Spatial 3-Dot Overflow Menu
 * - Mobile Navigation Drawer with Staggered Cascade
 * - Elastic Badge Spring Pop Physics
 * - Search & Style Concierge Bridge
 */
(function () {
  'use strict';

  function initHeader() {
    const header = document.querySelector('.site-header') || document.getElementById('siteHeader');
    const announcementBar = document.querySelector('.top-announcement-bar') || document.getElementById('topAnnouncementBar');
    if (!header) return;

    // 1. Dynamic Scroll Quieting & Announcement Bar Collapse
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 20) {
        header.classList.add('scrolled');
        if (announcementBar) announcementBar.classList.add('collapsed');
      } else {
        header.classList.remove('scrolled');
        if (announcementBar) announcementBar.classList.remove('collapsed');
      }
      lastScrollY = currentScrollY;
    };

    if (window._nexLenis) {
      window._nexLenis.on('scroll', handleScroll);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // 2. Magnetic Navigation Links & Glider Indicator
    const navMenu = document.getElementById('navMenuLinks') || header.querySelector('.nav-menu-links');
    let glider = document.getElementById('navGliderPill') || header.querySelector('.nav-glider-pill');
    if (!glider && navMenu) {
      glider = document.createElement('span');
      glider.className = 'nav-glider-pill';
      glider.id = 'navGliderPill';
      glider.setAttribute('aria-hidden', 'true');
      navMenu.prepend(glider);
    }
    const navLinks = navMenu ? navMenu.querySelectorAll('.nav-item-link') : [];

    if (navMenu && glider && navLinks.length > 0 && !navMenu._gliderInit) {
      navMenu._gliderInit = true;

      // Identify active link based on current page URL
      const currentPath = window.location.pathname.toLowerCase();
      let activeLink = null;
      navLinks.forEach(link => {
        const href = (link.getAttribute('href') || '').toLowerCase();
        if (href && (currentPath.endsWith(href) || (href !== 'index.html' && currentPath.includes(href.replace('.html', ''))))) {
          link.classList.add('active');
          activeLink = link;
        }
      });

      const positionGlider = (target) => {
        if (!target) {
          glider.style.opacity = '0';
          return;
        }
        const menuRect = navMenu.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const left = targetRect.left - menuRect.left;
        const width = targetRect.width;

        glider.style.transform = `translateX(${left}px)`;
        glider.style.width = `${width}px`;
        glider.style.opacity = '1';
      };

      if (activeLink) {
        positionGlider(activeLink);
      }

      navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => positionGlider(link));
        link.addEventListener('focus', () => positionGlider(link));
      });

      navMenu.addEventListener('mouseleave', () => {
        if (activeLink) {
          positionGlider(activeLink);
        } else {
          glider.style.opacity = '0';
        }
      });
    }

    // 3. 3-Dot Overflow Menu Dropdown (3D Spatial Emergence)
    const moreMenus = document.querySelectorAll('.nav-more-menu');
    moreMenus.forEach(menu => {
      const trigger = menu.querySelector('.nav-more-trigger, [data-dropdown-trigger]');
      const dropdown = menu.querySelector('.nav-more-dropdown, .shadcn-dropdown-content');
      if (!trigger || !dropdown) return;

      if (trigger.dataset.initialized === 'true') return;
      trigger.dataset.initialized = 'true';

      const closeDropdown = () => {
        dropdown.setAttribute('data-state', 'closed');
        trigger.setAttribute('aria-expanded', 'false');
      };

      const openDropdown = () => {
        // Close other open dropdowns first
        document.querySelectorAll('.nav-more-dropdown[data-state="open"]').forEach(d => {
          d.setAttribute('data-state', 'closed');
          const pt = d.parentElement?.querySelector('[data-dropdown-trigger], .nav-more-trigger');
          if (pt) pt.setAttribute('aria-expanded', 'false');
        });
        dropdown.setAttribute('data-state', 'open');
        trigger.setAttribute('aria-expanded', 'true');
      };

      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = dropdown.getAttribute('data-state') === 'open';
        if (isOpen) {
          closeDropdown();
        } else {
          openDropdown();
        }
      });
    });

    // Global Click Outside & Escape Key Listener
    if (!window.__headerClickOutsideBound) {
      window.__headerClickOutsideBound = true;
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-more-menu')) {
          document.querySelectorAll('.nav-more-dropdown[data-state="open"]').forEach(d => {
            d.setAttribute('data-state', 'closed');
            const pt = d.parentElement?.querySelector('[data-dropdown-trigger], .nav-more-trigger');
            if (pt) pt.setAttribute('aria-expanded', 'false');
          });
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          document.querySelectorAll('.nav-more-dropdown[data-state="open"]').forEach(d => {
            d.setAttribute('data-state', 'closed');
            const pt = d.parentElement?.querySelector('[data-dropdown-trigger], .nav-more-trigger');
            if (pt) pt.setAttribute('aria-expanded', 'false');
          });
          const mobileDrawer = document.getElementById('mobileNavDrawer');
          if (mobileDrawer && (mobileDrawer.classList.contains('open') || mobileDrawer.classList.contains('active'))) {
            mobileDrawer.classList.remove('active', 'open');
            mobileDrawer.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
          }
        }
      });
    }

    // 4. Mobile Navigation Drawer Controller
    const mobileBtn = document.getElementById('mobileMenuBtn') || document.getElementById('mobile-menu-toggle');
    const closeMobileBtn = document.getElementById('closeMobileDrawerBtn');
    const mobileDrawer = document.getElementById('mobileNavDrawer') || document.getElementById('mobile-nav-drawer');

    if (mobileBtn && mobileDrawer && !mobileBtn.dataset.initialized) {
      mobileBtn.dataset.initialized = 'true';
      mobileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = mobileDrawer.classList.toggle('open');
        mobileDrawer.classList.toggle('active', isOpen);
        mobileDrawer.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
        mobileBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });
    }

    if (closeMobileBtn && mobileDrawer && !closeMobileBtn.dataset.initialized) {
      closeMobileBtn.dataset.initialized = 'true';
      closeMobileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        mobileDrawer.classList.remove('active', 'open');
        mobileDrawer.setAttribute('aria-hidden', 'true');
        if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    }

    // 5. Search Trigger & Shortcut (Ctrl + K / Cmd + K)
    const searchBtn = document.getElementById('searchTriggerBtn') || document.querySelector('.search-trigger');
    if (searchBtn && !searchBtn._searchBound) {
      searchBtn._searchBound = true;
      searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof window.nexOpenSearch === 'function') {
          window.nexOpenSearch();
        } else {
          document.dispatchEvent(new CustomEvent('nex:open-search'));
        }
      });
    }

    if (!window.__searchShortcutBound) {
      window.__searchShortcutBound = true;
      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          if (typeof window.nexOpenSearch === 'function') {
            window.nexOpenSearch();
          } else {
            document.dispatchEvent(new CustomEvent('nex:open-search'));
          }
        }
      });
    }

    // 6. Style Concierge Nav Trigger Bridge
    const conciergeBtn = document.getElementById('conciergeNavTrigger');
    if (conciergeBtn && !conciergeBtn._conciergeBound) {
      conciergeBtn._conciergeBound = true;
      conciergeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof window.nexOpenConcierge === 'function') {
          window.nexOpenConcierge();
        } else {
          document.dispatchEvent(new CustomEvent('nex:open-concierge'));
        }
      });
    }

    // 7. Initial Badge Synchronization
    updateWishlistBadge();
    updateCartBadge();

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  // Live Elastic Wishlist Badge Sync
  function updateWishlistBadge() {
    try {
      const stored = localStorage.getItem('nex_curated_wishlist_ids') || '[]';
      const list = JSON.parse(stored);
      const count = Array.isArray(list) ? list.length : 0;
      const badges = document.querySelectorAll('.wishlist-count-badge, #headerWishlistCount, #mobileWishlistCount');
      badges.forEach(b => {
        const prevCount = parseInt(b.textContent, 10) || 0;
        b.textContent = count;
        b.style.display = count > 0 ? 'inline-flex' : 'none';
        if (count !== prevCount && count > 0) {
          b.classList.remove('animate-pop');
          void b.offsetWidth; // Trigger reflow for CSS animation restart
          b.classList.add('animate-pop');
        }
      });
    } catch (e) {}
  }

  // Live Elastic Cart Badge Sync
  function updateCartBadge() {
    try {
      let count = 0;
      if (window.nexCart && typeof window.nexCart.getCount === 'function') {
        count = window.nexCart.getCount();
      } else {
        const stored = localStorage.getItem('nex_cart_items') || localStorage.getItem('cart') || '[]';
        const items = JSON.parse(stored);
        if (Array.isArray(items)) {
          count = items.reduce((acc, item) => acc + (item.quantity || 1), 0);
        }
      }
      const badges = document.querySelectorAll('.bag-count-badge, #headerCartCount, #mobileCartCount');
      badges.forEach(b => {
        const prevCount = parseInt(b.textContent, 10) || 0;
        b.textContent = count;
        if (count !== prevCount) {
          b.classList.remove('animate-pop');
          void b.offsetWidth;
          b.classList.add('animate-pop');
        }
      });
    } catch (e) {}
  }

  window.nexUpdateWishlistBadge = updateWishlistBadge;
  window.nexUpdateCartBadge = updateCartBadge;
  window.initHeader = initHeader;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeader);
  } else {
    initHeader();
  }
})();
