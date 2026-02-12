const { Sequelize } = require('sequelize');
require('dotenv').config();

// We use POSTGRES_URL because it is the "Pooled" connection from your screenshot
const sequelize = new Sequelize(process.env.POSTGRES_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // REQUIRED for Neon/Vercel to "talk"
        }
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = { sequelize };