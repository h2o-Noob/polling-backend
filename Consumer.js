const { Kafka } = require('kafkajs');
const { getPollResults } = require('./routes/Result');
const { createVote } = require('./routes/Vote'); 
const { broadcast } = require('./websocket');

const kafka = new Kafka({
  clientId: 'polling-system',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'poll-group', sessionTimeout: 30000 });

const runConsumer = async () => {
  await consumer.connect(); 
  await consumer.subscribe({ topic: 'poll_votes', fromBeginning: false });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("Received message from topic:", topic);
    
      try {
        console.log("Raw message:", message.value.toString());
        const voteData = JSON.parse(message.value.toString());
        console.log("Parsed Vote Data: ", voteData);
    
        const pollId = parseInt(voteData.poll_id);
        const { option_id } = voteData;
    
        const vote = await createVote(pollId, option_id); 
        console.log(`Vote recorded in DB:`, vote);

        const updatedPollData = await getPollResults(pollId);
        if (updatedPollData && updatedPollData.length > 0) {
          broadcast(pollId, updatedPollData);
        } else {
          console.log('No updated poll data to broadcast.');
        }

      } catch (error) {
        console.error('Error processing vote message:', error);
      }
    },
  });
};

const startConsumer = async () => {
  try {
    await runConsumer();
    console.log("Kafka Consumer has started.");
  } catch (error) {
    console.error('Error starting Kafka consumer:', error);
  }
};

module.exports = startConsumer;
