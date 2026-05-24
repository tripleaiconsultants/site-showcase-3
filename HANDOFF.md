# HANDOFF.md — Phase 1 + Phase 1.5 + Phase 3 + Phase 4a + Phase 4 Remainder Compliance Pass Complete

## What was delivered

Phase 1 addressed three issues from the EAC-Issues-Found audit. Issue 3 added the GDPR Article 77 right to lodge a complaint with the Office of the Commissioner for Personal Data Protection of Cyprus (OCPDP) to Section 6 of both the EN and EL privacy policies (commit d43c8e3). Issue 4 replaced the vague "IT and hosting providers" wording in Section 4 with a named list of all sub-processors — Formspree, Microsoft, Botpress, Make, Google, Cloudflare, and GitHub — including the applicable international transfer mechanism for each, and added a new bullet to Section 1 disclosing that the consent worker logs visitor country (ip_country) derived from the IP address, in both EN and EL (commits 1b6220a and 2f28ff5). Issue 10 added prefers-reduced-motion support to the index.html splash page so that users who have set that OS preference skip the 4.5-second loading animation entirely and are redirected immediately to main.html, with a CSS @media block neutralising all @keyframes animations as a fallback (commit 45b1d4a).

## What is NOT done in this pass

- ~~**Issue 1 (Botpress pre-consent loading):** Resolved in Phase 1.5.~~
- ~~**Issue 2 (cookie-policy.html bp:* reclassification):** Resolved in Phase 1.5.~~
- **Issue 5 (disclosures placeholders):** Three regulatory placeholders remain unfilled in disclosures.html and EL/disclosures.html. Waiting on Andros to provide 5 values: exact licence category, Superintendent of Insurance registration number, whether E.A.C. provides advice (yes/no), HE company number, and VAT number.
- **Issue 6 (consent worker CORS wildcard):** The consent-worker/worker.js still uses `Access-Control-Allow-Origin: '*'`. Cannot be locked down until the production domain is decided and DNS is configured.
- ~~**Issue 7 (Botpress AI disclosure verification):** Resolved in Phase 3.~~
- ~~**Issue 8 (Make scenario verification):** Resolved in Phase 3.~~
- **Issue 9 (controller/processor agreement):** A one-page agreement between Marinos (processor) and Andros (controller) defining responsibilities and liability. This is a separate document, not a code change.

## Commits — Phase 1

| SHA | Message |
|-----|---------|
| d43c8e3 | compliance(issue-3): Add OCPDP complaint right to privacy policy (EN + EL) |
| 1b6220a | compliance(issue-4): Name sub-processors in Section 4 + add ip_country to Section 1 (EN + EL) |
| 2f28ff5 | compliance(issue-4): add missing EL bullet and closing para to align with EN |
| 45b1d4a | compliance(issue-10): Skip 4.5s redirect for prefers-reduced-motion users |

---

## Phase 1.5 — Botpress Consent Gating (Issues 1 & 2)

### What was delivered

Phase 1.5 made the Botpress chatbot widget fully compliant with Cyprus ePrivacy Law 112(I)/2004 §99(5) by ensuring it loads only after the user grants "Preferences" consent via the CMP. Issue 2 reclassified bp:* cookies from "Strictly Necessary" to "Preferences" in both the EN and EL cookie policy tables (commit c499161). Issue 1 Part A added a consent-gated `loadBotpress()` function to cmp.js with an idempotency flag (commit e024005). Issue 1 Part B removed all 36 Botpress `<script>` tags and 10 `<!-- Botpress Scripts -->` comments from the 18 HTML pages that previously loaded Botpress unconditionally (commit a78eee0). Three follow-up commits fixed timing races exposed by the new dynamic loading: Part 4 replaced the inline Chat Bubble Script blocks on all 10 service pages with `cmp:botpress-ready`/`cmp:botpress-failed` event listeners so Botpress UI handlers only fire when the widget API is confirmed available, and removed a redundant `<head>` timeout from EL/business.html (commit 9a85510). Part 4b removed a `webchat:ready` dependency inside the inline handlers that caused the chat bubble to appear only on refresh — on first Accept, Botpress had already fired `webchat:ready` before our listener was attached (commit d55c3e3). Part 4c chained the two dynamically-injected scripts via `s1.onload` because `defer` is ignored on dynamically-created scripts, and the tiny config script was consistently executing before the large inject.js bundle, calling `window.botpress.init()` before `window.botpress` existed (commit 88ee9ae).

### Compliance posture after Phase 1 + 1.5

