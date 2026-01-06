const { Client } = require('pg');
const fetch = require('node-fetch');

exports.handler = async (event) => {
    if (event.headers['x-architect-key'] !== process.env.ARCHITECT_KEY) {
        return { statusCode: 401, body: 'Unauthorized' };
    }

    const { id, editedName, editedData } = JSON.parse(event.body);
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const res = await client.query("SELECT type FROM machine_submissions WHERE id = $1", [id]);
        const type = res.rows[0].type.toLowerCase();

        // ARCHITECT FIX: Push directly to Data/ root, no subfolders
        const fileName = `${type}_${editedName}.json`;
        const filePath = `Data/${fileName}`; 
        
        const content = Buffer.from(JSON.stringify(editedData, null, 2)).toString('base64');
        const githubUrl = `https://api.github.com/repos/shiroonigami23-ui/toc-suite/contents/${filePath}`;

        const ghResponse = await fetch(githubUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${process.env.GITHUB_PAT}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `🤖 Library Addition: ${fileName}`,
                content: content
            })
        });

        if (ghResponse.ok) {
            await client.query("UPDATE machine_submissions SET status = 'approved' WHERE id = $1", [id]);
            return { statusCode: 200, body: 'Pushed successfully' };
        } else {
            const err = await ghResponse.json();
            return { statusCode: 500, body: err.message };
        }
    } catch (err) {
        return { statusCode: 500, body: err.message };
    } finally {
        await client.end();
    }
};
