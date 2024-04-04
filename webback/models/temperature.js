const { DataTypes } = require('sequelize');
const sequelize = require('../dbServer');

const Temperature = sequelize.define('Temperature', {
    TemperatureId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    DeviceId: {
        type: DataTypes.STRING(13),
        allowNull: false,
    },
    TimeStamp: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    Temperature: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    freezeTableName: true,
    timestamps: false,
});

module.exports = Temperature;
