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

---

## Anti-spam implementation plan (Phase C addition)

Status: Pre-implementation research complete. Execution requires Andros's domain decision (Turnstile sitekey is domain-bound). All steps below are mechanical once domain is set.

Total estimated execution time: 60-90 minutes.

Total cost: €0 (all Cloudflare free tier + Formspree free tier).

### Architecture summary

Three layers of anti-spam protection, all using existing accounts on Cloudflare and Formspree:

1. **Contact form**: Cloudflare Turnstile widget embedded in HTML, validated by Formspree (native integration — no custom Worker proxy needed).
2. **Consent endpoint**: Per-IP rate limit added to existing Cloudflare Worker (eac-consent-log).
3. **Chatbot**: Already done (Botpress dashboard rate limit 20/min/user, configured Sunday 31 May 2026).

Key architectural finding from research: Formspree added native Turnstile support in late 2025. They validate the token server-side using the Secret Key configured in their dashboard. This eliminates the need for a custom Cloudflare Worker proxy in front of Formspree — significantly simpler than originally planned.

---

### Step 1 — Create Turnstile widget in Cloudflare

Prerequisite: Andros has decided the production domain.

Location: Cloudflare dashboard, under Andros's account (androstecheac@gmail.com). NOT my account — this needs to be his from day one because the keys persist post-handover.

1. Cloudflare dashboard → Turnstile (left sidebar) → "Add widget"
2. Widget configuration:
   - Widget name: "EAC Insurance contact form"
   - Hostnames: production domain (e.g. eacinsurance.com.cy) — exact match, no www unless we add it explicitly
   - For pre-launch testing: also add "localhost" so we can verify before going live
   - Widget mode: **Managed** (Cloudflare auto-decides when to challenge; lowest friction for real users)
   - Pre-clearance: leave off
3. Save → Cloudflare generates a Site Key (public, goes in HTML) and a Secret Key (private, goes in Formspree).

Copy both keys somewhere safe. The Secret Key cannot be retrieved later — it can only be rotated.

---

### Step 2 — Configure Formspree to validate Turnstile

Location: Formspree dashboard, under Andros's account (post-handover migration). NOTE: This step happens after we've migrated the form to Andros's Formspree account (see Formspree migration plan elsewhere in NOTES.md).

1. Formspree dashboard → EAC form → Settings → CAPTCHA section
2. Enable CAPTCHA protection
3. Click "Adjust settings" → select "Cloudflare Turnstile"
4. Paste the Secret Key from Step 1 into the provided field
5. Save changes

After this, Formspree will reject any form submission whose `cf-turnstile-response` field is missing, expired (>5 min old), already used, or invalid.

---

### Step 3 — Add Turnstile widget to the HTML form

Files to edit:
- `main.html` (around line 718, current form)
- `EL/main.html` (around line 747, current form)

Add these two pieces of code:

**A. Load the Turnstile API script** — add to the `<head>` section (or just before `</body>`) of both files. Only need to add once per page; can be added to the global script-includes block if there is one:

```html
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
```

**B. Add the Turnstile widget div** — inside the existing `<form action="https://formspree.io/f/xlgevykp" method="POST" ...>`, just before the submit button:

```html
<div class="cf-turnstile" data-sitekey="REPLACE_WITH_SITE_KEY"></div>
```

That's it. No JS changes needed. The widget auto-injects a hidden input named `cf-turnstile-response` containing the token, which gets POSTed to Formspree along with the other form fields.

Optional but recommended: style the widget with `data-theme="light"` or `data-theme="dark"` to match the form's appearance, and `data-size="flexible"` so it adapts to the form's width.

Final widget tag:

```html
<div class="cf-turnstile" data-sitekey="REPLACE_WITH_SITE_KEY" data-theme="light" data-size="flexible"></div>
```

Note: the Formspree form endpoint URL will also change on handover day (new endpoint when Andros creates the form in his account). Both updates (Turnstile sitekey + new Formspree endpoint) can be made in the same commit.

---

### Step 4 — Add per-IP rate limiting to the consent worker

The current `consent-worker/worker.js` is an ES module Worker with no rate limiting. We add it via Cloudflare's rate-limit binding (free tier supported as of 2025).

#### 4.1 Update wrangler.toml

Add a rate-limit binding. The binding gives us a `limit()` function we call from worker code:

```toml
[[unsafe.bindings]]
name = "CONSENT_RATE_LIMITER"
type = "ratelimit"
namespace_id = "1001"
simple = { limit = 10, period = 60 }
```

Configuration meaning:
- `limit = 10`: max 10 requests
- `period = 60`: per 60 seconds
- `namespace_id`: any positive integer — used to scope limits across workers
- `simple`: fixed-window rate limiting algorithm

Cloudflare recommends NOT keying by IP alone (since multiple users behind NAT share an IP). But for an anonymous consent endpoint with no user concept, IP is the best available signal. The rate is conservative enough (10/min) that legitimate shared-IP users won't be affected — a single human won't click cookie buttons 10 times per minute. We accept the tradeoff.

#### 4.2 Update worker.js to use the binding

Modify the existing `export default { async fetch(request, env) {...} }` to check the rate limiter before processing:

```javascript
export default {
  async fetch(request, env) {
    // Handle CORS preflight (existing)
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS });
    }

    // === NEW: per-IP rate limit check ===
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const { success } = await env.CONSENT_RATE_LIMITER.limit({ key: ip });
    if (!success) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Try again in a minute.' }),
        { status: 429, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }
    // === END NEW ===

    // ...existing body validation and KV write logic unchanged...
  },
};
```