Phases 1 and 1.5 together close all user-facing GDPR/ePrivacy issues that are within the repository's control. The remaining issues require external inputs or access: Issue 5 (disclosures placeholders) is waiting on Andros to provide 5 regulatory values. Issue 6 (consent worker CORS wildcard) is waiting on the production domain being decided. Issues 7 and 8 (Botpress AI disclosure and Make scenario verification) require Botpress and Make dashboard access from Andros. Issue 9 (controller/processor agreement) is a separate document workstream.

### Commits — Phase 1.5

| SHA | Message |
|-----|---------|
| c499161 | compliance(issue-2): reclassify bp:* cookies from Strictly Necessary to Preferences |
| e024005 | compliance(issue-1): gate Botpress loading behind CMP preferences consent |
| a78eee0 | compliance(issue-1): remove Botpress script tags from all HTML pages |
| 9a85510 | compliance(issue-1): fix timing race between consent-gated Botpress load and inline UI handlers |
| d55c3e3 | compliance(issue-1): remove webchat:ready dependency to fix accept-then-show race |
| 88ee9ae | compliance(issue-1): chain Botpress scripts to fix race between inject and init |

### Browser verification summary

All 12 browser tests passed, including the headline reliability test (fresh incognito → Accept All → Botpress icon appears within 1-2s) passing 5/5 on different pages. Full test matrix and results in EVIDENCE.md.

**Partial failure mode (documented, not a launch blocker):** If `*.bpcontent.cloud` is blocked but `cdn.botpress.cloud` loads, inject.js sets up `window.botpress.on` but `.init()` is never called — our custom bubble appears but Botpress's own widget does not render. Both CDNs are Botpress infrastructure and are typically reachable together. Documented in EVIDENCE.md.

---

## Phase 3 — Dashboard Audit (Issues 7 & 8)

### What was delivered

Phase 3 audited the Botpress chatbot dashboard (Issue 7) and Make automation scenario (Issue 8), both completed on 2026-05-23. Dashboard changes included: AI identity disclosure in the bot's welcome message and header (EU AI Act Article 50 compliance), consent-before-data-collection text added to three prompt sections, `convo_ended` workflow logic to enable lead capture to Google Sheets, shared-secret webhook authentication between Botpress and Make, and removal of `convoTranscript` from the webhook payload for data minimisation. Two findings required privacy policy edits: OpenAI was identified as the LLM sub-processor (added to Section 4 of both EN and EL privacy policies) and chatbot data retention periods were undisclosed (added Botpress 90-day conversation retention and Google Sheet 24-month lead summary retention to Section 5 of both files) (commit b9b59a1). A pre-existing bug was discovered during testing: the `convo_ended` workflow variable was never being set, meaning the `Save_to_googleSheet` node never fired and chatbot lead data was likely not being captured prior to Phase 3. Bug fixed in Botpress dashboard. Andros should assess any impact from leads not captured before this fix.

### Compliance posture after Phase 1 + 1.5 + 3

Issues 1, 2, 3, 4, 7, 8, and 10 are now closed. The remaining issues require external inputs: Issue 5 (disclosures placeholders) is waiting on Andros for 5 regulatory values. Issue 6 (consent worker CORS wildcard) is waiting on the production domain. Issue 9 (controller/processor agreement) is a separate document workstream. Marketing-claim phrases in the Botpress system prompt ("Free risk analysis," "Best market prices," "Same-day coverage available") are flagged for Phase 4 review under Cyprus Insurance Distribution Law.

### Commits — Phase 3

| SHA | Message |
|-----|---------|
| b9b59a1 | compliance(phase-3): add OpenAI sub-processor and chatbot retention to privacy policy |
| d6b2d2d | compliance(phase-3): document dashboard audit findings in EVIDENCE.md and HANDOFF.md |

### All commits — Phases 1 + 1.5 + 3

| # | SHA | Phase | Message |
|---|-----|-------|---------|
| 1 | d43c8e3 | 1 | compliance(issue-3): Add OCPDP complaint right to privacy policy (EN + EL) |
| 2 | 1b6220a | 1 | compliance(issue-4): Name sub-processors in Section 4 + add ip_country to Section 1 (EN + EL) |
| 3 | 2f28ff5 | 1 | compliance(issue-4): add missing EL bullet and closing para to align with EN |
| 4 | 45b1d4a | 1 | compliance(issue-10): Skip 4.5s redirect for prefers-reduced-motion users |
| 5 | c499161 | 1.5 | compliance(issue-2): reclassify bp:* cookies from Strictly Necessary to Preferences |
| 6 | e024005 | 1.5 | compliance(issue-1): gate Botpress loading behind CMP preferences consent |
| 7 | a78eee0 | 1.5 | compliance(issue-1): remove Botpress script tags from all HTML pages |
| 8 | 9a85510 | 1.5 | compliance(issue-1): fix timing race between consent-gated Botpress load and inline UI handlers |
| 9 | d55c3e3 | 1.5 | compliance(issue-1): remove webchat:ready dependency to fix accept-then-show race |
| 10 | 88ee9ae | 1.5 | compliance(issue-1): chain Botpress scripts to fix race between inject and init |
| 11 | b9b59a1 | 3 | compliance(phase-3): add OpenAI sub-processor and chatbot retention to privacy policy |
| 12 | d6b2d2d | 3 | compliance(phase-3): document dashboard audit findings in EVIDENCE.md and HANDOFF.md |

