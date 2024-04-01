import React from 'react';
import 'leaflet/dist/leaflet.css';
import Box from '@mui/material/Box';
import AppBar from '../assets/AppBar';
import LocationDash from '../assets/locationDash';
import PresVariable from '../assets/presVariable';
import CardVariable from '../assets/CardVariable';  
import TempVariable from '../assets/tempVariable';
import SatVariable from '../assets/satVariable';


//Dashboard view rendering
function dashboard() {
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
        <PresVariable/>
        <CardVariable/>
        <TempVariable/>
        <SatVariable/>
      </Box>
      <LocationDash />
    </div>
  );
}

export default dashboard;