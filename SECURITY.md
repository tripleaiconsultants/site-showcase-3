# Security Posture — E.A.C. Insurance Website

**Last reviewed:** 2026-05-23
**Next review:** 2027-05-23

## In place

- **HTTPS** — via GitHub Pages (enforced by GitHub for `*.github.io` domains; production domain will require separate HTTPS configuration)
- **Security meta headers** — `X-Content-Type-Options: nosniff` and `Referrer-Policy: strict-origin-when-cross-origin` set via `<meta>` tags on all pages
- **CMP-gated third-party scripts** — Botpress chatbot loads only after user grants "Preferences" consent via the Cookie Management Platform (cmp.js). No third-party scripts load pre-consent except strictly necessary ones
- **Botpress→Make webhook authentication** — shared secret stored in Botpress dashboard environment variables and Make scenario webhook configuration. Secret is a 32-character alphanumeric string. Value is NOT documented in any repo file
- **GDPR consent checkbox** — present on both EN and EL contact forms, HTML `required` attribute enforces client-side
- **Formspree honeypot** — `_gotcha` hidden field on both contact forms; Formspree silently drops submissions where this field is non-empty
- **XSS prevention** — validate.js uses `textContent` assignment for error messages (not `innerHTML`)
- **Robots.txt restrictions** — `/forms/` and `/consent-worker/` directories disallowed from crawling
- **Consent proof logging** — Cloudflare Worker stores consent decisions in KV store with 3-year TTL, without storing full IP addresses
- **Data minimisation** — Botpress→Make webhook sends conversation summary only, not full transcript (implemented Phase 3)
- **AI disclosure** — chatbot identified as AI-powered in welcome message, page footer, and Section 8 of privacy policy (EU AI Act Art. 50)

## Limitations / known gaps

- **CORS wildcard on consent worker** — `consent-worker/worker.js` uses `Access-Control-Allow-Origin: '*'`. Cannot be locked down until production domain is decided (tracked as Phase 2 Issue 6)
- **No server-side GDPR consent enforcement** — contact form consent checkbox is client-side only (`required` attribute). A user bypassing JavaScript (e.g. direct POST to Formspree endpoint) could submit without consent. Formspree free tier has no server-side consent validation. Recommend Phase 5+: evaluate Formspree paid tier with hCaptcha, or migrate to self-hosted form handler
- **No rate limiting on contact form** — beyond Formspree's built-in abuse protection, no IP-based or session-based throttling
- **No Content-Security-Policy header** — meta-tag CSP is limited; full CSP requires HTTP headers, which require production hosting with header control (not available on GitHub Pages without a proxy)
- **No HSTS** — requires production domain with proper HTTP header support
- **GitHub Pages hosting limitations** — no custom HTTP headers, no server-side logic, no WAF. Production deployment should evaluate hosting with header control (e.g. Cloudflare Pages, Netlify, or traditional hosting behind Cloudflare proxy)

## Access control

| Person | Role | Access to |
|--------|------|-----------|
| Andros Panayiotou | CEO (data controller) | Botpress workspace, Make scenario, Google Sheet, Outlook inbox, Facebook/Instagram/LinkedIn business pages |
| Marinos Antoniou | Developer (TripleAI Consultants, processor) | Cloudflare account (consent worker), GitHub repository, Botpress workspace (delegated access) |

**2FA status:**
- Andros's accounts: TBD — confirm with Andros whether 2FA is enabled on Botpress, Make, Google, Microsoft/Outlook, and social media accounts
- Marinos's accounts: TBD — confirm whether 2FA is enabled on Cloudflare and GitHub

**Recommendation:** Enable 2FA on all accounts that handle personal data. Priority: Botpress (conversation data), Google (lead summaries), Outlook (form submissions), Make (webhook routing).

## Pending improvements (tracked elsewhere)

- Production domain → CORS lockdown on consent worker (HANDOFF.md, Phase 2 Issue 6)
- Full security headers via HTTP (CSP, HSTS, X-Frame-Options) — requires production hosting (Phase 4 Block A)
- Server-side form validation — Phase 5+
- Isotope GPL v3 library removal — dead code, no security risk, but license compliance (NOTES.md)

## Incident response

See [INCIDENT-RESPONSE.md](INCIDENT-RESPONSE.md) for the breach notification runbook.
