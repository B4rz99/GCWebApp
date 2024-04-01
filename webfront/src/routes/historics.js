import React from 'react'
import Box from '@mui/material/Box';
import 'leaflet/dist/leaflet.css';
import AppBar from '../assets/AppBar';
import Location from '../assets/location';
import PresHistoVariable from '../assets/presHistoVariable';
import CardHistoVariable from '../assets/cardHistoVariable';
import TempHistoVariable from '../assets/tempHistoVariable';
import SatHistoVariable from '../assets/satHistoVariable';

export default function historics() {
  return (
    <div>
      <AppBar/>
    <Box
        display='flex'
        justifyContent='center'
        marginY={3}
        gap={4}
      >
        <PresHistoVariable/>
        <CardHistoVariable/>
        <SatHistoVariable/>
        <TempHistoVariable/>
        
    </Box>
    <Location />
    </div>
  )
}