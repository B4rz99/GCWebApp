import React from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import Box from '@mui/material/Box';
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import { Icon } from 'leaflet'
import Selector from './selector.js'
import Calendar from './calendar.js'
import { Polyline } from 'react-leaflet';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { API_URL } from '../auth/constants';
import TableHistorics from './tableHistorics.js';

export default function LocationDash({onDateChange, onSelectorChange, startTime, endTime, selectedDevice}) {
  console.log('Props received:', { onDateChange, onSelectorChange, startTime, endTime, selectedDevice });  
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
                    }
                });
                setMapData(response.data);
                console.log(response.data);
                console.log('mapData:', response.data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, [startTime, endTime, selectedDevice]);

    // Get the last position fetched
    const lastPosition = mapData.length > 0 ? mapData[mapData.length - 1] : null;

    const allPositions = mapData.map(position => [position.Latitude, position.Longitude]);


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
                        <Marker position={[lastPosition.Latitude, lastPosition.Longitude]} icon={new Icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41] })} />
                    )}
                    <Polyline positions={allPositions} color="red" />
                </MapContainer>
                <TableHistorics startTime={startTime} endTime={endTime} selectedDevice={selectedDevice}/>
                <Calendar onDateChange={onDateChange} />
                <Selector onSelectorChange={onSelectorChange} />
            </Box>
        </div>
    );
}