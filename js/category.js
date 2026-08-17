/* nexCommerce Category PLP Controller */
import { renderProductCard } from './components.js';

export const CategoryPage = {
  products: [
    { id: 'p1', name: 'Acoustic Studio Headphones', price: 28500, category: 'acoustics', image: 'assets/images/products/p1.png', tag: 'Core Collection' },
    { id: 'p2', name: 'Architectural Cashmere Sweater', price: 18400, category: 'apparel', image: 'assets/images/products/p2.png', tag: 'New Arrival' },
    { id: 'p3', name: 'Minimalist Chronograph Timepiece', price: 42000, category: 'accessories', image: 'assets/images/products/p3.png', tag: 'Limited Drop' },
    { id: 'p4', name: 'Performance Knit Runner', price: 16500, category: 'footwear', image: 'assets/images/products/p4.png', tag: 'Best Seller' },
    { id: 'p5', name: 'Structured Wool Overcoat', price: 34000, category: 'apparel', image: 'assets/images/products/p5.png' },
    { id: 'p6', name: 'Wireless Precision Earbuds', price: 14500, category: 'acoustics', image: 'assets/images/products/p6.png' },
    { id: 'p7', name: 'Minimalist Leather Tote', price: 29000, category: 'accessories', image: 'assets/images/products/p7.png' }
  ],
  activeFilter: 'all',
  activeSort: 'featured',

  init() {
    this.bindEvents();
    this.render();
  },

  bindEvents() {
    const filterBtn = document.getElementById('plp-filter-trigger');
    const filterSheet = document.getElementById('plp-filter-sheet');
    const filterClose = document.getElementById('plp-filter-close');

    if (filterBtn && filterSheet) {
      filterBtn.addEventListener('click', () => {
        filterSheet.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    }

    if (filterClose && filterSheet) {
      filterClose.addEventListener('click', () => {
        filterSheet.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    const sortSelect = document.getElementById('plp-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.activeSort = e.target.value;
        this.render();
      });
    }

    document.querySelectorAll('.filter-option-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-option-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.activeFilter = e.target.getAttribute('data-category') || 'all';
        if (filterSheet) filterSheet.classList.remove('active');
        document.body.style.overflow = '';
        this.render();
      });
    });
  },

  getFilteredProducts() {
    let list = [...this.products];
    if (this.activeFilter !== 'all') {
      list = list.filter(p => p.category === this.activeFilter);
    }
    if (this.activeSort === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (this.activeSort === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    }
    return list;
  },

  render() {
    const grid = document.getElementById('plp-product-grid');
    const countEl = document.getElementById('plp-product-count');
    const items = this.getFilteredProducts();

    if (countEl) countEl.textContent = `${items.length} Products`;
    if (grid) {
      grid.innerHTML = items.map(p => renderProductCard(p)).join('');
    }
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => CategoryPage.init());
} else {
  CategoryPage.init();
}
