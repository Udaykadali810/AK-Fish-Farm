const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { sequelize, Admin } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize database and create admin user
const initializeDatabase = async () => {
    try {
        await sequelize.sync({ alter: false });
        console.log('Database synced');

        // Create default admin if doesn't exist
        const email = 'admin@akfishfarms.com';
        const password = 'AKFish2026!';
        const hashedPassword = await bcrypt.hash(password, 10);

        const [admin, created] = await Admin.findOrCreate({
            where: { email },
            defaults: { password: hashedPassword }
        });

        if (created) {
            console.log('✅ Admin user created');
            console.log('📧 Email:', email);
            console.log('🔑 Password:', password);
        } else {
            console.log('✅ Admin user already exists');
        }
    } catch (error) {
        console.error('❌ Database initialization error:', error);
    }
};

initializeDatabase();

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
