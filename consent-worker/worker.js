/**
 * Cloudflare Worker — Consent Log Endpoint
 *
 * Receives POST /consent/log from the CMP and stores each record
 * in Cloudflare KV keyed by consent_id.
 *
 * KV binding: CONSENT_STORE (configured in wrangler.toml)
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',   // TODO: Replace '*' with your production domain once hosted
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS });
    }

    try {
      const body = await request.json();

      // Validate required fields
      if (!body.consent_id || !body.choices) {
        return new Response(JSON.stringify({ error: 'Missing consent_id or choices' }), {
          status: 400,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        });
      }

      // Add server-side metadata
      const record = {
        ...body,
        server_timestamp_utc: new Date().toISOString(),
        ip_country: request.cf?.country || 'unknown',
      };

      // Store in KV — key is consent_id, value is JSON
      // ExpirationTtl: 3 years (GDPR recommends keeping consent proof)
      await env.CONSENT_STORE.put(
        body.consent_id,
        JSON.stringify(record),
        { expirationTtl: 94608000 }
      );

      return new Response(JSON.stringify({ ok: true, consent_id: body.consent_id }), {
        status: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Invalid request body' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }
  },
};
