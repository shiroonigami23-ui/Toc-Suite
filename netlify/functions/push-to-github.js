const { Client } = require('pg');
const fetch = require('node-fetch');

exports.handler = async (event) => {
    if (event.headers['x-architect-key'] !== process.env.ARCHITECT_KEY) {
        return { statusCode: 401, body: 'Unauthorized' };
    }

    const { id, editedName, editedData } = JSON.parse(event.body || '{}');
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        await client.query(`
            ALTER TABLE machine_submissions
            ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP,
            ADD COLUMN IF NOT EXISTS approved_by VARCHAR(120),
            ADD COLUMN IF NOT EXISTS pushed_at TIMESTAMP,
            ADD COLUMN IF NOT EXISTS pushed_by VARCHAR(120)
        `).catch(() => {});
        const res = await client.query(
            `SELECT ms.type, ms.repo_eligible, ms.assignment_id, ms.status, a.repo_eligible AS assignment_repo_eligible
             FROM machine_submissions ms
             LEFT JOIN assignments a ON a.id = ms.assignment_id
             WHERE ms.id = $1
             LIMIT 1`,
            [id]
        );

        if (!res.rows.length) return { statusCode: 404, body: 'Submission not found' };

        const row = res.rows[0];
        const status = String(row.status || 'pending').toLowerCase();
        if (status === 'rejected') return { statusCode: 409, body: 'Submission is rejected and cannot be pushed' };
        if (status === 'pushed') return { statusCode: 409, body: 'Submission is already pushed' };
        if (!['pending', 'review', 'approved'].includes(status)) {
            return { statusCode: 409, body: `Submission status '${status}' is not push-ready` };
        }

        const isRepoEligible = Boolean(row.repo_eligible) || Boolean(row.assignment_repo_eligible);
        if (!isRepoEligible) {
            return {
                statusCode: 403,
                body: 'This submission is not repo-eligible. Only special hard-category items can be pushed.'
            };
        }

        const type = String(row.type || '').toLowerCase();
        const repo = process.env.GITHUB_REPO || 'shiroonigami23-ui/toc-suite';

        const fileName = `${type}_${editedName}.json`;
        const filePath = `Data/${fileName}`;
        const content = Buffer.from(JSON.stringify(editedData, null, 2)).toString('base64');
        const githubUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;

        const ghResponse = await fetch(githubUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${process.env.GITHUB_PAT}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `Library Addition: ${fileName}`,
                content
            })
        });

        if (ghResponse.ok) {
            await client.query(
                `UPDATE machine_submissions
                 SET status = 'pushed',
                     approved_at = COALESCE(approved_at, NOW()),
                     approved_by = COALESCE(approved_by, 'Architect'),
                     pushed_at = NOW(),
                     pushed_by = 'Architect'
                 WHERE id = $1`,
                [id]
            );
            return { statusCode: 200, body: 'Pushed successfully' };
        }

        const err = await ghResponse.json().catch(() => ({}));
        return { statusCode: 500, body: err.message || 'GitHub push failed' };
    } catch (err) {
        return { statusCode: 500, body: err.message };
    } finally {
        await client.end();
    }
};
