import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material';
import axios from 'axios';
import { LineChart } from '@mui/x-charts/LineChart';


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

export default function satHistoVariable({ startTime, endTime, selectedDevice }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedDevice) return;
      try {
        const response = await axios.get('/api/oxygen', {
          params: {
            deviceId: selectedDevice,
            startDate: startTime,
            endDate: endTime,
          }
        });
        setChartData(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, [startTime, endTime, selectedDevice]);

  const transformData = () => {
    // Agrupar datos por hora/día y calcular promedio
    const groupedData = chartData.reduce((acc, entry) => {
      const date = new Date(entry.TimeStamp);
      const hourDayKey = `${date.getHours()}/${date.getDate()}`;
      if (!acc[hourDayKey]) {
        acc[hourDayKey] = { sum: entry.Oxygen, count: 1 };
      } else {
        acc[hourDayKey].sum += entry.Oxygen;
        acc[hourDayKey].count++;
      }
      return acc;
    }, {});
  
    // Calcular el promedio de los valores de la tasa de pulso
    const avgOxygenSeries = Object.keys(groupedData).map(key => {
      const [hour, day] = key.split('/');
      const avgOxygen = groupedData[key].sum / groupedData[key].count;
      return { x: `${hour}/${day}`, y: avgOxygen };
    });
  
    return avgOxygenSeries;
  };

  const avgOxygenSeries = transformData();

  const data = avgOxygenSeries.map(entry => entry.y);
  const xLabels = avgOxygenSeries.map(entry => entry.x);

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Box height={250} width={400}>
          <Paper elevation={4}>
            <Typography component='h1' sx={{ mx: 4 }}>
              Saturación
            </Typography>
            <LineChart
              height={250}
              width={400}
              
              series={[
                { data, yAxisKey: 'leftAxisId' },
              ]}
              xAxis={[{ scaleType: 'point', data: xLabels }]}
              yAxis={[{ id: 'leftAxisId', min:80 }]}
            />
          </Paper>
        </Box>
      </ThemeProvider>
    </div>
  );
}
