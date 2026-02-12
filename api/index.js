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

// Import and use your actual routes here (e.g., auth, products)
// const authRoutes = require('./routes/auth');
// app.use('/api/auth', authRoutes);

// CRUCIAL: Vercel needs this export to recognize the serverless function
module.exports = app;