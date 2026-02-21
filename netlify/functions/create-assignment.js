const { Client } = require('pg');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
    if (event.headers['x-architect-key'] !== process.env.ARCHITECT_KEY) return { statusCode: 401, body: 'Unauthorized' };

    let body;
    try {
        body = JSON.parse(event.body || '{}');
    } catch (_e) {
        return { statusCode: 400, body: 'Invalid JSON' };
    }

    const title = String(body.title || '').trim();
    const machineType = String(body.machineType || 'FA').toUpperCase();
    const assignmentMode = String(body.assignmentMode || 'practice').toLowerCase();
    const prompt = String(body.prompt || '').trim();
    const startAt = body.startAt || null;
    const endAt = body.endAt || null;
    const maxMarks = Number(body.maxMarks || 100);
    const archiveAfterDays = Math.max(7, Math.min(15, Number(body.archiveAfterDays || 10)));
    const maxSubmissions = Math.max(1, Math.min(20, Number(body.maxSubmissions || 1)));
    const repoEligible = body.repoEligible === true || String(body.repoEligible || '').toLowerCase() === 'true';
    const strictDeviceLock = !(body.strictDeviceLock === false || String(body.strictDeviceLock || '').toLowerCase() === 'false');

    if (!title || !prompt) return { statusCode: 400, body: 'title and prompt are required' };
    if (!['FA', 'MM', 'PDA', 'TM', 'ALL'].includes(machineType)) return { statusCode: 400, body: 'machineType must be FA/MM/PDA/TM/ALL' };
    if (!['quiz', 'practice'].includes(assignmentMode)) return { statusCode: 400, body: 'assignmentMode must be quiz or practice' };

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

        const createdBy = 'Architect';
        const res = await client.query(
            `INSERT INTO assignments
            (title, machine_type, assignment_mode, prompt, start_at, end_at, max_marks, max_submissions, archive_after_days, repo_eligible, strict_device_lock, is_active, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,TRUE,$12)
             RETURNING id`,
            [title, machineType, assignmentMode, prompt, startAt, endAt, maxMarks, maxSubmissions, archiveAfterDays, repoEligible, strictDeviceLock, createdBy]
        );

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ok: true, id: res.rows[0].id })
        };
    } catch (err) {
        return { statusCode: 500, body: err.message };
    } finally {
        await client.end();
    }
};
