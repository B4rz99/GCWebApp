/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material'

//Theme-ing the Pulse variable
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

//Construction of Pulse component
const CardVariable = () => {
  return (
    <Grid item xs={3} >
      <ThemeProvider theme={theme}>
        <Paper elevation={4} sx={{width: {xs: 250, md:200, lg: 250}}}>
          <Box paddingX={3}>
            <Typography component='h1' sx={{ fontFamily:'Mulish', fontWeight:'Bold' }} >
              Pulso
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
              80 lpm
            </Typography>
            <Typography component='h2' sx={{ fontSize:'54px', fontWeight:'500', display:{xs:'none', md:'flex', lg:'none'}}}>
              80 lpm
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