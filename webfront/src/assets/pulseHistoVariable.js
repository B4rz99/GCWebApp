import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush } from 'recharts';

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
      ],
    },
  },
});


export default function PulseHistoVariable({ startTime, endTime, selectedDevice }) {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedDevice) return;
      try {
        const response = await axios.get(`${API_URL}/api/heartRate`, {
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
        acc[hourDayKey] = { sum: entry.HeartRate, count: 1 };
      } else {
        acc[hourDayKey].sum += entry.HeartRate;
        acc[hourDayKey].count++;
      }
      return acc;
    }, {});
  
    // Calcular el promedio de los valores de la tasa de pulso
    const avgHeartRateSeries = Object.keys(groupedData).map(key => {
      const [hour, day] = key.split('/');
      const avgHeartRate = groupedData[key].sum / groupedData[key].count;
      return { x: `${hour}/${day}`, y: avgHeartRate };
    });
  
    return avgHeartRateSeries;
  };

  const avgHeartRateSeries = transformData();

  const handleDataClick = (data, index) => {
    setClickedDataIndex(index);
  };

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Box height={250} width={400}>
          <Paper elevation={4}>
            <Typography component='h1' sx={{ mx: 4 }}>
              Frec. Cardiaca
            </Typography>
            <LineChart
              width={400}
              height={250}
              data={avgHeartRateSeries}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" />
              <YAxis />
              <Tooltip formatter={(value) => Math.round(value)} />
              <Line type="monotone" dataKey="y" stroke="#8884d8"/>
              <Brush dataKey="x" height={30} />
            </LineChart>
          </Paper>
        </Box>
      </ThemeProvider>
    </div>
  );
}

