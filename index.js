const express = require('express');
const path = require('path');
const app = express();
const { createPoll } = require('./routes/Poll');
const { sendVote } = require('./Producer');
const startConsumer = require('./Consumer');
const { getLeaderboard } = require('./routes/Leaderboard');
const { getPollResults } = require('./routes/Result');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/results', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'results.html'));
});


app.post('/polls', async (req, res) => {
    const { title, options } = req.body;
    const poll = await createPoll(title, options);
    res.status(201).json(poll);
});

app.post('/polls/:id/vote', (req, res) => {
    const vote = { poll_id: req.params.id, option_id: req.body.option_id };
    sendVote(vote);
    res.status(200).json({ message: 'Vote sent!' });
});

app.get('/polls/:id', async (req, res) => {
    try {
        const results = await getPollResults(req.params.id); // Fetch poll results
        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching poll results:', error);
        res.status(500).json({ error: 'Failed to fetch poll results' });
    }
});

// Route for retrieving the leaderboard
app.get('/leaderboard', async (req, res) => {
    try {
        const leaderboard = await getLeaderboard(req, res); // Fetch leaderboard data
        res.status(200).json(leaderboard);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
});

app.listen(3000, () => {
    startConsumer();
    console.log('Server running on port 3000');
});
