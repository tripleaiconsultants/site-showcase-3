# NOTES.md — Deferred Items and Out-of-Scope Findings

Items discovered during compliance work that are out of scope for the current phase but must be addressed before or shortly after launch.

---

## Phase 4 remainder (pre-launch priority)

### Isotope Layout — GPL v3 dead code (must remove before launch)

Isotope (`assets/vendor/isotope-layout/`) is loaded via `<script>` on all 26 HTML pages and has initialization code in `assets/js/main.js` (L235–258), but **zero HTML pages contain any Isotope DOM elements** (`.isotope-layout`, `.isotope-container`, `.isotope-item`, `.isotope-filters`). `new Isotope()` is never instantiated. This is a BootstrapMade BizLand template artifact.

Isotope is dual-licensed: GPL v3 for open-source use, or commercial license (Metafizzy) for closed-source/commercial use. E.A.C. is a commercial insurance business and the site is not open-source, so GPL v3 applies — and distributing the script to every visitor's browser technically constitutes distribution under GPL v3, which would require the entire site to be open-sourced under GPL v3. Since no code actually executes, the practical risk is low, but the legal exposure exists.

**Action required:**
1. Delete `assets/vendor/isotope-layout/isotope.pkgd.min.js` and `assets/vendor/isotope-layout/isotope.pkgd.js`
2. Remove `<script src="...isotope...">` tags from all 26 HTML pages (13 EN + 13 EL)
3. Remove the Isotope initialization block from `assets/js/main.js` (L232–260)
4. Remove `.portfolio-filters` CSS rules from `assets/css/main.css` (L2341–2377)
5. Check whether `imagesloaded.pkgd.min.js` is used only as an Isotope dependency — if so, also remove

### Verify imagesloaded dependency

`assets/vendor/imagesloaded/imagesloaded.pkgd.min.js` is loaded on all 26 pages. It is used inside the Isotope initialization block in main.js (`imagesLoaded(isotopeItem.querySelector('.isotope-container'), ...)`). Check whether any other code calls `imagesLoaded()`. If Isotope is the sole consumer, remove imagesloaded as well.

### Check other vendor libraries for dead-code status

The following vendor libraries were inherited from the BootstrapMade BizLand template. Verify each is actually used on at least one live page:
- **PureCounter** — used for counter animations (stats section on main.html). Likely active.
- **GLightbox** — used for image lightbox (about section gallery). Likely active.
- **Swiper** — used for testimonials carousel. Likely active.
- **AOS** — used for scroll animations site-wide. Active.
- **Waypoints** — check if used independently or only via other libraries.

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

### 6 unused template HTML pages (candidates for deletion)

The following pages are BootstrapMade BizLand template pages with no EAC-specific content:
- `portfolio-details.html` / `EL/portfolio-details.html`
- `service-details.html` / `EL/service-details.html`
- `starter-page.html` / `EL/starter-page.html`

They are not linked from navigation, not used by visitors, but are included in the repository. Consider deleting to reduce attack surface and maintenance burden.

### Sitemap missing 8 pages

`sitemap.xml` lists 18 pages but the repo contains 26 HTML files. Missing from sitemap:
- `index.html` / `EL/index.html` (splash/redirect pages — may be intentionally excluded)
- `portfolio-details.html` / `EL/portfolio-details.html` (unused template pages — should be deleted, not added)
- `service-details.html` / `EL/service-details.html` (unused template pages)
- `starter-page.html` / `EL/starter-page.html` (unused template pages)

After deleting the 6 unused template pages, the only gap would be the 2 index.html pages. Evaluate whether those should be in the sitemap or not (they are splash/redirect pages with no SEO content).

### robots.txt — add `_archive/` Disallow

`_archive/` was created during Phase 4a (Block B) to hold archived dead code (contact.php). robots.txt currently blocks `/forms/` and `/consent-worker/` but not `/_archive/`. Add `Disallow: /_archive/` before launch.

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

### Cosmetic fixes before launch

- **"Consulatants" typo:** The TripleAI credit line in all 18 active page footers reads "TripleAI Consulatants" — should be "TripleAI Consultants". One `replace_all` sed across all files.

### Talk-to-human escalation flow

Phase 3 identified that the chatbot's talk-to-human escalation flow could be enhanced. Currently the bot suggests contacting Andros directly. Consider implementing a structured handoff (e.g. Botpress's built-in human handoff feature or a scheduled callback form within the chat).
