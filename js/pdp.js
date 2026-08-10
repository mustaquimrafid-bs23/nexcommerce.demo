/* nexCommerce PDP Controller & FitAdvisor Module */
import { CartState } from './cart.js';

export const PDP = {
  currentProduct: {
    id: 'p2',
    name: 'Architectural Cashmere Sweater',
    price: 18400,
    image: 'p2.png',
    description: 'Precision-knitted from 100% Mongolian cashmere with architectural ribbed trim.'
  },
  selectedSize: 'M',
  selectedColor: 'Obsidian',

  init() {
    this.bindEvents();
  },

  bindEvents() {
    // Variant Selection
    document.querySelectorAll('.size-swatch').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.size-swatch').forEach(s => s.classList.remove('active'));
        e.target.classList.add('active');
        this.selectedSize = e.target.getAttribute('data-size') || 'M';
      });
    });

    document.querySelectorAll('.color-swatch').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.color-swatch').forEach(c => c.classList.remove('active'));
        e.target.classList.add('active');
        this.selectedColor = e.target.getAttribute('data-color') || 'Obsidian';
      });
    });

    // Add to Bag Button
    const addBtn = document.getElementById('add-to-bag-btn');
    const mobileAddBtn = document.getElementById('mobile-add-to-bag-btn');

    const handleAdd = async (buttonEl) => {
      if (!buttonEl || buttonEl.disabled) return;
      const originalText = buttonEl.textContent;
      buttonEl.disabled = true;
      buttonEl.textContent = 'Adding...';

      try {
        // Simulate resilient async API call
        await new Promise(resolve => setTimeout(resolve, 350));
        
        const variantString = `${this.selectedColor} / ${this.selectedSize}`;
        CartState.addItem(this.currentProduct, 1, variantString);

        buttonEl.textContent = '✓ Added to Bag';
        setTimeout(() => {
          buttonEl.textContent = originalText;
          buttonEl.disabled = false;
        }, 1800);
      } catch (err) {
        console.error('Failed to add product to bag', err);
        buttonEl.textContent = 'Error — Try Again';
        buttonEl.disabled = false;
      }
    };

    if (addBtn) addBtn.addEventListener('click', () => handleAdd(addBtn));
    if (mobileAddBtn) mobileAddBtn.addEventListener('click', () => handleAdd(mobileAddBtn));

    // FitAdvisor Modal
    const fitTrigger = document.getElementById('fit-advisor-trigger');
    const fitModal = document.getElementById('fit-advisor-modal');
    const fitClose = document.getElementById('fit-advisor-close');

    if (fitTrigger && fitModal) {
      fitTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        fitModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    }

    if (fitClose && fitModal) {
      fitClose.addEventListener('click', () => {
        fitModal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    document.querySelectorAll('.fit-option-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.fit-option-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        const recommendedSize = e.target.getAttribute('data-rec-size') || 'M';
        const recText = document.getElementById('fit-recommendation-text');
        if (recText) recText.textContent = `Based on your ${e.target.textContent} preference, we recommend Size ${recommendedSize}.`;
      });
    });
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => PDP.init());
} else {
  PDP.init();
}
