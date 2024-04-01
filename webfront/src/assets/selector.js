import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function BasicSelect() {
  const [patient, setPatient] = React.useState('');

  const handleChange = (event) => {
    setPatient(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Paciente</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={patient}
          label="Paciente"
          onChange={handleChange}
        >
          <MenuItem value={1}>Paciente 1</MenuItem>
          <MenuItem value={2}>Paciente 2</MenuItem>
          <MenuItem value={3}>Paciente 3</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}