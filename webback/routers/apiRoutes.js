

const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const sequelize = require('sequelize')
const Device = require('../models/device');
const HeartRate = require('../models/heartRate');

const Oxygen = require('../models/oxygen');
const Position = require('../models/position');
const Temperature = require('../models/temperature');

Device.hasMany(Position, { foreignKey: 'DeviceId' });
Device.hasMany(HeartRate, { foreignKey: 'DeviceId' });
Device.hasMany(Temperature, { foreignKey: 'DeviceId' });
Device.hasMany(Oxygen, { foreignKey: 'DeviceId' });

Position.belongsTo(Device, { foreignKey: 'DeviceId' });
HeartRate.belongsTo(Device, { foreignKey: 'DeviceId' });
Temperature.belongsTo(Device, { foreignKey: 'DeviceId' });
Oxygen.belongsTo(Device, { foreignKey: 'DeviceId' });


router.get('/oxygen', async (req, res) => {
    try {
        const { deviceId, startDate, endDate } = req.query;
        if (!deviceId) {
            return res.status(400).json({ error: 'Device ID Required.' });
        }
        let filterOptions = { DeviceId: deviceId };
        if (startDate && endDate) {
            filterOptions.TimeStamp = {
                [Op.between]: [new Date(startDate), new Date(endDate)],
            };
        }
        const oxygenData = await Oxygen.findAll({ where: filterOptions });
        res.json(oxygenData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/heartRate', async (req, res) => {
    try {
        const { deviceId, startDate, endDate } = req.query;
        if (!deviceId) {
            return res.status(400).json({ error: 'Device ID Required.' });
        }
        let filterOptions = { DeviceId: deviceId };
        if (startDate && endDate) {
            filterOptions.TimeStamp = {
                [Op.between]: [new Date(startDate), new Date(endDate)],
            };
        }
        const heartRateData = await HeartRate.findAll({ where: filterOptions });
        res.json(heartRateData);
    } catch (error) {

        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/temperature', async (req, res) => {
    try {
        const { deviceId, startDate, endDate } = req.query;
        if (!deviceId) {
            return res.status(400).json({ error: 'Device ID Required.' });
        }
        let filterOptions = { DeviceId: deviceId };
        if (startDate && endDate) {
            filterOptions.TimeStamp = {
                [Op.between]: [new Date(startDate), new Date(endDate)],
            };
        }
        const temperatureData = await Temperature.findAll({ where: filterOptions });
        res.json(temperatureData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/pressure', async (req, res) => {
    try {
        const { deviceId, startDate, endDate } = req.query;
        if (!deviceId) {
            return res.status(400).json({ error: 'Device ID Required.' });
        }
        let filterOptions = { DeviceId: deviceId };
        if (startDate && endDate) {
            filterOptions.TimeStamp = {
                [Op.between]: [new Date(startDate), new Date(endDate)],
            };
        }
        const pressureData = await Pressure.findAll({ where: filterOptions });
        res.json(pressureData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/position', async (req, res) => {
    try {
        const { deviceId, startDate, endDate } = req.query;
        if (!deviceId) {
            return res.status(400).json({ error: 'Device ID Required.' });
        }
        let filterOptions = { DeviceId: deviceId };
        if (startDate && endDate) {
            filterOptions.TimeStamp = {
                [Op.between]: [new Date(startDate), new Date(endDate)],
            };
        }
        const positionData = await Position.findAll({ where: filterOptions });
        res.json(positionData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/allDevices', async (req, res) => {
    try {
        // Realizar la consulta para obtener todos los dispositivos
        const allDevices = await Device.findAll();

        // Retornar los datos de los dispositivos en la respuesta
        res.json(allDevices);
    } catch (error) {
        // En caso de error, manejarlo y enviar una respuesta de error
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/realTime', async (req, res) => {
    try {
      let deviceIds = req.query.DeviceIDs; // Obtener los DeviceIDs de la consulta (si los hay)
      if (!Array.isArray(deviceIds)) {
        deviceIds = [deviceIds]; // Si solo se proporciona un DeviceID, convertirlo en un array
      }
  
      let whereClause = {}; // Clausula where para Sequelize
  
      // Si se proporcionan DeviceIDs, filtrar por esos dispositivos
      if (deviceIds && deviceIds.length > 0) {
        whereClause = { DeviceId: deviceIds };
      }
  
      // Obtener el último valor de HeartRate para cada DeviceId
        const heartRates = await HeartRate.findAll({
            attributes: ['DeviceId', [sequelize.fn('MAX', sequelize.col('TimeStamp')), 'TimeStamp'], [sequelize.fn('MAX', sequelize.col('HeartRate')), 'HeartRate']],
            
            group: 'DeviceId',
            order: [['TimeStamp', 'DESC']],
            limit: 1
        });
        
        // Obtener el último valor de Oxygen para cada DeviceId
        const oxygens = await Oxygen.findAll({
            attributes: ['DeviceId', [sequelize.fn('MAX', sequelize.col('TimeStamp')), 'TimeStamp'], [sequelize.fn('MAX', sequelize.col('Oxygen')), 'Oxygen']],
            
            group: 'DeviceId',
            order: [['TimeStamp', 'DESC']],
            limit: 1
        });
        
        // Obtener el último valor de Temperature para cada DeviceId
        const temperatures = await Temperature.findAll({
            attributes: ['DeviceId', [sequelize.fn('MAX', sequelize.col('TimeStamp')), 'TimeStamp'], [sequelize.fn('MAX', sequelize.col('Temperature')), 'Temperature']],
            
            group: 'DeviceId',
            order: [['TimeStamp', 'DESC']],
            limit: 1
        });
  
      // Combinar los resultados en un solo JSON
      const data = heartRates.map((heartRate, index) => ({
        DeviceId: heartRate.DeviceId,
        data: [
          {
            TimeStamp: heartRate.TimeStamp,
            HeartRate: heartRate.HeartRate,
            Oxygen: oxygens[index].Oxygen,
            Temperature: temperatures[index].Temperature
          }
        ]
      }));
  
      res.json(data);
    } catch (error) {
      console.error('Error fetching real-time data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/availableDevices', async (req, res) => {
    try {
        // Realizar la consulta para obtener todos los dispositivos disponibles
        const availableDevices = await Device.findAll({
            where: {
                Status: false
            }
        })
        // Retornar los datos de los dispositivos en la respuesta
        res.json(availableDevices);
    } catch (error) {
        // En caso de error, manejarlo y enviar una respuesta de error
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/unavailableDevices', async (req, res) => {
    try {
        // Realizar la consulta para obtener todos los dispositivos disponibles
        const unavailableDevices = await Device.findAll({
            where: {
                Status: true
            }
        })
        // Retornar los datos de los dispositivos en la respuesta
        res.json(unavailableDevices);
    } catch (error) {
        // En caso de error, manejarlo y enviar una respuesta de error
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/atypicalOxygen', async (req, res) => {
    try {
        const { deviceId, startDate, endDate } = req.query;
        
        // Check if deviceId is provided
        if (!deviceId) {
            return res.status(400).json({ error: 'Device ID Required.' });
        }

        // Initialize filter options
        let filterOptions = { DeviceId: deviceId };

        // Add date range filter if both startDate and endDate are provided
        if (startDate && endDate) {
            filterOptions.TimeStamp = {
                [Op.between]: [new Date(startDate), new Date(endDate)],
            };
        }

        // Add condition for Oxygen level below 95
        filterOptions.Oxygen = {
            [Op.lt]: 95,
        };

        // Query the database with the specified filter options
        const oxygenData = await Oxygen.findAll({ where: filterOptions });
        // Respond with the retrieved data
        res.json(oxygenData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/atypicalHeartRate', async (req, res) => {
    try {
        const { deviceId, startDate, endDate } = req.query;
        
        // Check if deviceId is provided
        if (!deviceId) {
            return res.status(400).json({ error: 'Device ID Required.' });
        }

        // Initialize filter options
        let filterOptions = { DeviceId: deviceId };

        // Add date range filter if both startDate and endDate are provided
        if (startDate && endDate) {
            filterOptions.TimeStamp = {
                [Op.between]: [new Date(startDate), new Date(endDate)],
            };
        }

        // Add conditions for HeartRate below 60 or above 80
        filterOptions.HeartRate = {
            [Op.or]: [
                { [Op.lt]: 60 },
                { [Op.gt]: 80 },
            ],
        };

        // Query the database with the specified filter options
        const heartRateData = await HeartRate.findAll({ where: filterOptions });

        // Respond with the retrieved data
        res.json(heartRateData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/atypicalTemperature', async (req, res) => {
    try {
        const { deviceId, startDate, endDate } = req.query;
        
        // Check if deviceId is provided
        if (!deviceId) {
            return res.status(400).json({ error: 'Device ID Required.' });
        }

        // Initialize filter options
        let filterOptions = { DeviceId: deviceId };

        // Add date range filter if both startDate and endDate are provided
        if (startDate && endDate) {
            filterOptions.TimeStamp = {
                [Op.between]: [new Date(startDate), new Date(endDate)],
            };
        }

        // Add conditions for Temperature below 35.1 or above 37.5
        filterOptions.Temperature = {
            [Op.or]: [
                { [Op.lt]: 35.1 },
                { [Op.gt]: 37.5 },
            ],
        };

        // Query the database with the specified filter options
        const temperatureData = await Temperature.findAll({ where: filterOptions });

        // Respond with the retrieved data
        res.json(temperatureData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/atypicalPressure', async (req, res) => {
    try {
        const { deviceId, startDate, endDate } = req.query;

        // Check if deviceId is provided
        if (!deviceId) {
            return res.status(400).json({ error: 'Device ID Required.' });
        }

        // Initialize filter options
        let filterOptions = { DeviceId: deviceId };

        // Add date range filter if both startDate and endDate are provided
        if (startDate && endDate) {
            filterOptions.TimeStamp = {
                [Op.between]: [new Date(startDate), new Date(endDate)],
            };
        }

        // Add conditions for Sistolic and Diastolic pressure
        filterOptions = {
            ...filterOptions,
            [Op.and]: [
                {
                    [Op.or]: [
                        { Sistolic: { [Op.lt]: 80 } },
                        { Sistolic: { [Op.gt]: 120 } },
                    ],
                },
                {
                    [Op.or]: [
                        { Diastolic: { [Op.lt]: 60 } },
                        { Diastolic: { [Op.gt]: 80 } },
                    ],
                },
            ],
        };

        // Query the database with the specified filter options
        const pressureData = await Pressure.findAll({ where: filterOptions });

        // Respond with the retrieved data
        res.json(pressureData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;