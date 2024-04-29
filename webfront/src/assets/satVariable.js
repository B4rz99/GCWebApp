import React from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material';
import { useDataContext } from '../DataContext'; // Importa el contexto de datos

// Theme-ing the Saturation variable
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
                  fontWeight:'Bold'
                },
            },
            {
              props: {
                  component: 'h2',
              },
              style: {
                fontSize: '4rem',
                fontFamily:'Mulish'
              },
          },
        ],
    },
  },
});

// Construction of Saturation component
const SatVariable = ({ selectedDevice }) => {
  const { data } = useDataContext(); // Get data from the data context

  // Filter data by selectedDevice and extract oxygen
  const saturationData = data.find(deviceData => deviceData.DeviceId === selectedDevice)?.data[0];
  const saturation = saturationData ? `${saturationData.Oxygen}%` : '0%'; // Default to 0% if no saturation data

  return (
    <Grid item xs={3} >
      <ThemeProvider theme={theme}>
        <Paper elevation={4} sx={{width: {xs: 250, md:200, lg: 250}}}>
          <Box paddingX={3}>
            <Typography component='h1'>
              SpO2
            </Typography>
          </Box>
          <Box 
              sx={{
                  display:'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
              }}
          >
            <Typography component='h2' sx={{display:{xs:'flex', md:'none', lg:'flex'}}}>
              {saturation}
            </Typography>
            <Typography component='h2' sx={{ fontSize:'54px', fontWeight:'500', display:{xs:'none', md:'flex', lg:'none'}}}>
              {saturation}
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
          </Grid>
        </Paper>
      </ThemeProvider>
    </Grid>
  );
};

export default SatVariable;
