const pool = require('../db');

const getLeaderboard = async (req, res) => {
    const client = await pool.connect();
    try {
        // Fetch top 10 options based on total votes
        const result = await client.query(`
            SELECT o.id AS option_id, o.option_text, SUM(o.vote_count) AS total_votes
            FROM options o
            GROUP BY o.id, o.option_text
            ORDER BY total_votes DESC
            LIMIT 10;  -- Limit to top 10 options
        `);
        
        // Return the leaderboard data
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ error: 'Error fetching leaderboard' });
    } finally {
        client.release();
    }
};

module.exports = { getLeaderboard };
