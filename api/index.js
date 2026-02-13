const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

// 1. HEALTH CHECK: Move this to the very top so it doesn't depend on DB/Routes
app.get('/api/test', (req, res) => {
    res.json({
        message: "API is responding!",
        status: "UP",
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV
    });
});

// 2. DEFENSIVE IMPORTS: Import routes after the test route
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
