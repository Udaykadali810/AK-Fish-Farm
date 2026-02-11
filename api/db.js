const { Sequelize } = require('sequelize');
const path = require('path');

// This uses the "Master Key" you just found
const sequelize = new Sequelize(process.env.POSTGRES_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // REQUIRED: Helps the backend "handshake" with Neon
        }
    },
    // Adding a pool helps serverless functions share the connection
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// Models must use absolute paths for Vercel
const Admin = require(path.join(__dirname, 'models/Admin'))(sequelize);
const User = require(path.join(__dirname, 'models/User'))(sequelize);
const Order = require(path.join(__dirname, 'models/Order'))(sequelize);
const Product = require(path.join(__dirname, 'models/Product'))(sequelize);

module.exports = { sequelize, Admin, User, Order, Product };