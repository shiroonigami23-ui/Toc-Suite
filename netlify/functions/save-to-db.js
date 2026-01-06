const { Client } = require('pg');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

    const { name, type, data, author } = JSON.parse(event.body);
    // Uses the DATABASE_URL you set in Netlify
    const client = new Client(process.env.DATABASE_URL); 

    try {
        await client.connect();
        const query = 'INSERT INTO machine_submissions (name, type, data, author) VALUES ($1, $2, $3, $4) RETURNING id';
        const res = await client.query(query, [name, type, data, author]);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Staged for review', id: res.rows[0].id })
        };
    } catch (err) {
        return { statusCode: 500, body: err.message };
    } finally {
        await client.end();
    }
};