# EVIDENCE.md — Phase 1 Compliance Pass

## Issue 3 — Add OCPDP complaint right to privacy policy

**Files changed:** privacy-policy.html, EL/privacy-policy.html
**Commit:** d43c8e3

**Legal basis:**
- GDPR Article 13(2)(d): controller must inform the data subject of the right to lodge a complaint with a supervisory authority
- GDPR Article 77: right to lodge a complaint with a supervisory authority
- Cyprus supervisory authority: Office of the Commissioner for Personal Data Protection (OCPDP), Iasonos 1, 1082 Nicosia

**Verification performed:**
1. `grep -n "lodge a complaint\|υποβολής καταγγελίας" privacy-policy.html EL/privacy-policy.html`
2. Count of `<li>` elements in Section 6 of both files
3. `git diff` of both files

**Verification result:**
```
$ grep -n "lodge a complaint\|υποβολής καταγγελίας" privacy-policy.html EL/privacy-policy.html
EL/privacy-policy.html:128:          <li><strong>Δικαίωμα υποβολής καταγγελίας:</strong> ...
privacy-policy.html:133:          <li><strong>Right to lodge a complaint:</strong> ...

$ Section 6 <li> count:
EN: 8 (was 7)
EL: 8 (was 7)

$ git diff shows exactly 1 line added per file, both after "withdraw consent" / "Ανάκληση συγκατάθεσης", before closing </ul>.
```

**Side effects checked:**
- Section 7 (Cookies) heading and content unchanged in both files — confirmed via diff
- No other sections reference the rights list
- Existing `<li>` CSS styling applies to new bullet — no visual breakage expected
- Footer, nav, and other page sections untouched — confirmed via diff showing only 1 insertion per file

## Issue 4 — Name sub-processors (Section 4) + add ip_country disclosure (Section 1)

**Files changed:** privacy-policy.html, EL/privacy-policy.html
**Commit:** 1b6220a

**Legal basis:**
- GDPR Article 13(1)(e): controller must disclose the recipients or categories of recipients of personal data
- GDPR Article 13(1)(a)–(c): controller must disclose what data is collected and for what purposes
- GDPR Articles 44–49: international transfer safeguards (EU-US DPF, adequacy decisions, SCCs) — each sub-processor entry states the applicable mechanism

**Pre-implementation verification:**
- consent-worker/worker.js line 42: `ip_country: request.cf?.country || 'unknown'` — confirmed only 2-letter country code is stored, full IP is never extracted or persisted. This validates the Section 1 bullet stating "Your full IP address is not stored."

**Verification performed:**
1. `grep -n "Formspree\|Botpress\|Make (Celonis\|Microsoft Corporation\|Google LLC\|Cloudflare Inc\|GitHub Pages" privacy-policy.html` — EN sub-processors present
2. `grep -n "Formspree\|Botpress\|Make (Celonis\|Microsoft (Outlook\|Google (Workspace\|Cloudflare\|GitHub" EL/privacy-policy.html` — EL sub-processors present
3. `grep -n "IT and hosting providers\|Πάροχοι IT" privacy-policy.html EL/privacy-policy.html` — exit code 1, no matches (vague wording removed)
4. `grep -n "Country of access\|Χώρα πρόσβασης" privacy-policy.html EL/privacy-policy.html` — ip_country bullet present in both

**Verification result:**
```
=== 1. EN Section 4: named sub-processors ===
privacy-policy.html:111: Hosting (GitHub Pages, Microsoft Corporation, USA)
privacy-policy.html:112: Formspree (Formspree Inc., USA)
privacy-policy.html:113: Microsoft Corporation (Outlook, USA)
privacy-policy.html:114: Botpress Technologies Inc. (Canada)
privacy-policy.html:115: Make (Celonis SE / Make.com)
privacy-policy.html:116: Google LLC (Google Workspace / Sheets, USA)
privacy-policy.html:117: Cloudflare Inc. (USA)

=== 2. EL Section 4: Greek equivalents ===
EL/privacy-policy.html:109: Formspree (ΗΠΑ)
EL/privacy-policy.html:110: Microsoft (Outlook, ΗΠΑ/ΕΕ)
EL/privacy-policy.html:111: Botpress (Καναδάς)
EL/privacy-policy.html:112: Make (Celonis, ΕΕ/ΗΠΑ)
EL/privacy-policy.html:113: Google (Workspace / Sheets, ΗΠΑ)
EL/privacy-policy.html:114: Cloudflare (ΗΠΑ)
EL/privacy-policy.html:115: GitHub (ΗΠΑ)

=== 3. Vague wording GONE ===
grep exit code 1 — "IT and hosting providers" / "Πάροχοι IT" not found in either file.

=== 4. ip_country bullet in Section 1 ===
privacy-policy.html:87: Country of access (from IP address)
EL/privacy-policy.html:85: Χώρα πρόσβασης (από τη διεύθυνση IP)
```

