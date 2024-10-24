# Real-Time Polling System

This project implements a real-time polling system using WebSockets, Kafka, and Express.js. Users can create polls, cast votes, and see real-time results.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
- [Usage](#usage)
- [WebSocket Integration](#websocket-integration)

## Features
- Create and manage polls
- Real-time voting updates using WebSockets
- Leaderboard feature to show top polls
- Persistent storage of poll results

## Technologies Used
- **Node.js** for server-side JavaScript
- **Express.js** for building the API
- **WebSockets** for real-time communication
- **Kafka** for handling message queues
- **PostgreSQL** for storing poll data
- **HTML/CSS** for the front-end

## Setup Instructions

I. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

II. **Install Dependencies:** Ensure you have Node.js and npm installed. Run the following command to install the necessary dependencies:
   ```bash
   npm install
   ```

III. **Configure Kafka:** Make sure you have Kafka installed and running. Set up a Kafka topic called `poll_votes`:
   ```bash
   kafka-topics.sh --create --topic poll_votes --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1
   ```

IV. **Setup PostgreSQL Database:** Create a PostgreSQL database and configure the database connection in your project as needed.

## Running the Application

Start the WebSocket and Express servers: The WebSocket server runs on port 8081 and the Express API server runs on port 3000.
```bash
npm run start
```

Alternatively, you can start the servers separately:
```bash
# Start WebSocket server
node websocket.js

# Start Express API server
node index.js
```

V. **Start Kafka Consumer:** The consumer listens to the `poll_votes` topic for vote messages and updates the poll results in the database.
```bash
node Consumer.js
```

## Usage

I. **Creating a Poll** Send a POST request to `/polls` with a poll title and options:
```json
{
  "title": "Favorite Programming Language?",
  "options": ["JavaScript", "Python", "Java"]
}
```

II. **Casting a Vote** Send a POST request to `/polls/:id/vote` with the poll's ID and option ID:
```json
{
  "option_id": 1
}
```

III. **Viewing Poll Results** Visit `/results.html?pollId=<pollId>` to view real-time results.

IV. **Viewing the Leaderboard** Send a GET request to `/leaderboard` to get the leaderboard of top polls.

## WebSocket Integration

The WebSocket server runs on port 8081. It broadcasts real-time updates to clients whenever a vote is cast. Clients can receive these updates to refresh the poll results on the page without needing a page reload.
