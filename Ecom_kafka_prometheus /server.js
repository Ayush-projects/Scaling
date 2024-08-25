require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const { validateRequest } = require('./middleware/validationMiddleware');
const setupSwagger = require('./config/swagger');
const { processOrders } = require('./kafka/kafkaConsumer');

// Import Prometheus middleware and metrics
const { promMiddleware, metricsEndpoint, orderCounter, orderDurationHistogram } = require('./middleware/prometheusMiddleware');

const app = express();
connectDB();

// Use Prometheus middleware for tracking API request durations
app.use(promMiddleware);

app.use(express.json());
app.use(errorHandler);
app.use(validateRequest);

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

// Start processing Kafka orders
processOrders();

// Setup Swagger
setupSwagger(app);


metricsEndpoint(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
