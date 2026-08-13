/**
 * nexCommerce &mdash; Notification & Communication Center (js/notifications.js)
 * Manages Toast notifications, Notification Center slide-out drawer, 
 * unread badges, direct navigation routing, and localStorage persistence.
 *
 * TODO: Wire  real WebSockets / SSE / Push Notification Server
 */

(function () {
  const STORAGE_KEY = 'nex_notifications';

  const DEFAULT_NOTIFICATIONS = [
    {
      id: 'notif-1',
      type: 'info',
      title: 'YOUR ORDER IS OUT FOR DELIVERY',
      message: 'Order #NX-M4KZ9 is on its way to Dhanmondi, Dhaka. Expected today between 2:00 PM &ndash; 5:00 PM.',
      actionUrl: 'tracking.html?ref=NX-M4KZ9',
      createdAt: '10 mins ago',
      read: false
    },
    {
      id: 'notif-2',
      type: 'info',
      title: 'RETURN REQUEST RECEIVED',
      message: 'Return request RR-NX-48291 has been received and is currently under review by our team.',
      actionUrl: 'account.html#orders',
      createdAt: '2 hours ago',
      read: false
    },
    {
      id: 'notif-3',
      type: 'ai',
      title: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:-0.125em; margin-right:4px;"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M3 5h4"/></svg> YOUR SIZE MAY BE RUNNING LOW',
      message: 'The size M Architectural Cashmere Sweater you recently viewed has limited stock remaining.',
      actionUrl: 'product.html?id=p1',
      createdAt: '1 day ago',
      read: false
    }
  ];

  class NotificationEngine {
    constructor() {
      this.notifications = [];
      this.initialized = false;
    }

    init() {
      if (this.initialized) return;
      this.loadStorage();
      this.ensureDOMContainers();
      this.updateHeaderBadge();
      this.initialized = true;
    }

    loadStorage() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          this.notifications = JSON.parse(stored);
        } else {
          this.notifications = DEFAULT_NOTIFICATIONS;
          this.saveStorage();
        }
      } catch (_) {
        this.notifications = DEFAULT_NOTIFICATIONS;
      }
    }

    saveStorage() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.notifications));
      } catch (_) {}
    }

    ensureDOMContainers() {
      // Toast Container
      if (!document.getElementById('toastContainer')) {
        const toastBox = document.createElement('div');
        toastBox.id = 'toastContainer';
        toastBox.setAttribute('aria-live', 'polite');
        document.body.appendChild(toastBox);
      }

      // Drawer & Backdrop
      if (!document.getElementById('notifDrawer')) {
        const backdrop = document.createElement('div');
        backdrop.id = 'notifDrawerBackdrop';
        backdrop.className = 'notif-drawer-backdrop';
        backdrop.onclick = () => this.closeDrawer();

        const drawer = document.createElement('div');
        drawer.id = 'notifDrawer';
        drawer.className = 'notif-drawer';
        drawer.setAttribute('role', 'dialog');
        drawer.setAttribute('aria-label', 'Notification Center');

        drawer.innerHTML = `
          <div class="notif-drawer-header">
            <span class="notif-drawer-title">NOTIFICATIONS</span>
            <div style="display: flex; gap: 16px; align-items: center;">
              <button onclick="window.nexNotifications.markAllRead()" style="background: none; border: none; color: var(--accent-cyan); font-family: var(--font-body); font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; padding: 0;">MARK ALL READ</button>
              <button onclick="window.nexNotifications.closeDrawer()" style="background: none; border: none; color: var(--text-secondary); font-size: 20px; cursor: pointer; padding: 0; line-height: 1;">&times;</button>
            </div>
          </div>
          <div class="notif-drawer-list" id="notifDrawerList"></div>
        `;

        document.body.appendChild(backdrop);
        document.body.appendChild(drawer);
      }
    }

    getUnreadCount() {
      return this.notifications.filter(n => !n.read).length;
    }

    updateHeaderBadge() {
      const badges = document.querySelectorAll('#headerNotifBadge, .header-notif-count');
      const count = this.getUnreadCount();
      badges.forEach(b => {
        b.textContent = count;
        b.style.display = count > 0 ? 'inline-flex' : 'none';
      });
    }

    showToast({ type = 'info', title = '', message = '', actionText = null, actionUrl = null, duration = 4500 }) {
      this.ensureDOMContainers();
      const container = document.getElementById('toastContainer');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = `toast-card toast-${type}`;

      const iconMap = {
        success: '&#10003;',
        info: '●',
        warning: '!',
        error: '&times;',
        ai: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:-0.125em; margin-right:4px;"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M3 5h4"/></svg>'
      };

      toast.innerHTML = `
        <div class="toast-icon-badge">${iconMap[type] || '●'}</div>
        <div class="toast-content">
          ${title ? `<div class="toast-title">${title}</div>` : ''}
          <div class="toast-msg">${message}</div>
          ${actionText && actionUrl ? `
            <a href="${actionUrl}" style="font-family: var(--font-body); font-size: 12px; color: var(--accent-cyan); font-weight: 600; text-decoration: none; margin-top: 4px; display: inline-block;">${actionText} &rarr;</a>
          ` : ''}
        </div>
        <button class="toast-close-btn" onclick="this.parentElement.remove()" aria-label="Dismiss">&times;</button>
      `;

      container.appendChild(toast);

      if (duration > 0) {
        setTimeout(() => {
          if (toast.parentElement) {
            toast.classList.add('leaving');
            setTimeout(() => toast.remove(), 180);
          }
        }, duration);
      }
    }

    addNotification({ type = 'info', title, message, actionUrl = null }) {
      const newNotif = {
        id: `notif-${Date.now()}`,
        type,
        title,
        message,
        actionUrl,
        createdAt: 'Just now',
        read: false
      };
      this.notifications.unshift(newNotif);
      this.saveStorage();
      this.updateHeaderBadge();
      this.renderDrawerList();

      // Show instant toast notification
      this.showToast({
        type,
        title,
        message,
        actionText: actionUrl ? 'VIEW' : null,
        actionUrl
      });
    }

    toggleDrawer() {
      const drawer = document.getElementById('notifDrawer');
      if (drawer && drawer.classList.contains('open')) {
        this.closeDrawer();
      } else {
        this.openDrawer();
      }
    }

    openDrawer() {
      this.ensureDOMContainers();
      this.renderDrawerList();
      const drawer = document.getElementById('notifDrawer');
      const backdrop = document.getElementById('notifDrawerBackdrop');
      if (drawer) drawer.classList.add('open');
      if (backdrop) backdrop.classList.add('open');
    }

    closeDrawer() {
      const drawer = document.getElementById('notifDrawer');
      const backdrop = document.getElementById('notifDrawerBackdrop');
      if (drawer) drawer.classList.remove('open');
      if (backdrop) backdrop.classList.remove('open');
    }

    renderDrawerList() {
      const listEl = document.getElementById('notifDrawerList');
      if (!listEl) return;

      if (this.notifications.length === 0) {
        listEl.innerHTML = `
          <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 24px; text-align: center; color: var(--text-secondary);">
            <div style="font-size: 24px; margin-bottom: 12px; opacity: 0.5;">○</div>
            <div style="font-family: var(--font-serif); font-size: 20px; color: var(--text-primary); margin-bottom: 6px;">You're all caught up.</div>
            <div style="font-family: var(--font-body); font-size: 13px;">Nothing needs your attention right now.</div>
          </div>
        `;
        return;
      }

      listEl.innerHTML = this.notifications.map(n => `
        <a href="${n.actionUrl || '#'}" class="notif-item ${n.read ? 'read' : 'unread'}" onclick="window.nexNotifications.markAsRead('${n.id}', event, '${n.actionUrl || ''}')">
          <div class="notif-unread-dot" style="visibility: ${n.read ? 'hidden' : 'visible'};"></div>
          <div class="notif-item-body">
            <div class="notif-item-title">${n.title}</div>
            <div class="notif-item-text">${n.message}</div>
            <div class="notif-item-time">${n.createdAt}</div>
          </div>
        </a>
      `).join('');
    }

    markAsRead(id, event, targetUrl) {
      const notif = this.notifications.find(n => n.id === id);
      if (notif) {
        notif.read = true;
        this.saveStorage();
        this.updateHeaderBadge();
      }
      if (targetUrl && targetUrl !== '#') {
        window.location.href = targetUrl;
      } else {
        if (event) event.preventDefault();
        this.renderDrawerList();
      }
    }

    markAllRead() {
      this.notifications.forEach(n => n.read = true);
      this.saveStorage();
      this.updateHeaderBadge();
      this.renderDrawerList();
    }
  }

  // Export Singleton  global window
  window.nexNotifications = new NotificationEngine();

  document.addEventListener('DOMContentLoaded', () => {
    window.nexNotifications.init();
  });
})();
