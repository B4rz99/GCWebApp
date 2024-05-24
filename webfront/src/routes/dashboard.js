import React from 'react';
import 'leaflet/dist/leaflet.css';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import AppBar from '../assets/AppBar.tsx';
import LocationDash from '../assets/locationDash';
import PresVariable from '../assets/presVariable';
import CardVariable from '../assets/CardVariable';
import TempVariable from '../assets/tempVariable';
import SatVariable from '../assets/satVariable';
import DeviceNameCard from '../assets/deviceNameCard.js';
import Popup from '../assets/popup.js';


// Dashboard view rendering
function Dashboard() {
  const [selectedDevice, setSelectedDevice] = React.useState([]);

  const handleSelectorChange = (selector) => {
    setSelectedDevice(selector);
  };

  return (
    <div className="App">
      <AppBar />
      <Box marginLeft={15}> {/* Adjust marginLeft as needed */}
        {selectedDevice.map((device, index) => (
          <Grid
            key={index}
            container
            spacing={0}
            justifyContent="center"
            alignItems="center"
            style={{ marginBottom: '16px', marginTop:'2px' }} // Add space below each grid container
          >
            <Grid item xs={10} sm={4} md={2} lg={2}>
              <DeviceNameCard selectedDevice={device} /> {/* Add the DeviceNameCard */}
            </Grid>
            <Grid item xs={10} sm={4} md={2} lg={2}>
              <CardVariable selectedDevice={device} />
            </Grid>
            <Grid item xs={10} sm={4} md={2} lg={2}>
              <TempVariable selectedDevice={device} />
            </Grid>
            <Grid item xs={10} sm={4} md={2} lg={2}>
              <SatVariable selectedDevice={device} />
            </Grid>
            <Grid item xs={10} sm={4} md={2} lg={2}>
              <PresVariable selectedDevice={device} />
            </Grid>
          </Grid>
        ))}
        <LocationDash onSelectorChange={handleSelectorChange} selectedDevice={selectedDevice} />
        <Popup />
      </Box>
    </div>
  );
}

export default Dashboard;
