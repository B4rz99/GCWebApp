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

export default function BasicSelect({ onSelectorChange }) {
  const [devices, setDevices] = useState([]); // State to store devices data
  const [selectedDeviceIds, setSelectedDeviceIds] = useState([]); // State to store selected device IDs

  useEffect(() => {
    // Function to fetch devices data
    async function fetchDevices() {
      try {
        const response = await axios.get(`${API_URL}/api/allDevices`);
        if (response.status === 200) {
          // Store devices data in state
          setDevices(response.data);
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

  // Use useEffect to log selectedDeviceIds whenever they change
  useEffect(() => {
    console.log('Selected Device IDs:', selectedDeviceIds);
  }, [selectedDeviceIds]);

  const handleChange = (event) => {
    const selectedValues = event.target.value;
    setSelectedDeviceIds(selectedValues);
    // Call onSelectorChange function with selected device IDs
    onSelectorChange(selectedValues);
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
          renderValue={(selected) => selected.join(', ')} // How to display selected values
        >
          {devices.map((device) => (
            <MenuItem key={device.DeviceId} value={device.DeviceId}>
              <Checkbox checked={selectedDeviceIds.includes(device.DeviceId)} />
              <ListItemText primary={device.Name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
