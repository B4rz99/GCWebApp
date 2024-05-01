const { DataTypes } = require('sequelize');
const sequelize = require('../dbServer');

const Alarm = sequelize.define('Alarm', {
	AlarmID: {
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
	Enabled: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false,
	},
},{
	freezeTableName: true,
	timestamps: false,
});

module.exports = Alarm;