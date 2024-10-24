const pool = require('../db');

const createPoll = async (title, options) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const pollResult = await client.query(
            'INSERT INTO polls (title) VALUES ($1) RETURNING *',
            [title]
        );

        const pollId = pollResult.rows[0].id;

        const optionQueries = options.map(option => {
            return client.query(
                'INSERT INTO options (poll_id, option_text) VALUES ($1, $2) RETURNING *',
                [pollId, option]
            );
        });

        const optionResults = await Promise.all(optionQueries);

        // Commit the transaction
        await client.query('COMMIT');

        // Return the created poll and its options
        return {
            poll: pollResult.rows[0],
            options: optionResults.map(result => result.rows[0]) // Get the rows from each option result
        };
    } catch (error) {
        // Rollback the transaction in case of an error
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

module.exports = { createPoll };