**Side effects checked:**
- Section 5 (Data Retention) unchanged in both files — confirmed via diff
- "We do not sell your personal data to third parties" paragraph preserved in EN (line 120)
- Section 1 "Important" / "Σημείωση" warning paragraphs unchanged — confirmed via diff
- Footer, nav, and other page sections untouched — diff shows changes only in Section 1 and Section 4 regions

**Observation for reviewer (resolved):**
- EN/EL mismatch was flagged: EL Section 4 had 7 bullets, EN had 8 + closing paragraph.
- Marinos confirmed this was an error and provided verbatim Greek for both missing elements.
- Fixed in follow-up commit 2f28ff5 (not amending 1b6220a — history preserved).

## Issue 4 (follow-up) — Add missing EL insurance companies bullet + "We do not sell" paragraph

**Files changed:** EL/privacy-policy.html
**Commit:** 2f28ff5

**What was added:**
- `<li>` for Ασφαλιστικές εταιρείες (line 116) — last bullet before `</ul>`
- `<p>Δεν πωλούμε τα προσωπικά σας δεδομένα σε τρίτους.</p>` (line 118) — after `</ul>`

**Verification performed:**
1. `git diff EL/privacy-policy.html` — exactly 2 insertions, no other changes
2. Section 4 `<li>` count — now 8 (matching EN)
3. `grep -n "Δεν πωλούμε" EL/privacy-policy.html` — line 118
4. `grep -n "υποβάλει απαίτηση" EL/privacy-policy.html` — line 116

**Verification result:**
```
$ git diff shows +2 lines only:
+          <li><strong>Ασφαλιστικές εταιρείες:</strong> Όταν έχετε ζητήσει προσφορά ή έχετε υποβάλει απαίτηση...
+        <p>Δεν πωλούμε τα προσωπικά σας δεδομένα σε τρίτους.</p>

Section 4 <li> count: 8 (matches EN)
grep Δεν πωλούμε: line 118 ✓
grep υποβάλει απαίτηση: line 116 ✓
```

**Side effects checked:**
- Section 5 (Διατήρηση) heading unchanged — confirmed via diff
- No other files touched

## Issue 10 — prefers-reduced-motion handling for index.html redirect

**Files changed:** index.html
**Commit:** 45b1d4a

**Legal / accessibility basis:**
- WCAG 2.2 Success Criterion 2.2.1 (Timing Adjustable, Level A): users must be able to turn off, adjust, or extend time limits
- WCAG 2.2 Success Criterion 2.3.3 (Animation from Interactions, Level AAA): motion animation triggered by interaction can be disabled
- `prefers-reduced-motion` is the OS-level mechanism users set to communicate this preference

**What was added:**
1. JS (line 345): `if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { window.location.href = 'main.html'; }` — fires at top of `<script>` block, before any setTimeout, using same exit path as existing Escape-key handler
2. CSS (lines 300–306): `@media (prefers-reduced-motion: reduce)` block setting `animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important;` on all elements — neutralizes all 7 `@keyframes` animations (floatUp, spin, spinReverse, fadeInDown, fadeInUp, zoomIn, progressFill)

**Design choice:** `animation-duration: 0.01ms` rather than `animation: none` because several elements use `animation-fill-mode: both` and depend on reaching their end-state (opacity: 1) to be visible. The near-zero duration lets animations complete instantly to their final state.

**Verification performed:**
1. `grep -n "prefers-reduced-motion" index.html` — should return 2 hits (CSS line 300, JS line 345)
2. `grep -n "Escape" index.html` — Escape handler still at line 405
3. `grep -n "4500" index.html` — original 4.5s timeout still at line 403
4. `git diff index.html` — only 2 insertion blocks, no other changes

**Verification result:**
```
$ grep -n "prefers-reduced-motion" index.html
300:        @media (prefers-reduced-motion: reduce) {
345:        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {

$ grep -n "Escape" index.html
405:        // Skip with Escape key
407:            if (e.key === 'Escape') {

$ grep -n "4500" index.html
403:        }, 4500);

$ git diff: +12 lines in 2 blocks (CSS block at line 300, JS check at line 345). No deletions. No other changes.
```

**Browser testing (manual, to be confirmed by Marinos):**
- [ ] DevTools → Rendering → prefers-reduced-motion: reduce → reload index.html → instant redirect to main.html
- [ ] Switch to "no preference" → reload → 4.5s animation then redirect
- [ ] Escape key works in both modes

