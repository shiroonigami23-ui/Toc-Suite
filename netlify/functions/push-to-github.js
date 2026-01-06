const { Client } = require('pg');
const fetch = require('node-fetch'); // Ensure "node-fetch": "^2.6.7" is in your package.json

exports.handler = async (event) => {
    // 1. SECURITY: Block any unauthorized access
    if (event.headers['x-architect-key'] !== process.env.ARCHITECT_KEY) {
        return { statusCode: 401, body: 'Unauthorized' };
    }

    const { id } = JSON.parse(event.body);
    const client = new Client(process.env.DATABASE_URL); // Neon DB connection

    try {
        await client.connect();
        
        // 2. Fetch the staging data
        const res = await client.query("SELECT * FROM machine_submissions WHERE id = $1", [id]);
        if (res.rows.length === 0) return { statusCode: 404, body: 'Submission not found' };
        const submission = res.rows[0];

        // 3. ARCHITECT'S DATA CONTRACT: Construct the GitHub Path
        // Fix applied: "Data" folder with capital 'D' at root
        const typeFolder = submission.type.toLowerCase(); // 'pda', 'tm', etc.
        const fileName = `${typeFolder}_${submission.name}.json`;
        const filePath = `Data/${typeFolder}/${fileName}`; 
        
        const content = Buffer.from(JSON.stringify(submission.data, null, 2)).toString('base64');
        const githubUrl = `https://api.github.com/repos/shiroonigami23-ui/toc-suite/contents/${filePath}`;

        // 4. COMMIT TO GITHUB: Using the hidden PAT
        const ghResponse = await fetch(githubUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${process.env.GITHUB_PAT}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `🤖 Library Auto-Update: Added ${fileName} (Approved by Architect)`,
                content: content
            })
        });

        if (ghResponse.ok) {
            // 5. Finalize: Mark as approved in DB to clear the dashboard queue
            await client.query("UPDATE machine_submissions SET status = 'approved' WHERE id = $1", [id]);
            return { 
                statusCode: 200, 
                body: JSON.stringify({ message: `Successfully pushed ${fileName} to GitHub Library.` }) 
            };
        } else {
            const errorData = await ghResponse.json();
            return { statusCode: 500, body: `GitHub API Error: ${errorData.message}` };
        }
    } catch (err) {
        return { statusCode: 500, body: `Server Error: ${err.message}` };
    } finally {
        await client.end();
    }
};