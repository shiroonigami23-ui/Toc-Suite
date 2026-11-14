// Server-side proxy for the AI machine generators (image → machine, text → machine).
// The Gemini key never reaches the browser. Env vars (Netlify → Site settings → Environment):
//   AI_ACCESS_PASSWORD  password students type to unlock the AI tools (shared with verify-ai-password)
//   GEMINI_API_KEY      Google AI Studio key
//   GEMINI_MODEL        optional, defaults to the auto-updating "gemini-flash-latest" alias
exports.handler = async (event) => {
    const json = (statusCode, body) => ({ statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (event.httpMethod !== 'POST') return json(405, { error: 'Method Not Allowed' });

    let body;
    try { body = JSON.parse(event.body || '{}'); } catch (_e) { return json(400, { error: 'Invalid JSON' }); }

    const expected = String(process.env.AI_ACCESS_PASSWORD || '');
    if (!expected || String(body.password || '') !== expected) return json(401, { error: 'AI access is locked' });

    const key = process.env.GEMINI_API_KEY;
    if (!key) return json(500, { error: 'GEMINI_API_KEY is not configured' });

    const payload = body.payload;
    if (!payload || !Array.isArray(payload.contents)) return json(400, { error: 'Missing payload.contents' });
    if ((event.body || '').length > 6 * 1024 * 1024) return json(413, { error: 'Image too large (max ~4 MB)' });

    const model = process.env.GEMINI_MODEL || 'gemini-flash-latest';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
            body: JSON.stringify({ contents: payload.contents, generationConfig: payload.generationConfig }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) return json(res.status, { error: data?.error?.message || `Gemini request failed (${res.status})` });
        const text = (data.candidates?.[0]?.content?.parts || []).map(p => p.text || '').join('');
        return json(200, { text });
    } catch (e) {
        return json(502, { error: 'Could not reach the AI service' });
    }
};
