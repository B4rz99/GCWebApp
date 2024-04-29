const { DataTypes } = require('sequelize');
const sequelize = require('../dbServer');

const Pressure = sequelize.define('Pressure', {
	PressureID: {
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
	Sistolic: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	Diastolic: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
},{
	freezeTableName: true,
	timestamps: false,
});

module.exports = Pressure;