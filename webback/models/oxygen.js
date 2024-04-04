const { DataTypes } = require('sequelize');
const sequelize = require('../dbServer');

const Oxygen = sequelize.define('Oxygen', {
    OxygenId: {
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
    Oxygen: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    freezeTableName: true,
    timestamps: false,
});

module.exports = Oxygen;
