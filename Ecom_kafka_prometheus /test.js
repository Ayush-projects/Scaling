const { Kafka } = require('kafkajs');

async function testKafkaConnection() {
  const kafka = new Kafka({
    clientId: 'test-client',
    brokers: ['localhost:9092', 'localhost:9093', 'localhost:9094'], 
  });

  const producer = kafka.producer();

  try {
    // Connect to Kafka
    await producer.connect();
    console.log('Successfully connected to Kafka!');

    // Produce a test message
    const result = await producer.send({
      topic: 'test-topic',
      messages: [
        { value: 'Hello KafkaJS user!' },
      ],
    });

    console.log('Test message sent successfully:', result);
  } catch (err) {
    console.error('Failed to connect or send message:', err);
  } finally {
    // Disconnect the producer
    await producer.disconnect();
    console.log('Producer disconnected');
  }
}

testKafkaConnection();
