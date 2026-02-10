const express = require('express');
const router = express.Router();
const { adminLogin, changePassword } = require('../controllers/admin.controller');
const { getData, saveData } = require('../utils/storage');
const jwt = require('jsonwebtoken');

// Auth middleware
const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'akfishfarms_secret');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

router.post('/login', adminLogin);
router.post('/change-password', auth, changePassword);

// Orders - Public (Placement)
router.post('/orders', (req, res) => {
    const { customerName, place, phone, items, total } = req.body;
    if (!customerName || !place || !phone || !items || !total) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const data = getData();
    const orderId = `AKF-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
        id: orderId,
        customerName,
        place,
        phone,
        items,
        total,
        status: 'Processing',
        date: new Date().toISOString(),
        deliveryNotes: ''
    };

    data.orders.push(newOrder);
    saveData(data);
    res.json(newOrder);
});

router.get('/orders/track/:id', (req, res) => {
    const data = getData();
    const order = data.orders.find(o => o.id.toLowerCase() === req.params.id.toLowerCase());
    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json({
        customerName: order.customerName,
        place: order.place,
        status: order.status,
        deliveryNotes: order.deliveryNotes
    });
});

// Orders - Private (Admin)
router.get('/orders', auth, (req, res) => {
    const data = getData();
    res.json(data.orders);
});

router.put('/orders/:id', auth, (req, res) => {
    const { status, deliveryNotes } = req.body;
    const data = getData();
    const orderIndex = data.orders.findIndex(o => o.id === req.params.id);
    if (orderIndex === -1) return res.status(404).json({ message: 'Order not found' });

    if (status) data.orders[orderIndex].status = status;
    if (deliveryNotes) data.orders[orderIndex].deliveryNotes = deliveryNotes;

    saveData(data);
    res.json(data.orders[orderIndex]);
});

router.delete('/orders/:id', auth, (req, res) => {
    const data = getData();
    data.orders = data.orders.filter(o => o.id !== req.params.id);
    saveData(data);
    res.json({ message: 'Order deleted' });
});

// Offers
router.get('/offers', (req, res) => {
    const data = getData();
    res.json(data.offers);
});

router.post('/offers', auth, (req, res) => {
    const data = getData();
    const newOffer = { id: Date.now().toString(), ...req.body };
    data.offers.push(newOffer);
    saveData(data);
    res.json(newOffer);
});

router.put('/offers/:id', auth, (req, res) => {
    const data = getData();
    const index = data.offers.findIndex(o => o.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Offer not found' });
    data.offers[index] = { ...data.offers[index], ...req.body };
    saveData(data);
    res.json(data.offers[index]);
});

router.delete('/offers/:id', auth, (req, res) => {
    const data = getData();
    data.offers = data.offers.filter(o => o.id !== req.params.id);
    saveData(data);
    res.json({ message: 'Offer removed' });
});

// Products (Basic Control)
router.get('/products', (req, res) => {
    const data = getData();
    res.json(data.products);
});

router.post('/products/sync', auth, (req, res) => {
    const { products } = req.body;
    const data = getData();
    data.products = products;
    saveData(data);
    res.json({ message: 'Products synced' });
});

router.put('/products/:id', auth, (req, res) => {
    const data = getData();
    const index = data.products.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Product not found' });
    data.products[index] = { ...data.products[index], ...req.body };
    saveData(data);
    res.json(data.products[index]);
});

module.exports = router;
