const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { sequelize } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    process.env.FRONTEND_URL,
    'https://ak-fish-farm.vercel.app'
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow all local development origins automatically
        if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
            return callback(null, true);
        }
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/orders', require('./routes/orders'));
app.use('/api/offers', require('./routes/offers'));
app.use('/api/admin', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/inquiries', require('./routes/inquiries'));

// Healthcheck route for Railway
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Base route for API
app.get('/api', (req, res) => {
    res.json({ message: 'AK Fish Farms API is running...' });
});

// Database Sync and Server Handle
if (process.env.NODE_ENV !== 'production' || require.main === module) {
    sequelize.sync()
        .then(() => {
            console.log('Database synced successfully.');
            // On localhost, we always want to listen if we got here
            app.listen(PORT, '0.0.0.0', () => {
                console.log(`Server is running on port ${PORT}`);
            });
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
} else {
    // For Vercel/Serverless: Sync on demand or assume synced
    sequelize.authenticate()
        .then(() => console.log('Database connected (Serverless)'))
        .catch(err => console.error('Database connection failed:', err));
}

module.exports = app;