---

## Phase 4a — Hardening Sweep (Blocks B, D, E, F)

### What was delivered

Phase 4a is a hardening sweep covering documentation, asset management, form security, template license compliance, and SEO baselining. Block F created five compliance documentation artefacts: a Record of Processing Activities (ROPA.md) covering four processing activities per GDPR Article 30, a sub-processor register (SUBPROCESSORS.md) cross-referencing all 8 entities from the privacy policy with transfer mechanisms and DPA URLs, a security posture summary (SECURITY.md) with 11 in-place controls and 6 known gaps, a GDPR Article 33 incident response runbook (INCIDENT-RESPONSE.md) with Cyprus OCPDP contact details and phased notification procedures, an EU AI Act Article 4 AI literacy log (AI-LITERACY-LOG.md) documenting the Botpress/OpenAI deployment and Andros's initial briefing, and a deferred-items register (NOTES.md) for out-of-scope findings. Block D produced a complete asset inventory (ASSETS.md) cataloguing all 58 image/video files, 10 vendor libraries, 5 custom CSS/JS files, and 7 external CDN resources with verified licensing categories — flagging Isotope Layout as GPL v3 dead code that must be removed before launch and 8 insurance-themed stock images pending reverse-image-search source confirmation. Block B audited the contact form and added Formspree's `_gotcha` honeypot to both EN and EL forms for spam mitigation, archived the dead `forms/contact.php` to `_archive/`, and restored the BootstrapMade "Designed by" footer credit on all 18 active pages to satisfy the BizLand template free license requirement. Block E produced an SEO baseline snapshot documenting the current state: no 404.html, zero OG/canonical/hreflang tags across all 26 pages, sitemap covering 18 active pages with a placeholder domain, and a robots.txt gap for the new `_archive/` directory.

### What is deferred from Phase 4a

- **Block A (security headers):** Blocked by Issue 6 — cannot set CSP/HSTS headers without production domain and hosting configuration.
- **Block C (accessibility statement):** Deferred to Phase 4b — requires full accessibility audit first.
- **Block E remainder (Lighthouse):** Lighthouse CLI available but no Chrome/Chromium on WSL2. Marinos to run manually from Chrome DevTools and add JSON reports to `evidence/`.
- **NOTES.md remediation queue (pre-launch):** Isotope GPL v3 removal (5-step plan in NOTES.md), imagesloaded dependency check, reverse-image-search 8 stock images, delete 6 unused template pages, update sitemap.xml domain + add `<lastmod>`, add `Disallow: /_archive/` to robots.txt, fix "Consulatants" typo in footer credit.
- **NOTES.md Phase 5+ items:** Server-side GDPR consent enforcement, marketing-claim phrases in Botpress system prompt, talk-to-human escalation flow enhancement.

### New artefacts

| File | Purpose |
|------|---------|
| ROPA.md | Record of Processing Activities (GDPR Article 30) |
| SUBPROCESSORS.md | Sub-processor register with transfer mechanisms and DPA status |
| SECURITY.md | Security posture: controls, gaps, access, pending improvements |
| INCIDENT-RESPONSE.md | Breach notification runbook (GDPR Article 33, Cyprus OCPDP) |
| AI-LITERACY-LOG.md | AI literacy compliance log (EU AI Act Article 4) |
| ASSETS.md | Full asset inventory with licensing categories |
| NOTES.md | Deferred items and out-of-scope findings register |

### Commits — Phase 4a

| SHA | Block | Message |
|-----|-------|---------|
| 821f6d8 | F | compliance(phase-4a): create RoPA, sub-processor list, security posture, incident runbook, AI literacy log |
| 474a074 | D | compliance(phase-4a): create ASSETS.md inventory of all images, fonts, and CDN dependencies |
| 09f82ff | B | compliance(phase-4a): audit contact form, add honeypot, archive dead PHP, restore BootstrapMade credit |
| 8d16493 | E | compliance(phase-4a): SEO baseline snapshot and deferred-items update |

