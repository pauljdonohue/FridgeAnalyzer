// /api/openai-ping.js
export default async function handler(req, res) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ ok: false, error: "OPENAI_API_KEY not set" });
    }

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: 'Reply with the single word: "pong".',
      }),
    });

    const raw = await r.text();
    if (!r.ok) return res.status(r.status).json({ ok: false, error: raw });

    let data;
    try { data = JSON.parse(raw); } catch { data = { raw }; }

    // Extract just the text:
    const text =
      data?.output_text ||
      data?.content?.[0]?.text ||
      data?.output?.[0]?.text || // your screenshot showed `output[0].text: "pong"`
      raw;

    // Return only what the UI needs:
    return res.status(200).json({ ok: true, text });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
}