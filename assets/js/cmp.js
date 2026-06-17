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
      body: 'We use cookies that are strictly necessary for the site to function. With your consent, we also use additional cookies that enable our AI chat assistant and remember your preferences. You can accept all, reject non-essential, or customise your choices.',
      acceptAll: 'Accept All',
      rejectNonEssential: 'Reject Non-Essential',
      settings: 'Settings',
      modalTitle: 'Cookie Settings',
      necessary: 'Strictly Necessary',
      necessaryDesc: 'Required for the site to function — session management, security, cookie consent state. Always on.',
      preferences: 'Preferences',
      preferencesDesc: 'Enables our AI chat assistant (Botpress) so you can ask questions about insurance. Conversations may be recorded for quality and training. Stores your language and display choices.',
      save: 'Save Preferences',
      cancel: 'Cancel',
      alwaysOn: 'Always on',
      bannerFooter: 'Learn more in our <a href="privacy-policy.html">Privacy Policy</a> and <a href="cookie-policy.html">Cookie Policy</a>.',
      chatbotBody: 'Before we start: this is an AI assistant and conversations may be recorded to improve our service. Please don\'t share sensitive personal, medical or financial details. See our <a href="privacy-policy.html">Privacy Policy</a> & <a href="terms.html">Terms</a>.',
      chatbotAccept: 'Accept & Continue'
    },
    el: {
      title: 'Ρυθμίσεις Cookies',
      body: 'Χρησιμοποιούμε cookies που είναι απαραίτητα για τη λειτουργία του site. Με τη συγκατάθεσή σας, χρησιμοποιούμε επίσης πρόσθετα cookies που ενεργοποιούν τον ψηφιακό μας βοηθό και θυμούνται τις προτιμήσεις σας. Μπορείτε να αποδεχτείτε όλα, να απορρίψετε τα μη απαραίτητα, ή να προσαρμόσετε τις επιλογές σας.',
      acceptAll: 'Αποδοχή Όλων',
      rejectNonEssential: 'Απόρριψη Μη Απαραίτητων',
      settings: 'Ρυθμίσεις',
      modalTitle: 'Ρυθμίσεις Cookies',
      necessary: 'Απαραίτητα',
      necessaryDesc: 'Απαραίτητα για τη λειτουργία του site — διαχείριση συνεδρίας, ασφάλεια, αποθήκευση επιλογών cookie. Πάντα ενεργά.',
      preferences: 'Προτιμήσεις',
      preferencesDesc: 'Ενεργοποιεί τον ψηφιακό μας βοηθό συνομιλίας (Botpress) για ερωτήσεις σχετικά με ασφάλειες. Οι συνομιλίες ενδέχεται να καταγράφονται για ποιότητα και εκπαίδευση. Αποθηκεύει τις επιλογές γλώσσας και εμφάνισης.',
      save: 'Αποθήκευση',
      cancel: 'Άκυρο',
      alwaysOn: 'Πάντα ενεργά',
      bannerFooter: 'Μάθετε περισσότερα στην <a href="privacy-policy.html">Πολιτική Απορρήτου</a> και την <a href="cookie-policy.html">Πολιτική Cookies</a> μας.',
      chatbotBody: 'Πριν ξεκινήσουμε: αυτός είναι ψηφιακός βοηθός AI και οι συνομιλίες ενδέχεται να καταγράφονται για βελτίωση της υπηρεσίας μας. Παρακαλούμε μην μοιράζεστε ευαίσθητα προσωπικά, ιατρικά ή οικονομικά στοιχεία. Δείτε την <a href="privacy-policy.html">Πολιτική Απορρήτου</a> & τους <a href="terms.html">Όρους</a>.',
      chatbotAccept: 'Αποδοχή & Συνέχεια'
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
    var previousChoices = existing ? existing.choices : null;
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

    // Only reload when an existing consent is being modified (not on first consent)
    var hasExistingConsent = previousChoices !== null;
    var preferencesChanged = hasExistingConsent && (
      previousChoices.necessary !== choices.necessary ||
      previousChoices.preferences !== choices.preferences ||
      previousChoices.analytics !== choices.analytics ||
      previousChoices.marketing !== choices.marketing
    );
    if (preferencesChanged) {
      setTimeout(function () { window.location.reload(); }, 1500);
    }
  }

  function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      var v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  var botpressLoaded = false;

  function loadBotpress() {
    if (botpressLoaded) return;
    botpressLoaded = true;
    var s1 = document.createElement('script');
    s1.src = 'https://cdn.botpress.cloud/webchat/v3.2/inject.js';
    s1.onload = function () {
      var s2 = document.createElement('script');
      s2.src = 'https://files.bpcontent.cloud/2025/08/31/06/20250831060030-72DVBA9B.js';
      document.body.appendChild(s2);
    };
    document.body.appendChild(s1);
    var attempts = 0;
    var poll = setInterval(function () {
      if (window.botpress && window.botpress.on) {
        clearInterval(poll);
        try {
          window.dispatchEvent(new CustomEvent('cmp:botpress-ready'));
        } catch (e) { }
      } else if (++attempts > 50) {
        clearInterval(poll);
        try {
          window.dispatchEvent(new CustomEvent('cmp:botpress-failed'));
        } catch (e) { }
      }
    }, 200);
  }

  function applyConsent(choices) {
    if (choices.preferences) { checkChatbotConsent(); }
    // Analytics gating - ready for future GA/analytics integration
    window.__eac_analytics_allowed = !!choices.analytics;
    if (choices.analytics) {
      try { window.dispatchEvent(new CustomEvent('cmp:analytics-ready')); } catch(e) {}
    }
  }

  // --- Chatbot Consent Card (compact, anchored to bottom corner) ---
  var chatbotLauncherEl = null;
  var chatbotCardEl = null;

  function checkChatbotConsent() {
    var status = sessionStorage.getItem('chatbot_consent');
    if (status === 'accepted') { loadBotpress(); return; }
    if (status === 'declined') { return; }
    showChatbotLauncher();
  }

  function createChatbotLauncher() {
    var btn = document.createElement('button');
    btn.className = 'chatbot-consent-launcher';
    btn.id = 'chatbot-consent-launcher';
    btn.setAttribute('aria-label', t().chatbotAccept);
    btn.innerHTML = '<i class="bi bi-chat-dots-fill"></i>';
    btn.addEventListener('click', function () { showChatbotCard(); });
    document.body.appendChild(btn);
    chatbotLauncherEl = btn;
  }

  function createChatbotCard() {
    var lang = t();
    var card = document.createElement('div');
    card.className = 'chatbot-consent-card';
    card.id = 'chatbot-consent-card';
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-label', 'Chat consent');
    card.style.display = 'none';
    card.innerHTML =
      '<button class="chatbot-card-close" aria-label="Close"><i class="bi bi-x"></i></button>' +
      '<p>' + lang.chatbotBody + '</p>' +
      '<button class="chatbot-card-accept" id="chatbot-card-accept">' + lang.chatbotAccept + '</button>';
    document.body.appendChild(card);
    chatbotCardEl = card;

    document.getElementById('chatbot-card-accept').addEventListener('click', function () {
      sessionStorage.setItem('chatbot_consent', 'accepted');
      if (CONSENT_LOG_URL) {
        try {
          fetch(CONSENT_LOG_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              consent_id: generateId(),
              timestamp_utc: new Date().toISOString(),
              site: 'eac-insurance',
              locale: isEL() ? 'el' : 'en',
              consent_type: 'chatbot',
              action: 'accepted',
              page_path: window.location.pathname
            })
          }).catch(function () {
            localStorage.setItem('chatbot_consent_timestamp', new Date().toISOString());
          });
        } catch (e) {
          localStorage.setItem('chatbot_consent_timestamp', new Date().toISOString());
        }
      }
      hideChatbotCard();
      hideChatbotLauncher();
      loadBotpress();
    });

    card.querySelector('.chatbot-card-close').addEventListener('click', function () {
      hideChatbotCard();
    });

    document.addEventListener('click', function (e) {
      if (chatbotCardEl && chatbotCardEl.style.display !== 'none' &&
          !chatbotCardEl.contains(e.target) &&
          chatbotLauncherEl && !chatbotLauncherEl.contains(e.target)) {
        hideChatbotCard();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && chatbotCardEl && chatbotCardEl.style.display !== 'none') {
        hideChatbotCard();
      }
    });
  }

  function showChatbotLauncher() {
    if (!chatbotLauncherEl) createChatbotLauncher();
    chatbotLauncherEl.style.display = '';
  }

  function hideChatbotLauncher() {
    if (chatbotLauncherEl) chatbotLauncherEl.style.display = 'none';
  }

  function showChatbotCard() {
    if (!chatbotCardEl) createChatbotCard();
    chatbotCardEl.style.display = '';
  }

  function hideChatbotCard() {
    if (chatbotCardEl) chatbotCardEl.style.display = 'none';
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
        '<p class="cmp-banner-footer">' + lang.bannerFooter + '</p>' +
      '</div>';
    document.body.appendChild(div);
    bannerEl = div;

    document.getElementById('cmp-accept-all').addEventListener('click', function () {
      saveConsent({ necessary: true, preferences: true, analytics: false, marketing: false }, 'accept_all');
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
        analytics: false,
        marketing: false
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
      if (pref) pref.checked = !!existing.choices.preferences;
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
    if (existing && existing.choices && existing.policy_version === POLICY_VERSION) {
      hideBanner();
      applyConsent(existing.choices);
    } else {
      if (existing && existing.policy_version !== POLICY_VERSION) {
        localStorage.removeItem(STORAGE_KEY);
      }
      showBanner();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
