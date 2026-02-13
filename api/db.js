const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.POSTGRES_URL + "?sslmode=require", {
    dialect: 'postgres',
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