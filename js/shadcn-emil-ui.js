/**
 * nexCommerce - shadcn/ui + Emil Kowalski Physics Component Controller
 * Implements accessible Radix-style UI primitives infused with fluid motion.
 */

// ─── 1. DIALOG / MODAL PRIMITIVE ─────────────────────────────────────
export class ShadcnDialog {
  constructor(overlayId) {
    this.overlay = document.getElementById(overlayId);
    if (!this.overlay) return;
    this.content = this.overlay.querySelector('.shadcn-dialog-content');
    this.closeButtons = this.overlay.querySelectorAll('[data-dialog-close]');
    this.init();
  }

  init() {
    this.closeButtons.forEach(btn => btn.addEventListener('click', () => this.close()));
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) this.close();
    });
  }

  open() {
    if (!this.overlay) return;
    this.overlay.setAttribute('data-state', 'open');
    this.overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Focus first focusable element
    const focusable = this.content?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable) setTimeout(() => focusable.focus(), 50);
  }

  close() {
    if (!this.overlay) return;
    this.overlay.setAttribute('data-state', 'closed');
    this.overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  isOpen() {
    return this.overlay?.getAttribute('data-state') === 'open';
  }
}

// ─── 2. SHEET / DRAWER PRIMITIVE (Cart, Filters, Navigation) ─────────
export class ShadcnSheet {
  constructor(overlayId, side = 'right') {
    this.overlay = document.getElementById(overlayId);
    if (!this.overlay) return;
    this.content = this.overlay.querySelector('.shadcn-sheet-content, .shadcn-drawer-content');
    this.side = side;
    this.closeButtons = this.overlay.querySelectorAll('[data-sheet-close]');
    this.init();
  }

  init() {
    this.closeButtons.forEach(btn => btn.addEventListener('click', () => this.close()));
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) this.close();
    });
  }

  open() {
    if (!this.overlay) return;
    this.overlay.setAttribute('data-state', 'open');
    if (this.content) this.content.setAttribute('data-state', 'open');
    document.body.style.overflow = 'hidden';
    
    // Disable smooth scroll interference if Lenis is active
    if (window._nexLenis) window._nexLenis.stop();
  }

  close() {
    if (!this.overlay) return;
    this.overlay.setAttribute('data-state', 'closed');
    if (this.content) this.content.setAttribute('data-state', 'closed');
    document.body.style.overflow = '';
    
    if (window._nexLenis) window._nexLenis.start();
  }

  isOpen() {
    return this.overlay?.getAttribute('data-state') === 'open';
  }
}

// ─── 3. DROPDOWN MENU PRIMITIVE (Origin-Aware Popover) ───────────────
export class ShadcnDropdown {
  constructor(wrapperEl) {
    this.wrapper = typeof wrapperEl === 'string' ? document.querySelector(wrapperEl) : wrapperEl;
    if (!this.wrapper) return;
    this.trigger = this.wrapper.querySelector('[data-dropdown-trigger]');
    this.content = this.wrapper.querySelector('.shadcn-dropdown-content');
    this.init();
  }

  init() {
    if (!this.trigger || !this.content) return;

    this.trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });

    document.addEventListener('click', (e) => {
      if (!this.wrapper.contains(e.target)) this.close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) this.close();
    });
  }

  toggle() {
    this.isOpen() ? this.close() : this.open();
  }

  open() {
    this.content.setAttribute('data-state', 'open');
    this.trigger.setAttribute('aria-expanded', 'true');
  }

  close() {
    this.content.setAttribute('data-state', 'closed');
    this.trigger.setAttribute('aria-expanded', 'false');
  }

  isOpen() {
    return this.content.getAttribute('data-state') === 'open';
  }
}

// ─── 4. TACTILE PRESS INITIALIZER ────────────────────────────────────
export function initTactilePhysics() {
  document.querySelectorAll('button, .btn-luxury, a.btn-luxury, .product-card').forEach(el => {
    el.setAttribute('data-tactile', 'true');
  });
}

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initTactilePhysics();
});
