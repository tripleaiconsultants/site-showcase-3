export default {
  async fetch(request, env) {
    const allowedOrigins = env.ALLOWED_ORIGINS.split(",");
    const origin = request.headers.get("Origin") || "";
    const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

    const corsHeaders = {
      "Access-Control-Allow-Origin": corsOrigin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return Response.json({ ok: false, error: "Method not allowed" }, {
        status: 405, headers: corsHeaders,
      });
    }

    try {
      const contentType = request.headers.get("Content-Type") || "";
      let data;

      if (contentType.includes("application/json")) {
        data = await request.json();
      } else if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
        const formData = await request.formData();
        data = Object.fromEntries(formData.entries());
      } else {
        return Response.json({ ok: false, error: "Unsupported content type" }, {
          status: 400, headers: corsHeaders,
        });
      }

      // Honeypot check
      if (data._gotcha) {
        return Response.json({ ok: true }, { headers: corsHeaders });
      }

      const name = (data.name || "").trim();
      const phone = (data.phone || "").trim();
      const email = (data.email || "").trim();
      const category = (data.category || "").trim();
      const message = (data.message || "").trim();

      if (!name) {
        return Response.json({ ok: false, error: "Name is required" }, {
          status: 400, headers: corsHeaders,
        });
      }

      if (!phone && !email) {
        return Response.json({ ok: false, error: "Phone or email is required" }, {
          status: 400, headers: corsHeaders,
        });
      }

      const subject = category
        ? `New Enquiry: ${category} — ${name}`
        : `New Enquiry from ${name}`;

      const html = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#0a1929;border-bottom:2px solid #BC9042;padding-bottom:10px;">
            New Contact Form Submission
          </h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;font-weight:bold;color:#555;width:130px;">Name:</td><td style="padding:8px 0;">${escapeHtml(name)}</td></tr>
            ${phone ? `<tr><td style="padding:8px 0;font-weight:bold;color:#555;">Phone:</td><td style="padding:8px 0;">${escapeHtml(phone)}</td></tr>` : ""}
            ${email ? `<tr><td style="padding:8px 0;font-weight:bold;color:#555;">Email:</td><td style="padding:8px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>` : ""}
            ${category ? `<tr><td style="padding:8px 0;font-weight:bold;color:#555;">Category:</td><td style="padding:8px 0;">${escapeHtml(category)}</td></tr>` : ""}
          </table>
          ${message ? `<h3 style="color:#0a1929;margin-top:20px;">Message:</h3><p style="background:#f5f5f5;padding:15px;border-radius:8px;line-height:1.6;">${escapeHtml(message)}</p>` : ""}
          <hr style="border:none;border-top:1px solid #ddd;margin-top:30px;">
          <p style="font-size:12px;color:#999;">Sent from eacinsurance.com contact form</p>
        </div>
      `;

      const text = [
        `Name: ${name}`,
        phone ? `Phone: ${phone}` : null,
        email ? `Email: ${email}` : null,
        category ? `Category: ${category}` : null,
        message ? `\nMessage:\n${message}` : null,
      ].filter(Boolean).join("\n");

      await env.EMAIL.send({
        to: env.RECIPIENT_EMAIL,
        from: { email: "noreply@eacinsurance.com", name: "E.A.C. Insurance Website" },
        replyTo: email || undefined,
        subject,
        html,
        text,
      });

      return Response.json({ ok: true }, { headers: corsHeaders });

    } catch (err) {
      console.error("Email send failed:", err);
      return Response.json({ ok: false, error: "Failed to send. Please try again." }, {
        status: 500, headers: corsHeaders,
      });
    }
  },
};

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