**Side effects checked:**
- Escape-key handler unchanged (line 405–409) — confirmed via grep
- Original 4.5s setTimeout unchanged (line 397–403) — confirmed via grep
- No other files touched — diff shows only index.html

---

# EVIDENCE.md — Phase 1.5 Compliance Pass (Issues 1 & 2)

## Issue 2 — Reclassify bp:* cookies from Strictly Necessary to Preferences

**Files changed:** cookie-policy.html, EL/cookie-policy.html
**Commit:** c499161

**Legal basis:**
- EDPB Guidelines 5/2020 §32–39: "strictly necessary" is limited to cookies essential for the service explicitly requested by the user
- A chatbot widget is not strictly necessary for an insurance information site
- CMP category alignment: `applyConsent()` gates Botpress on `choices.preferences`, so cookie-policy table must classify bp:* under "Preferences"

**Verification performed:**
1. `grep -A5 "bp:\*" cookie-policy.html` — classification cell says "Preferences"
2. `grep -A5 "bp:\*" EL/cookie-policy.html` — classification cell says "Προτιμήσεις"
3. `grep -n "Strictly Necessary\|Απαραίτητα" cookie-policy.html EL/cookie-policy.html` — only cmp_consent row, not bp:*

**Side effects checked:**
- cmp_consent row still "Strictly Necessary" / "Απαραίτητα" — unchanged
- No other cookie table rows affected

## Issue 1 Part A — Gate Botpress loading behind CMP preferences consent

**Files changed:** assets/js/cmp.js
**Commit:** e024005

**Legal basis:**
- Cyprus ePrivacy Law 112(I)/2004 §99(5): non-essential cookies require prior informed consent
- Botpress sets bp:* cookies for chatbot state — classified as "Preferences" (Issue 2)
- `applyConsent(choices)` now calls `loadBotpress()` only when `choices.preferences` is true

**What was added:**
- `botpressLoaded` idempotency flag (prevents double injection on consent toggle)
- `loadBotpress()` function — dynamically creates and injects both Botpress script elements
- `applyConsent()` updated to call `loadBotpress()` when `choices.preferences` is true

**Verification performed:**
1. `grep -n "botpressLoaded\|loadBotpress" assets/js/cmp.js` — 4 hits (declaration, function def, flag set, call)
2. `grep -n "choices.preferences" assets/js/cmp.js` — 1 hit in applyConsent

## Issue 1 Part B — Remove Botpress script tags from all HTML pages

**Files changed:** 18 HTML files (9 root + 9 EL)
**Commit:** a78eee0

**What was removed:**
- 36 `<script>` tags (2 per file × 18 files) loading inject.js and config script
- 10 `<!-- Botpress Scripts -->` comments (all 5 EN + all 5 EL service pages)

**Verification performed:**
1. `grep -rn "cdn.botpress.cloud\|bpcontent.cloud" *.html EL/*.html` — 0 hits
2. `grep -rn "Botpress Scripts" *.html EL/*.html` — 0 hits
3. `grep -rn "window.botpress" *.html EL/*.html` — hits only in inline UI handlers (10 service pages)
4. `git diff --stat` — 18 files changed

**What was preserved:**
- All inline `window.botpress` interaction handlers in 10 service pages — these are UI handlers that degrade gracefully when Botpress is absent

## Part 4 — Fix timing race between consent-gated Botpress load and inline UI handlers

**Files changed:** assets/js/cmp.js, 10 service page HTML files, EL/business.html
**Commit:** 9a85510

**Root cause:** After Parts A–B, Botpress loads dynamically on consent. Inline handlers were written for synchronous loading — `webchat:opened`/`webchat:closed` listeners never registered (guarded by `if (window.botpress)` at DOMContentLoaded time), and a 4-second timeout fired from page load time, not consent time.

**Fix applied:**
1. cmp.js: added 200ms polling loop in `loadBotpress()` that fires `cmp:botpress-ready` when `window.botpress.on` is available, or `cmp:botpress-failed` after 50 attempts (10s)
2. 10 service pages: replaced entire Chat Bubble Script blocks with `cmp:botpress-ready`/`cmp:botpress-failed` event listeners. Listener-before-check ordering prevents event loss on cached loads.
3. EL/business.html: removed redundant `<head>` timeout block (lines 43–52)

