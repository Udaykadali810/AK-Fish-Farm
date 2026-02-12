const { Sequelize } = require('sequelize');
require('dotenv').config();

// Use SQLite for Vercel serverless (PostgreSQL won't work in serverless without external DB)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
});

// Import models
const Admin = require('./models/Admin')(sequelize);
const User = require('./models/User')(sequelize);
const Order = require('./models/Order')(sequelize);
const Product = require('./models/Product')(sequelize);
const Offer = require('./models/Offer')(sequelize);
const Inquiry = require('./models/Inquiry')(sequelize);

// Sync database
sequelize.sync({ alter: false });

module.exports = {
    sequelize,
    Admin,
    User,
    Order,
    Product,
    Offer,
    Inquiry
};