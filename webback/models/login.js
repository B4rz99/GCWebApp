const { DataTypes } = require('sequelize');
const sequelize = require('../dbServer');

const Login = sequelize.define('Login', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true
    }
});

module.exports = Login;