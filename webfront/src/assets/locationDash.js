import React, { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import Box from '@mui/material/Box';
import { useDataContext } from '../DataContext';
import Selector from './selector';

// Define los colores para los dispositivos

export default function LocationDash({ onSelectorChange, selectedDevice }) {
  const { data } = useDataContext(); // Contexto de datos

  const [devicePositions, setDevicePositions] = useState({}); // Estado local para almacenar las posiciones de cada dispositivo
  const prevDevicePositions = useRef({}); // Estado ref para almacenar las posiciones anteriores de cada dispositivo


  // Define a color palette to use for each device
  const deviceColors = {
    '1234567890': 'red',    // Asignamos 'red' al ID '1234567890'
    '1342765980': 'blue',   // Asignamos 'blue' al ID '1342765980'
    // Si hay más IDs conocidos, puedes asignarles colores aquí
  };
  const defaultColor = 'gray';

  function getColorForDevice(deviceId) {
    return deviceColors[deviceId] || defaultColor;
  }

  useEffect(() => {
    if (data && data.length > 0) {
      const newDevicePositions = {...devicePositions };

      data.forEach(deviceData => {
        const deviceId = deviceData.DeviceId;
        if (selectedDevice.includes(deviceId)) {
          if (deviceData.Latitude && deviceData.Longitude) {
            const latitude = parseFloat(deviceData.Latitude);
            const longitude = parseFloat(deviceData.Longitude);

            const isNewPosition = !prevDevicePositions.current[deviceId] ||
                prevDevicePositions.current[deviceId][0] !== latitude ||
                prevDevicePositions.current[deviceId][1] !== longitude;
            
            if (isNewPosition) {
              if (!newDevicePositions[deviceId]) {
                newDevicePositions[deviceId] = [];
              }
              newDevicePositions[deviceId].push([latitude, longitude]);
              prevDevicePositions.current[deviceId] = [latitude, longitude];
            }
          }
        }
      });
      setDevicePositions(newDevicePositions);
    }
  }, [data, selectedDevice]);


return (
  <div>
      <Box
          display='flex'
          justifyContent='center'
          marginY={6}
          marginX={6}
          gap={2}
      >
          <MapContainer style={{ height: "500px", width: '50%' }} center={[10.96854, -74.78132]} zoom={13} scrollWheelZoom={true}>
              <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {/* Renderizar las polilíneas para cada dispositivo */}
              {Object.entries(devicePositions).filter(([deviceId]) => selectedDevice.includes(deviceId)).map((deviceId) => (
                  <Polyline
                      key={deviceId}
                      positions={deviceId[1]}
                      color={getColorForDevice(deviceId[0])} // Usa el color asignado para el dispositivo
                  />
              ))}
          </MapContainer>
          <Selector onSelectorChange={onSelectorChange} />
      </Box>
  </div>
);

}