**Design decisions:**
- `{ once: true }` on event listeners — auto-removes after firing
- `onBotpressAvailable()` is idempotent — safe if called twice (listener + synchronous check)
- Variant A (EN): no sessionStorage. Variant B (EL): sessionStorage persistence for `hasOpenedChat`
- EL/home.html and EL/business.html: 4-space indentation preserved (all others 2-space)

## Part 4b — Remove webchat:ready dependency to fix accept-then-show race

**Files changed:** 10 service page HTML files
**Commit:** d55c3e3

**Root cause:** `onBotpressAvailable` registered a `webchat:ready` listener, but `webchat:ready` signals the same precondition our poll already confirmed (`window.botpress.on` exists). On first consent, Botpress fires `webchat:ready` before our poll detects `.on` and dispatches `cmp:botpress-ready` — by the time the listener is attached, the event has already fired.

**Fix applied:** Moved `webchat:ready` callback body directly into `onBotpressAvailable`. Bubble creation and display now execute immediately when `cmp:botpress-ready` fires. `webchat:opened`/`webchat:closed` listeners unchanged.

**Additional fix:** Added `if (window.botpress)` guard to Variant B click handlers for defensive consistency with Variant A.

## Part 4c — Chain Botpress scripts to fix race between inject and init

**Files changed:** assets/js/cmp.js
**Commit:** 88ee9ae

**Root cause:** `loadBotpress()` appended both scripts with `defer = true`, but `defer` is ignored for dynamically-created scripts (HTML spec §4.12.1). Browser default for dynamic scripts is `async = true` — each executes as soon as it downloads. The config script (~1KB, just `window.botpress.init({...})`) consistently downloaded before inject.js (~hundreds of KB React bundle), calling `window.botpress.init()` before `window.botpress` existed — silent TypeError.

**Verification of `defer` removal safety:**
- inject.js contains zero `DOMContentLoaded` listeners and zero `document.readyState` checks — confirmed via `grep` on fetched source
- inject.js is a React IIFE that renders into a self-created container
- `loadBotpress()` only runs post-DOMContentLoaded (either from `applyConsent()` during `init()`, or from button click)

**Fix applied:** Chain s2 inside `s1.onload` so config script only appends after inject.js has fully loaded and set up `window.botpress`. Removed `defer` from both (no effect on dynamic scripts).

## Browser verification — Phase 1.5 (all tests passed)

**Test environment:** Fresh incognito windows, Chrome DevTools Network tab

| # | Test | Result |
|---|------|--------|
| 1 | Fresh incognito → Accept All → Botpress icon appears within 1-2s (5 consecutive runs on different pages) | PASS 5/5 |
| 2 | Click icon → chat opens → "Here to assist" label vanishes | PASS |
| 3 | Close chat → label does NOT reappear | PASS |
| 4 | Refresh page (consent saved) → icon appears → click → same behavior | PASS |
| 5 | Repeat on motor.html, EL/main.html → consistent | PASS |
| 6 | Fresh incognito → Reject Non-Essential → zero botpress network requests, no bubble | PASS |
| 7 | Returning visitor (stored consent) → navigate to new page → Botpress loads via init() | PASS |
| 8 | EL pages → Greek label "Εδώ για να σας βοηθήσω!" → click → vanishes → sessionStorage persists across pages | PASS |
| 9 | Consent revoke → navigate → no Botpress. Re-grant → Botpress loads on current page | PASS |
| 10 | Block `*.botpress.cloud` AND `*.bpcontent.cloud` → Accept All → wait 12s → `chat-unavailable` on `<body>`, no console errors | PASS |
| 11 | `?disableBot=1` → no bubble despite Botpress loading | PASS |
| 12 | Cookie policy table → bp:* classified as "Preferences" / "Προτιμήσεις" | PASS |

## Partial failure mode — documented behavior (not a launch blocker)

**Scenario:** `*.bpcontent.cloud` blocked but `cdn.botpress.cloud` reachable.

**Observed behavior:** inject.js loads and sets up `window.botpress.on`. `s1.onload` fires and tries to append config script — fetch fails silently. `window.botpress.init()` is never called, so Botpress's own widget never renders. Our poll detects `window.botpress.on` → fires `cmp:botpress-ready` → our custom bubble appears, but clicking it opens an uninitialized Botpress frame (no bot name, no greeting, no styling).

**Assessment:** Both CDNs (`cdn.botpress.cloud` and `files.bpcontent.cloud`) are Botpress infrastructure and are typically reachable together. A split failure (one reachable, one blocked) is unlikely in practice. Not a launch blocker — documenting for completeness.

## Integration check — Phase 1.5

