/* nexCommerce SmartSearch Overlay Module */
import { renderProductCard } from './components.js';

export const SmartSearch = {
  products: [
    { id: 'p1', name: 'Acoustic Studio Headphones', price: 28500, category: 'acoustics', image: 'assets/images/products/p1.png', tag: 'Core Collection' },
    { id: 'p2', name: 'Architectural Cashmere Sweater', price: 18400, category: 'apparel', image: 'assets/images/products/p2.png', tag: 'New Arrival' },
    { id: 'p3', name: 'Minimalist Chronograph Timepiece', price: 42000, category: 'accessories', image: 'assets/images/products/p3.png', tag: 'Limited Drop' },
    { id: 'p4', name: 'Performance Knit Runner', price: 16500, category: 'footwear', image: 'assets/images/products/p4.png', tag: 'Best Seller' },
    { id: 'p5', name: 'Structured Wool Overcoat', price: 34000, category: 'apparel', image: 'assets/images/products/p5.png' },
    { id: 'p6', name: 'Wireless Precision Earbuds', price: 14500, category: 'acoustics', image: 'assets/images/products/p6.png' }
  ],

  init() {
    this.bindTriggers();
  },

  bindTriggers() {
    const trigger = document.getElementById('search-trigger');
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    }

    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.open();
      }
      if (e.key === 'Escape') {
        this.close();
      }
    });

    const closeBtn = document.getElementById('search-close');
    const backdrop = document.getElementById('search-backdrop');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    if (backdrop) backdrop.addEventListener('click', () => this.close());

    const input = document.getElementById('search-input');
    if (input) {
      input.addEventListener('input', (e) => this.query(e.target.value));
    }
  },

  open() {
    const overlay = document.getElementById('search-overlay');
    if (overlay) {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      const input = document.getElementById('search-input');
      if (input) setTimeout(() => input.focus(), 100);
    }
  },

  close() {
    const overlay = document.getElementById('search-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  query(term) {
    const resultsContainer = document.getElementById('search-results-grid');
    if (!resultsContainer) return;

    const trimmed = term.trim().toLowerCase();
    if (!trimmed) {
      resultsContainer.innerHTML = `<p class="search-hint">Type to search collections, products, or materials...</p>`;
      return;
    }

    // Pipeline: Resilient search (keyword match with graceful fallback)
    const matches = this.products.filter(p => 
      p.name.toLowerCase().includes(trimmed) || 
      p.category.toLowerCase().includes(trimmed)
    );

    if (matches.length === 0) {
      resultsContainer.innerHTML = `<p class="search-empty">No products matching "${term}" were found.</p>`;
      return;
    }

    resultsContainer.innerHTML = matches.map(p => renderProductCard(p)).join('');
  }
};

window.nexSearch = SmartSearch;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => SmartSearch.init());
} else {
  SmartSearch.init();
}
