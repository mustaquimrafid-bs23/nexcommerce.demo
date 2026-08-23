const fs = require('fs');

const cssBlock = `
/* ═══════════════════════════════════════════════════════════════════════════
   nexCommerce — Capability 3: Autonomous Target-Budget Cart Builder Styles
   ═══════════════════════════════════════════════════════════════════════════ */

.budget-modal-backdrop {
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

.budget-modal-backdrop.is-open {
  opacity: 1;
  pointer-events: auto;
}

.budget-modal-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -48%) scale(0.96);
  width: min(95vw, 980px);
  max-height: 90vh;
  background: linear-gradient(145deg, rgba(13, 20, 40, 0.98) 0%, rgba(5, 11, 24, 0.99) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(0, 245, 160, 0.12);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.35s ease;
}

.budget-modal-backdrop.is-open .budget-modal-dialog {
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
  pointer-events: auto;
}

.budget-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.budget-modal-title {
  font-family: var(--font-serif);
  font-size: 24px;
  font-weight: 400;
  color: var(--text-primary);
  margin: 0;
}

.budget-modal-body {
  padding: 24px 32px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

/* Preset Budget Selector Buttons */
.budget-presets-cluster {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.budget-preset-chip {
  padding: 8px 16px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #CBD5E1;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.budget-preset-chip:hover, .budget-preset-chip.active {
  background: rgba(0, 245, 160, 0.1);
  border-color: #00F5A0;
  color: #00F5A0;
}

/* Real-Time Budget Gauge Meter */
.budget-telemetry-card {
  background: linear-gradient(135deg, rgba(0, 245, 160, 0.06) 0%, rgba(13, 20, 40, 0.6) 100%);
  border: 1px solid rgba(0, 245, 160, 0.2);
  border-radius: 14px;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.budget-telemetry-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.budget-spent-amount {
  font-family: var(--font-serif);
  font-size: 28px;
  color: #00F5A0;
}

.budget-target-cap {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
}

.budget-progress-track {
  height: 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  overflow: hidden;
}

.budget-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3DE0FF 0%, #00F5A0 100%);
  border-radius: 999px;
  transition: width 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

.budget-headroom-pill {
  font-size: 11px;
  font-weight: 700;
  color: #00F5A0;
  background: rgba(0, 245, 160, 0.1);
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid rgba(0, 245, 160, 0.25);
  align-self: flex-start;
}

/* Dynamic Item Slots Grid */
.budget-slots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.budget-slot-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: border-color 0.2s ease;
}

.budget-slot-card:hover {
  border-color: rgba(0, 245, 160, 0.3);
}

.budget-slot-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.budget-slot-name {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
}

.budget-slot-item-view {
  display: flex;
  align-items: center;
  gap: 12px;
}

.budget-slot-thumb {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background: radial-gradient(circle at center, #1E293B 0%, #0F172A 100%);
  object-fit: contain;
  padding: 4px;
}

.budget-slot-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.budget-slot-item-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.budget-slot-item-price {
  font-size: 13px;
  font-weight: 700;
  color: #00F5A0;
}

/* Modal Footer & Batch Add CTA */
.budget-modal-footer {
  padding: 18px 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(5, 11, 24, 0.8);
}

.budget-confirm-btn {
  padding: 12px 24px;
  border-radius: 8px;
  background: #00F5A0;
  color: #000B1A;
  font-size: 13px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.budget-confirm-btn:hover {
  background: #4EFEB3;
  transform: translateY(-1px);
}
`;

fs.appendFileSync('css/design-system.css', '\n' + cssBlock.trim() + '\n');
console.log('Appended budget CSS successfully!');
