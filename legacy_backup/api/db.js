const { Sequelize } = require('sequelize');
const pg = require('pg');
require('dotenv').config();

// Hardcoded admin credentials for serverless deployment
const ADMIN_EMAIL = 'admin@akfishfarms.com';
const ADMIN_PASSWORD = 'AKFish2026!';
const JWT_SECRET = 'ak_fish_farms_secret_key_2026_v1';

// Ensure the connection string works with Sequelize and PG
const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
    console.error('POSTGRES_URL is not defined in environment variables');
}

const sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    dialectModule: pg,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: false
});

// Import models
const Admin = require('./models/Admin')(sequelize);
const User = require('./models/User')(sequelize);
const Order = require('./models/Order')(sequelize);
const Product = require('./models/Product')(sequelize);
const Offer = require('./models/Offer')(sequelize);
const Inquiry = require('./models/Inquiry')(sequelize);

// Test connection and sync tables (non-blocking for serverless)
sequelize.authenticate()
    .then(() => {
        console.log('Successfully connected to Neon Database.');
        return sequelize.sync({ alter: true });
    })
    .then(() => console.log('Database tables synchronized.'))
    .catch(err => console.error('Database Error:', err));

// Export models and sequelize
module.exports = {
    sequelize,
    Admin,
    User,
    Order,
    Product,
    Offer,
    Inquiry
};