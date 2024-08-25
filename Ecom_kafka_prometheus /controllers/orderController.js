const Order = require('../models/Order');
const { produceMessage } = require('../kafka/kafkaProducer');  // Import Kafka producer

// Place Order
exports.placeOrder = async (req, res) => {
    const { orderItems, totalPrice } = req.body;
    try {
        await produceMessage('order_topic', { userId: req.user._id, orderItems, totalPrice });
        res.status(201).json({ message: 'Order is being processed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};