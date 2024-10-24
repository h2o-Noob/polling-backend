const pool = require('../db'); // Make sure you have your database connection set up

const getPollResults = async (pollId) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            `SELECT p.id AS poll_id, p.title AS poll_title, 
            o.id AS option_id, o.option_text AS option_name, 
            o.vote_count 
            FROM polls p 
            JOIN options o ON p.id = o.poll_id
            WHERE p.id = $1`,
            [pollId]
        );
        if (result.rows.length === 0) {
            return { message: "No poll results found." };
          }
        
        function getTopOptions(pollData) {
            // Sort options by vote_count in descending order
            const sortedOptions = pollData.sort((a, b) => b.vote_count - a.vote_count);
            
            // Get the poll title
            const pollTitle = pollData[0]?.poll_title || 'No title';
        
            // Get top 3 options
            const topOptions = sortedOptions.slice(0, 3).map(option => {
                return `${option.option_name}: ${option.vote_count} votes`;
            });
        
            // Return the poll title and top 3 options
            return {
                poll_title: pollTitle,
                top_3_options: topOptions
            };
        }

        return result.rows;
    } finally {
        client.release();
    }
};

module.exports = { getPollResults };