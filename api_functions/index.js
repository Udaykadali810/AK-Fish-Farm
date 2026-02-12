const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// Hardcoded admin credentials
const ADMIN_EMAIL = 'admin@akfishfarms.com';
const ADMIN_PASSWORD = 'AKFish2026!';
const JWT_SECRET = 'ak_fish_farms_secret_key_2026';

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: "Backend is working on Vercel!", status: "OK", timestamp: new Date().toISOString() });
});

// Auth routes
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const identifier = email || username;

        console.log('Login attempt for:', identifier);

        if (identifier === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            const token = jwt.sign({ id: 1, role: 'admin', email: ADMIN_EMAIL }, JWT_SECRET, { expiresIn: '24h' });
            return res.json({ token, role: 'admin' });
        }

        return res.status(401).json({ message: 'Invalid credentials' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Offers route
app.get('/api/offers', (req, res) => {
    res.json([
        { id: 1, title: "Welcome Offer", discount: 10, code: "WELCOME10" },
        { id: 2, title: "First Purchase", discount: 15, code: "FIRST15" }
    ]);
});

// Orders routes
app.post('/api/orders', (req, res) => {
    const order = req.body;
    const orderId = 'ORD' + Date.now();
    res.json({ orderId, status: 'pending', ...order });
});

app.get('/api/orders/:orderId', (req, res) => {
    const { orderId } = req.params;
    res.json({
        orderId,
        status: 'processing',
        items: [],
        total: 0,
        createdAt: new Date().toISOString()
    });
});

// Inquiries route
app.post('/api/inquiries', (req, res) => {
    const inquiry = req.body;
    res.json({ message: 'Inquiry submitted successfully', id: Date.now() });
});

// Admin routes
app.get('/api/admin/dashboard', (req, res) => {
    res.json({
        totalOrders: 0,
        totalRevenue: 0,
        totalCustomers: 0,
        recentOrders: []
    });
});

// Catch-all for API routes
app.all('/api/*', (req, res) => {
    res.status(404).json({ message: 'API endpoint not found' });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Export for Vercel serverless
module.exports = app;