### All commits — Phases 1 + 1.5 + 3 + 4a

| # | SHA | Phase | Message |
|---|-----|-------|---------|
| 1 | d43c8e3 | 1 | compliance(issue-3): Add OCPDP complaint right to privacy policy (EN + EL) |
| 2 | 1b6220a | 1 | compliance(issue-4): Name sub-processors in Section 4 + add ip_country to Section 1 (EN + EL) |
| 3 | 2f28ff5 | 1 | compliance(issue-4): add missing EL bullet and closing para to align with EN |
| 4 | 45b1d4a | 1 | compliance(issue-10): Skip 4.5s redirect for prefers-reduced-motion users |
| 5 | c499161 | 1.5 | compliance(issue-2): reclassify bp:* cookies from Strictly Necessary to Preferences |
| 6 | e024005 | 1.5 | compliance(issue-1): gate Botpress loading behind CMP preferences consent |
| 7 | a78eee0 | 1.5 | compliance(issue-1): remove Botpress script tags from all HTML pages |
| 8 | 9a85510 | 1.5 | compliance(issue-1): fix timing race between consent-gated Botpress load and inline UI handlers |
| 9 | d55c3e3 | 1.5 | compliance(issue-1): remove webchat:ready dependency to fix accept-then-show race |
| 10 | 88ee9ae | 1.5 | compliance(issue-1): chain Botpress scripts to fix race between inject and init |
| 11 | b9b59a1 | 3 | compliance(phase-3): add OpenAI sub-processor and chatbot retention to privacy policy |
| 12 | d6b2d2d | 3 | compliance(phase-3): document dashboard audit findings in EVIDENCE.md and HANDOFF.md |
| 13 | 3953854 | 3 | compliance(phase-3): fix commit table count in HANDOFF.md |
| 14 | 821f6d8 | 4a | compliance(phase-4a): create RoPA, sub-processor list, security posture, incident runbook, AI literacy log |
| 15 | 474a074 | 4a | compliance(phase-4a): create ASSETS.md inventory of all images, fonts, and CDN dependencies |
| 16 | 09f82ff | 4a | compliance(phase-4a): audit contact form, add honeypot, archive dead PHP, restore BootstrapMade credit |
| 17 | 8d16493 | 4a | compliance(phase-4a): SEO baseline snapshot and deferred-items update |

---

## Phase 4 Remainder — Repo Cleanup Pass

### What was delivered

Phase 4 remainder completed the pre-launch cleanup items flagged during Phase 4a. Task 1 removed the Isotope Layout library (GPL v3, dead code with zero DOM triggers) and its sole dependency imagesloaded from all 24 HTML pages, main.js, main.css, and the vendor directory — eliminating GPL v3 distribution exposure (commit 89d7ae5). A vendor audit confirmed all 8 remaining libraries (AOS, Bootstrap, Bootstrap Icons, GLightbox, PureCounter, Swiper, Waypoints, php-email-form) are actively triggered with documented call sites in main.js or HTML. Task 3 deleted 6 unused BizLand template pages (portfolio-details, service-details, starter-page × EN + EL) after verifying zero inbound links from any active page, reducing the site from 26 to 20 pages (commit 970f1ac). Task 4 added `Disallow: /_archive/` to robots.txt to prevent indexing of archived dead code (commit 65baf32). Task 5 fixed the "Consulatants" → "Consultants" typo in all 18 footer credits (commit cb72ac4). EVIDENCE.md, ASSETS.md, and NOTES.md were updated with per-task verification records, trigger locations for surviving vendor libraries, and strikethrough of completed remediation items (commit 65692b2).

### What remains

- **Reverse-image-search 8 stock images:** car_3d.webp, health_3d.webp, house_3d.webp, business_3d.webp, motor-insu.webp, health_insu.webp, home_insu.webp, business_insu.webp — source and license unconfirmed. Marinos doing manually.
- **Lighthouse baseline:** No Chrome on WSL2. Marinos running manually from Opera/Chrome DevTools.
- **Terms of Use review:** Content review of terms.html / EL/terms.html deferred.
- **Phase 4b accessibility:** Accessibility audit and statement.
- **Marketing-claim phrases:** Botpress system prompt contains "Free risk analysis," "Best market prices," "Same-day coverage available" — review under Cyprus Insurance Distribution Law.
- **Server-side consent enforcement:** Contact form GDPR checkbox is client-side only (HTML `required`). Phase 5+ improvement.
- **Sitemap domain placeholder:** sitemap.xml and robots.txt use `www.eacinsurance.com` — update when production domain is decided.
- **Issue 5 (disclosures placeholders):** Waiting on Andros for 5 regulatory values.
- **Issue 6 (consent worker CORS):** Waiting on production domain.
- **Issue 9 (controller/processor agreement):** Separate document workstream.