**Performed after all 6 commits (c499161 through 88ee9ae):**
1. `grep -rn "botpress\|bpcontent" --include="*.html" . | grep '<script src='` — 0 hits (all script tags removed)
2. `grep -rn "setupBotListener\|createChatBubble\|webchat:ready" .` — 0 hits (old functions/events fully removed)
3. `grep -rn "TODO\|FIXME\|XXX" assets/js/cmp.js cookie-policy.html EL/cookie-policy.html` — 0 hits
4. Remaining botpress text references only in privacy-policy.html (sub-processor list) and cookie-policy.html (cookie table) — correct
5. Cookie Settings footer link (`window.CMP.openSettings()`) verified present and functional
6. `git log --oneline -10` — 10 clean compliance commits, no amends

---

# EVIDENCE.md — Phase 3 Dashboard Audit (Issues 7 & 8)

All dashboard work was completed on 2026-05-23. Two findings required privacy policy edits (commit b9b59a1). The remaining findings are dashboard-only changes documented here for the compliance record.

## Section 1 — Welcome message AI disclosure

**Finding:** Bot's first message did not disclose AI identity.
**Change (Botpress dashboard):** Welcome message updated to disclose AI identity.
- EN: "Good morning! I'm Andros's AI assistant for E.A.C. Insurance. I can answer general insurance questions, and for anything more complex Andros himself will follow up. How can I help you today?"
- EL mirror added with equivalent Greek text.

**Legal basis:** EU AI Act Article 50 — AI systems that interact with natural persons must be designed and developed so that the natural person is informed that they are interacting with an AI system.

**Verification:** Tested in Botpress emulator — first message displays AI disclosure in both EN and EL.

## Section 2 — Header rebranding

**Finding:** Bot name "E.A.C Insurance Assistant" did not indicate AI nature.
**Change (Botpress dashboard):**
- Bot name: "E.A.C Insurance Assistant" → "E.A.C AI Assistant"
- EN description: "AI assistant for E.A.C. Insurance. Available 24/7. A human advisor follows up for quotes and claims."
- EL description: "AI βοηθός για την E.A.C. Insurance. Διαθέσιμος 24/7. Για προσφορές και απαιτήσεις θα επικοινωνήσει μαζί σας ένας ασφαλιστής."

**Legal basis:** EU AI Act Article 50 — the AI nature must be apparent to users from the interface itself.

**Verification:** Header visible in Botpress webchat widget — confirmed updated name and description.

## Section 3 — Talk-to-human path

**Finding:** No dedicated escalation flow node in the Botpress bot. Bot uses a text-based fallback: always mentions Andros's phone number and asks if the user wants a callback.

**Assessment:** Acceptable per GDPR — there is no legal requirement for a specific escalation UX, only that data subjects can contact a human controller. The bot provides the phone number and offers to arrange contact. Flagged as a Phase 4 enhancement opportunity (adding a dedicated escalation flow node for better UX).

**No repo change required.**

## Section 4 — Consent before personal data collection

**Finding:** Three prompt sections in the Botpress bot collect personal data (name, phone, email) without disclosing how it will be used.
**Change (Botpress dashboard):** Disclosure appended to Rule 1, Rule 2, and Appointment Requests sections in both EN and EL:
- EN: "By sharing your details you agree we may contact you back. See our Privacy Policy on our website."
- EL: "Δίνοντας τα στοιχεία σας συμφωνείτε να επικοινωνήσουμε μαζί σας. Δείτε την Πολιτική Απορρήτου στον ιστότοπό μας."

**Legal basis:** GDPR Article 13 — information to be provided where personal data are collected from the data subject.

**Verification:** Tested in Botpress emulator — disclosure text appears before each data collection prompt.

**No repo change required.**

## Section 5 — LLM provider identified (OpenAI)

**Finding:** Botpress uses OpenAI as its AI provider via built-in integration (not a direct API key). OpenAI processes conversation content to generate responses. This constitutes a sub-processor relationship that must be disclosed under GDPR Article 13(1)(e).

**Change (repo — privacy-policy.html + EL/privacy-policy.html):** Added OpenAI bullet to Section 4 "Who Receives Your Data" in both EN and EL, positioned after the Botpress bullet and before the Make bullet to keep chatbot-stack sub-processors grouped in data-flow order.

**Commit:** b9b59a1

**Legal basis:**
- GDPR Article 13(1)(e): controller must disclose the recipients or categories of recipients of personal data
- GDPR Articles 44–49: EU-US Data Privacy Framework applies to OpenAI (OpenAI L.L.C., USA)

