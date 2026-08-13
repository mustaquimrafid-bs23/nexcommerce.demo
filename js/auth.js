/**
 * nexCommerce Auth Module
 * Simulated session management via localStorage.
 * <!-- TODO: Wire to real Auth API (JWT/OAuth) -->
 */

const NexAuth = (() => {
  const SESSION_KEY = 'nex_session';
  const USERS_KEY   = 'nex_users';

  /* ── Helpers ─────────────────────────────── */

  function _getUsers() {
    try { 
      let users = JSON.parse(localStorage.getItem(USERS_KEY)) || []; 
      if (users.length === 0) {
        users = [_createDemoUser()];
        _saveUsers(users);
      }
      return users;
    }
    catch { return [_createDemoUser()]; }
  }

  function _createDemoUser() {
    return {
      id:       'u_demo',
      name:     'Demo User',
      email:    'demo@nexcommerce.ai',
      password: _hashPassword('password123'),
      createdAt: new Date().toISOString()
    };
  }

  function _saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function _getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
    catch { return null; }
  }

  function _setSession(user) {
    const session = {
      id:        user.id,
      name:      user.name,
      firstName: user.name.split(' ')[0],
      email:     user.email,
      loggedInAt: new Date().toISOString()
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  }

  function _clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  function _hashPassword(pw) {
    // Simple deterministic hash for prototype purposes
    let h = 0;
    for (let i = 0; i < pw.length; i++) {
      h = Math.imul(31, h) + pw.charCodeAt(i) | 0;
    }
    return 'h_' + Math.abs(h).toString(36);
  }

  /* ── Public API ───────────────────────────── */

  /**
   * Returns the current session object or null if logged out.
   */
  function getSession() {
    return _getSession();
  }

  /**
   * Returns true if a user is currently signed in.
   */
  function isLoggedIn() {
    return _getSession() !== null;
  }

  /**
   * Registers a new user.
   * @returns { success, error, session }
   */
  function signUp({ name, email, password }) {
    if (!name || !email || !password) {
      return { success: false, error: 'All fields are required.' };
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters.' };
    }

    const users = _getUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser = {
      id:       'u_' + Date.now(),
      name:     name.trim(),
      email:    email.trim().toLowerCase(),
      password: _hashPassword(password),
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    _saveUsers(users);

    const session = _setSession(newUser);
    return { success: true, session, isNewUser: true };
  }

  /**
   * Signs in an existing user.
   * @returns { success, error, session }
   */
  function signIn({ email, password }) {
    if (!email || !password) {
      return { success: false, error: 'Email and password are required.' };
    }

    const users = _getUsers();
    const user  = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!user) {
      return { success: false, error: 'No account found with this email address.' };
    }

    if (user.password !== _hashPassword(password)) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    const session = _setSession(user);
    return { success: true, session };
  }

  /**
   * Signs out the current user and redirects.
   */
  function signOut(redirectTo = 'index.html') {
    _clearSession();
    window.location.href = redirectTo;
  }

  /**
   * Auth guard — call at the top of any protected page.
   * Redirects to sign-in if not logged in.
   */
  function requireAuth(redirectTo = '') {
    if (!isLoggedIn()) {
      const current = encodeURIComponent(window.location.pathname.split('/').pop());
      window.location.href = `signin.html?next=${redirectTo || current}`;
    }
  }

  /**
   * Injects the correct auth state into the navigation.
   * Updates "Account" link to show user's first name or "Sign In".
   */
  function updateNavLinks() {
    const session = _getSession();
    const accountLinks = document.querySelectorAll('a[data-auth-account]');
    const signInLinks  = document.querySelectorAll('a[data-auth-signin]');
    const signOutBtns  = document.querySelectorAll('[data-auth-signout]');
    const userNameEls  = document.querySelectorAll('[data-auth-name]');

    if (session) {
      accountLinks.forEach(el => {
        el.href = 'account.html';
        el.textContent = session.firstName;
      });
      signInLinks.forEach(el => { el.style.display = 'none'; });
      signOutBtns.forEach(el => { el.style.display = ''; });
      userNameEls.forEach(el => { el.textContent = session.firstName; });
    } else {
      accountLinks.forEach(el => {
        el.href = 'signin.html';
        el.textContent = 'Sign In';
      });
      signInLinks.forEach(el => { el.style.display = ''; });
      signOutBtns.forEach(el => { el.style.display = 'none'; });
    }
  }

  return { getSession, isLoggedIn, signUp, signIn, signOut, requireAuth, updateNavLinks };
})();

// Auto-update nav on every page load
document.addEventListener('DOMContentLoaded', () => NexAuth.updateNavLinks());
window.NexAuth = NexAuth;
