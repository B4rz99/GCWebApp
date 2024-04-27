const { DataTypes } = require('sequelize');
const sequelize = require('../dbServer');

const Relation = sequelize.define('Relation', {
	deviceId: {
		type: DataTypes.STRING,
		primaryKey: true,
		allowNull: false,
	},
	emailD: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	emailP : {
		type: DataTypes.STRING,
		allowNull: false,
	},
},{
	freezeTableName: true,
	timestamps: false,
});

module.exports = Relation;

Relation.prototype.emailExists = async function(emailP) {
    const result = await Relation.findOne({ where: { emailP } });
    return !!result;
};

Relation.prototype.deviceExists = async function(deviceId) {
    const result = await Relation.findOne({ where: { deviceId } });
    return !!result;
};

