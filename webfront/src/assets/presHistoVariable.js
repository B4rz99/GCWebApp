import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material';
import axios from 'axios';
import { API_URL } from '../auth/constants';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'chartjs-plugin-zoom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
ChartJS.register(require('chartjs-plugin-zoom'));

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

export default function PresHistoVariable({ startTime, endTime, selectedDevice }) {
  const [chartData, setChartData] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedDevice) return;
      try {
        const response = await axios.get(`${API_URL}/api/pressure`, {
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
        acc[hourDayKey] = { sum: entry.Pressure, count: 1 };
      } else {
        acc[hourDayKey].sum += entry.Pressure;
        acc[hourDayKey].count++;
      }
      return acc;
    }, {});
  
    // Calcular el promedio de los valores de la tasa de pulso
    const avgPressureSeries = Object.keys(groupedData).map(key => {
      const [hour, day] = key.split('/');
      const avgPressure = groupedData[key].sum / groupedData[key].count;
      return { x: `${hour}/${day}`, y: avgPressure };
    });
  
    return avgPressureSeries;
  };

  const avgPressureSeries = transformData();

  // Prepare data for Chart.js
  const data = {
    labels: avgPressureSeries.map((entry) => entry.x),
    datasets: [
        {
            label: 'Tension Arterial',
            data: avgPressureSeries.map((entry) => entry.y),
            borderColor: '#8884d8',
            borderWidth: 1,
            fill: false,
            pointBackgroundColor: avgPressureSeries.map((_, index) =>
                index === highlightedIndex ? 'yellow' : '#8884d8'
            ),
        },
    ],
};

const handleChartClick = (event, elements) => {
  if (elements.length > 0) {
      const index = elements[0].index;
      setHighlightedIndex(index);

      // Get the chart instance
      const chartInstance = event.chart;

      // Calculate the range of points to display (clicked point and two points next to it)
      const startIndex = Math.max(index - 3, 0);
      const endIndex = Math.min(index + 3, avgPressureSeries.length - 1);

      // Define the new x-axis range to center the clicked point and include two adjacent points
      const newMinX = avgPressureSeries[startIndex].x;
      const newMaxX = avgPressureSeries[endIndex].x;

      // Calculate y-axis range to focus on the range around the clicked point
      const yValues = avgPressureSeries.slice(startIndex, endIndex + 1).map(point => point.y);
      const newMinY = Math.min(...yValues);
      const newMaxY = Math.max(...yValues);

      // Set the new x-axis and y-axis range to zoom in on the selected range
      chartInstance.options.scales.x.min = newMinX;
      chartInstance.options.scales.x.max = newMaxX;
      chartInstance.options.scales.y.min = newMinY - 5; // Optional: Add a margin for better visibility
      chartInstance.options.scales.y.max = newMaxY + 5; // Optional: Add a margin for better visibility

      // Update the chart to apply the changes
      chartInstance.update();
  }
};


const options = {
    scales: {
        x: {
            title: {
                display: true,
                text: 'Hora/Día',
            },
        },
        y: {
            title: {
                display: true,
                text: 'mmHg',
            },
            suggestedMin: 40,
            suggestedMax: 140,
        },
    },
    plugins: {
        tooltip: {
            callbacks: {
                label: (context) => `${context.parsed.y.toFixed(0)}`,
            },
        },
        zoom: {
            pan: {
                enabled: true,
                mode: 'xy',
            },
            zoom: {
                wheel: {
                    enabled: true,
                },
                pinch: {
                    enabled: true,
                },
                mode: 'xy',
            },
        },
    },
    onClick: handleChartClick,
};

  return (
    <ThemeProvider theme={theme}>
            <Box height={250} width={400}>
                <Paper elevation={4}>
                    <Typography component='h1' sx={{ mx: 4 }}>
                        Tensión Arterial
                    </Typography>
                    <Line data={data} options={options} width={400} height={250} />
                </Paper>
            </Box>
    </ThemeProvider>
  );
}
