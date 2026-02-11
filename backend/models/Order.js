const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Order', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        orderId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        customerName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        place: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        items: {
            type: DataTypes.JSON,
            allowNull: false
        },
        total: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'Processing'
        },
        deliveryNotes: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    });
};
