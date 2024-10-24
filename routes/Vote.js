const pool = require('../db');

const createVote = async (poll_id, option_id) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Start a transaction

        // Insert the vote into the 'votes' table
        const voteResult = await client.query(
            'INSERT INTO votes (poll_id, option_id) VALUES ($1, $2) RETURNING *',
            [poll_id, option_id]
        );

        // Update the vote_count in the 'options' table
        await client.query(
            'UPDATE options SET vote_count = vote_count + 1 WHERE id = $1',
            [option_id]
        );

        await client.query('COMMIT'); // Commit the transaction

        return voteResult.rows[0]; // Return the inserted vote
    } catch (error) {
        await client.query('ROLLBACK'); // Rollback in case of error
        throw error; // Re-throw the error for further handling
    } finally {
        client.release();
    }
};

module.exports = { createVote };
