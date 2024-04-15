

const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');

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

module.exports = router;