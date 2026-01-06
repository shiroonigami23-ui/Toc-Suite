const { Client } = require('pg');

exports.handler = async (event) => {
    // SECURITY: Ensure only the Architect (with the secret header) can see the queue
    if (event.headers['x-architect-key'] !== process.env.ARCHITECT_KEY) {
        return { statusCode: 401, body: 'Unauthorized' };
    }

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false } // Required for cloud Postgres
    });

    try {
        await client.connect();
        // Fetch only machines waiting for review
        const res = await client.query("SELECT * FROM machine_submissions WHERE status = 'pending' ORDER BY created_at DESC");
        
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(res.rows)
        };
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    } finally {
        await client.end();
    }
};
