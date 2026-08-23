const fs = require('fs');

const cssBlock = `
/* ═══════════════════════════════════════════════════════════════════════════
   nexCommerce — Capability 7: Cart Recovery & Exit-Intent Modal Styles
   ═══════════════════════════════════════════════════════════════════════════ */

.recovery-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(3, 11, 23, 0.88);
  backdrop-filter: blur(14px);
  display: none;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.25s ease-out forwards;
}

.recovery-modal-card {
  width: 100%;
  max-width: 520px;
  background: linear-gradient(155deg, rgba(13, 20, 40, 0.99) 0%, rgba(5, 10, 24, 0.99) 100%);
  border: 1px solid rgba(0, 245, 160, 0.35);
  border-radius: 20px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 245, 160, 0.12);
  position: relative;
}

.recovery-timer-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 100px;
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.35);
  color: #F59E0B;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.recovery-items-row {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 8px 0;
}

.recovery-item-thumb {
  width: 64px;
  height: 80px;
  border-radius: 8px;
  background: radial-gradient(circle at center, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 70%);
  border: 1px solid rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  flex-shrink: 0;
}

.recovery-item-thumb img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.recovery-action-btn {
  width: 100%;
  padding: 14px 20px;
  border-radius: 10px;
  background: #00F5A0;
  color: #000B1A;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: 0 8px 24px rgba(0, 245, 160, 0.25);
}

.recovery-action-btn:hover {
  background: #4EFEB3;
  transform: translateY(-1px);
  box-shadow: 0 12px 32px rgba(0, 245, 160, 0.35);
}
`;

fs.appendFileSync('css/design-system.css', '\n' + cssBlock.trim() + '\n');
console.log('Appended recovery CSS successfully!');
