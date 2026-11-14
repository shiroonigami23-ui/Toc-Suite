const { Client } = require('pg');

const handle = async (event) => {
    if (event.httpMethod !== 'GET') return { statusCode: 405, body: 'Method Not Allowed' };
    const machineType = String((event.queryStringParameters || {}).machineType || 'FA').toUpperCase();

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        await client.query(`
            CREATE TABLE IF NOT EXISTS assignments (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                machine_type VARCHAR(20) NOT NULL,
                assignment_mode VARCHAR(20) NOT NULL DEFAULT 'practice',
                prompt TEXT NOT NULL,
                start_at TIMESTAMP NULL,
                end_at TIMESTAMP NULL,
                max_marks INTEGER NOT NULL DEFAULT 100,
                max_submissions INTEGER NOT NULL DEFAULT 1,
                archive_after_days INTEGER NOT NULL DEFAULT 10,
                repo_eligible BOOLEAN NOT NULL DEFAULT FALSE,
                strict_device_lock BOOLEAN NOT NULL DEFAULT TRUE,
                is_active BOOLEAN NOT NULL DEFAULT TRUE,
                created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                created_by VARCHAR(120) NULL
            )
        `);
        await client.query(`
            ALTER TABLE assignments
            ADD COLUMN IF NOT EXISTS max_submissions INTEGER NOT NULL DEFAULT 1,
            ADD COLUMN IF NOT EXISTS archive_after_days INTEGER NOT NULL DEFAULT 10,
            ADD COLUMN IF NOT EXISTS repo_eligible BOOLEAN NOT NULL DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS strict_device_lock BOOLEAN NOT NULL DEFAULT TRUE
        `);

        const res = await client.query(
            `SELECT id, title, machine_type, assignment_mode, prompt, start_at, end_at, max_marks, max_submissions, archive_after_days, repo_eligible, strict_device_lock
             FROM assignments
             WHERE is_active = TRUE
               AND (machine_type = $1 OR machine_type = 'ALL')
               AND (start_at IS NULL OR start_at <= NOW())
               AND (end_at IS NULL OR end_at >= NOW())
             ORDER BY created_at DESC
             LIMIT 20`,
            [machineType]
        );

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(res.rows)
        };
    } catch (err) {
        return { statusCode: 500, body: err.message };
    } finally {
        await client.end();
    }
};

// The Android app (Capacitor, origin https://localhost) calls this function cross-origin.
const CORS_ORIGINS = new Set(['https://localhost', 'capacitor://localhost', 'http://localhost']);
const withCors = (handler) => async (event) => {
    const origin = event.headers?.origin || event.headers?.Origin || '';
    const cors = CORS_ORIGINS.has(origin)
        ? { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', Vary: 'Origin' }
        : {};
    if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors, body: '' };
    const res = await handler(event);
    return { ...res, headers: { ...(res.headers || {}), ...cors } };
};

exports.handler = withCors(handle);
