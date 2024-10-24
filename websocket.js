const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const PORT = 8081;

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('User connected to WebSocket.');

    ws.on('close', () => {
        console.log('User disconnected from WebSocket.');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

const broadcast = (pollId, updatedData) => {
    const message = JSON.stringify({
        pollId,
        updatedResults: updatedData,
    });

    console.log(`Broadcasting to ${wss.clients.size} clients.`);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        } else {
            console.log('Client is not ready to receive messages.');
        }
    });
};

app.get('/', (req, res) => {
    res.send('Hello, WebSocket with Express!');
});

server.listen(PORT, () => {
    console.log(`Express server listening on http://localhost:${PORT}`);
});

module.exports = { broadcast };
