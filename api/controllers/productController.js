const { Product } = require('../db');
const { randomUUID } = require('crypto');

exports.getAllProducts = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const products = await Product.findAll({
            limit: limit
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { name, price, active } = req.body;
        if (!name || !price) {
            return res.status(400).json({ message: 'Name and price are required' });
        }

        const id = req.body.id || randomUUID();

        const product = await Product.create({
            id,
            name,
            price,
            active: active !== undefined ? active : true
        });

        res.status(201).json(product);
    } catch (error) {
        console.error("Create product error:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, active } = req.body;
        const product = await Product.findByPk(id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        if (name !== undefined) product.name = name;
        if (price !== undefined) product.price = price;
        if (active !== undefined) product.active = active;

        await product.save();
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        await product.destroy();
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.syncProducts = async (req, res) => {
    try {
        const { products } = req.body;
        for (const p of products) {
            await Product.upsert(p);
        }
        res.json({ message: 'Products synced' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
