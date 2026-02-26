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
    const approvalState = String(payload.approvalState || 'review').toLowerCase();
    const grade = payload.grade === null || payload.grade === '' ? null : Number(payload.grade);

    if (!Number.isInteger(id) || id <= 0) {
        return { statusCode: 400, body: 'Invalid submission id' };
    }
    if (!['practice', 'quiz'].includes(submissionMode)) {
        return { statusCode: 400, body: 'submissionMode must be practice or quiz' };
    }
    if (!['review', 'approved', 'rejected', 'pending'].includes(approvalState)) {
        return { statusCode: 400, body: 'approvalState must be pending/review/approved/rejected' };
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
            ADD COLUMN IF NOT EXISTS reviewed_by VARCHAR(120),
            ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP,
            ADD COLUMN IF NOT EXISTS approved_by VARCHAR(120),
            ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMP,
            ADD COLUMN IF NOT EXISTS rejected_by VARCHAR(120),
            ADD COLUMN IF NOT EXISTS pushed_at TIMESTAMP,
            ADD COLUMN IF NOT EXISTS pushed_by VARCHAR(120)
        `);

        const reviewedBy = 'Architect';
        await client.query(
            `UPDATE machine_submissions
             SET submission_mode = $1,
                 grade = $2,
                 review_note = $3,
                 reviewed_at = NOW(),
                 reviewed_by = $4,
                 status = $5,
                 approved_at = CASE WHEN $5 = 'approved' THEN COALESCE(approved_at, NOW()) ELSE approved_at END,
                 approved_by = CASE WHEN $5 = 'approved' THEN COALESCE(approved_by, $4) ELSE approved_by END,
                 rejected_at = CASE WHEN $5 = 'rejected' THEN NOW() ELSE rejected_at END,
                 rejected_by = CASE WHEN $5 = 'rejected' THEN $4 ELSE rejected_by END
             WHERE id = $6`,
            [submissionMode, grade, reviewNote, reviewedBy, approvalState, id]
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
