# Personal Data Breach — Incident Response Runbook

**E.A.C. Insurance Agencies & Consultants Ltd**
**Last reviewed:** 2026-05-23
**Next review:** 2027-05-23

## 0. Definition

A personal data breach is any "security incident leading to the accidental or unlawful destruction, loss, alteration, unauthorised disclosure of, or access to, personal data transmitted, stored or otherwise processed" (GDPR Art. 4(12)).

### Examples relevant to this site

- Botpress workspace credentials leaked or compromised
- Make scenario webhook URL exposed AND shared secret leaked simultaneously
- Google Sheet containing lead summaries shared with unauthorised party
- Cloudflare account compromised (consent worker, KV store)
- Contact form data sent to wrong destination (e.g. Formspree misconfiguration)
- Cookie consent records exposed publicly
- GitHub repository made public while containing sensitive configuration (note: repo currently contains no secrets)
- Outlook account compromised (contains all form submissions)

## 1. First hour (T+0 to T+1h)

- [ ] **Stop the bleed:** Revoke compromised credentials, regenerate secrets (Botpress→Make shared secret, API keys), take affected systems offline if needed
- [ ] **Preserve evidence:** Screenshot affected systems, export relevant logs, do not delete anything
- [ ] **Notify internally:** Contact both:
  - Andros Panayiotou (CEO, data controller) — +357 96 660 113 / e.a.c.insurances@outlook.com
  - Marinos Antoniou (developer, TripleAI) — marinosantoniou3009@gmail.com

## 2. First 24 hours (T+1h to T+24h)

- [ ] **Assess scope:**
  - What personal data was affected? (names, emails, phone numbers, conversation content, consent records)
  - How many data subjects are affected? (check Formspree submission count, Botpress conversation count, Google Sheet row count)
  - What security controls failed?
  - Is the breach ongoing or contained?
- [ ] **Decide notifiability:** Under GDPR Art. 33, a breach must be reported to the supervisory authority unless it is "unlikely to result in a risk to the rights and freedoms of natural persons"
  - Contact data (name + email + phone) exposure: likely notifiable
  - Consent records only (no contact data): likely not notifiable
  - Conversation content with personal details: likely notifiable
- [ ] **Begin drafting DPA notification** if breach appears notifiable (see Section 3)

## 3. Within 72 hours (T+0 to T+72h) — DPA notification

If the breach is notifiable, file with the Cyprus Office of the Commissioner for Personal Data Protection (OCPDP):

**Contact:**
- Address: Iasonos 1, 1082 Nicosia, Cyprus
- Email: commissioner@dataprotection.gov.cy
- Website: www.dataprotection.gov.cy

**Notification must include** (GDPR Art. 33(3)):
1. Nature of the breach (what happened)
2. Name and contact details of the data protection contact (Andros Panayiotou, e.a.c.insurances@outlook.com, +357 96 660 113)
3. Categories and approximate number of data subjects affected
4. Categories and approximate number of personal data records affected
5. Likely consequences of the breach
6. Measures taken or proposed to address the breach and mitigate adverse effects

**If full details are not yet available:** GDPR Art. 33(4) permits phased notification — file what you know within 72 hours and supplement later.

## 4. Communication to affected data subjects (if high risk)

Under GDPR Art. 34, if the breach is "likely to result in a high risk to the rights and freedoms" of data subjects, notify them directly:

- [ ] Use plain language
- [ ] Explain what happened
- [ ] Explain what personal data was affected
- [ ] Explain what they should do (e.g. be alert to phishing, change passwords if relevant)
- [ ] Provide contact details for questions (Andros's email and phone)

Communication can be via email to affected individuals. If email addresses are not available or the breach affects a large number of subjects, a prominent notice on the website may be appropriate (GDPR Art. 34(3)(c)).

## 5. Post-incident

- [ ] **Write-up:** Document what happened, root cause, what was fixed, timeline of response
- [ ] **Update security controls:** Regenerate all affected credentials, review access controls
- [ ] **Update this runbook** with lessons learned
- [ ] **Update [SECURITY.md](SECURITY.md)** with any new controls implemented
- [ ] **Retain records:** Keep all breach documentation for at least 5 years (GDPR Art. 33(5) requires the controller to document all breaches, whether notifiable or not)