The `CF-Connecting-IP` header is automatically set by Cloudflare's edge for the original client IP. Falls back to `'unknown'` defensively, which means all requests with no IP info share a single rate-limit bucket (acceptable edge case).

#### 4.3 Deploy

After editing worker.js and wrangler.toml:

```bash
cd consent-worker
wrangler deploy
```

Validate by sending 11 requests in quick succession from one IP — the 11th should return 429.

#### 4.4 Important caveat from Cloudflare docs

Rate limits are local to each Cloudflare edge location. A user routed through Sydney has a separate count from a user routed through Frankfurt. For our purposes this is fine — an attacker would need to coordinate across multiple Cloudflare edge locations to exceed the global rate, which is non-trivial.

---

### Step 5 — Verify end-to-end

After all three steps deployed:

#### Test contact form anti-spam

1. Open production site in incognito → contact form page
2. Verify Turnstile widget renders (might be just a checkmark, might prompt for interaction depending on Cloudflare's risk assessment)
3. Submit form without solving Turnstile → expect Formspree rejection
4. Solve Turnstile → submit → expect success
5. Wait 6 minutes, copy the token via DevTools, attempt to reuse → expect rejection (token expired)

#### Test consent endpoint rate limit

1. Open browser console
2. Loop: 11 fast fetches to consent worker endpoint
3. Expect: first 10 return 200/204, 11th returns 429

```javascript
for (let i = 0; i < 11; i++) {
  fetch('https://eac-consent-log.WORKER_SUBDOMAIN.workers.dev/consent/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      consent_id: 'test-' + Date.now() + '-' + i,
      choices: { necessary: true, preferences: false, analytics: false, marketing: false },
    }),
  }).then(r => console.log(i, r.status));
}
```

After 1 minute, all should be allowed again.

---

### Step 6 — Document in artefacts

After deployment, update:

#### SECURITY.md

Add to "Anti-spam protection" section:
- Cloudflare Turnstile (Managed mode) on contact form
- Token expiry: 300 seconds; tokens are single-use
- Formspree native server-side validation of cf-turnstile-response
- Cloudflare Worker per-IP rate limit on consent endpoint: 10 req/60s
- Botpress per-user rate limit: 20 messages/60s (configured pre-launch)

#### Privacy policy

Cloudflare's Turnstile Privacy Addendum should be referenced in the privacy policy, but only if we use "invisible" widget mode. We're using Managed mode (which may show a checkbox), so this is not strictly required. Decision: do NOT add a Turnstile-specific clause to the privacy policy. The existing sub-processor list (which includes Cloudflare for the consent worker) already covers the relationship at a high level.

If we ever switch to invisible mode in the future, we MUST add the Turnstile Privacy Addendum reference. Flag for re-review at the annual policy review.

#### SUBPROCESSORS.md

Add Cloudflare Turnstile to the sub-processor list (or confirm Cloudflare entry is broad enough to cover Turnstile — it likely already is since Turnstile is a Cloudflare product). Recommend a single line under existing Cloudflare entry: "Includes consent worker (KV storage of consent records) and Turnstile (CAPTCHA on contact form)."

---

### Open questions / decisions deferred to Phase C

- **Widget mode: Managed vs Invisible vs Non-interactive.** Plan defaults to Managed (low friction for real users, mild challenge for bots). Decision can be revisited on launch day if Turnstile analytics show too much friction.

- **Should we add Turnstile to the chatbot too?** Botpress has its own rate limit and platform-level abuse protection. The added friction of a Turnstile challenge before chat is significant. Decision: NO, Botpress rate limit is sufficient.

- **Pre-clearance cookie.** Cloudflare offers "pre-clearance" to let a visitor solve Turnstile once and skip future challenges. Useful for sites with many forms; we only have one. Decision: NO.

---

### Risks and mitigations

| Risk | Mitigation |
|------|-----------|
| Turnstile widget fails to load (CDN issue) | Form will not submit (fail-closed). Acceptable: spam protection over availability. Document this in incident response. |
| Rate limit too strict, blocks real users | Monitor 429 responses in Cloudflare analytics for first week post-launch. Adjust limit upward if false positives appear. |
| Andros forgets Turnstile keys after handover | Keys are stored in two places: Formspree dashboard (Secret) and HTML (Site key). Both visible to Andros. Document key rotation procedure in INCIDENT-RESPONSE.md. |
| Cloudflare worker deployed to wrong account during handover | Sequence carefully on handover day: redeploy fresh to Andros's Cloudflare account, get new URL, update cmp.js, push site, then revoke old worker. |

---

### Phase C execution checklist

When Andros responds with the domain decision:

- [ ] Create Turnstile widget in Andros's Cloudflare account (Step 1)
- [ ] Migrate Formspree form to Andros's account (separate handover task) and configure Turnstile Secret Key (Step 2)
- [ ] Update HTML in main.html + EL/main.html with Turnstile script + widget div (Step 3)
- [ ] Update worker.js + wrangler.toml with rate-limit binding (Step 4)
- [ ] Redeploy consent worker to Andros's Cloudflare account
- [ ] Verify all 3 protections end-to-end (Step 5)
- [ ] Update SECURITY.md and SUBPROCESSORS.md (Step 6)
- [ ] Commit + push
