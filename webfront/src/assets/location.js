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

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedDevice) return;
            try {
                const response = await axios.get(`${API_URL}/api/position`, {
                    params: {
                        deviceId: selectedDevice,
                        startDate: startTime,
                        endDate: endTime,
                    },
                });
                setMapData(response.data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, [startTime, endTime, selectedDevice]);

    // Calculate bounds based on positions
    const allPositions = mapData.map(position => [position.Latitude, position.Longitude]);
    const bounds = allPositions.length > 0 ? allPositions : [[10.96854, -74.78132]];

    // Define bounds for the city of Barranquilla
    const barranquillaBounds = [
        [10.96854, -74.88132], // Southwest corner of the city
        [11.0192, -74.73818], // Northeast corner of the city
    ];

    // Access the map instance and set bounds
    function SetMapBounds() {
        const map = useMap();
        if (allPositions.length > 0) {
            map.fitBounds(bounds);
        } else {
            map.fitBounds(barranquillaBounds);
        }
        return null;
    }

    // Get the last position fetched
    const lastPosition = mapData.length > 0 ? mapData[mapData.length - 1] : null;

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
                    {lastPosition && (
                        <Marker
                            position={[lastPosition.Latitude, lastPosition.Longitude]}
                            icon={new Icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41] })}
                        />
                    )}
                    <Polyline positions={allPositions} color="red" />
                    <SetMapBounds />
                </MapContainer>
                <TableHistorics startTime={startTime} endTime={endTime} selectedDevice={selectedDevice} />
                <Calendar onDateChange={onDateChange} />
                <SelectorHisto onSelectorChange={onSelectorChange} />
            </Box>
        </div>
    );
}
