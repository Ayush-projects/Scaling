const Product = require('../models/Product');

// Get All Products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Add Product (for admin use)
exports.addProduct = async (req, res) => {
    const { name, description, price, stock } = req.body;
    try {
        const product = await Product.create({ name, description, price, stock });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};