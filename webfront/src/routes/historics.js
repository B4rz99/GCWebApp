import React from 'react';
import 'leaflet/dist/leaflet.css';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import AppBar from '../assets/AppBar.tsx';
import Location from '../assets/location';
import PulseHistoVariable from '../assets/pulseHistoVariable';
import TempHistoVariable from '../assets/tempHistoVariable';
import SatHistoVariable from '../assets/satHistoVariable';
import TableHistorics from '../assets/tableHistorics';
import PresHistoVariable from '../assets/presHistoVariable';

// Historics view rendering
export default function Historics() {
    const [startTime, setStartTime] = React.useState(null);
    const [endTime, setEndTime] = React.useState(null);
    const [selectedDevice, setSelectedDevice] = React.useState([]);

    const handleDateChange = (startDate, endDate) => {
        setStartTime(startDate);
        setEndTime(endDate);
    };

    const handleSelectorChange = (selector) => {
        setSelectedDevice(selector);
    };

    return (
        <div>
            <AppBar />
            <Box  marginleft={23}>
            {/* Wrap content in a Grid container */}
            <Grid container spacing={2} justifyContent="center" marginY={1}>
                <Grid item xs={12} sm={6} md={3} lg={3}>
                    <PulseHistoVariable startTime={startTime} endTime={endTime} selectedDevice={selectedDevice} />
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={3}>
                    <TempHistoVariable startTime={startTime} endTime={endTime} selectedDevice={selectedDevice} />
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={3}>
                    <SatHistoVariable startTime={startTime} endTime={endTime} selectedDevice={selectedDevice} />
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={3}>
                    <PresHistoVariable startTime={startTime} endTime={endTime} selectedDevice={selectedDevice} />
                </Grid>
            </Grid>
            {/* Wrap the Location component in a Grid item */}
            <Grid item xs={12}>
                <Location
                    onDateChange={handleDateChange}
                    onSelectorChange={handleSelectorChange}
                    startTime={startTime}
                    endTime={endTime}
                    selectedDevice={selectedDevice}
                />
            </Grid>
            </Box>
        </div>
    );
}
