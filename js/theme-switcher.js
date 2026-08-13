/* ─── nexCommerce Theme Switcher ─────────────────────────────────────────
 * Self-contained floating palette widget. Drop the script  any page.
 * Overrides CSS custom properties on :root to switch theme colours.
 * Theme is persisted across pages via localStorage.
 * ──────────────────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  /* ── Predefined Themes ───────────────────────────────────────────────── */
  const THEMES = [
    {
      id: 'default',
      name: 'Cyber Cyan',
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
      name: 'Forest Emerald',
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
      name: 'Warm Amber',
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
      name: 'Editorial Rose',
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
      name: 'Sunset Coral',
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
      name: 'Arctic Slate',
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
      localStorage.setItem(LS_KEY, JSON.stringify({ id, vars: theme.vars }));
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
    localStorage.setItem(LS_KEY, JSON.stringify({ id: 'custom', vars }));
  }

  /* ── Restore Persisted Theme ──────────────────────────────────────────*/
  function restoreTheme() {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_KEY));
      if (saved && saved.vars) applyTheme(saved.vars);
    } catch (_) {}
  }

  /* ── Inject Styles ───────────────────────────────────────────────────── */
  function injectStyles() {
    if (document.getElementById('nex-theme-switcher-styles')) return;
    const style = document.createElement('style');
    style.id = 'nex-theme-switcher-styles';
    style.textContent = `
      #nex-theme-fab {
        position: fixed;
        bottom: 32px;
        right: 32px;
        z-index: 99999;
        font-family: 'Inter', system-ui, sans-serif;
      }

      #nex-theme-toggle {
        width: 52px;
        height: 52px;
        border-radius: 50%;
        background: #0B2147;
        border: 1.5px solid rgba(255,255,255,0.15);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.3s ease;
        color: var(--accent-cyan, #00C8FF);
        position: relative;
        z-index: 2;
        outline: none;
      }
      #nex-theme-toggle:hover {
        transform: scale(1.08);
        box-shadow: 0 12px 40px rgba(0,0,0,0.5);
        border-color: var(--accent-cyan, #00C8FF);
      }
      #nex-theme-toggle.open {
        border-color: var(--accent-cyan, #00C8FF);
        box-shadow: 0 0 0 2px var(--accent-cyan, #00C8FF), 0 12px 40px rgba(0,0,0,0.4);
        transform: rotate(30deg);
      }

      #nex-theme-panel {
        position: absolute;
        bottom: 64px;
        right: 0;
        width: 296px;
        background: rgba(11, 33, 71, 0.96);
        border: 1px solid rgba(255,255,255,0.12);
        border-radius: 16px;
        padding: 20px;
        box-shadow: 0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04) inset;
        transform-origin: bottom right;
        transform: scale(0.9) translateY(8px);
        opacity: 0;
        pointer-events: none;
        transition: transform 0.22s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease;
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
      }
      #nex-theme-panel.visible {
        transform: scale(1) translateY(0);
        opacity: 1;
        pointer-events: all;
      }

      .nex-ts-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid rgba(255,255,255,0.08);
      }
      .nex-ts-title {
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: #AAB6C8;
      }
      .nex-ts-reset {
        font-size: 11px;
        color: var(--accent-cyan, #00C8FF);
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        font-family: inherit;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-weight: 600;
        opacity: 0.7;
        transition: opacity 0.15s;
        outline: none;
      }
      .nex-ts-reset:hover { opacity: 1; }

      .nex-ts-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
        margin-bottom: 16px;
      }

      .nex-ts-swatch {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        padding: 8px 4px 10px;
        border-radius: 10px;
        border: 1px solid transparent;
        background: none;
        transition: background 0.15s, border-color 0.15s;
        position: relative;
        outline: none;
      }
      .nex-ts-swatch:hover {
        background: rgba(255,255,255,0.05);
      }
      .nex-ts-swatch.active {
        border-color: rgba(255,255,255,0.2);
        background: rgba(255,255,255,0.06);
      }
      .nex-ts-swatch.active::after {
        content: '';
        position: absolute;
        bottom: 5px;
        left: 50%;
        transform: translateX(-50%);
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: var(--accent-cyan, #00C8FF);
      }

      .nex-ts-dot {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transition: transform 0.15s, box-shadow 0.15s;
        border: 2px solid rgba(255,255,255,0.18);
        flex-shrink: 0;
      }
      .nex-ts-swatch:hover .nex-ts-dot,
      .nex-ts-swatch.active .nex-ts-dot {
        transform: scale(1.12);
        box-shadow: 0 4px 14px rgba(0,0,0,0.45);
      }

      .nex-ts-label {
        font-size: 9px;
        font-weight: 600;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: #AAB6C8;
        text-align: center;
        line-height: 1.2;
      }

      .nex-ts-divider {
        height: 1px;
        background: rgba(255,255,255,0.08);
        margin: 14px 0;
      }

      .nex-ts-custom-label {
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #AAB6C8;
        margin-bottom: 10px;
      }

      .nex-ts-custom-row {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .nex-ts-color-input-wrap {
        position: relative;
        width: 44px;
        height: 44px;
        flex-shrink: 0;
        cursor: pointer;
      }
      .nex-ts-color-input-wrap input[type="color"] {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        border: none;
        cursor: pointer;
        border-radius: 10px;
        opacity: 0;
        z-index: 2;
      }
      .nex-ts-color-preview {
        width: 44px;
        height: 44px;
        border-radius: 10px;
        border: 2px solid rgba(255,255,255,0.15);
        background: #00C8FF;
        pointer-events: none;
        transition: background 0.15s;
        box-shadow: 0 2px 8px rgba(0,0,0,0.35);
      }

      .nex-ts-apply-btn {
        flex: 1;
        height: 44px;
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.12);
        border-radius: 10px;
        color: #F5F7FA;
        font-family: inherit;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        cursor: pointer;
        transition: background 0.15s, border-color 0.15s, color 0.15s;
        outline: none;
      }
      .nex-ts-apply-btn:hover {
        background: rgba(255,255,255,0.1);
        border-color: var(--accent-cyan, #00C8FF);
        color: var(--accent-cyan, #00C8FF);
      }

      .nex-ts-footer {
        margin-top: 14px;
        font-size: 10px;
        color: rgba(170,182,200,0.35);
        text-align: center;
        letter-spacing: 0.05em;
      }
    `;
    document.head.appendChild(style);
  }

  /* ── Build Panel HTML ────────────────────────────────────────────────── */
  function buildPanel() {
    const saved = (() => { try { return JSON.parse(localStorage.getItem(LS_KEY)); } catch(_){} return null; })();
    const activeId = saved ? saved.id : 'default';

    const swatchGrid = THEMES.map(t => `
      <button class="nex-ts-swatch ${t.id === activeId ? 'active' : ''}"
              data-theme-id="${t.id}"
              title="${t.name}: ${t.description}">
        <span class="nex-ts-dot" style="background:${t.swatch};"></span>
        <span class="nex-ts-label">${t.name.split(' ').slice(-1)[0]}</span>
      </button>
    `).join('');

    return `
      <div class="nex-ts-header">
        <span class="nex-ts-title">Theme Colour</span>
        <button class="nex-ts-reset" id="nexTsReset">Reset</button>
      </div>

      <div class="nex-ts-grid" id="nexTsSwatchGrid">
        ${swatchGrid}
      </div>

      <div class="nex-ts-divider"></div>

      <div class="nex-ts-custom-label">Custom Colour</div>
      <div class="nex-ts-custom-row">
        <div class="nex-ts-color-input-wrap" title="Click  pick a colour">
          <input type="color" id="nexTsColorPicker" value="#00C8FF">
          <div class="nex-ts-color-preview" id="nexTsColorPreview" style="background:#00C8FF;"></div>
        </div>
        <button class="nex-ts-apply-btn" id="nexTsApplyCustom">Apply Custom</button>
      </div>

      <div class="nex-ts-footer">Persists across all pages via localStorage</div>
    `;
  }

  /* ── Create & Inject Widget ──────────────────────────────────────────── */
  function createWidget() {
    if (document.getElementById('nex-theme-fab')) return null;

    const fab = document.createElement('div');
    fab.id = 'nex-theme-fab';
    fab.setAttribute('role', 'region');
    fab.setAttribute('aria-label', 'Theme colour switcher');

    const panel = document.createElement('div');
    panel.id = 'nex-theme-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Theme colour options');
    panel.innerHTML = buildPanel();

    const toggle = document.createElement('button');
    toggle.id = 'nex-theme-toggle';
    toggle.setAttribute('aria-label', 'Open theme switcher');
    toggle.setAttribute('title', 'Switch theme colour');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
        <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
        <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
        <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
      </svg>
    `;

    fab.appendChild(panel);
    fab.appendChild(toggle);
    document.body.appendChild(fab);

    return { fab, panel, toggle };
  }

  /* ── Wire Events ──────────────────────────────────────────────────────*/
  function wireEvents(panel, toggle) {
    let isOpen = false;

    function closePanel() {
      isOpen = false;
      panel.classList.remove('visible');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    function openPanel() {
      isOpen = true;
      panel.classList.add('visible');
      toggle.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
    }

    // Toggle open/close
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      isOpen ? closePanel() : openPanel();
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (isOpen && !panel.contains(e.target) && e.target !== toggle) {
        closePanel();
      }
    });

    // Preset swatches
    panel.querySelector('#nexTsSwatchGrid').addEventListener('click', (e) => {
      const btn = e.target.closest('.nex-ts-swatch');
      if (!btn) return;
      const id = btn.dataset.themeId;
      applyThemeById(id);
      panel.querySelectorAll('.nex-ts-swatch').forEach(s => {
        s.classList.toggle('active', s.dataset.themeId === id);
      });
    });

    // Custom color picker - live preview
    const picker = panel.querySelector('#nexTsColorPicker');
    const preview = panel.querySelector('#nexTsColorPreview');
    picker.addEventListener('input', () => {
      preview.style.background = picker.value;
    });

    // Apply custom color
    panel.querySelector('#nexTsApplyCustom').addEventListener('click', () => {
      applyCustomColor(picker.value);
      panel.querySelectorAll('.nex-ts-swatch').forEach(s => s.classList.remove('active'));
    });

    // Reset  default
    panel.querySelector('#nexTsReset').addEventListener('click', () => {
      localStorage.removeItem(LS_KEY);
      applyThemeById('default');
      panel.querySelectorAll('.nex-ts-swatch').forEach(s => {
        s.classList.toggle('active', s.dataset.themeId === 'default');
      });
      picker.value = '#00C8FF';
      preview.style.background = '#00C8FF';
    });

    // Keyboard: Escape  close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        closePanel();
        toggle.focus();
      }
    });
  }

  /* ── Boot ────────────────────────────────────────────────────────────── */
  function init() {
    restoreTheme();  // Apply immediately  avoid FOUC
    injectStyles();
    const result = createWidget();
    if (result) wireEvents(result.panel, result.toggle);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
