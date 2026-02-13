const { Sequelize } = require('sequelize');
const pg = require('pg');
require('dotenv').config();

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

// Test connection (don't block, just log)
sequelize.authenticate()
    .then(() => console.log('Successfully connected to Neon Database.'))
    .catch(err => console.error('Unable to connect to the database:', err));

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