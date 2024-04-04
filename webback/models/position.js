const { DataTypes } = require('sequelize');
const sequelize = require('../dbServer');

const Position = sequelize.define('Position', {
	PositionId: {
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
	Latitude: {
		type: DataTypes.DECIMAL(9,7),
		allowNull: false,
	},
	Longitude: {
		type: DataTypes.DECIMAL(9,6),
		allowNull: false,
	},
	Accuracy: {
		type: DataTypes.DECIMAL(6,3),
        allowNull: true,
	}
},{
	freezeTableName: true,
	timestamps: false,
});

module.exports = Position;