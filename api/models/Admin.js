const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Admin', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            defaultValue: 'admin@akfishfarms.com'
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
};