**Verification performed:**
```
$ grep -n "OpenAI" privacy-policy.html EL/privacy-policy.html
privacy-policy.html:115: OpenAI (OpenAI L.L.C., USA)
EL/privacy-policy.html:112: OpenAI (OpenAI L.L.C., ΗΠΑ)

$ sed -n '/<h2>4\./,/<h2>5\./p' privacy-policy.html | grep -c "<li>"
9

$ sed -n '/<h2>4\./,/<h2>5\./p' EL/privacy-policy.html | grep -c "<li>"
9

Chatbot-stack grouping confirmed: Botpress (114/111) → OpenAI (115/112) → Make (116/113)
```

**Side effects checked:**
- "We do not sell" paragraph unchanged in both files
- Section 5 heading shifted down by 1 line, content unchanged

## Section 6 — Retention periods identified

**Finding:** Privacy policy Section 5 "Data Retention" had no mention of chatbot conversation data retention. Actual retention:
- **Botpress:** 90 days for conversations/messages (automatic deletion), 30 days for logs, files indefinite
- **Google Sheet:** Indefinite by default — committed to 24-month review/purge cycle during Phase 3
- **GDPR erasure:** Requires Botpress API calls; no dashboard UI exists for individual conversation deletion

**Change (repo — privacy-policy.html + EL/privacy-policy.html):** Added two bullets to Section 5 in both EN and EL:
1. Chatbot conversations: 90-day Botpress retention with erasure-on-request path
2. Chatbot lead summaries: 24-month Google Sheet retention

**Commit:** b9b59a1

**Legal basis:**
- GDPR Article 13(2)(a): controller must inform data subject of data retention periods or criteria
- GDPR Article 5(1)(e): storage limitation principle

**Verification performed:**
```
$ grep -n "90 days\|90 ημέρες" privacy-policy.html EL/privacy-policy.html
privacy-policy.html:129: Botpress retains conversation logs for 90 days
EL/privacy-policy.html:126: Η Botpress διατηρεί τα αρχεία συνομιλιών για 90 ημέρες

$ sed -n '/<h2>5\./,/<h2>6\./p' privacy-policy.html | grep -c "<li>"
5

$ sed -n '/<h2>5\./,/<h2>6\./p' EL/privacy-policy.html | grep -c "<li>"
5
```

**Side effects checked:**
- Existing retention bullets (requests/quotes, claims, marketing) unchanged
- Section 6 heading shifted down by 2 lines, content unchanged

## Section 7 — System prompt review

**Changes (Botpress dashboard):**
- Added `convo_ended` logic: instructs LLM to set `workflow.convo_ended = true` when user signals end-of-conversation, enabling the `Save_to_googleSheet` node to fire.
- Marketing-claim phrases identified in system prompt ("Free risk analysis," "Best market prices," "Same-day coverage available") — could fall under Cyprus Insurance Distribution Law misleading-statements rules. Flagged for Phase 4 review; no change made in Phase 3.

**Pre-existing bug discovered during Phase 3 testing:** The `convo_ended` workflow variable was never being set prior to Phase 3, meaning the `Save_to_googleSheet` node never fired. Chatbot lead data was likely not being captured to the Google Sheet prior to this discovery. Bug fixed in Botpress dashboard during Phase 3. Andros should be informed at handover so he can assess any impact from leads not captured before this fix.

**No repo change required.**

## Section 8 — Webhook hardening

**Changes (Make dashboard + Botpress dashboard):**
- **Shared-secret authentication:** Added between Botpress and Make. The secret is a 32-character random alphanumeric string, stored in the user's password manager. Make scenario filter "Verify secret" rejects any webhook call without a matching secret header.
- **Data minimization:** Removed `convoTranscript` from the webhook payload. Only `convoSummary` is sent (sufficient for follow-up; full transcript is unnecessary and increases data exposure).
- **`language` field:** Attempted but deferred — `workflow.language` variable does not exist in the current Botpress setup. Language can be inferred from `convoSummary` text. Not a compliance blocker.
- **Make region confirmed:** `hook.eu2.make.com` — EU jurisdiction. No cross-border transfer concern for the automation layer itself.
- **End-to-end test (2026-05-23):** Emulator conversation → webhook fires → "Verify secret" filter passes → Google Sheet receives new row with expected fields. Confirmed working.

**No repo change required.**

## Known Botpress platform issue (informational)

**Issue:** Botpress emulator displays "Error Occurred" red banners after each AI iteration with the error: `agi/improvement:trackIterations: data/iterations/0/iteration/status must be equal to one of the allowed values`

**Assessment:** This is Botpress's internal telemetry/improvement tracking, not bot functionality. Does not affect production behavior or user-facing responses. No repo fix possible — this is a Botpress platform bug. Monitor for resolution from Botpress upstream.

## Integration check — Phase 3

