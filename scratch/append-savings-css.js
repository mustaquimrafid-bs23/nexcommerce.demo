const fs = require('fs');

const cssBlock = `
/* ═══════════════════════════════════════════════════════════════════════════
   nexCommerce — Capability 5: Proactive AI Checkout Savings Optimizer Styles
   ═══════════════════════════════════════════════════════════════════════════ */

.savings-advisor-card {
  background: linear-gradient(135deg, rgba(0, 245, 160, 0.08) 0%, rgba(13, 20, 40, 0.7) 100%);
  border: 1px solid rgba(0, 245, 160, 0.28);
  border-radius: 14px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

.savings-advisor-card:hover {
  border-color: rgba(0, 245, 160, 0.45);
  transform: translateY(-1px);
}

.savings-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.savings-advisor-badge {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #00F5A0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.savings-amount-highlight {
  font-family: var(--font-serif);
  font-size: 18px;
  font-weight: 600;
  color: #00F5A0;
}

.savings-recommendation-text {
  font-size: 12px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.8);
}

.savings-apply-action-btn {
  width: 100%;
  padding: 10px 14px;
  border-radius: 8px;
  background: #00F5A0;
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

.savings-apply-action-btn:hover {
  background: #4EFEB3;
  transform: translateY(-1px);
}

.savings-applied-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  background: rgba(0, 245, 160, 0.12);
  border: 1px solid rgba(0, 245, 160, 0.3);
  color: #00F5A0;
  font-size: 12px;
  font-weight: 600;
}

.savings-upgrade-alert {
  background: rgba(61, 224, 255, 0.08);
  border: 1px solid rgba(61, 224, 255, 0.25);
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 11.5px;
  color: #CBD5E1;
  line-height: 1.45;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}
`;

fs.appendFileSync('css/design-system.css', '\n' + cssBlock.trim() + '\n');
console.log('Appended savings CSS successfully!');
