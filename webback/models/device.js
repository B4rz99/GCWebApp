const { DataTypes } = require('sequelize');
const sequelize = require('../dbServer');

const Device = sequelize.define('Device', {
	DeviceId: {
		type: DataTypes.STRING(13),
		primaryKey: true,
		allowNull: false,
	},
	Name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	Status : {
		type: DataTypes.BOOLEAN,
		allowNull: false,
	},
},{
	freezeTableName: true,
	timestamps: false,
});

module.exports = Device;
