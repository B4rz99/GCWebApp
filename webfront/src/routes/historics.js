import React from 'react'
import Box from '@mui/material/Box';
import 'leaflet/dist/leaflet.css';
import AppBar from '../assets/AppBar';
import Location from '../assets/location';
import PulseHistoVariable from '../assets/pulseHistoVariable';
import TempHistoVariable from '../assets/tempHistoVariable';
import SatHistoVariable from '../assets/satHistoVariable';

export default function historics() {

  const [startTime, setStartTime] = React.useState(null);
  const [endTime, setEndTime] = React.useState(null);
  const [selectedDevice, setSelectedDevice] = React.useState('');
  const handleDateChange = (startDate, endDate) => {
    // Aquí puedes realizar acciones con las fechas seleccionadas, como obtener datos de un servidor
    setStartTime(startDate);
    setEndTime(endDate);
  };

  const handleSelectorChange = (selector) => {
    setSelectedDevice(selector); // Establecer el valor seleccionado del selector
  };
  return (
    <div>
      <AppBar/>
    <Box
        display='flex'
        justifyContent='center'
        marginY={3}
        gap={4}
      >
        <PulseHistoVariable startTime={startTime} endTime={endTime} selectedDevice={selectedDevice}/>
        <TempHistoVariable startTime={startTime} endTime={endTime} selectedDevice={selectedDevice}/>
        <SatHistoVariable startTime={startTime} endTime={endTime} selectedDevice={selectedDevice}/>
    
    </Box>
    <Location
        onDateChange={handleDateChange}
        onSelectorChange={handleSelectorChange}
        startTime={startTime}
        endTime={endTime}
        selectedDevice={selectedDevice}
      />
    </div>
  )
}