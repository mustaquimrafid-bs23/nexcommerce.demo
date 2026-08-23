const fs = require('fs');

const cssBlock = `
/* ═══════════════════════════════════════════════════════════════════════════
   nexCommerce — Capability 6: Delivery-Aware & Hyperlocal Gate Styles
   ═══════════════════════════════════════════════════════════════════════════ */

.delivery-hub-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.23, 1, 0.32, 1);
}

.delivery-hub-pill:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(61, 224, 255, 0.4);
  box-shadow: 0 0 16px rgba(61, 224, 255, 0.15);
}

.delivery-express-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 7px;
  border-radius: 100px;
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: #F59E0B;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.delivery-hub-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(3, 11, 23, 0.85);
  backdrop-filter: blur(12px);
  display: none;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.delivery-hub-modal {
  width: 100%;
  max-width: 480px;
  background: linear-gradient(155deg, rgba(13, 20, 40, 0.98) 0%, rgba(5, 10, 24, 0.98) 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  padding: 26px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.7);
}

.hub-selection-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 280px;
  overflow-y: auto;
}

.hub-card-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1.5px solid rgba(255, 255, 255, 0.07);
  cursor: pointer;
  transition: all 0.2s ease;
}

.hub-card-item:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(61, 224, 255, 0.3);
}

.hub-card-item.selected {
  background: rgba(61, 224, 255, 0.08);
  border-color: #3DE0FF;
}
`;

fs.appendFileSync('css/design-system.css', '\n' + cssBlock.trim() + '\n');
console.log('Appended delivery CSS successfully!');
