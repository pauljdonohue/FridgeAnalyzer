// api/openai-ping.js
export default async function handler(req, res) {
  try {
    // minimal “is it working?” call using the Responses API
    const r = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',          // small & cheap sanity-check model
        input: 'Say "pong" in one word.'
      }),
    });

    const data = await r.json();

    // A simple, robust way to surface success:
    // Try common fields; fall back to returning raw JSON.
    const text =
      data?.output_text ||
      data?.content?.[0]?.text ||
      data?.choices?.[0]?.message?.content ||
      JSON.stringify(data);

    res.status(200).json({ ok: true, text });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
}