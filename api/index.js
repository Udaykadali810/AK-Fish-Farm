const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

// Simple in-memory storage for demo (in production, use a real database like PostgreSQL/MongoDB)
const ADMIN_EMAIL = 'admin@akfishfarms.com';
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('AKFish2026!', 10);

// A simple test route to verify the backend is alive
app.get('/api/test', (req, res) => {
    res.json({ message: "Backend is working on Vercel!", status: "OK" });
});

// Import and use your actual routes
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const offerRoutes = require('./routes/offers');
const inquiryRoutes = require('./routes/inquiries');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

// CRUCIAL: Vercel needs this export to recognize the serverless function
module.exports = app;
