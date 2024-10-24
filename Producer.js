const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'polling-system', 
    brokers: ['localhost:9092'], 
});

const producer = kafka.producer();

const sendVote = async (vote) => {
    try {
        await producer.connect();

        const result = await producer.send({
            topic: 'poll_votes',  
            messages: [
                { value: JSON.stringify(vote) }  
            ],
        });

        console.log('Vote sent successfully:', result);
    } catch (err) {
        console.error('Error sending vote to Kafka:', err);
    } finally {
        await producer.disconnect();
    }
};

module.exports = { sendVote };
