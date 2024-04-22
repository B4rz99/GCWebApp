import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
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
    Legend,
} from 'chart.js';
import 'chartjs-plugin-zoom';
import { API_URL } from '../auth/constants';

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
                        fontWeight: 'bold',
                    },
                },
            ],
        },
    },
});

export default function PulseHistoVariable({ startTime, endTime, selectedDevice }) {
    const [chartData, setChartData] = useState([]);
    const [highlightedIndex, setHighlightedIndex] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedDevice) return;
            try {
                const response = await axios.get(`${API_URL}/api/heartRate`, {
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
                acc[hourDayKey] = { sum: entry.HeartRate, count: 1 };
            } else {
                acc[hourDayKey].sum += entry.HeartRate;
                acc[hourDayKey].count++;
            }
            return acc;
        }, {});

        // Calculate the average heart rate for each time period
        return Object.keys(groupedData).map((key) => {
            const [hour, day] = key.split('/');
            const avgHeartRate = groupedData[key].sum / groupedData[key].count;
            return { x: `${hour}/${day}`, y: avgHeartRate };
        });
    };

    const avgHeartRateSeries = transformData();

    // Prepare data for Chart.js
    const data = {
        labels: avgHeartRateSeries.map((entry) => entry.x),
        datasets: [
            {
                label: 'Frec. Cardiaca',
                data: avgHeartRateSeries.map((entry) => entry.y),
                borderColor: '#8884d8',
                borderWidth: 1,
                fill: false,
                pointBackgroundColor: avgHeartRateSeries.map((_, index) =>
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
          const endIndex = Math.min(index + 3, avgHeartRateSeries.length - 1);
  
          // Define the new x-axis range to center the clicked point and include two adjacent points
          const newMinX = avgHeartRateSeries[startIndex].x;
          const newMaxX = avgHeartRateSeries[endIndex].x;
  
          // Calculate y-axis range to focus on the range around the clicked point
          const yValues = avgHeartRateSeries.slice(startIndex, endIndex + 1).map(point => point.y);
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
                    text: 'lpm',
                },
                suggestedMin: 50,
                suggestedMax: 130,
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
                        Frec. Cardiaca
                    </Typography>
                    <Line data={data} options={options} width={400} height={250} />
                </Paper>
            </Box>
        </ThemeProvider>
    );
}
