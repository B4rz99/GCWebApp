const { Sequelize, DataTypes } = require('sequelize');
const config = require('./config.json');

const sequelize = new Sequelize(config.database, config.username, config.password, {
	logging: false,
	host: config.host,
	dialect: config.dialect,
	port: config.port,
	dialectOptions: {
		ssl: {
			require: true,
			rejectUnauthorized: false // Nota: Establecer en false solo para pruebas. Para producción, configura los certificados apropiadamente.
		}
	}
});

module.exports = sequelize;