**Performed after commit b9b59a1:**
```
$ grep -n "OpenAI" privacy-policy.html EL/privacy-policy.html
privacy-policy.html:115: ✓
EL/privacy-policy.html:112: ✓

$ Section 4 bullet count: EN=9, EL=9 (was 8)
$ Section 5 bullet count: EN=5, EL=5 (was 3)

$ grep -n "90 days\|90 ημέρες" privacy-policy.html EL/privacy-policy.html — 1 hit per file ✓
$ grep -n "24 months\|24 μήνες" privacy-policy.html EL/privacy-policy.html — 2 hits per file ✓ (existing + new)

$ git diff --stat: 2 files changed, 6 insertions(+)
```

---

# Phase 4a — Hardening Sweep (Blocks B, D, F, E-baseline)

## Block F — Documentation artefacts

### Files created

| File | Lines | Purpose |
|------|------:|---------|
| ROPA.md | ~70 | Record of Processing Activities per GDPR Article 30 |
| SUBPROCESSORS.md | ~45 | Sub-processor list with transfer mechanisms and DPA URLs/status |
| SECURITY.md | ~60 | Security posture summary with in-place controls and known gaps |
| INCIDENT-RESPONSE.md | ~75 | GDPR Article 33 breach notification runbook for Cyprus OCPDP |
| AI-LITERACY-LOG.md | ~55 | EU AI Act Article 4 compliance log |
| NOTES.md | ~90 | Deferred items and out-of-scope findings for Phase 4 remainder / Phase 5+ |

### Cross-reference verification

```
$ ls -la ROPA.md SUBPROCESSORS.md SECURITY.md INCIDENT-RESPONSE.md AI-LITERACY-LOG.md NOTES.md
All 6 files exist ✓

$ grep -c 'GitHub\|Formspree\|Microsoft\|Botpress\|OpenAI\|Make\|Google\|Cloudflare' SUBPROCESSORS.md
16 — all 8 named sub-processors from privacy-policy.html Section 4 present ✓

$ grep -c '## Processing activity' ROPA.md
4 — covers: (1) contact form, (2) chatbot/Botpress, (3) consent logging, (4) marketing ✓
Cross-check with privacy-policy.html Sections 1–2: all disclosed processing purposes covered ✓

$ grep 'commissioner@dataprotection.gov.cy' INCIDENT-RESPONSE.md
1 match — consistent with privacy-policy.html Section 6 ✓

$ grep -ri 'secret' SECURITY.md INCIDENT-RESPONSE.md AI-LITERACY-LOG.md ROPA.md SUBPROCESSORS.md | grep -iv 'shared.secret\|shared secret'
1 match: "sensitive configuration" in INCIDENT-RESPONSE.md breach example — no actual secret values ✓
Shared-secret value NOT logged anywhere ✓
```

### Content accuracy notes

- ROPA Processing activity 4 (marketing): marked TBD — confirm with Andros whether marketing communications are currently active and via what platform
- SUBPROCESSORS.md DPA status: all marked "TBD — confirm with Andros" — DPA signing status not verified
- SECURITY.md 2FA status: marked "TBD — confirm with Andros" for both Andros's and Marinos's accounts
- AI-LITERACY-LOG.md briefing date: 2026-05-23 (today, verbal walkthrough)
- All unverified facts marked TBD rather than asserted — per compliance rules

## Block D — Asset inventory (ASSETS.md)

### File created

ASSETS.md — 134 lines, 8 sections covering all repo assets.

### Asset coverage verification

```
$ wc -l ASSETS.md
134

$ grep -c 'assets/img/' ASSETS.md
58 — matches 57 image files + 1 video_poster.jpg (derived from MotionArray video) ✓

$ diff <(find assets/img/ -type f | sed 's|.*/assets/|assets/|' | sort) \
       <(grep -oP 'assets/img/[^ |]+' ASSETS.md | sort)
(no output) — every filesystem image file has a corresponding ASSETS.md entry ✓
```

### Licensing categories applied

| Category | Count | License | Attribution |
|----------|------:|---------|-------------|
| Andros-provided (photos, logos, icons) | 14 | Owned by data controller | None required |
| BootstrapMade BizLand template imagery | 34 | BootstrapMade free license | Yes — footer credit (missing, restored in Block B) |
| MotionArray video + poster | 2 | MotionArray free-tier, commercial use permitted | None required |
| Insurance stock images (source undocumented) | 8 | TBD — pending reverse-image-search | TBD |
| **Total assets/img/ entries** | **58** | | |

### Vendor library licenses

