const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Offer', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        code: {
            type: DataTypes.STRING,
            allowNull: true
        },
        discount: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
};
