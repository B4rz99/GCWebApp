import React from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material';
import { useDataContext } from '../DataContext'; // Importa el contexto de datos

// Theme-ing the Temperature variable
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
            fontWeight: 'Bold',
          },
        },
        {
          props: {
            component: 'h2',
          },
          style: {
            fontSize: '4rem',
            fontFamily: 'Mulish',
          },
        },
      ],
    },
  },
  MuiPaper: {
    default: {
      elevation: 4,
    },
    overrides: {
      root: {
        width: {
          xs: 250,
          md: 200,
          lg: 250,
        },
      },
    },
  },
});

// Construction of Temperature component
const TempVariable = ({ selectedDevice }) => {
  const { data } = useDataContext(); // Get data from the data context

  // Filter data by selectedDevice and extract temperature
  const temperatureData = data.find(deviceData => deviceData.DeviceId === selectedDevice)?.data[0];
  const temperature = temperatureData ? `${temperatureData.Temperature}°C` : '0°C'; // Default to 0°C if no temperature data

  return (
    <Grid item xs={3}>
      <ThemeProvider theme={theme}>
        <Paper elevation={4} sx={{ width: { xs: 250, md: 200, lg: 250 } }}>
          <Box paddingX={3}>
            <Typography component='h1'>
              Temperatura
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography component='h2' sx={{ display: { xs: 'flex', md: 'none', lg: 'flex' } }}>
              {temperature}
            </Typography>
            <Typography component='h2' sx={{ fontSize: '54px', fontWeight: '500', display: { xs: 'none', md: 'flex', lg: 'none' } }}>
              {temperature}
            </Typography>
          </Box>
          <Grid container
            direction="row"
            justifyContent="flex-end"
            alignItems="flex-end"
            sx={{
              mr: 2,
            }}
          >
            <img src='https://cdn-icons-png.flaticon.com/512/1247/1247137.png'
              className='ter'
            />
          </Grid>
        </Paper>
      </ThemeProvider>
    </Grid>
  );
};

export default TempVariable;
