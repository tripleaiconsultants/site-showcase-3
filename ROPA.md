# Record of Processing Activities — E.A.C. Insurance

Per GDPR Article 30. Recommended even when fewer than 250 employees, as the processing is not occasional (Art. 30(5) exception does not apply to a business that routinely collects customer data).

**Controller:** E.A.C. Insurance Agencies & Consultants Ltd, Apostolou Varnava 51A, 3065 Limassol, Cyprus
**Contact:** e.a.c.insurances@outlook.com | +357 96 660 113
**Last reviewed:** 2026-05-23
**Next review:** 2027-05-23
**Maintained by:** Andros Panayiotou (CEO)

---

## Processing activity 1 — Website contact form

- **Categories of data subjects:** Prospective customers, existing customers
- **Categories of personal data:** Name, email address, phone number (if provided), insurance type of interest, message content
- **Legal basis:** Consent (GDPR Art. 6(1)(a)) when submitting the form; pre-contractual measures (GDPR Art. 6(1)(b)) when preparing a quote
- **Purpose:** Respond to enquiries, prepare insurance quotes, contact the user regarding their request
- **Recipients:** Formspree Inc. (USA) — processes form submission and forwards to email; Microsoft Corporation (USA) — receives the forwarded email via Outlook
- **Transfer mechanism:** EU-US Data Privacy Framework (both Formspree and Microsoft)
- **Retention:** 24 months from last communication
- **Technical/organisational measures:** HTTPS, Formspree `_gotcha` honeypot, GDPR consent checkbox (client-side `required`), security meta headers (X-Content-Type-Options, Referrer-Policy)
- **Privacy policy reference:** Sections 1, 2, 3, 4 (Formspree + Microsoft bullets), 5

## Processing activity 2 — Website chatbot (Botpress)

- **Categories of data subjects:** Website visitors who interact with the chatbot
- **Categories of personal data:** Conversation content (free-text messages entered by the user), any personal data the user voluntarily provides during conversation (e.g. name, phone, insurance needs)
- **Legal basis:** Consent (GDPR Art. 6(1)(a)) — chatbot loads only after CMP "Preferences" consent is granted
- **Purpose:** Provide general insurance information, capture leads for follow-up by Andros
- **Recipients:** Botpress Technologies Inc. (Canada) — hosts the chatbot widget and conversation logs; OpenAI L.L.C. (USA) — provides the LLM generating chatbot responses (engaged by Botpress as sub-processor); Make / Celonis SE — routes lead summaries from Botpress to Google Sheet; Google LLC (USA) — stores lead summaries in Google Sheets
- **Transfer mechanism:** Botpress (Canada) — EU adequacy decision; OpenAI, Google (USA) — EU-US Data Privacy Framework; Make — Standard Contractual Clauses
- **Retention:** Botpress conversation logs: 90 days (auto-deleted); Google Sheet lead summaries: 24 months from last contact, then deleted
- **Technical/organisational measures:** CMP consent gating (loads only after Preferences consent), Botpress→Make webhook authenticated via shared secret, AI disclosure in chatbot welcome message and website footer (EU AI Act Art. 50), conversation summary (not full transcript) sent to Google Sheet (data minimisation)
- **Privacy policy reference:** Sections 1, 2, 4 (Botpress, OpenAI, Make, Google bullets), 5, 8

## Processing activity 3 — Cookie consent logging (Cloudflare Worker)

- **Categories of data subjects:** All website visitors
- **Categories of personal data:** Consent decision (accept/reject per category), timestamp, visitor country derived from IP address (ip_country, e.g. "CY"); full IP address is NOT stored
- **Legal basis:** Legitimate interest (GDPR Art. 6(1)(f)) — maintaining proof of consent as required by Cyprus ePrivacy Law 112(I)/2004 §99(5) and EDPB Guidelines 5/2020
- **Purpose:** Store verifiable proof of each visitor's cookie consent decision
- **Recipients:** Cloudflare Inc. (USA) — hosts the consent-logging worker and KV store
- **Transfer mechanism:** EU-US Data Privacy Framework
- **Retention:** 3 years (KV store TTL), aligned with statute of limitations for regulatory enforcement
- **Technical/organisational measures:** HTTPS, consent worker does not store full IP, country derived from Cloudflare's CF-IPCountry header, CORS currently set to wildcard (to be locked to production domain — tracked as Phase 2 Issue 6)
- **Privacy policy reference:** Sections 1 (ip_country bullet), 4 (Cloudflare bullet)

## Processing activity 4 — Marketing communications

- **Categories of data subjects:** Customers and prospects who explicitly opt in to marketing
- **Categories of personal data:** Name, email address
- **Legal basis:** Consent (GDPR Art. 6(1)(a)) — separate, explicit consent required
- **Purpose:** Send insurance tips, market updates, special offers
- **Recipients:** TBD — confirm with Andros which platform is used for marketing emails (if any)
- **Transfer mechanism:** TBD — depends on platform
- **Retention:** Until consent is withdrawn or 36 months of inactivity, whichever comes first
- **Technical/organisational measures:** TBD — confirm with Andros whether marketing communications are currently active and via what channel
- **Privacy policy reference:** Sections 2, 3, 5
