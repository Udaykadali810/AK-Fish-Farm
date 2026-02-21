const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Inquiry', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        contactNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fishEnquiry: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('Pending', 'Responded', 'Closed'),
            defaultValue: 'Pending'
        }
    }, {
        timestamps: true
    });
};
