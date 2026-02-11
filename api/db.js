const { Sequelize } = require('sequelize');
require('dotenv').config();

const isLocalStorage = !process.env.DATABASE_URL;

const sequelize = isLocalStorage
    ? new Sequelize({
        dialect: 'sqlite',
        storage: './database.sqlite',
        logging: false
    })
    : new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
            ssl: process.env.DATABASE_URL.includes('localhost') ? false : {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: false
    });

const Admin = require('./models/Admin')(sequelize);
const User = require('./models/User')(sequelize);
const Order = require('./models/Order')(sequelize);
const Offer = require('./models/Offer')(sequelize);
const Product = require('./models/Product')(sequelize);
const Inquiry = require('./models/Inquiry')(sequelize);

module.exports = {
    sequelize,
    Admin,
    User,
    Order,
    Offer,
    Product,
    Inquiry
};