| Library | License | Flag |
|---------|---------|------|
| Bootstrap, Bootstrap Icons, AOS, GLightbox, Swiper, PureCounter, Waypoints, imagesloaded | MIT (or MIT + SIL OFL for fonts) | None |
| Isotope Layout | **GPL v3** | **Dead code — flagged for removal in NOTES.md** |
| php-email-form (validate.js) | BootstrapMade | Modified to support Formspree |

### CDN resources documented

Google Fonts (3 families, OFL/Apache 2.0), Font Awesome Free (CC BY 4.0), Google Maps Embed (Google ToS), Botpress Webchat (Botpress ToS).

## Block B — Contact form audit + BootstrapMade footer credit

### Contact form GDPR checkbox

**Status:** Present in both EN (main.html:753) and EL (EL/main.html:784) contact forms.

- `<input type="checkbox" name="gdpr-consent" required>` — HTML `required` attribute enforced
- Links to `privacy-policy.html` (EN) / `privacy-policy.html` (EL, relative to EL/)
- GDPR Article 13 disclosure satisfied: user sees link to privacy policy before submitting

**Limitation (documented, not fixed — Phase 5+):** Consent is client-side only. A user bypassing JavaScript (e.g. direct POST to `https://formspree.io/f/xlgevykp` via curl) could submit without consent. Formspree free tier has no server-side consent validation. Documented in NOTES.md under Phase 5+ improvements.

### Formspree `_gotcha` honeypot added

**Files changed:** main.html, EL/main.html

Added Formspree's recommended hidden honeypot field to both contact forms:
```html
<input type="text" name="_gotcha" tabindex="-1" autocomplete="off"
       style="position:absolute;left:-9999px;top:-9999px" aria-hidden="true">
```

- `name="_gotcha"` — Formspree silently drops submissions where this field is non-empty
- `tabindex="-1"` — not keyboard-focusable
- `aria-hidden="true"` — not announced by screen readers
- CSS positions the field off-screen to hide from visual users
- Bots auto-fill all visible fields, triggering the honeypot

**Verification:**
```
$ grep -rn '_gotcha' --include="*.html" .
main.html:722: ✓
EL/main.html:751: ✓
```

### Dead contact.php archived

**File moved:** `forms/contact.php` → `_archive/contact.php`

**Rationale:** Both EN and EL contact forms POST to `https://formspree.io/f/xlgevykp`, not to `forms/contact.php`. The PHP file contains a `mail()` handler that is never called. Archiving rather than deleting preserves it for reference.

**Verification:**
```
$ grep -rn 'formspree.io' main.html EL/main.html
main.html:718: action="https://formspree.io/f/xlgevykp" ✓
EL/main.html:747: action="https://formspree.io/f/xlgevykp" ✓

$ ls _archive/contact.php — exists ✓
$ ls forms/contact.php — does not exist ✓
```

**Remaining in forms/:** `Readme.txt`, `newsletter.php` — not in scope for this block.

### BootstrapMade footer credit restored

**License requirement:** BootstrapMade BizLand template free license requires visible "Designed by BootstrapMade" credit in the footer of all pages using the template.

**Finding:** Credit was missing from all 18 active pages (9 EN + 9 EL). The 6 unused template pages (portfolio-details, service-details, starter-page × EN + EL) already had the credit. The 2 index.html splash pages have no footer — not applicable.

**Fix applied to 18 pages:**
- 10 main/service pages (multi-line credits div): added licensing comment + "Designed by BootstrapMade." before existing TripleAI credit
- 8 legal pages (single-line credits div): same pattern

**Format (EN main pages):**
```html
        <!-- Licensing information: https://bootstrapmade.com/license/ -->
        Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>. Website by <a href="#">TripleAI Consulatants</a>
```

**Format (EL main pages):**
```html
        <!-- Licensing information: https://bootstrapmade.com/license/ -->
        Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>. Ιστοσελίδα από <a href="#">TripleAI Consulatants</a>
```

**Format (legal pages, EN and EL):**
```html
      <!-- Licensing information: https://bootstrapmade.com/license/ -->
      <div class="credits">Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>. Website by <a href="#">TripleAI Consulatants</a></div>
```

**Verification:**
```
$ grep -c 'Designed by.*BootstrapMade' --include="*.html" -r .
24 total pages (18 active + 6 template) ✓
index.html: 0 (no footer) ✓
EL/index.html: 0 (no footer) ✓

$ grep -l 'Designed by.*BootstrapMade' --include="*.html" -r . | wc -l
24 ✓
```

**Observation:** The TripleAI name is spelled "Consulatants" (typo for "Consultants") across all 18 pages. Pre-existing — not in scope for this block.
