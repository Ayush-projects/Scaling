const { Kafka } = require('kafkajs');
const Order = require('../models/Order');
const { orderCounter, orderDurationHistogram } = require('../middleware/prometheusMiddleware');

const kafka = new Kafka({ clientId: 'order-consumer', brokers: ['localhost:9092'] });

const consumer = kafka.consumer({ groupId: 'order-group' });

const processOrders = async () => {
    try {
        // Connect to Kafka broker
        await consumer.connect();
        console.log('Connected to Kafka broker.');

        // Subscribe to the order_topic
        await consumer.subscribe({ topic: 'order_topic', fromBeginning: true });
        console.log('Subscribed to order_topic.');

        // Start consuming messages
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const start = Date.now(); // Start timer for processing time
                const orderDetails = JSON.parse(message.value.toString());

                try {
                    // Create the order in the database
                    const order = await Order.create({
                        user: orderDetails.userId,
                        orderItems: orderDetails.orderItems,
                        totalPrice: orderDetails.totalPrice,
                        createdAt: new Date(),
                    });

                    // Log successful order processing
                    console.log(`Processed order ${order._id}`);

                    // Increment Prometheus order counter
                    orderCounter.inc();

                    // Record the processing duration
                    const processingDuration = Date.now() - start;
                    orderDurationHistogram.observe(processingDuration);

                } catch (error) {
                    // Log and handle errors
                    console.error('Failed to process order:', error);
                }
            },
        });
    } catch (error) {
        // Log and handle connection or subscription errors
        console.error('Failed to process orders:', error);
    }
};

module.exports = { processOrders };
