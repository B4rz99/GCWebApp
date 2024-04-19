const { DataTypes } = require('sequelize');
const sequelize = require('../dbServer');

const Token = sequelize.define('Token', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: false
    },
}, {
    freezeTableName: true,
    timestamps: false,
});

module.exports = Token;