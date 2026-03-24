# E.A.C. Insurance — Go-Live Compliance Changes

## What Changed
- **6 new legal pages**: Privacy Policy, Cookie Policy, Disclosures (EN + EL)
- **Cookie consent banner (CMP)** on all pages — Accept All / Reject / Settings with per-category toggles
- **Server-side consent logging** via Cloudflare Worker
- **Footer**: added Privacy Policy | Cookie Policy | Disclosures | Cookie Settings links + AI chatbot disclosure
- **Claims text fixed**: removed all "15 minutes", "48 hours", "24-48 hour" promises
- **Video**: `preload="none"`, poster image from video frame
- **Accessibility**: `prefers-reduced-motion` CSS + JS (disables animations, pauses video)
- **EL/main.html**: fixed duplicate heading bug
- **CSS**: new styles in main.css + sub.css (CMP, legal pages, footer links, reduced motion)

## Testing Checklist

### Existing Features (nothing should be broken)
- [ ] All 10 original pages load without console errors
- [ ] Dark mode toggle works on every page
- [ ] Mobile responsive layout intact on every page
- [ ] Side popup widget opens/closes correctly
- [ ] Botpress chatbot loads and functions
- [ ] Contact form submits successfully
- [ ] Navigation links work (header + footer)
- [ ] AOS scroll animations fire
- [ ] Hero video plays on main.html + EL/main.html
- [ ] Page transitions work between all pages
- [ ] Social media links in footer work
- [ ] WhatsApp link in popup widget works
- [ ] Language switch (EN ↔ EL) works

### New Legal Pages
- [ ] privacy-policy.html loads and renders correctly
- [ ] EL/privacy-policy.html loads and renders correctly
- [ ] cookie-policy.html loads and renders correctly
- [ ] EL/cookie-policy.html loads and renders correctly
- [ ] disclosures.html loads and renders correctly
- [ ] EL/disclosures.html loads and renders correctly
- [ ] All 6 legal pages support dark mode
- [ ] All 6 legal pages are mobile responsive
- [ ] Cookie list table displays properly (no pink text)

### Cookie Consent Banner
- [ ] Banner appears on fresh visit (clear localStorage `cmp_consent`)
- [ ] "Accept All" works — saves consent, hides banner
- [ ] "Reject Non-Essential" works — saves consent, hides banner
- [ ] "Settings" opens modal with 4 category toggles
- [ ] Necessary toggle is always on (disabled)
- [ ] Preferences/Analytics/Marketing toggles work
- [ ] "Save Preferences" saves and closes
- [ ] Banner does NOT reappear after consent is given (refresh page)
- [ ] Footer "Cookie Settings" link opens the CMP modal
- [ ] CMP works in both EN and EL (auto-detects language)
- [ ] CMP does not overlap or conflict with the side popup widget

### Footer
- [ ] Legal links row visible: Privacy Policy | Cookie Policy | Disclosures | Cookie Settings
- [ ] Each link navigates to the correct page
- [ ] Cookie Settings link opens CMP modal (not a new page)
- [ ] AI disclosure text visible in footer ("Our chat assistant is AI-powered")
- [ ] Same links present on all 16 pages (EN + EL)

### Claims Text
- [ ] Search all pages for "15 minutes" — should find ZERO results
- [ ] Search all pages for "48 hours" — should find ZERO results
- [ ] Search all pages for "24-48" — should find ZERO results

### Video & Performance
- [ ] main.html video has poster image (shows frame before video loads)
- [ ] EL/main.html video has poster image
- [ ] Video does not auto-download on page load (check Network tab)

### Accessibility
- [ ] Enable "Reduce motion" in OS settings → animations should be disabled
- [ ] With reduced motion: hero video should be paused
- [ ] With reduced motion: AOS scroll effects should be instant (no animation)

### Server-Side Consent Logging
- [ ] After clicking Accept All, check Network tab for POST to `eac-consent-log.marinosantoniou3009.workers.dev` — should return 200
