import React from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material';
import { useDataContext } from '../DataContext'; // Importa el contexto de datos

// Theme-ing the Pulse variable
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

// Construction of Pulse component
const CardVariable = ({ selectedDevice}) => {
  const { data } = useDataContext(); // Get data from the data context

  // Filter data by selectedDevice and extract heart rate
  
  const selectedDeviceData = data.find(deviceData => deviceData.DeviceId === selectedDevice);
  const heartRate = selectedDeviceData ? `${selectedDeviceData.HeartRate} lpm` : '0 lpm'; // Default to 0 lpm if no heart rate data

  return (
    <Grid item xs={3} >
      <ThemeProvider theme={theme}>
        <Paper elevation={4} sx={{width: {xs: 280, md:200, lg: 250}}}>
          <Box paddingX={3}>
            <Typography component='h1' sx={{ fontFamily:'Mulish', fontWeight:'Bold' }} >
              Frec. Cardiaca
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
              {heartRate}
            </Typography>
            <Typography component='h2' sx={{ fontSize:'54px', fontWeight:'500', display:{xs:'none', md:'flex', lg:'none'}}}>
              {heartRate}
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
          <img src='https://static.wixstatic.com/media/f434cf_ce4ec99f85af48eeaafbbb61089ce801~mv2.gif' 
          className='hrt'
          />
          </Grid>
        </Paper>
      </ThemeProvider>
    </Grid>
  );
};

export default CardVariable;
