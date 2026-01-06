const { Client } = require('pg');

exports.handler = async (event) => {
    // SECURITY CHECK: Verify the secret header
    if (event.headers['x-architect-key'] !== process.env.ARCHITECT_KEY) {
        return { statusCode: 401, body: 'Unauthorized' };
    }

    const client = new Client(process.env.DATABASE_URL);
    try {
        await client.connect();
        const res = await client.query("SELECT * FROM machine_submissions WHERE status = 'pending' ORDER BY created_at DESC");
        return { statusCode: 200, body: JSON.stringify(res.rows) };
    } catch (err) {
        return { statusCode: 500, body: err.message };
    } finally {
        await client.end();
    }
};