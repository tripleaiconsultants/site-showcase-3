# NOTES.md — Deferred Items and Out-of-Scope Findings

Items discovered during compliance work that are out of scope for the current phase but must be addressed before or shortly after launch.

---

## Phase 4 remainder (pre-launch priority)

### ~~Isotope Layout — GPL v3 dead code~~ ✓ Done (commit 89d7ae5)

Removed: vendor files, 48 script tags, main.js init block, main.css portfolio-filters CSS. imagesloaded also removed (sole consumer was Isotope).

### ~~Vendor library dead-code audit~~ ✓ Done (no commit — all 8 survivors active)

AOS, Bootstrap, Bootstrap Icons, GLightbox, PureCounter, Swiper, Waypoints, php-email-form — all confirmed active with trigger locations documented in ASSETS.md.

### Reverse-image-search 8 insurance-themed images

The following images were downloaded from free stock sites (likely Pexels/Unsplash/Pixabay) but exact sources were not documented at download time:
- `assets/img/car_3d.webp`
- `assets/img/health_3d.webp`
- `assets/img/house_3d.webp`
- `assets/img/business_3d.webp`
- `assets/img/motor-insu.webp`
- `assets/img/health_insu.webp`
- `assets/img/home_insu.webp`
- `assets/img/business_insu.webp`

**Action required:** Before launch, reverse-image-search via TinEye or Google Lens to confirm source and verify license permits commercial use without attribution. Document results in ASSETS.md.

### ~~6 unused template HTML pages~~ ✓ Done (commit 970f1ac)

Deleted: portfolio-details.html, service-details.html, starter-page.html (EN + EL). Site now 20 pages.

### Sitemap — 2 splash pages not listed

`sitemap.xml` lists 18 pages; repo now has 20 HTML files (after deleting 6 template pages). The 2 unlisted pages are `index.html` / `EL/index.html` (splash/redirect pages with no SEO content — intentional exclusion).

### ~~robots.txt — add `_archive/` Disallow~~ ✓ Done (commit 65baf32)

### Sitemap domain placeholder

`sitemap.xml` and `robots.txt` use `www.eacinsurance.com` as the domain. This is a placeholder — the production domain has not been decided yet. Same blocker as Phase 2 Issue 6 (consent worker CORS lockdown). Both must be updated when the production domain is configured.

---

## Phase 5+ improvements

### Server-side GDPR consent enforcement

The contact form GDPR consent checkbox uses HTML `required` attribute only (client-side). A user bypassing JavaScript (e.g. direct POST to the Formspree endpoint via curl) could submit without consent. Formspree free tier has no server-side consent validation.

**Options:**
1. Upgrade to Formspree paid tier — includes hCaptcha and custom validation rules
2. Migrate to self-hosted form handler with server-side validation (requires production hosting with server-side capability)
3. Add Cloudflare Workers-based form proxy that validates consent field before forwarding to Formspree

### Marketing-claim phrases in Botpress system prompt

Flagged during Phase 3 dashboard audit: the Botpress system prompt contains phrases like "Free risk analysis," "Best market prices," "Same-day coverage available." These should be reviewed under the Cyprus Insurance Distribution Law for compliance with advertising regulations. Phase 4 remainder or Phase 5 item.

### ~~Cosmetic fixes before launch~~ ✓ Done (commit cb72ac4)

"Consulatants" → "Consultants" fixed in all 18 footer credits.

### Talk-to-human escalation flow

Phase 3 identified that the chatbot's talk-to-human escalation flow could be enhanced. Currently the bot suggests contacting Andros directly. Consider implementing a structured handoff (e.g. Botpress's built-in human handoff feature or a scheduled callback form within the chat).
