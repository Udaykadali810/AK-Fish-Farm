const express = require('express');
const cors = require('cors');
// Make sure this points correctly to your database config file
const { sequelize } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// A simple test route to verify the backend is alive
app.get('/api/test', (req, res) => {
    res.json({ message: "Backend is working on Vercel!" });
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

// CRUCIAL: Vercel needs this export to recognize the serverless function
module.exports = app;
