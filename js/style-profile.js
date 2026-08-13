(function(window) {
  'use strict';

  var STORAGE_KEY = 'nexcommerce_style_profile';

  var ALLOWED_STYLES = ['minimal', 'classic', 'casual', 'formal', 'trendy', 'sporty'];
  var ALLOWED_FITS = ['fitted', 'regular', 'relaxed', 'oversized'];
  var ALLOWED_COLORS = ['black', 'white', 'neutral', 'earth tones', 'blue', 'bright colors', 'pastels'];
  var ALLOWED_LIFESTYLES = ['office', 'everyday', 'travel', 'fitness', 'outdoor', 'social', 'formal events'];

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  }

  function validateArray(arr, allowed) {
    if (!Array.isArray(arr)) return [];
    return arr.filter(function(item) {
      return allowed.includes(item.toLowerCase());
    });
  }

  function validateSingle(val, allowed) {
    if (!val) return null;
    var lower = val.toLowerCase();
    return allowed.includes(lower) ? lower : null;
  }

  function save(profileData) {
    // Validate inputs per AC-06, NAC-08
    var validated = {
      customerId: 'guest_or_auth_id', // mock
      stylePreferences: validateArray(profileData.stylePreferences, ALLOWED_STYLES),
      fitPreference: validateSingle(profileData.fitPreference, ALLOWED_FITS),
      colorPreferences: validateArray(profileData.colorPreferences, ALLOWED_COLORS),
      lifestylePreferences: validateArray(profileData.lifestylePreferences, ALLOWED_LIFESTYLES),
      personalizationEnabled: profileData.personalizationEnabled !== false,
      updatedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
      if (window.dataLayer) window.dataLayer.push({ event: 'ai_profile_saved' });
      return true;
    } catch (e) {
      if (window.dataLayer) window.dataLayer.push({ event: 'ai_profile_save_failed' });
      return false;
    }
  }

  function remove() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      if (window.dataLayer) window.dataLayer.push({ event: 'ai_profile_deleted' });
      return true;
    } catch (e) {
      return false;
    }
  }

  function getActiveProfile() {
    var profile = load();
    if (profile && profile.personalizationEnabled) {
      return profile;
    }
    return null;
  }

  window.NexStyleProfile = {
    load: load,
    save: save,
    remove: remove,
    getActiveProfile: getActiveProfile
  };

  /* ── UI Logic for profile.html ──────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProfileUI);
  } else {
    initProfileUI();
  }

  function initProfileUI() {
    var profileContainer = document.getElementById('aiProfileContainer');
    if (!profileContainer) return; // Only run on profile.html

    if (window.dataLayer) window.dataLayer.push({ event: 'ai_profile_opened' });

    var chips = document.querySelectorAll('.pref-chip');
    var saveBtn = document.getElementById('btnSaveProfile');
    var deleteBtn = document.getElementById('btnDeleteProfile');
    var togglePersonalization = document.getElementById('togglePersonalization');
    var msgBox = document.getElementById('profileMsg');

    var hasUnsavedChanges = false;

    // Load existing
    var existing = window.NexStyleProfile.load();
    if (existing) {
      // populate UI
      chips.forEach(function(chip) {
        var val = chip.getAttribute('data-val').toLowerCase();
        var cat = chip.getAttribute('data-cat');
        if (cat === 'style' && existing.stylePreferences.includes(val)) chip.classList.add('selected');
        if (cat === 'color' && existing.colorPreferences.includes(val)) chip.classList.add('selected');
        if (cat === 'lifestyle' && existing.lifestylePreferences.includes(val)) chip.classList.add('selected');
        if (cat === 'fit' && existing.fitPreference === val) chip.classList.add('selected');
      });
      if (togglePersonalization) {
        togglePersonalization.checked = existing.personalizationEnabled;
      }
    }

    // Chip interaction
    chips.forEach(function(chip) {
      chip.addEventListener('click', function() {
        hasUnsavedChanges = true;
        var cat = this.getAttribute('data-cat');
        if (cat === 'fit') {
          // single select
          document.querySelectorAll('.pref-chip[data-cat="fit"]').forEach(function(c) { c.classList.remove('selected'); });
          this.classList.add('selected');
        } else {
          // multi select
          this.classList.toggle('selected');
        }
      });
    });

    if (togglePersonalization) {
      togglePersonalization.addEventListener('change', function() {
        hasUnsavedChanges = true;
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', function() {
        var newProfile = {
          stylePreferences: [],
          colorPreferences: [],
          lifestylePreferences: [],
          fitPreference: null,
          personalizationEnabled: togglePersonalization ? togglePersonalization.checked : true
        };

        document.querySelectorAll('.pref-chip.selected').forEach(function(chip) {
          var val = chip.getAttribute('data-val');
          var cat = chip.getAttribute('data-cat');
          if (cat === 'style') newProfile.stylePreferences.push(val);
          if (cat === 'color') newProfile.colorPreferences.push(val);
          if (cat === 'lifestyle') newProfile.lifestylePreferences.push(val);
          if (cat === 'fit') newProfile.fitPreference = val;
        });

        var success = window.NexStyleProfile.save(newProfile);
        if (success) {
          hasUnsavedChanges = false;
          showMsg('Your preferences have been updated.', false);
        } else {
          showMsg('We couldn\'t save your changes. Please try again.', true);
        }
      });
    }

    if (deleteBtn) {
      deleteBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete your saved style preferences?')) {
          window.NexStyleProfile.remove();
          hasUnsavedChanges = false;
          window.location.reload();
        }
      });
    }

    function showMsg(text, isError) {
      if (!msgBox) return;
      msgBox.textContent = text;
      msgBox.className = 'profile-msg' + (isError ? ' error' : '');
      msgBox.style.display = 'block';
      setTimeout(function() {
        msgBox.style.display = 'none';
      }, 5000);
    }

    window.addEventListener('beforeunload', function(e) {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes.';
      }
    });
  }

})(window);
