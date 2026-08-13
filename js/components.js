/* nexCommerce Reusable Components Module */

/**
 * Render a single ProductCard HTML string
 * @param {Object} product - Product model
 * @param {string} product.id
 * @param {string} product.name
 * @param {number} product.price
 * @param {string} product.image
 * @param {string} [product.secondaryImage]
 * @param {string} [product.tag] - e.g., "New Arrival", "Core Collection"
 * @returns {string} HTML string
 */
export function renderProductCard(product) {
  const badgeHtml = product.tag 
    ? `<span class="product-badge">${product.tag}</span>` 
    : '';

  return `
    <article class="product-card" data-id="${product.id}">
      <div class="product-image-container">
        ${badgeHtml}
        <a href="product.html?id=${product.id}" class="product-img-link" aria-label="${product.name}">
          <img src="${product.image}" alt="${product.name}" class="product-img primary" loading="lazy">
          ${product.secondaryImage ? `<img src="${product.secondaryImage}" alt="${product.name}" class="product-img secondary" loading="lazy">` : ''}
        </a>
        <button class="quick-view-btn" data-action="quick-view" data-id="${product.id}" aria-label="Quick view ${product.name}">
          Quick View
        </button>
      </div>
      <div class="product-info">
        <h3 class="product-title"><a href="product.html?id=${product.id}">${product.name}</a></h3>
        <p class="product-price">৳ ${product.price.toLocaleString()}</p>
      </div>
    </article>
  `;
}

/**
 * Render TrustSignal component HTML string
 * @returns {string} HTML string
 */
export function renderTrustSignals() {
  return `
    <div class="trust-signals-container">
      <div class="trust-item">
        <span class="trust-icon" aria-hidden="true">&#10003;</span>
        <span>30-Day Complimentary Returns</span>
      </div>
      <div class="trust-item">
        <span class="trust-icon" aria-hidden="true">&#10003;</span>
        <span>Encrypted SSL Checkout</span>
      </div>
      <div class="trust-item">
        <span class="trust-icon" aria-hidden="true">&#10003;</span>
        <span>Guaranteed Authentic</span>
      </div>
    </div>
  `;
}

/**
 * Render Product Quick View Modal HTML string
 * @param {Object} product 
 * @returns {string} HTML string
 */
export function renderQuickViewModal(product) {
  return `
    <div id="quick-view-modal" class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="qv-title">
      <div class="modal-content quick-view-content">
        <button class="modal-close-btn" data-action="close-modal" aria-label="Close modal">&times;</button>
        <div class="qv-grid">
          <div class="qv-image-wrap">
            <img src="${product.image}" alt="${product.name}">
          </div>
          <div class="qv-details">
            <h2 id="qv-title" class="qv-title">${product.name}</h2>
            <p class="qv-price">৳ ${product.price.toLocaleString()}</p>
            <p class="qv-description">${product.description || 'Precision crafted with signature luxury materials.'}</p>
            <div class="qv-actions">
              <a href="product.html?id=${product.id}" class="btn-luxury" style="width:100%; text-align:center;">View Full Details</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
