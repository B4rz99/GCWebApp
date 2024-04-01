/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material'

//Theme-ing the Temperature variable
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
    MuiPaper: {
      default: {
        elevation: 4,
      },
      overrides: {
        root: {
          width: {
            xs: 250,
            md: 200,
            lg: 250
          },
        },
      },
    },
});

//Construction of Temperature component
const tempVariable = () => {
  return (
    <Grid item xs={3} >
      <ThemeProvider theme={theme}>
        <Paper elevation={4} sx={{width: {xs: 250, md:200, lg: 250}}}>
          <Box paddingX={3}>
            <Typography component='h1'>
              Temperatura
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
              36.3°C
            </Typography>
            <Typography component='h2' sx={{ fontSize:'54px', fontWeight:'500', display:{xs:'none', md:'flex', lg:'none'}}}>
              36.3°C
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

export default tempVariable;