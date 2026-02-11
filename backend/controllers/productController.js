const { Product } = require('../db');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
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
