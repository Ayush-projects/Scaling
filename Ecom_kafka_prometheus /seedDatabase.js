const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker'); // Destructure to access the correct methods
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Load models
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));

// Function to generate random users
const generateUsers = async (num) => {
    for (let i = 0; i < num; i++) {
        const user = new User({
            name: faker.person.fullName(), // Updated method name
            email: faker.internet.email(),
            password: 'password123', // You may hash this if needed
        });
        await user.save();
    }
    console.log(`${num} users generated.`);
};

// Function to generate random products
const generateProducts = async (num) => {
    for (let i = 0; i < num; i++) {
        const product = new Product({
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: parseFloat(faker.commerce.price()), // Convert price to number
            stock: faker.number.int({ min: 10, max: 100 }), // Updated method name
        });
        await product.save();
    }
    console.log(`${num} products generated.`);
};

// Function to generate random orders
const generateOrders = async (num) => {
    const users = await User.find();
    const products = await Product.find();

    for (let i = 0; i < num; i++) {
        const randomUser = faker.helpers.arrayElement(users);
        const randomProduct = faker.helpers.arrayElement(products);
        const orderItems = [
            {
                product: randomProduct._id,
                quantity: faker.number.int({ min: 1, max: 5 }), // Updated method name
            },
        ];

        const order = new Order({
            user: randomUser._id,
            orderItems,
            totalPrice: orderItems.reduce((total, item) => total + item.quantity * randomProduct.price, 0),
            isPaid: faker.datatype.boolean(),
            paidAt: faker.date.recent(),
        });

        await order.save();
    }
    console.log(`${num} orders generated.`);
};

// Run the seeding functions
const seedDatabase = async () => {
    await generateUsers(20);    // Generate 20 random users
    await generateProducts(30); // Generate 30 random products
    await generateOrders(15);   // Generate 15 random orders
    mongoose.connection.close();
};

seedDatabase();