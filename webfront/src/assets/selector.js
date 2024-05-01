import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import axios from 'axios';
import { API_URL } from '../auth/constants';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function BasicSelect({ onSelectorChange }) {
  const [devices, setDevices] = useState([]); // State to store devices data
  const [selectedDeviceIds, setSelectedDeviceIds] = useState([]); // State to store selected device IDs
  const [openSnackbar, setOpenSnackbar] = useState(false); // State for showing snackbar

  useEffect(() => {
    // Function to fetch devices data
    async function fetchDevices() {
      try {
        const response = await axios.get(`${API_URL}/api/allDevices`);
        if (response.status === 200) {
          // Store devices data in state
          const devicesData = response.data;
          setDevices(devicesData);

          // Set all device IDs as initially selected
          const allDeviceIds = devicesData.map(device => device.DeviceId);
          setSelectedDeviceIds(allDeviceIds);

          // Call onSelectorChange function with all device IDs
          onSelectorChange(allDeviceIds);
        } else {
          console.error('Error fetching devices data:', response.statusText);
        }
      } catch (error) {
        console.error('Error during the request:', error.message);
      }
    }

    // Fetch devices data when the component mounts
    fetchDevices();
  }, []);

  const handleChange = (event) => {
    const selectedValues = event.target.value;

    // If no options are selected, display a warning and return early
    if (selectedValues.length === 0) {
      setOpenSnackbar(true);
      return;
    }

    // Update selected device IDs state
    setSelectedDeviceIds(selectedValues);
    
    // Call onSelectorChange function with selected device IDs
    onSelectorChange(selectedValues);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl sx={{ m: 1, width: 200 }}>
        <InputLabel id="multi-select-label">Pacientes</InputLabel>
        <Select
          labelId="multi-select-label"
          id="multi-select"
          multiple
          value={selectedDeviceIds}
          onChange={handleChange}
          renderValue={(selected) => selected.join(', ')}
        >
          {devices.map((device) => (
            <MenuItem key={device.DeviceId} value={device.DeviceId}>
              <Checkbox checked={selectedDeviceIds.includes(device.DeviceId)} />
              <ListItemText primary={device.Name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* Snackbar for warning */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="warning" sx={{ width: '100%' }}>
          Mínimo debe haber un paciente debe ser seleccionado.
        </Alert>
      </Snackbar>
    </Box>
  );
}
