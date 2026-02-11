const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Product', {
        id: {
            type: DataTypes.STRING, // Use string if frontend uses IDs like '1', '2'
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    });
};
