const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

// This works for ANY Postgres provider (Supabase, Railway, Render, etc.)
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // Helps avoid connection blocks on free tiers
        }
    },
    logging: false
});

// Paths must be absolute for Vercel
const Admin = require(path.join(__dirname, 'models/Admin'))(sequelize);
const User = require(path.join(__dirname, 'models/User'))(sequelize);
const Order = require(path.join(__dirname, 'models/Order'))(sequelize);
const Offer = require(path.join(__dirname, 'models/Offer'))(sequelize);
const Product = require(path.join(__dirname, 'models/Product'))(sequelize);
const Inquiry = require(path.join(__dirname, 'models/Inquiry'))(sequelize);

module.exports = { sequelize, Admin, User, Order, Offer, Product, Inquiry };