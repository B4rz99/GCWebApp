import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { API_URL } from '../auth/constants';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
ChartJS.register(zoomPlugin);

const theme = createTheme({
    components: {
        MuiTypography: {
            variants: [
                {
                    props: { component: 'h1' },
                    style: {
                        fontSize: '1.4rem',
                        fontFamily: 'Mulish',
                        fontWeight: 'bold',
                    },
                },
            ],
        },
    },
});

export default function TempHistoVariable({ startTime, endTime, selectedDevice }) {
    const [chartData, setChartData] = useState([]);
    const [highlightedIndex, setHighlightedIndex] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedDevice) return;
            try {
                const response = await axios.get(`${API_URL}/api/temperature`, {
                    params: {
                        deviceId: selectedDevice,
                        startDate: startTime,
                        endDate: endTime,
                    },
                });
                setChartData(response.data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, [startTime, endTime, selectedDevice]);

    const transformData = () => {
        // Group data by hour/day and calculate the average
        const groupedData = chartData.reduce((acc, entry) => {
            const date = new Date(entry.TimeStamp);
            const hourDayKey = `${date.getHours()}/${date.getDate()}`;
            if (!acc[hourDayKey]) {
                acc[hourDayKey] = { sum: entry.Temperature, count: 1 };
            } else {
                acc[hourDayKey].sum += entry.Temperature;
                acc[hourDayKey].count++;
            }
            return acc;
        }, {});

        // Calculate the average temperature for each time period
        return Object.keys(groupedData).map((key) => {
            const [hour, day] = key.split('/');
            const avgTemperature = groupedData[key].sum / groupedData[key].count;
            return { x: `${hour}/${day}`, y: avgTemperature };
        });
    };

    const avgTemperatureSeries = transformData();

    // Prepare data for Chart.js
    const data = {
      labels: avgTemperatureSeries.map((entry) => entry.x),
      datasets: [
          {
              label: 'Temperatura',
              data: avgTemperatureSeries.map((entry) => entry.y),
              borderColor: '#8884d8',
              borderWidth: 1,
              fill: false,
              pointBackgroundColor: avgTemperatureSeries.map((_, index) =>
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
        const endIndex = Math.min(index + 3, avgTemperatureSeries.length - 1);

        // Define the new x-axis range to center the clicked point and include two adjacent points
        const newMinX = avgTemperatureSeries[startIndex].x;
        const newMaxX = avgTemperatureSeries[endIndex].x;

        // Calculate y-axis range to focus on the range around the clicked point
        const yValues = avgTemperatureSeries.slice(startIndex, endIndex + 1).map(point => point.y);
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
                  text: '°C',
              },
              suggestedMin: 30,
              suggestedMax: 40,
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
                    <Typography component="h1" sx={{ mx: 4 }}>
                        Temperatura
                    </Typography>
                    <Line
                        data={data}
                        options={options}
                        width={400}
                        height={250}
                    />
                </Paper>
            </Box>
        </ThemeProvider>
    );
}
