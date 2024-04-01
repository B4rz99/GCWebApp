import React from 'react'
import Box from '@mui/material/Box';
import {LineChart} from '@mui/x-charts/LineChart';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material'


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
          ],
      },
    },
  });

export default function presHistoVariable() {
  return (
    <div>
    <ThemeProvider theme={theme}>
        <Box
          height={250}
          width={400}
        >
        <Paper elevation={4}>
            <Typography component='h1' sx={{mx: 4}}>
              Presión
            </Typography>
            <LineChart
            xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
            series={[
               { curve: 'linear', data: [2, 5.5, 2, 8.5, 1.5, 5]},
            ]}
            width={400}
            height={250}
            />
        </Paper>
        </Box>
    </ThemeProvider>
    </div>
  )
}