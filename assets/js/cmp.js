(function () {
  'use strict';

  var STORAGE_KEY = 'cmp_consent';
  var POLICY_VERSION = '2026-03';
  var CONSENT_LOG_URL = 'https://eac-consent-log.marinosantoniou3009.workers.dev/consent/log';

  function isEL() {
    return window.location.pathname.toLowerCase().indexOf('/el/') !== -1;
  }

  var TEXT = {
    en: {
      title: 'Cookie Settings',
      body: 'We use cookies and similar technologies for essential site operation, preferences, analytics, and marketing. You can accept all, reject non-essential, or customise your choices.',
      acceptAll: 'Accept All',
      rejectNonEssential: 'Reject Non-Essential',
      settings: 'Settings',
      modalTitle: 'Cookie Settings',
      necessary: 'Strictly Necessary',
      necessaryDesc: 'Required for the site to function properly. Cannot be disabled.',
      preferences: 'Preferences',
      preferencesDesc: 'Remember your choices such as language and theme.',
      analytics: 'Analytics',
      analyticsDesc: 'Help us understand how visitors use the site.',
      marketing: 'Marketing',
      marketingDesc: 'Used for personalised campaigns with your consent.',
      save: 'Save Preferences',
      cancel: 'Cancel',
      alwaysOn: 'Always on'
    },
    el: {
      title: 'Ρυθμίσεις Cookies',
      body: 'Χρησιμοποιούμε cookies και παρόμοιες τεχνολογίες για απαραίτητη λειτουργία, προτιμήσεις, στατιστικά και marketing. Μπορείτε να αποδεχθείτε, να απορρίψετε τα μη απαραίτητα ή να ρυθμίσετε τις επιλογές σας.',
      acceptAll: 'Αποδοχή Όλων',
      rejectNonEssential: 'Απόρριψη Μη Απαραίτητων',
      settings: 'Ρυθμίσεις',
      modalTitle: 'Ρυθμίσεις Cookies',
      necessary: 'Απαραίτητα',
      necessaryDesc: 'Απαιτούνται για τη λειτουργία του site. Δεν μπορούν να απενεργοποιηθούν.',
      preferences: 'Προτιμήσεις',
      preferencesDesc: 'Θυμούνται τις επιλογές σας (π.χ. γλώσσα, θέμα).',
      analytics: 'Στατιστικά / Analytics',
      analyticsDesc: 'Μας βοηθούν να κατανοήσουμε πώς χρησιμοποιείται το site.',
      marketing: 'Marketing',
      marketingDesc: 'Για εξατομικευμένες καμπάνιες, μόνο με τη συγκατάθεσή σας.',
      save: 'Αποθήκευση',
      cancel: 'Άκυρο',
      alwaysOn: 'Πάντα ενεργά'
    }
  };

  function t() {
    return isEL() ? TEXT.el : TEXT.en;
  }

  function loadConsent() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch (e) {
      return null;
    }
  }

  function saveConsent(choices, source) {
    var existing = loadConsent();
    var payload = {
      consent_id: (existing && existing.consent_id) || generateId(),
      timestamp_utc: new Date().toISOString(),
      site: 'eac-insurance',
      locale: isEL() ? 'el' : 'en',
      policy_version: POLICY_VERSION,
      choices: choices,
      source: source,
      page_path: window.location.pathname
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

    // Server-side consent logging (fails silently if no endpoint configured)
    if (CONSENT_LOG_URL) {
      try {
        fetch(CONSENT_LOG_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch(function () { });
      } catch (e) { }
    }

    applyConsent(choices);
    hideBanner();
    hideModal();

    // Fire custom event
    try {
      window.dispatchEvent(new CustomEvent('cmp:consent-updated', { detail: choices }));
    } catch (e) { }
  }

  function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      var v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function applyConsent(choices) {
    // Gate analytics/marketing scripts here if needed
    // Example: if (choices.analytics) { loadAnalytics(); }
  }

  // --- Banner ---
  var bannerEl = null;
  var modalOverlayEl = null;

  function createBanner() {
    var lang = t();
    var div = document.createElement('div');
    div.className = 'cmp-banner';
    div.id = 'cmp-banner';
    div.setAttribute('role', 'dialog');
    div.setAttribute('aria-label', lang.title);
    div.innerHTML =
      '<div class="cmp-inner">' +
        '<div class="cmp-text">' +
          '<h4>' + lang.title + '</h4>' +
          '<p>' + lang.body + '</p>' +
        '</div>' +
        '<div class="cmp-actions">' +
          '<button class="cmp-btn cmp-btn-accept" id="cmp-accept-all">' + lang.acceptAll + '</button>' +
          '<button class="cmp-btn cmp-btn-reject" id="cmp-reject">' + lang.rejectNonEssential + '</button>' +
          '<button class="cmp-btn cmp-btn-settings" id="cmp-open-settings">' + lang.settings + '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(div);
    bannerEl = div;

    document.getElementById('cmp-accept-all').addEventListener('click', function () {
      saveConsent({ necessary: true, preferences: true, analytics: true, marketing: true }, 'accept_all');
    });
    document.getElementById('cmp-reject').addEventListener('click', function () {
      saveConsent({ necessary: true, preferences: false, analytics: false, marketing: false }, 'reject_nonessential');
    });
    document.getElementById('cmp-open-settings').addEventListener('click', function () {
      hideBanner();
      showModal();
    });
  }

  function createModal() {
    var lang = t();
    var overlay = document.createElement('div');
    overlay.className = 'cmp-modal-overlay';
    overlay.id = 'cmp-modal-overlay';
    overlay.style.display = 'none';
    overlay.innerHTML =
      '<div class="cmp-modal" role="dialog" aria-modal="true" aria-label="' + lang.modalTitle + '">' +
        '<h3>' + lang.modalTitle + '</h3>' +
        '<div class="cmp-category">' +
          '<div class="cmp-category-info"><h5>' + lang.necessary + '</h5><p>' + lang.necessaryDesc + '</p></div>' +
          '<label class="cmp-toggle"><input type="checkbox" checked disabled><span class="cmp-slider"></span></label>' +
        '</div>' +
        '<div class="cmp-category">' +
          '<div class="cmp-category-info"><h5>' + lang.preferences + '</h5><p>' + lang.preferencesDesc + '</p></div>' +
          '<label class="cmp-toggle"><input type="checkbox" id="cmp-pref"><span class="cmp-slider"></span></label>' +
        '</div>' +
        '<div class="cmp-category">' +
          '<div class="cmp-category-info"><h5>' + lang.analytics + '</h5><p>' + lang.analyticsDesc + '</p></div>' +
          '<label class="cmp-toggle"><input type="checkbox" id="cmp-analytics"><span class="cmp-slider"></span></label>' +
        '</div>' +
        '<div class="cmp-category">' +
          '<div class="cmp-category-info"><h5>' + lang.marketing + '</h5><p>' + lang.marketingDesc + '</p></div>' +
          '<label class="cmp-toggle"><input type="checkbox" id="cmp-marketing"><span class="cmp-slider"></span></label>' +
        '</div>' +
        '<div class="cmp-modal-actions">' +
          '<button class="cmp-btn cmp-btn-cancel" id="cmp-cancel">' + lang.cancel + '</button>' +
          '<button class="cmp-btn cmp-btn-save" id="cmp-save">' + lang.save + '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    modalOverlayEl = overlay;

    document.getElementById('cmp-save').addEventListener('click', function () {
      saveConsent({
        necessary: true,
        preferences: document.getElementById('cmp-pref').checked,
        analytics: document.getElementById('cmp-analytics').checked,
        marketing: document.getElementById('cmp-marketing').checked
      }, 'save_preferences');
    });

    document.getElementById('cmp-cancel').addEventListener('click', function () {
      hideModal();
      var existing = loadConsent();
      if (!existing) showBanner();
    });

    // Close on overlay click
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        hideModal();
        var existing = loadConsent();
        if (!existing) showBanner();
      }
    });
  }

  function showBanner() {
    if (bannerEl) bannerEl.style.display = '';
  }

  function hideBanner() {
    if (bannerEl) bannerEl.style.display = 'none';
  }

  function showModal() {
    if (!modalOverlayEl) return;
    // Pre-fill toggles from existing consent
    var existing = loadConsent();
    if (existing && existing.choices) {
      var pref = document.getElementById('cmp-pref');
      var analytics = document.getElementById('cmp-analytics');
      var marketing = document.getElementById('cmp-marketing');
      if (pref) pref.checked = !!existing.choices.preferences;
      if (analytics) analytics.checked = !!existing.choices.analytics;
      if (marketing) marketing.checked = !!existing.choices.marketing;
    }
    modalOverlayEl.style.display = '';
  }

  function hideModal() {
    if (modalOverlayEl) modalOverlayEl.style.display = 'none';
  }

  // --- Public API ---
  window.CMP = {
    openSettings: function () {
      hideBanner();
      showModal();
    },
    getConsent: function () {
      return loadConsent();
    }
  };

  // --- Init ---
  function init() {
    createBanner();
    createModal();

    var existing = loadConsent();
    if (existing && existing.choices) {
      hideBanner();
      applyConsent(existing.choices);
    } else {
      showBanner();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
