exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    let body;
    try {
        body = JSON.parse(event.body || '{}');
    } catch (_e) {
        return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'Invalid JSON' }) };
    }

    const provided = String(body.password || '');
    const expected = String(process.env.AI_ACCESS_PASSWORD || '');

    if (!expected) {
        return {
            statusCode: 500,
            body: JSON.stringify({ ok: false, error: 'AI_ACCESS_PASSWORD is not configured' })
        };
    }

    const ok = provided.length > 0 && provided === expected;
    return {
        statusCode: ok ? 200 : 401,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok })
    };
};
