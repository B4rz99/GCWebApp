import React, { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Polyline, Marker, Popup} from 'react-leaflet';
import Box from '@mui/material/Box';
import { useDataContext } from '../DataContext';
import Selector from './selector';
import L  from 'leaflet';

export default function LocationDash({ onSelectorChange, selectedDevice }) {
  const { data } = useDataContext(); // Contexto de datos

  const [devicePositions, setDevicePositions] = useState({}); // Estado local para almacenar las posiciones de cada dispositivo
  const prevDevicePositions = useRef({}); // Estado ref para almacenar las posiciones anteriores de cada dispositivo
  const [selected, setSelected] = useState([]);

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
      const newDevicePositions = { ...devicePositions };

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
              newDevicePositions[deviceId].push({ position: [latitude, longitude], timestamp: deviceData.TimeStampHeartRate });
              prevDevicePositions.current[deviceId] = [latitude, longitude];
            }
          }
        }
      });
      setDevicePositions(newDevicePositions);
      setSelected(selectedDevice);
    }
  }, [data, selectedDevice]);


  function formatTimestamp(timestamp) {
    const tiempo = new Date(timestamp)
    const date = tiempo.getDate();
    const month = tiempo.getMonth() + 1;
    const year = tiempo.getFullYear();
    const hours = tiempo.getHours();
    const minutes = tiempo.getMinutes();
    const seconds = tiempo.getSeconds();
    return `${date}-${month < 10 ? '0' + month : month}-${year} ${hours}:${minutes}:${seconds}`;
  }

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
          {/* Renderizar las polilíneas y los marcadores para cada dispositivo */}
          {Object.entries(devicePositions).filter(([deviceId]) => selected.includes(deviceId)).map((deviceId) => (
            <>
              <Marker icon={new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-' + getColorForDevice(deviceId[0]) + '.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              })} key={deviceId[0] + '-last'} position={deviceId[1][deviceId[1].length - 1].position}>
                <Popup>
                  {`Device ID: ${deviceId[0]}\n
                  Latitude: ${deviceId[1][deviceId[1].length - 1].position[0]}\n
                  Longitude: ${deviceId[1][deviceId[1].length - 1].position[1]}\n
                  Timestamp: ${formatTimestamp(deviceId[1][deviceId[1].length - 1].timestamp)}`}
                  </Popup>
              </Marker>
              <Polyline
                key={deviceId[0]}
                positions={deviceId[1].map(positionData => positionData.position)}
                color={getColorForDevice(deviceId[0])} // Usa el color asignado para el dispositivo
              />
            </>
          ))}
        </MapContainer>
        <Selector onSelectorChange={onSelectorChange} />
      </Box>
    </div>
  );
}
