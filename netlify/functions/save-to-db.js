const { Client } = require('pg');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

    try {
        const { name, type, data, author } = JSON.parse(event.body);
        
        // ARCHITECT'S FIX: Use object-based config to enable SSL for Neon
        const client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false // Required for Neon cloud connections
            }
        });

        await client.connect();
        
        // Ensure data is stringified for the JSONB column
        const query = 'INSERT INTO machine_submissions (name, type, data, author) VALUES ($1, $2, $3, $4) RETURNING id';
        const res = await client.query(query, [name, type, JSON.stringify(data), author]);
        
        await client.end();

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: 'Success', id: res.rows[0].id })
        };
    } catch (err) {
        console.error("Database Error:", err.message);
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: "Database Connection Failed", details: err.message }) 
        };
    }
};
