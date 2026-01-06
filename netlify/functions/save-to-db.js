const { Client } = require('pg');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

    const { name, type, data, author } = JSON.parse(event.body);
    
    // FIX: Add SSL configuration for Neon
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false // Required for Neon cloud connections
        }
    });

    try {
        await client.connect();
        
        // Ensure data is sent as a string if using JSONB, or ensure it's a valid object
        const query = 'INSERT INTO machine_submissions (name, type, data, author) VALUES ($1, $2, $3, $4) RETURNING id';
        const res = await client.query(query, [name, type, JSON.stringify(data), author]);
        
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: 'Staged for review', id: res.rows[0].id })
        };
    } catch (err) {
        console.error("Database Error:", err);
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: err.message, stack: err.stack }) 
        };
    } finally {
        await client.end();
    }
};
