const { Client } = require('pg');

exports.handler = async (event) => {
    if (event.headers['x-architect-key'] !== process.env.ARCHITECT_KEY) {
        return { statusCode: 401, body: 'Unauthorized' };
    }

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        await client.query(`
            ALTER TABLE machine_submissions
            ADD COLUMN IF NOT EXISTS submission_mode VARCHAR(20) DEFAULT 'practice',
            ADD COLUMN IF NOT EXISTS grade INTEGER,
            ADD COLUMN IF NOT EXISTS review_note TEXT,
            ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP,
            ADD COLUMN IF NOT EXISTS reviewed_by VARCHAR(120),
            ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP,
            ADD COLUMN IF NOT EXISTS approved_by VARCHAR(120),
            ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMP,
            ADD COLUMN IF NOT EXISTS rejected_by VARCHAR(120),
            ADD COLUMN IF NOT EXISTS pushed_at TIMESTAMP,
            ADD COLUMN IF NOT EXISTS pushed_by VARCHAR(120)
        `).catch(() => {});
        await client.query(`
            ALTER TABLE assignments
            ADD COLUMN IF NOT EXISTS max_submissions INTEGER NOT NULL DEFAULT 1,
            ADD COLUMN IF NOT EXISTS archive_after_days INTEGER NOT NULL DEFAULT 10,
            ADD COLUMN IF NOT EXISTS repo_eligible BOOLEAN NOT NULL DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS strict_device_lock BOOLEAN NOT NULL DEFAULT TRUE
        `).catch(() => {});
        await client.query(`
            UPDATE machine_submissions ms
            SET status = 'archived'
            FROM assignments a
            WHERE ms.assignment_id = a.id
              AND ms.status = 'pending'
              AND (
                (a.end_at IS NOT NULL AND NOW() > (a.end_at + (a.archive_after_days::text || ' days')::interval))
              )
        `).catch(() => {});
        // Fallback archive logic when end_at is null
        await client.query(`
            UPDATE machine_submissions ms
            SET status = 'archived'
            FROM assignments a
            WHERE ms.assignment_id = a.id
              AND ms.status = 'pending'
              AND a.end_at IS NULL
              AND ms.created_at < (NOW() - (a.archive_after_days::text || ' days')::interval)
        `).catch(() => {});

        const res = await client.query(`
            SELECT
              ms.*,
              COALESCE(a.repo_eligible, FALSE) AS repo_eligible,
              a.max_submissions,
              a.archive_after_days,
              EXTRACT(EPOCH FROM (NOW() - ms.created_at)) / 3600.0 AS age_hours
            FROM machine_submissions ms
            LEFT JOIN assignments a ON ms.assignment_id = a.id
            WHERE COALESCE(ms.status, 'pending') <> 'archived'
            ORDER BY
              CASE COALESCE(ms.status, 'pending')
                WHEN 'pending' THEN 1
                WHEN 'review' THEN 2
                WHEN 'approved' THEN 3
                WHEN 'rejected' THEN 4
                WHEN 'pushed' THEN 5
                ELSE 6
              END,
              ms.created_at DESC
        `);

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(res.rows)
        };
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    } finally {
        await client.end();
    }
};
