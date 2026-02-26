const { Client } = require('pg');
const fetch = require('node-fetch');

exports.handler = async (event) => {
    if (event.headers['x-architect-key'] !== process.env.ARCHITECT_KEY) {
        return { statusCode: 401, body: 'Unauthorized' };
    }

    const { ids } = JSON.parse(event.body || '{}');
    if (!Array.isArray(ids) || !ids.length) {
        return { statusCode: 400, body: 'No submission ids provided' };
    }

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
        const results = [];
        const repo = process.env.GITHUB_REPO || 'shiroonigami23-ui/toc-suite';

        for (const id of ids) {
            const res = await client.query(
                `SELECT ms.*, a.repo_eligible AS assignment_repo_eligible
                 FROM machine_submissions ms
                 LEFT JOIN assignments a ON a.id = ms.assignment_id
                 WHERE ms.id = $1
                 LIMIT 1`,
                [id]
            );
            const sub = res.rows[0];
            if (!sub) {
                results.push({ id, status: 'failed', reason: 'not_found' });
                continue;
            }
            const workflowState = String(sub.status || 'pending').toLowerCase();
            if (workflowState === 'rejected') {
                results.push({ id, status: 'failed', reason: 'rejected' });
                continue;
            }
            if (workflowState === 'pushed') {
                results.push({ id, status: 'failed', reason: 'already_pushed' });
                continue;
            }
            if (!['pending', 'review', 'approved'].includes(workflowState)) {
                results.push({ id, status: 'failed', reason: 'not_push_ready' });
                continue;
            }

            const isRepoEligible = Boolean(sub.repo_eligible) || Boolean(sub.assignment_repo_eligible);
            if (!isRepoEligible) {
                results.push({ id, status: 'failed', reason: 'not_repo_eligible' });
                continue;
            }

            const type = String(sub.type || '').toLowerCase();
            const fileName = `${type}_${sub.name}.json`;
            const filePath = `Data/${fileName}`;
            const content = Buffer.from(JSON.stringify(sub.data, null, 2)).toString('base64');
            const githubUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;

            const ghResponse = await fetch(githubUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${process.env.GITHUB_PAT}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `Bulk Library Addition: ${fileName}`,
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
                results.push({ id, status: 'success' });
            } else {
                const ghErr = await ghResponse.json().catch(() => ({}));
                results.push({ id, status: 'failed', reason: ghErr.message || 'github_push_failed' });
            }
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(results)
        };
    } catch (err) {
        return { statusCode: 500, body: err.message };
    } finally {
        await client.end();
    }
};
