import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios'; // Importar Axios
import { API_URL } from '../auth/constants';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';

export default function BasicSelect({ onSelectorChange }) {
  const [devices, setDevices] = useState([]); // Estado para almacenar los datos de los dispositivos
  const [selectedDeviceId, setSelectedDeviceId] = useState(null); // Estado para almacenar el ID del dispositivo seleccionado

  useEffect(() => {
    // Función para obtener los datos de los dispositivos
    async function fetchAvailableDevices() {
      try {
        const response = await axios.get(`${API_URL}/api/availableDevices`);
        if (response.status === 200) {
          // Almacenar los datos de los dispositivos en el estado
          setDevices(response.data);
        } else {
          console.error('Error al obtener los datos de dispositivos:', response.statusText);
        }
      } catch (error) {
        console.error('Error al realizar la solicitud:', error.message);
      }
    }

    // Llamar a la función para obtener los datos de los dispositivos cuando el componente se monta
    fetchAvailableDevices();
  }, []); // El segundo argumento [] asegura que useEffect se ejecute solo una vez

  const handleChange = (event) => {
    const selectedDeviceId = event.target.value;
    setSelectedDeviceId(selectedDeviceId);
    // Llamar a la función onSelectorChange con el ID del dispositivo seleccionado
    onSelectorChange(selectedDeviceId);
  };

  return (
    <Box sx={{ maxHeight: 100 }}>
      <FormControl fullWidth>
        <InputLabel id="simple-select">Brazalete</InputLabel>
        <Select
          labelId="simple-select"
          id="simple-select-1"
          value={selectedDeviceId || ''} // Usar una cadena vacía si selectedDeviceId es null
          label="Device"
          onChange={handleChange}
        >
          {devices.map(device => (
            <MenuItem key={device.DeviceId} value={device.DeviceId}>
              {device.Name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
