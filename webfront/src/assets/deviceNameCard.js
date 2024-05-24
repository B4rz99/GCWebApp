import React from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material';
import { useDataContext } from '../DataContext'; // Importa el contexto de datos

// Theme-ing the DeviceName component
const theme = createTheme({
  components: {
    MuiTypography: {
        variants: [
            {
                props: {
                    component: 'h1',
                },
                style: {
                  fontSize: '1.4rem',
                  fontFamily: 'Mulish',
                  fontWeight: 'Bold'
                },
            },
            {
              props: {
                  component: 'h2',
              },
              style: {
                fontSize: '2.5rem',
                fontFamily: 'Mulish'
              },
          },
        ],
    },
  },
});

// Construction of DeviceName component
const DeviceNameCard = ({ selectedDevice }) => {
  const { data } = useDataContext(); // Get data from the data context

  // Filter data by selectedDevice and extract device name
  const selectedDeviceData = data.find(deviceData => deviceData.DeviceId === selectedDevice);
  const deviceName = selectedDeviceData ? selectedDeviceData.DeviceName : 'Unknown'; // Default to 'Unknown' if no device name

  return (
    <Grid item xs={3}>
      <ThemeProvider theme={theme}>
        <Paper elevation={4} sx={{ width: { xs: 280, md: 200, lg: 250 } }}>
          <Box paddingX={3}>
            <Typography component='h1' sx={{ fontFamily: 'Mulish', fontWeight: 'Bold' }}>
              Paciente
            </Typography>
          </Box>
          <Box paddingX={3}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography component='h2' sx={{ display: { xs: 'flex', md: 'none', lg: 'flex' } }}>
              {deviceName}
            </Typography>
            <Typography component='h2' sx={{ fontSize: '54px', fontWeight: '500', display: { xs: 'none', md: 'flex', lg: 'none' } }}>
              {deviceName}
            </Typography>
          </Box>
          <Grid container
            direction="row"
            justifyContent="flex-end"
            alignItems="flex-end"
            sx={{
              mr: 4,
            }}
          >
            {/* You can add an image or icon here if needed */}
          </Grid>
        </Paper>
      </ThemeProvider>
    </Grid>
  );
};

export default DeviceNameCard;
