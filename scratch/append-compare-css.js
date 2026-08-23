const fs = require('fs');

const cssBlock = `
/* ═══════════════════════════════════════════════════════════════════════════
   nexCommerce — Capability 2: Product Advisor & Comparison Matrix Styles
   ═══════════════════════════════════════════════════════════════════════════ */

.compare-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(3, 11, 23, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  z-index: 9998;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.35s cubic-bezier(0.23, 1, 0.32, 1);
}

.compare-modal-backdrop.is-open {
  opacity: 1;
  pointer-events: auto;
}

.compare-modal-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -48%) scale(0.96);
  width: min(95vw, 1120px);
  max-height: 90vh;
  background: linear-gradient(145deg, rgba(13, 20, 40, 0.98) 0%, rgba(5, 11, 24, 0.99) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(61, 224, 255, 0.12);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.35s ease;
}

.compare-modal-backdrop.is-open .compare-modal-dialog {
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
  pointer-events: auto;
}

.compare-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.compare-modal-title {
  font-family: var(--font-serif);
  font-size: 24px;
  font-weight: 400;
  color: var(--text-primary);
  margin: 0;
}

.compare-modal-body {
  padding: 24px 32px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* AI Verdict Highlight Box */
.compare-verdict-card {
  background: linear-gradient(135deg, rgba(61, 224, 255, 0.06) 0%, rgba(13, 20, 40, 0.6) 100%);
  border: 1px solid rgba(61, 224, 255, 0.22);
  border-radius: 14px;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.compare-verdict-eyebrow {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #3DE0FF;
  display: flex;
  align-items: center;
  gap: 6px;
}

.compare-verdict-headline {
  font-family: var(--font-serif);
  font-size: 18px;
  color: var(--text-primary);
  line-height: 1.35;
}

.compare-verdict-use-cases {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.compare-use-case-item {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
}

/* Side-by-Side Product Cards Header */
.compare-products-header-grid {
  display: grid;
  grid-template-columns: 180px 1fr 1fr;
  gap: 20px;
  align-items: flex-end;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.compare-product-column-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
}

.compare-product-thumb {
  width: 90px;
  height: 90px;
  border-radius: 10px;
  background: radial-gradient(circle at center, #1E293B 0%, #0F172A 100%);
  object-fit: contain;
  padding: 6px;
}

.compare-product-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.3;
}

.compare-product-price {
  font-family: var(--font-serif);
  font-size: 18px;
  color: #3DE0FF;
}

.compare-choose-btn {
  width: 100%;
  min-height: 40px;
  border-radius: 8px;
  background: #3DE0FF;
  color: #000B1A;
  font-size: 12px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.compare-choose-btn:hover {
  background: #6BE8FF;
  transform: translateY(-1px);
}

/* Spec Comparison Matrix Table */
.compare-matrix-table {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.compare-matrix-row {
  display: grid;
  grid-template-columns: 180px 1fr 1fr;
  gap: 20px;
  padding: 12px 14px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.015);
  align-items: center;
  font-size: 13px;
}

.compare-matrix-row:nth-child(even) {
  background: rgba(255, 255, 255, 0.03);
}

.compare-spec-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
}

.compare-spec-val {
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.compare-diff-tag {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(61, 224, 255, 0.1);
  color: #3DE0FF;
  border: 1px solid rgba(61, 224, 255, 0.25);
  align-self: flex-start;
}

@media (max-width: 768px) {
  .compare-products-header-grid, .compare-matrix-row {
    grid-template-columns: 1fr 1fr;
  }
  .compare-matrix-row > .compare-spec-label {
    grid-column: 1 / -1;
    margin-bottom: -6px;
  }
  .compare-verdict-use-cases {
    grid-template-columns: 1fr;
  }
}
`;

fs.appendFileSync('css/design-system.css', '\n' + cssBlock.trim() + '\n');
console.log('Appended comparison CSS successfully!');
