const { DataTypes } = require('sequelize');
const sequelize = require('../dbServer');
const bcrypt = require('bcrypt');
const { generateAccessToken } = require('../auth/generateTokens');
const { getEmailInfo } = require('../lib/getEmailInfo');
const { generateRefreshToken } = require('../auth/generateTokens');
const Token = require('./token');

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

Login.beforeSave(async (user, options) => {
  // Check if the password has been modified or if it's a new record
  if (user.changed('password')) {
    const saltRounds = 10;
    // Hash the password using bcrypt
    const hash = await bcrypt.hash(user.password, saltRounds);
    user.password = hash;
  }
});

Login.prototype.emailExists = async function(email) {
  const result = await Login.findOne({ where: { email } });
  return !!result;
};

Login.prototype.isValidPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

Login.prototype.createAccessToken = function() {
  return generateAccessToken(getEmailInfo(this));
};

Login.prototype.createRefreshToken = async function() {
  const refreshToken = generateRefreshToken(getEmailInfo(this));
  try {
      await new Token({ token: refreshToken }).save();
      return refreshToken;
  } catch (error) {
      console.error(error);
  }
};

module.exports = Login;