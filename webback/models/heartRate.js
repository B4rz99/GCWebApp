const { DataTypes } = require('sequelize');
const sequelize = require('../dbServer');

const HeartRate = sequelize.define('HeartRate', {
    HeartRateId: {
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
    HeartRate: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    freezeTableName: true,
    timestamps: false,
});

module.exports = HeartRate;