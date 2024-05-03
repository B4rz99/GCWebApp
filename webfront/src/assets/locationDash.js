import React, { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import Box from '@mui/material/Box';
import { useDataContext } from '../DataContext';
import Selector from './selector';

export default function LocationDash({ onSelectorChange, selectedDevice }) {
  const { data } = useDataContext(); // Contexto de datos

  const [devicePositions, setDevicePositions] = useState({}); // Estado local para almacenar las posiciones de cada dispositivo
  const prevDevicePositions = useRef({}); // Estado ref para almacenar las posiciones anteriores de cada dispositivo

  useEffect(() => {
    // Actualizar las posiciones cuando se reciban nuevos datos del contexto de datos
    if (data && data.length > 0) {
      const newDevicePositions = { ...devicePositions }; // Copiar el estado actual de las posiciones

      data.forEach(deviceData => {
        const deviceId = deviceData.DeviceId;
        if (selectedDevice.includes(deviceId)) {
          // Si el dispositivo está seleccionado
          if (deviceData.Latitude && deviceData.Longitude) {
            // Verificar si las nuevas posiciones son diferentes a las anteriores
            const isNewPosition = !prevDevicePositions.current[deviceId] ||
                                  prevDevicePositions.current[deviceId].toString() !== [deviceData.Latitude, deviceData.Longitude].toString();
            if (isNewPosition) {
              // Agregar la nueva posición solo si es diferente a la anterior
              if (!newDevicePositions[deviceId]) {
                newDevicePositions[deviceId] = [];
              }
              newDevicePositions[deviceId].push([deviceData.Latitude, deviceData.Longitude]);
              // Actualizar el estado previo de las posiciones
              prevDevicePositions.current[deviceId] = [deviceData.Latitude, deviceData.Longitude];
            }
          }
        }
      });

      setDevicePositions(newDevicePositions); // Actualizar el estado con las nuevas posiciones
    }
  }, [data, selectedDevice]);
  
  // Renderizar las polilíneas para cada dispositivo seleccionado
  const renderPolylines = () => {
    const polylines = [];
    for (const deviceId in devicePositions) {
      const positions = devicePositions[deviceId];
      
      const polyline = positions
      console.log(polyline);
      polylines.push(
        <Polyline key={deviceId} positions={polyline} />
      );
    }
    return polylines;
  };
  
  
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
          {renderPolylines()}
        </MapContainer>
        <Selector onSelectorChange={onSelectorChange} />
      </Box>
    </div>
  );
}
