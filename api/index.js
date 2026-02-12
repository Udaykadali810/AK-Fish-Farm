const express = require('express');
const cors = require('cors');
const { sequelize } = require('./db'); // Ensure this points to your Neon config

const app = express();
app.use(cors());
app.use(express.json());

// Import your actual routes here
// const productRoutes = require('./routes/products');
// app.use('/api/products', productRoutes);

app.get('/api/test', (req, res) => {
    res.json({ message: "Backend is active and reaching Vercel!" });
});

// CRUCIAL: Export for Vercel Serverless
module.exports = app;