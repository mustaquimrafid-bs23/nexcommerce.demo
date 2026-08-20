/* ─── nexCommerce Theme Switcher (Footer Popup Widget) ─────────────────────
 * Compact trigger in the footer that opens a sleek popup panel on click.
 * Overrides CSS custom properties on :root to switch theme colours.
 * Persists theme choice across pages via localStorage.
 * ──────────────────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  /* ── Predefined Themes ───────────────────────────────────────────────── */
  const THEMES = [
    {
      id: 'default',
      name: 'Ocean Blue',
      shortName: 'Ocean',
      description: 'Default AI blue',
      swatch: '#00C8FF',
      vars: {
        '--accent-cyan':      '#00C8FF',
        '--accent-purple':    '#6C3BFF',
        '--accent-pink':      '#FF3CAC',
        '--bg-ai-subtle':     'rgba(0, 200, 255, 0.06)',
        '--focus-ring':       '#00C8FF',
        '--bg-main':          '#071A3A',
        '--bg-surface':       '#0B2147',
        '--bg-surface-hover': '#0E2957',
      }
    },
    {
      id: 'violet',
      name: 'Deep Violet',
      shortName: 'Violet',
      description: 'Rich purple luxury',
      swatch: '#8B5CF6',
      vars: {
        '--accent-cyan':      '#8B5CF6',
        '--accent-purple':    '#7C3AED',
        '--accent-pink':      '#EC4899',
        '--bg-ai-subtle':     'rgba(139, 92, 246, 0.06)',
        '--focus-ring':       '#8B5CF6',
        '--bg-main':          '#0D0A1E',
        '--bg-surface':       '#130F2A',
        '--bg-surface-hover': '#1A1438',
      }
    },
    {
      id: 'emerald',
      name: 'Garden Emerald',
      shortName: 'Emerald',
      description: 'Organic luxury green',
      swatch: '#10B981',
      vars: {
        '--accent-cyan':      '#10B981',
        '--accent-purple':    '#059669',
        '--accent-pink':      '#34D399',
        '--bg-ai-subtle':     'rgba(16, 185, 129, 0.06)',
        '--focus-ring':       '#10B981',
        '--bg-main':          '#021A10',
        '--bg-surface':       '#052D1A',
        '--bg-surface-hover': '#073D22',
      }
    },
    {
      id: 'amber',
      name: 'Editorial Amber',
      shortName: 'Amber',
      description: 'Editorial gold',
      swatch: '#F59E0B',
      vars: {
        '--accent-cyan':      '#F59E0B',
        '--accent-purple':    '#D97706',
        '--accent-pink':      '#FBBF24',
        '--bg-ai-subtle':     'rgba(245, 158, 11, 0.06)',
        '--focus-ring':       '#F59E0B',
        '--bg-main':          '#1A1000',
        '--bg-surface':       '#271800',
        '--bg-surface-hover': '#332200',
      }
    },
    {
      id: 'rose',
      name: 'Couture Rose',
      shortName: 'Rose',
      description: 'Haute couture pink',
      swatch: '#F43F5E',
      vars: {
        '--accent-cyan':      '#F43F5E',
        '--accent-purple':    '#E11D48',
        '--accent-pink':      '#FB7185',
        '--bg-ai-subtle':     'rgba(244, 63, 94, 0.06)',
        '--focus-ring':       '#F43F5E',
        '--bg-main':          '#1A0510',
        '--bg-surface':       '#250818',
        '--bg-surface-hover': '#2F0C20',
      }
    },
    {
      id: 'coral',
      name: 'Riviera Coral',
      shortName: 'Coral',
      description: 'Warm coastal energy',
      swatch: '#FF6B6B',
      vars: {
        '--accent-cyan':      '#FF6B6B',
        '--accent-purple':    '#FF4757',
        '--accent-pink':      '#FF8E8E',
        '--bg-ai-subtle':     'rgba(255, 107, 107, 0.06)',
        '--focus-ring':       '#FF6B6B',
        '--bg-main':          '#1A0808',
        '--bg-surface':       '#260D0D',
        '--bg-surface-hover': '#311212',
      }
    },
    {
      id: 'indigo',
      name: 'Midnight Indigo',
      shortName: 'Indigo',
      description: 'Deep ocean authority',
      swatch: '#4F46E5',
      vars: {
        '--accent-cyan':      '#4F46E5',
        '--accent-purple':    '#4338CA',
        '--accent-pink':      '#818CF8',
        '--bg-ai-subtle':     'rgba(79, 70, 229, 0.06)',
        '--focus-ring':       '#4F46E5',
        '--bg-main':          '#0B0B1E',
        '--bg-surface':       '#10102B',
        '--bg-surface-hover': '#151538',
      }
    },
    {
      id: 'slate',
      name: 'Monochrome',
      shortName: 'Mono',
      description: 'Minimal monochrome',
      swatch: '#94A3B8',
      vars: {
        '--accent-cyan':      '#94A3B8',
        '--accent-purple':    '#64748B',
        '--accent-pink':      '#CBD5E1',
        '--bg-ai-subtle':     'rgba(148, 163, 184, 0.06)',
        '--focus-ring':       '#94A3B8',
        '--bg-main':          '#0A0F18',
        '--bg-surface':       '#0F1622',
        '--bg-surface-hover': '#14202E',
      }
    },
  ];

  const LS_KEY = 'nex_theme';

  /* ── Apply Theme ────────────────────────────────────────────────────── */
  function applyTheme(vars) {
    const root = document.documentElement;
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
  }

  function applyThemeById(id) {
    const theme = THEMES.find(t => t.id === id);
    if (theme) {
      applyTheme(theme.vars);
      localStorage.setItem(LS_KEY, JSON.stringify({ id, name: theme.name, swatch: theme.swatch, vars: theme.vars }));
      updateTriggerState(theme.name, theme.swatch, id);
    }
  }

  function lighten(hex) {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return `rgb(${Math.min(255,r+60)},${Math.min(255,g+60)},${Math.min(255,b+60)})`;
  }

  function applyCustomColor(hex) {
    const darken = (h, factor) => {
      const r = parseInt(h.slice(1,3),16), g = parseInt(h.slice(3,5),16), b = parseInt(h.slice(5,7),16);
      return `rgb(${Math.round(r*factor)},${Math.round(g*factor)},${Math.round(b*factor)})`;
    };
    const toRgba = (h, a) => {
      const r = parseInt(h.slice(1,3),16), g = parseInt(h.slice(3,5),16), b = parseInt(h.slice(5,7),16);
      return `rgba(${r},${g},${b},${a})`;
    };
    const vars = {
      '--accent-cyan':      hex,
      '--accent-purple':    darken(hex, 0.8),
      '--accent-pink':      lighten(hex),
      '--bg-ai-subtle':     toRgba(hex, 0.06),
      '--focus-ring':       hex,
      '--bg-main':          darken(hex, 0.08),
      '--bg-surface':       darken(hex, 0.14),
      '--bg-surface-hover': darken(hex, 0.20),
    };
    applyTheme(vars);
    localStorage.setItem(LS_KEY, JSON.stringify({ id: 'custom', name: 'Custom', swatch: hex, vars }));
    updateTriggerState('Custom', hex, 'custom');
  }

  function updateTriggerState(name, swatchColor, id) {
    const dot = document.getElementById('footerThemeTriggerDot');
    const label = document.getElementById('footerThemeTriggerLabel');
    if (dot) {
      dot.style.background = swatchColor;
      dot.style.boxShadow = `0 0 8px ${swatchColor}`;
    }
    if (label) {
      label.textContent = `Theme: ${name}`;
    }
    const grid = document.getElementById('footerThemeGrid');
    if (grid) {
      grid.querySelectorAll('.footer-theme-swatch-item').forEach(item => {
        item.classList.toggle('active', item.dataset.themeId === id);
      });
    }
  }

  /* ── Restore Persisted Theme ──────────────────────────────────────────*/
  function restoreTheme() {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_KEY));
      if (saved && saved.vars) {
        applyTheme(saved.vars);
      }
    } catch (_) {}
  }

  /* ── Inject Footer Theme Changer Popup HTML & CSS ─────────────────────── */
  function injectFooterThemePopup() {
    if (document.getElementById('nex-footer-theme-changer-wrap')) return;

    // Inject styles
    if (!document.getElementById('nex-footer-theme-popup-styles')) {
      const style = document.createElement('style');
      style.id = 'nex-footer-theme-popup-styles';
      style.textContent = `
        .footer-theme-changer-wrap {
          position: relative;
          display: inline-block;
          font-family: var(--font-body, system-ui, sans-serif);
        }
        .footer-theme-trigger-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 20px;
          color: var(--text-secondary, #AAB6C8);
          font-family: inherit;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 180ms ease;
          outline: none;
        }
        .footer-theme-trigger-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.25);
          color: var(--text-primary, #FFFFFF);
        }
        .footer-theme-trigger-btn.open {
          background: rgba(255, 255, 255, 0.10);
          border-color: var(--accent-cyan, #00C8FF);
          color: var(--text-primary, #FFFFFF);
        }
        .footer-theme-trigger-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #00C8FF;
          box-shadow: 0 0 6px #00C8FF;
          flex-shrink: 0;
          transition: background 180ms ease, box-shadow 180ms ease;
        }
        .footer-theme-trigger-label {
          letter-spacing: 0.02em;
        }
        .footer-theme-chevron {
          transition: transform 200ms ease;
          color: var(--text-muted, #7E8B9B);
        }
        .footer-theme-trigger-btn.open .footer-theme-chevron {
          transform: rotate(180deg);
          color: var(--text-primary, #FFFFFF);
        }

        /* Popover Popup */
        .footer-theme-popover {
          position: absolute;
          bottom: calc(100% + 12px);
          left: 50%;
          transform: translateX(-50%) translateY(8px);
          width: 284px;
          background: rgba(9, 24, 51, 0.97);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          opacity: 0;
          pointer-events: none;
          transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1), opacity 180ms ease;
          z-index: 9999;
        }
        .footer-theme-popover.visible {
          opacity: 1;
          pointer-events: all;
          transform: translateX(-50%) translateY(0);
        }
        .footer-theme-popover-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .footer-theme-popover-title {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-muted, #AAB6C8);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .footer-theme-reset-link {
          background: none;
          border: none;
          font-size: 11px;
          font-weight: 600;
          color: var(--accent-cyan, #00C8FF);
          cursor: pointer;
          padding: 0;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          opacity: 0.75;
          transition: opacity 150ms ease;
          outline: none;
        }
        .footer-theme-reset-link:hover {
          opacity: 1;
        }

        /* Swatches Grid */
        .footer-theme-popover-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
          margin-bottom: 12px;
        }
        .footer-theme-swatch-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          padding: 6px 2px;
          border-radius: 8px;
          border: 1px solid transparent;
          background: transparent;
          cursor: pointer;
          transition: background 150ms ease, border-color 150ms ease;
          outline: none;
        }
        .footer-theme-swatch-item:hover {
          background: rgba(255, 255, 255, 0.06);
        }
        .footer-theme-swatch-item.active {
          border-color: rgba(255, 255, 255, 0.25);
          background: rgba(255, 255, 255, 0.08);
        }
        .footer-theme-swatch-dot {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.18);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
          transition: transform 150ms ease, box-shadow 150ms ease;
          flex-shrink: 0;
        }
        .footer-theme-swatch-item:hover .footer-theme-swatch-dot,
        .footer-theme-swatch-item.active .footer-theme-swatch-dot {
          transform: scale(1.15);
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.5);
          border-color: #FFFFFF;
        }
        .footer-theme-swatch-name {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--text-muted, #AAB6C8);
          text-align: center;
        }

        /* Custom section */
        .footer-theme-popover-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
          margin: 10px 0;
        }
        .footer-theme-custom-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .footer-theme-custom-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted, #AAB6C8);
        }
        .footer-theme-custom-picker-wrap {
          position: relative;
          width: 24px;
          height: 24px;
          cursor: pointer;
          flex-shrink: 0;
        }
        .footer-theme-custom-picker-wrap input[type="color"] {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
          border: none;
        }
        .footer-theme-custom-preview-dot {
          display: block;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 1.5px dashed rgba(255, 255, 255, 0.4);
          background: conic-gradient(red, yellow, lime, aqua, blue, magenta, red);
          pointer-events: none;
          transition: transform 150ms ease;
        }
        .footer-theme-custom-picker-wrap:hover .footer-theme-custom-preview-dot {
          transform: scale(1.15);
          border-style: solid;
          border-color: #FFFFFF;
        }

        @media (max-width: 767px) {
          .footer-theme-popover {
            left: 50%;
            transform: translateX(-50%) translateY(8px);
            width: 260px;
          }
        }
      `;
      document.head.appendChild(style);
    }

    const saved = (() => { try { return JSON.parse(localStorage.getItem(LS_KEY)); } catch(_){} return null; })();
    const activeId = saved ? saved.id : 'default';
    const activeName = saved ? (saved.name || 'Cyber Cyan') : 'Cyber Cyan';
    const activeSwatch = saved ? (saved.swatch || '#00C8FF') : '#00C8FF';

    const swatchesHtml = THEMES.map(t => `
      <button type="button" class="footer-theme-swatch-item ${t.id === activeId ? 'active' : ''}"
              data-theme-id="${t.id}"
              title="${t.name} — ${t.description}"
              aria-label="Set theme to ${t.name}">
        <span class="footer-theme-swatch-dot" style="background:${t.swatch};"></span>
        <span class="footer-theme-swatch-name">${t.shortName}</span>
      </button>
    `).join('');

    const themeChangerWrap = document.createElement('div');
    themeChangerWrap.id = 'nex-footer-theme-changer-wrap';
    themeChangerWrap.className = 'footer-theme-changer-wrap';
    themeChangerWrap.setAttribute('role', 'region');
    themeChangerWrap.setAttribute('aria-label', 'Theme Switcher');
    themeChangerWrap.innerHTML = `
      <!-- Trigger Button -->
      <button type="button" class="footer-theme-trigger-btn" id="footerThemeTriggerBtn" aria-haspopup="dialog" aria-expanded="false" title="Click to customize theme accent">
        <span class="footer-theme-trigger-dot" id="footerThemeTriggerDot" style="background: ${activeSwatch}; box-shadow: 0 0 6px ${activeSwatch};"></span>
        <span class="footer-theme-trigger-label" id="footerThemeTriggerLabel">Theme: ${activeName}</span>
        <svg class="footer-theme-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
      </button>

      <!-- Popover Menu -->
      <div class="footer-theme-popover" id="footerThemePopover" role="dialog" aria-label="Theme Options">
        <div class="footer-theme-popover-header">
          <span class="footer-theme-popover-title">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
            Theme Accents
          </span>
          <button type="button" class="footer-theme-reset-link" id="footerThemeReset" title="Reset to default cyan">Reset</button>
        </div>

        <div class="footer-theme-popover-grid" id="footerThemeGrid">
          ${swatchesHtml}
        </div>

        <div class="footer-theme-popover-divider"></div>

        <div class="footer-theme-custom-row">
          <span class="footer-theme-custom-label">Custom Palette</span>
          <div class="footer-theme-custom-picker-wrap" title="Pick custom color">
            <input type="color" id="footerThemeColorPicker" value="${activeSwatch}" aria-label="Pick custom color" />
            <span class="footer-theme-custom-preview-dot" id="footerThemeColorPreview" style="background: ${activeSwatch};"></span>
          </div>
        </div>
      </div>
    `;

    // Locate footer container safely
    const footerCopy = document.querySelector('.footer-copy, footer .footer-copy, footer [class*="copy"]');
    if (footerCopy && footerCopy.parentNode) {
      footerCopy.parentNode.insertBefore(themeChangerWrap, footerCopy);
    } else {
      const footer = document.querySelector('.footer-inner, .site-footer .container, footer .container, footer');
      if (footer) {
        footer.appendChild(themeChangerWrap);
      } else {
        const minimalFooter = document.createElement('div');
        minimalFooter.style.cssText = 'padding: 24px 0; text-align: center; display: flex; justify-content: center; background: transparent;';
        minimalFooter.appendChild(themeChangerWrap);
        document.body.appendChild(minimalFooter);
      }
    }

    wirePopupEvents(themeChangerWrap);
  }

  /* ── Wire Popup & Swatch Events ───────────────────────────────────────── */
  function wirePopupEvents(wrap) {
    const trigger = wrap.querySelector('#footerThemeTriggerBtn');
    const popover = wrap.querySelector('#footerThemePopover');
    const grid = wrap.querySelector('#footerThemeGrid');
    const colorPicker = wrap.querySelector('#footerThemeColorPicker');
    const colorPreview = wrap.querySelector('#footerThemeColorPreview');
    const resetBtn = wrap.querySelector('#footerThemeReset');

    let isOpen = false;

    function openPopover() {
      isOpen = true;
      popover.classList.add('visible');
      trigger.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
    }

    function closePopover() {
      isOpen = false;
      popover.classList.remove('visible');
      trigger.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    }

    // Toggle popover on button click
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      isOpen ? closePopover() : openPopover();
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (isOpen && !wrap.contains(e.target)) {
        closePopover();
      }
    });

    // Escape key closes popover
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        closePopover();
        trigger.focus();
      }
    });

    // Swatch selection
    if (grid) {
      grid.addEventListener('click', (e) => {
        const item = e.target.closest('.footer-theme-swatch-item');
        if (!item) return;
        const id = item.dataset.themeId;
        applyThemeById(id);
        if (colorPreview) {
          const t = THEMES.find(th => th.id === id);
          if (t) colorPreview.style.background = t.swatch;
        }
      });
    }

    // Custom color picker
    if (colorPicker) {
      colorPicker.addEventListener('input', () => {
        const hex = colorPicker.value;
        if (colorPreview) colorPreview.style.background = hex;
        applyCustomColor(hex);
      });
    }

    // Reset button
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        localStorage.removeItem(LS_KEY);
        applyThemeById('default');
        if (colorPreview) colorPreview.style.background = '#00C8FF';
        if (colorPicker) colorPicker.value = '#00C8FF';
      });
    }
  }

  /* ── Boot ────────────────────────────────────────────────────────────── */
  function init() {
    restoreTheme(); // Apply immediately to avoid FOUC
    // Do not inject developer theme widget into the public luxury footer
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
