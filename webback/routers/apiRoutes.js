

const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const sequelize = require('sequelize')
const Device = require('../models/device');
const HeartRate = require('../models/heartRate');
const Pressure = require('../models/pressure');
const Oxygen = require('../models/oxygen');
const Position = require('../models/position');
const Temperature = require('../models/temperature');
const Alarm = require('../models/alarm');
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

        // Validate deviceId
        if (!deviceId) {
            return res.status(400).json({ error: 'Device ID Required.' });
        }

        // Create filter options for Oxygen data based on the request parameters
        let filterOptions = { DeviceId: deviceId };
        if (startDate && endDate) {
            filterOptions.TimeStamp = {
                [Op.between]: [new Date(startDate), new Date(endDate)],
            };
        }

        // Fetch oxygen data based on the filter options
        const oxygenData = await Oxygen.findAll({ where: filterOptions });

        // Fetch the device details to obtain the device name
        const device = await Device.findOne({ where: { DeviceId: deviceId } });

        // Check if the device exists
        if (!device) {
            return res.status(404).json({ error: 'Device not found.' });
        }

        // Include the device name in the response
        const deviceName = device.Name;

        // Send the response with oxygen data and the device name
        res.json({ oxygenData, deviceName });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/heartRate', async (req, res) => {
    try {
        const { deviceId, startDate, endDate } = req.query;

        // Validate deviceId
        if (!deviceId) {
            return res.status(400).json({ error: 'Device ID Required.' });
        }

        // Create filter options for HeartRate data based on the request parameters
        let filterOptions = { DeviceId: deviceId };
        if (startDate && endDate) {
            filterOptions.TimeStamp = {
                [Op.between]: [new Date(startDate), new Date(endDate)],
            };
        }

        // Fetch heart rate data based on the filter options
        const heartRateData = await HeartRate.findAll({ where: filterOptions });

        // Fetch the device details to obtain the device name
        const device = await Device.findOne({ where: { DeviceId: deviceId } });

        // Check if the device exists
        if (!device) {
            return res.status(404).json({ error: 'Device not found.' });
        }

        // Include the device name in the response
        const deviceName = device.Name;

        // Send the response with heart rate data and the device name
        res.json({ heartRateData, deviceName });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/temperature', async (req, res) => {
    try {
        const { deviceId, startDate, endDate } = req.query;

        // Validate deviceId
        if (!deviceId) {
            return res.status(400).json({ error: 'Device ID Required.' });
        }

        // Create filter options for Temperature data based on the request parameters
        let filterOptions = { DeviceId: deviceId };
        if (startDate && endDate) {
            filterOptions.TimeStamp = {
                [Op.between]: [new Date(startDate), new Date(endDate)],
            };
        }

        // Fetch temperature data based on the filter options
        const temperatureData = await Temperature.findAll({ where: filterOptions });

        // Fetch the device details to obtain the device name
        const device = await Device.findOne({ where: { DeviceId: deviceId } });

        // Check if the device exists
        if (!device) {
            return res.status(404).json({ error: 'Device not found.' });
        }

        // Include the device name in the response
        const deviceName = device.Name;

        // Send the response with temperature data and the device name
        res.json({ temperatureData, deviceName });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/pressure', async (req, res) => {
    try {
        const { deviceId, startDate, endDate } = req.query;

        // Validate deviceId
        if (!deviceId) {
            return res.status(400).json({ error: 'Device ID Required.' });
        }

        // Create filter options for Pressure data based on the request parameters
        let filterOptions = { DeviceId: deviceId };
        if (startDate && endDate) {
            filterOptions.TimeStamp = {
                [Op.between]: [new Date(startDate), new Date(endDate)],
            };
        }

        // Fetch pressure data based on the filter options
        const pressureData = await Pressure.findAll({ where: filterOptions });

        // Fetch the device details to obtain the device name
        const device = await Device.findOne({ where: { DeviceId: deviceId } });

        // Check if the device exists
        if (!device) {
            return res.status(404).json({ error: 'Device not found.' });
        }

        // Include the device name in the response
        const deviceName = device.Name;

        // Format the response with pressure data and the device name
        res.json({ pressureData, deviceName });
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
  
      // Obtener el último valor de HeartRate para cada DeviceId
      const heartRates = await HeartRate.findAll({
        attributes: ['DeviceId', 'TimeStamp', 'HeartRate'],
        where: sequelize.literal('("DeviceId", "TimeStamp") IN (SELECT "DeviceId", MAX("TimeStamp") FROM "HeartRate" GROUP BY "DeviceId")')
      });
      
      const oxygens = await Oxygen.findAll({
        attributes: ['DeviceId', 'TimeStamp', 'Oxygen'],
        where: sequelize.literal('("DeviceId", "TimeStamp") IN (SELECT "DeviceId", MAX("TimeStamp") FROM "Oxygen" GROUP BY "DeviceId")')
      });
      
      const temperatures = await Temperature.findAll({
        attributes: ['DeviceId', 'TimeStamp', 'Temperature'],
        where: sequelize.literal('("DeviceId", "TimeStamp") IN (SELECT "DeviceId", MAX("TimeStamp") FROM "Temperature" GROUP BY "DeviceId")')
      });
      
      const pressures = await Pressure.findAll({
        attributes: ['DeviceId', 'TimeStamp', 'Sistolic','Diastolic'],
        where: sequelize.literal('("DeviceId", "TimeStamp") IN (SELECT "DeviceId", MAX("TimeStamp") FROM "Pressure" GROUP BY "DeviceId")') 
      });
    
      const positions = await Position.findAll({
        attributes: ['DeviceId', 'TimeStamp', 'Latitude', 'Longitude'],
        where: sequelize.literal('("DeviceId", "TimeStamp") IN (SELECT "DeviceId", MAX("TimeStamp") FROM "Position" GROUP BY "DeviceId")') 
      });
      // Combine los resultados en un solo objeto usando DeviceId como clave
      const combinedData = {};
      heartRates.forEach(heartRate => {
        const deviceId = heartRate.DeviceId;
        combinedData[deviceId] = {
          DeviceId: deviceId,
          HeartRate: heartRate.HeartRate,
          TimeStampHeartRate: heartRate.TimeStamp
        };
      });
      
      oxygens.forEach(oxygen => {
        const deviceId = oxygen.DeviceId;
        if (!combinedData[deviceId]) {
          combinedData[deviceId] = { DeviceId: deviceId };
        }
        combinedData[deviceId].Oxygen = oxygen.Oxygen;
        });
      
      temperatures.forEach(temperature => {
        const deviceId = temperature.DeviceId;
        if (!combinedData[deviceId]) {
          combinedData[deviceId] = { DeviceId: deviceId };
        }
        combinedData[deviceId].Temperature = temperature.Temperature;
        });
      
      pressures.forEach(pressure => {
        const deviceId = pressure.DeviceId;
        if (!combinedData[deviceId]){
            combinedData[deviceId] = { DeviceId: deviceId };
        }
        combinedData[deviceId].Sistolic = pressure.Sistolic;
        combinedData[deviceId].Diastolic = pressure.Diastolic;
      })
    
      positions.forEach(position => {
        const deviceId = position.DeviceId;
        if (!combinedData[deviceId]){
            combinedData[deviceId] = { DeviceId: deviceId};
        }
        combinedData[deviceId].Latitude = position.Latitude;
        combinedData[deviceId].Longitude = position.Longitude;
      })
      // Convertir el objeto combinado en un array de objetos
      const data = Object.values(combinedData);
      
      
  
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

        // Fetch the device details from the Device table to obtain the device name
        const device = await Device.findOne({ where: { DeviceId: deviceId } });

        // Check if the device was found
        if (!device) {
            return res.status(404).json({ error: 'Device not found.' });
        }

        // Retrieve the device name
        const deviceName = device.Name;

        // Respond with the oxygen data and the device name
        res.json({ oxygenData, deviceName });
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

        // Fetch the device details from the Device table to obtain the device name
        const device = await Device.findOne({ where: { DeviceId: deviceId } });

        // Check if the device was found
        if (!device) {
            return res.status(404).json({ error: 'Device not found.' });
        }

        // Retrieve the device name
        const deviceName = device.Name;

        // Respond with the heart rate data and the device name
        res.json({ heartRateData, deviceName });
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

        // Fetch the device details from the Device table to obtain the device name
        const device = await Device.findOne({ where: { DeviceId: deviceId } });

        // Check if the device was found
        if (!device) {
            return res.status(404).json({ error: 'Device not found.' });
        }

        // Retrieve the device name
        const deviceName = device.Name;

        // Respond with the temperature data and the device name
        res.json({ temperatureData, deviceName });
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

        // Fetch the device details from the Device table to obtain the device name
        const device = await Device.findOne({ where: { DeviceId: deviceId } });

        // Check if the device was found
        if (!device) {
            return res.status(404).json({ error: 'Device not found.' });
        }

        // Retrieve the device name
        const deviceName = device.Name;

        // Respond with the pressure data and the device name
        res.json({ pressureData, deviceName });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/sos', async (req, res) => {
    try {
        // Encontrar el último registro de cada DeviceId donde Enabled es false
        const latestAlarms = await Alarm.findAll({
            attributes: ['DeviceId', 'TimeStamp'],
            where: sequelize.literal('("DeviceId", "TimeStamp") IN (SELECT "DeviceId", MAX("TimeStamp") FROM "Alarm" WHERE "Enabled"=false GROUP BY "DeviceId")') 
        });

        // Actualizar todos los registros a Enabled true
        await Alarm.update({ Enabled: true }, { where: { Enabled: false } });

        // Devolver los últimos registros encontrados
        res.json(latestAlarms);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;