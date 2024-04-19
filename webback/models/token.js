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
        type: DataTypes.STRING,
        allowNull: false
    },
});

module.exports = Token;