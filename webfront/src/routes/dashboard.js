import React from 'react';
import 'leaflet/dist/leaflet.css';
import Box from '@mui/material/Box';
import AppBar from '../assets/AppBar.tsx';
import LocationDash from '../assets/locationDash';
import PresVariable from '../assets/presVariable';
import CardVariable from '../assets/CardVariable';  
import TempVariable from '../assets/tempVariable';
import SatVariable from '../assets/satVariable';
import Popup from '../assets/popup.js';


//Dashboard view rendering
function dashboard() {
  const [selectedDevice, setSelectedDevice] = React.useState([]);

  const handleSelectorChange = (selector) => {
    setSelectedDevice(selector); // Establecer el valor seleccionado del selector
  };
  return (
    <div className='App'>
      <AppBar />
        {selectedDevice.map((device, index) => (
          <Box key={index}
          display='flex'
          gap={6}
          justifyContent='center'
          marginY={3}
          marginX={6}>
            <CardVariable selectedDevice={device}/>
            <TempVariable selectedDevice={device}/>
            <SatVariable selectedDevice={device}/>
            <PresVariable selectedDevice={device}/>
          </Box>
        ))}
      <LocationDash onSelectorChange={handleSelectorChange} selectedDevice={selectedDevice} />
      <Popup/>
    </div>
  );
}

export default dashboard;