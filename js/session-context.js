(function(window) {
  'use strict';

  var STORAGE_KEY = 'nexcommerce_search_context';
  var TTL_MS = 30 * 60 * 1000; // 30 minutes

  function save(intentObj) {
    try {
      // Respect user GDPR marketing/personalization consent
      if (window.NexCookieConsent && !window.NexCookieConsent.hasConsent('marketing') && !window.NexCookieConsent.hasConsent('functional')) {
        return;
      }
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        intent: intentObj,
        savedAt: Date.now(),
        ttlMs: TTL_MS
      }));
    } catch(e) {}
  }

  function load() {
    try {
      var raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var payload = JSON.parse(raw);
      if (Date.now() - payload.savedAt > payload.ttlMs) {
        sessionStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return payload.intent;
    } catch(e) { return null; }
  }

  function clear() {
    try { sessionStorage.removeItem(STORAGE_KEY); } catch(e) {}
  }

  // FR-7: Merge refinement into existing context without discarding valid prior constraints
  function mergeRefinement(existingIntent, refinementIntent) {
    var merged = Object.assign({}, existingIntent);
    var fields = ['occasion','climate','location','style','color','fit','budget','category','recipient'];
    fields.forEach(function(key) {
      if (refinementIntent[key] !== null && refinementIntent[key] !== undefined) {
        merged[key] = refinementIntent[key];
      }
    });
    merged.raw = refinementIntent.raw;
    return merged;
  }

  window.NexSessionContext = { save: save, load: load, clear: clear, mergeRefinement: mergeRefinement };

})(window);
