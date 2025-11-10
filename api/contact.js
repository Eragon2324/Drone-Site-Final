export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const { name, email, message, ts, elapsedMs, company } = req.body || {};
    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      return res.status(400).json({ error: 'Invalid email address.' });
    }
    // Simple anti-bot
    if (company && String(company).trim().length > 0) {
      return res.status(200).json({ ok: true });
    }
    if (typeof elapsedMs === 'number' && elapsedMs < 1500) {
      // Too fast; likely bot
      return res.status(200).json({ ok: true });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const CONTACT_TO = process.env.CONTACT_TO || 'thomas@4-webers.com';
    const CONTACT_FROM = process.env.CONTACT_FROM || 'onboarding@resend.dev';

    if (!RESEND_API_KEY) {
      // If not configured yet, respond success to avoid blocking UX
      return res.status(200).json({ ok: true, note: 'Email not configured' });
    }

    const subject = `New message from ${name}`;
    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;line-height:1.6">
        <h2 style="margin:0 0 12px 0">New Contact Message</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <div style="white-space:pre-wrap;border-left:3px solid #eee;padding-left:12px">${escapeHtml(message)}</div>
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0" />
        <p style="color:#888;font-size:12px">Sent from website • ${new Date().toISOString()}</p>
      </div>
    `;

    const sendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: CONTACT_FROM,
        to: [CONTACT_TO],
        reply_to: email,
        subject,
        html
      })
    });

    if (!sendRes.ok) {
      const err = await safeJson(sendRes);
      return res.status(500).json({ error: err?.message || 'Failed to send email.' });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: 'Unexpected error.' });
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function safeJson(res) {
  try { return await res.json(); } catch { return null; }
}


