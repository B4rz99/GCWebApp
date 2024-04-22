import React from 'react';
import 'leaflet/dist/leaflet.css';
import Box from '@mui/material/Box';
import AppBar from '../assets/AppBar.tsx';
import LocationDash from '../assets/locationDash';
import PresVariable from '../assets/presVariable';
import CardVariable from '../assets/CardVariable';  
import TempVariable from '../assets/tempVariable';
import SatVariable from '../assets/satVariable';


//Dashboard view rendering
function dashboard() {
  const [selectedDevice, setSelectedDevice] = React.useState('');

  const handleSelectorChange = (selector) => {
    setSelectedDevice(selector); // Establecer el valor seleccionado del selector
  };
  return (
    <div className='App'>
      <AppBar />
      <Box
        display='flex'
        gap={6}
        justifyContent='center'
        marginY={3}
        marginX={6}
      >
        
        <CardVariable selectedDevice={selectedDevice}/>
        <TempVariable selectedDevice={selectedDevice}/>
        <SatVariable selectedDevice={selectedDevice}/>
      </Box>
      <LocationDash onSelectorChange={handleSelectorChange} selectedDevice={selectedDevice} />

    </div>
  );
}

export default dashboard;