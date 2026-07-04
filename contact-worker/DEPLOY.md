# E.A.C. Contact Form Worker — Deployment Guide

## Prerequisites

- Andros's Cloudflare account with the domain (eacinsurance.com) managed
- Node.js installed
- wrangler CLI: `npm install -g wrangler`

## Step 1: Enable Email Sending on the domain

```bash
npx wrangler login  # Login to Andros's Cloudflare account
npx wrangler email sending enable eacinsurance.com
npx wrangler email sending dns get eacinsurance.com  # Verify DNS records
```

Or via Dashboard: Compute & AI → Email Service → Email Sending → Onboard domain.

Wait 5-15 minutes for DNS propagation.

## Step 2: Install dependencies and deploy

```bash
cd contact-worker
npm install
npm run deploy
```

The Worker will be deployed at: `https://eac-contact-form.<account>.workers.dev`

## Step 3: Update the domain in wrangler.jsonc

If you want a custom domain (e.g., `contact.eacinsurance.com`), add a route:

```jsonc
{
  "routes": [
    { "pattern": "contact.eacinsurance.com/*", "zone_name": "eacinsurance.com" }
  ]
}
```

## Step 4: Update the form action URL

Once deployed, replace the Formspree URL in all HTML files with the Worker URL.
The current Formspree action is: `https://formspree.io/f/xlgevykp`
Replace with: `https://eac-contact-form.<account>.workers.dev`

## Step 5: Update ALLOWED_ORIGINS

In wrangler.jsonc, update `ALLOWED_ORIGINS` to include the production domain.

## Notes

- The `from` address must use the onboarded domain (eacinsurance.com)
- If using a different domain, update `allowed_sender_addresses` in wrangler.jsonc
- Emails go to: e.a.c.insurances@outlook.com (configured in `RECIPIENT_EMAIL`)
- The Worker sets `Reply-To` to the submitter's email so Andros can reply directly