### Commits — Phase 4 Remainder

| SHA | Message |
|-----|---------|
| 89d7ae5 | compliance(phase-4-remainder): remove Isotope GPL v3 dead code and imagesloaded dependency |
| 970f1ac | compliance(phase-4-remainder): delete 6 unused BizLand template pages |
| 65baf32 | compliance(phase-4-remainder): add /_archive/ disallow to robots.txt |
| cb72ac4 | compliance(phase-4-remainder): fix Consulatants → Consultants typo in 18 footer credits |
| 65692b2 | compliance(phase-4-remainder): update EVIDENCE, ASSETS, NOTES after cleanup pass |

### All commits — Phases 1 + 1.5 + 3 + 4a + 4 Remainder

| # | SHA | Phase | Message |
|---|-----|-------|---------|
| 1 | d43c8e3 | 1 | compliance(issue-3): Add OCPDP complaint right to privacy policy (EN + EL) |
| 2 | 1b6220a | 1 | compliance(issue-4): Name sub-processors in Section 4 + add ip_country to Section 1 (EN + EL) |
| 3 | 2f28ff5 | 1 | compliance(issue-4): add missing EL bullet and closing para to align with EN |
| 4 | 45b1d4a | 1 | compliance(issue-10): Skip 4.5s redirect for prefers-reduced-motion users |
| 5 | c499161 | 1.5 | compliance(issue-2): reclassify bp:* cookies from Strictly Necessary to Preferences |
| 6 | e024005 | 1.5 | compliance(issue-1): gate Botpress loading behind CMP preferences consent |
| 7 | a78eee0 | 1.5 | compliance(issue-1): remove Botpress script tags from all HTML pages |
| 8 | 9a85510 | 1.5 | compliance(issue-1): fix timing race between consent-gated Botpress load and inline UI handlers |
| 9 | d55c3e3 | 1.5 | compliance(issue-1): remove webchat:ready dependency to fix accept-then-show race |
| 10 | 88ee9ae | 1.5 | compliance(issue-1): chain Botpress scripts to fix race between inject and init |
| 11 | b9b59a1 | 3 | compliance(phase-3): add OpenAI sub-processor and chatbot retention to privacy policy |
| 12 | d6b2d2d | 3 | compliance(phase-3): document dashboard audit findings in EVIDENCE.md and HANDOFF.md |
| — | 3953854 | 3 | compliance(phase-3): fix commit table count in HANDOFF.md *(meta — table fix)* |
| 13 | 821f6d8 | 4a | compliance(phase-4a): create RoPA, sub-processor list, security posture, incident runbook, AI literacy log |
| 14 | 474a074 | 4a | compliance(phase-4a): create ASSETS.md inventory of all images, fonts, and CDN dependencies |
| 15 | 09f82ff | 4a | compliance(phase-4a): audit contact form, add honeypot, archive dead PHP, restore BootstrapMade credit |
| 16 | 8d16493 | 4a | compliance(phase-4a): SEO baseline snapshot and deferred-items update |
| 17 | 04da81b | 4a | compliance(phase-4a): integration check and HANDOFF.md Phase 4a section |
| 18 | 89d7ae5 | 4-rem | compliance(phase-4-remainder): remove Isotope GPL v3 dead code and imagesloaded dependency |
| 19 | 970f1ac | 4-rem | compliance(phase-4-remainder): delete 6 unused BizLand template pages |
| 20 | 65baf32 | 4-rem | compliance(phase-4-remainder): add /_archive/ disallow to robots.txt |
| 21 | cb72ac4 | 4-rem | compliance(phase-4-remainder): fix Consulatants → Consultants typo in 18 footer credits |
| 22 | 65692b2 | 4-rem | compliance(phase-4-remainder): update EVIDENCE, ASSETS, NOTES after cleanup pass |

*22 substantive compliance commits + 1 meta table-fix (3953854). HANDOFF.md update commit not listed (self-referential).*

## Evidence

Full verification records with grep output, diffs, legal citations, side-effect checks, browser test results, dashboard audit findings, and Phase 4a/4-remainder integration checks for all phases: [EVIDENCE.md](EVIDENCE.md)

## Sign-off

- [ ] **Marinos Antoniou** — Phase 1 + Phase 1.5 + Phase 3 + Phase 4a + Phase 4 Remainder reviewed and approved
