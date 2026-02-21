const { Client } = require('pg');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    if (event.headers['x-architect-key'] !== process.env.ARCHITECT_KEY) {
        return { statusCode: 401, body: 'Unauthorized' };
    }

    let payload;
    try {
        payload = JSON.parse(event.body || '{}');
    } catch (_e) {
        return { statusCode: 400, body: 'Invalid JSON payload' };
    }

    const id = Number(payload.id);
    const submissionMode = String(payload.submissionMode || 'practice').toLowerCase();
    const reviewNote = String(payload.reviewNote || '');
    const grade = payload.grade === null || payload.grade === '' ? null : Number(payload.grade);

    if (!Number.isInteger(id) || id <= 0) {
        return { statusCode: 400, body: 'Invalid submission id' };
    }
    if (!['practice', 'quiz'].includes(submissionMode)) {
        return { statusCode: 400, body: 'submissionMode must be practice or quiz' };
    }
    if (grade !== null && (Number.isNaN(grade) || grade < 0 || grade > 100)) {
        return { statusCode: 400, body: 'grade must be null or 0..100' };
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
            ADD COLUMN IF NOT EXISTS reviewed_by VARCHAR(120)
        `);

        const reviewedBy = 'Architect';
        await client.query(
            `UPDATE machine_submissions
             SET submission_mode = $1,
                 grade = $2,
                 review_note = $3,
                 reviewed_at = NOW(),
                 reviewed_by = $4
             WHERE id = $5`,
            [submissionMode, grade, reviewNote, reviewedBy, id]
        );

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ok: true })
        };
    } catch (err) {
        return { statusCode: 500, body: err.message };
    } finally {
        await client.end();
    }
};
