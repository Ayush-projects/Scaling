const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'backend',
  brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094'],
});

const producer = kafka.producer();

const connectProducer = async () => {
  try {
    await producer.connect();
    console.log('Kafka producer connected');
  } catch (err) {
    console.error('Failed to connect Kafka producer:', err);
    process.exit(1);  // Exit process if connection fails
  }
};

const produceMessage = async (topic, message) => {
  try {
    console.log(`Attempting to send message to topic ${topic}`);
    await producer.send({
      topic: topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    console.log(`Message sent to topic ${topic}`);
  } catch (err) {
    console.error('Failed to send message:', err);
  }
};

process.on('beforeExit', async () => {
  await producer.disconnect();
  console.log('Kafka producer disconnected');
});

connectProducer();  // Ensure connection is established before any other operations

module.exports = { produceMessage, connectProducer };
