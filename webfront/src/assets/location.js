import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import Box from '@mui/material/Box';
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { Icon } from 'leaflet';
import axios from 'axios';
import { API_URL } from '../auth/constants';
import TableHistorics from './tableHistorics';
import Calendar from './calendar';
import Selector from './selector';
import SelectorHisto from './selectorHisto';

export default function LocationDash({ onDateChange, onSelectorChange, startTime, endTime, selectedDevice }) {
    const [mapData, setMapData] = useState([]);
    const [deviceColors, setDeviceColors] = useState({});

    // Define a color palette to use for each device
    const colors = [
        'red',
        'blue',
        'green',
        'purple',
        'orange',
        'yellow',
        'cyan',
        'magenta',
    ];

    // Function to set colors for each device in the `selectedDevice` array
    const assignColorsToDevices = () => {
        const colorsMap = {};
        for (let i = 0; i < selectedDevice.length; i++) {
            colorsMap[selectedDevice[i]] = colors[i % colors.length];
        }
        setDeviceColors(colorsMap);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedDevice || selectedDevice.length === 0) return;

            try {
                const data = [];
                
                // Fetch data for each deviceId in selectedDevice
                for (const deviceId of selectedDevice) {
                    const response = await axios.get(`${API_URL}/api/position`, {
                        params: {
                            deviceId: deviceId,
                            startDate: startTime,
                            endDate: endTime,
                        },
                    });

                    // Add the device ID to each data item for easier processing later
                    const deviceData = response.data.map(item => ({
                        ...item,
                        deviceId: deviceId,
                    }));

                    data.push(...deviceData);
                }

                setMapData(data);
                assignColorsToDevices();
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, [startTime, endTime, selectedDevice]);

    // Calculate bounds based on positions
    const groupedPositions = mapData.reduce((acc, item) => {
        const deviceId = item.deviceId;
        if (!acc[deviceId]) {
            acc[deviceId] = [];
        }
        acc[deviceId].push([item.Latitude, item.Longitude]);
        return acc;
    }, {});

    const bounds = [];
    Object.values(groupedPositions).forEach(devicePositions => {
        if (devicePositions.length > 0) {
            bounds.push(devicePositions);
        }
    });

    // Define bounds for the city of Barranquilla
    const barranquillaBounds = [
        [10.96854, -74.88132], // Southwest corner of the city
        [11.0192, -74.73818], // Northeast corner of the city
    ];

    // Access the map instance and set bounds
    function SetMapBounds() {
        const map = useMap();
        if (bounds.length > 0) {
            map.fitBounds(bounds.flat());
        } else {
            map.fitBounds(barranquillaBounds);
        }
        return null;
    }

    return (
        <div>
            <Box
                display='flex'
                justifyContent='space-around'
                marginY={6}
                marginX={6}
                gap={2}
            >
                <MapContainer style={{ height: "500px", width: '50%' }} center={[10.96854, -74.78132]} zoom={13}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    
                    {/* Iterate through the mapData and draw Polyline for each device */}
                    {Object.entries(groupedPositions).map(([deviceId, positions]) => (
                        <Polyline
                            key={deviceId}
                            positions={positions}
                            color={deviceColors[deviceId]} // Use the assigned color for the device
                            interactive={false}
                        />
                    ))}

                    <SetMapBounds />
                </MapContainer>
                <TableHistorics startTime={startTime} endTime={endTime} selectedDevice={selectedDevice} />
                <Calendar onDateChange={onDateChange} />
                <Selector onSelectorChange={onSelectorChange} />
            </Box>
        </div>
    );
}
