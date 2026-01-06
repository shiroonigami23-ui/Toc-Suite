const { Client } = require('pg');
const fetch = require('node-fetch');

exports.handler = async (event) => {
    if (event.headers['x-architect-key'] !== process.env.ARCHITECT_KEY) {
        return { statusCode: 401, body: 'Unauthorized' };
    }

    const { ids } = JSON.parse(event.body);
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const results = [];

        for (const id of ids) {
            const res = await client.query("SELECT * FROM machine_submissions WHERE id = $1", [id]);
            const sub = res.rows[0];
            
            const type = sub.type.toLowerCase();
            const fileName = `${type}_${sub.name}.json`;
            const filePath = `Data/${type}/${fileName}`; // Root Data folder
            const content = Buffer.from(JSON.stringify(sub.data, null, 2)).toString('base64');
            
            const githubUrl = `https://api.github.com/repos/shiroonigami23-ui/toc-suite/contents/${filePath}`;

            const ghResponse = await fetch(githubUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${process.env.GITHUB_PAT}`, // Secret PAT
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `🤖 Bulk Library Addition: ${fileName}`,
                    content: content
                })
            });

            if (ghResponse.ok) {
                await client.query("UPDATE machine_submissions SET status = 'approved' WHERE id = $1", [id]);
                results.push({ id, status: 'success' });
            }
        }

        return { statusCode: 200, body: JSON.stringify(results) };
    } catch (err) {
        return { statusCode: 500, body: err.message };
    } finally {
        await client.end();
    }
};