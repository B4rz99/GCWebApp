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

const predefinedColors = [
    '#FF6384', // Red
    '#36A2EB', // Blue
    '#FFCE56', // Yellow
    '#4BC0C0', // Teal
    '#9966FF', // Purple
    '#FF9F40', // Orange
    '#F468B3', // Pink
    '#F1C0C0', // Teal
    '#00A651', // Green
    '#B7EB1D', // Grey
    // Add more colors as needed
];

export default function PressureHistoVariable({ startTime, endTime, selectedDevice }) {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [highlightedIndex, setHighlightedIndex] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedDevice || selectedDevice.length === 0) return;

            try {
                // Array to hold datasets for each device
                const datasets = [];
                
                // Array to hold labels (time points) for each device
                let labels = [];
                
                // Track the index of the current color being used
                let colorIndex = 0;

                // Iterate through each selected device
                for (let i = 0; i < selectedDevice.length; i++) {
                    const deviceId = selectedDevice[i];
                    // Fetch data for the current device
                    const response = await axios.get(`${API_URL}/api/pressure`, {
                        params: {
                            deviceId,
                            startDate: startTime,
                            endDate: endTime,
                        },
                    });

                    // Check if response data is valid
                    if (response && response.data) {
                        const { pressureData, deviceName } = response.data;

                        const transformedData = transformData(pressureData);

                        // Set labels based on the transformed data's x-values
                        if (labels.length === 0 && transformedData.length > 0) {
                            labels = transformedData.map((entry) => entry.x);
                        }

                        // Push a dataset object for the current device using the device name
                        const systolicColor = predefinedColors[colorIndex % predefinedColors.length];
                        const diastolicColor = predefinedColors[(colorIndex + 1) % predefinedColors.length];
                        colorIndex += 2;

                        datasets.push({
                            label: `${deviceName} Sistólica`, // Use device name in the label
                            data: transformedData.map((entry) => entry.y.avgSistolic),
                            borderColor: systolicColor,
                            borderWidth: 1,
                            fill: false,
                            pointBackgroundColor: systolicColor, // Consistent point color
                        });

                        datasets.push({
                            label: `${deviceName} Diastólica`, // Use device name in the label
                            data: transformedData.map((entry) => entry.y.avgDiastolic),
                            borderColor: diastolicColor,
                            borderWidth: 1,
                            fill: false,
                            pointBackgroundColor: diastolicColor, // Consistent point color
                        });
                    }
                }

                // Set the chart data state
                setChartData({ labels, datasets });
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, [startTime, endTime, selectedDevice]);

    const transformData = (data) => {
        // Group data by hour of each day and calculate the average systolic and diastolic pressures
        const groupedData = data.reduce((acc, entry) => {
            const date = new Date(entry.TimeStamp);
            // Create a key based on the date and hour (e.g., 'HH/DD/MM')
            const hourDayKey = `${date.getHours().toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;

            // Initialize grouping if not yet done
            if (!acc[hourDayKey]) {
                acc[hourDayKey] = {
                    sumSistolic: entry.Sistolic,
                    sumDiastolic: entry.Diastolic,
                    count: 1,
                };
            } else {
                // Accumulate sum of systolic and diastolic pressures and increment the count
                acc[hourDayKey].sumSistolic += entry.Sistolic;
                acc[hourDayKey].sumDiastolic += entry.Diastolic;
                acc[hourDayKey].count++;
            }
            return acc;
        }, {});

        // Calculate average systolic and diastolic pressures for each hour of each day
        return Object.keys(groupedData).map((hourDayKey) => {
            const { sumSistolic, sumDiastolic, count } = groupedData[hourDayKey];
            const avgSistolic = sumSistolic / count;
            const avgDiastolic = sumDiastolic / count;

            // Return an object with the hour/day key as the x-axis value and the average pressures as y values
            return { x: hourDayKey, y: { avgSistolic, avgDiastolic } };
        });
    };

    const handleChartClick = (event, elements) => {
        if (elements.length > 0) {
            const index = elements[0].index;
            setHighlightedIndex(index);

            // Get the chart instance
            const chartInstance = event.chart;

            // Calculate the range of points to display (clicked point and two points next to it)
            const startIndex = Math.max(index - 3, 0);
            const endIndex = Math.min(index + 3, chartData.datasets[0].data.length - 1);

            // Define the new x-axis range to center the clicked point and include adjacent points
            const newMinX = chartData.labels[startIndex];
            const newMaxX = chartData.labels[endIndex];

            // Calculate y-axis range to focus on the range around the clicked point
            const systolicYValues = chartData.datasets.map(dataset => dataset.data.slice(startIndex, endIndex + 1)).flat();
            const diastolicYValues = chartData.datasets.map(dataset => dataset.data.slice(startIndex, endIndex + 1)).flat();
            const newMinY = Math.min(...systolicYValues, ...diastolicYValues);
            const newMaxY = Math.max(...systolicYValues, ...diastolicYValues);

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
                    text: 'Fecha',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'mmHg',
                },
                suggestedMin: 20,
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
            <Box>
                <Paper elevation={4}>
                    <Typography component='h1' sx={{ mx: 4 }}>
                        Tensión Arterial
                    </Typography>
                    <Line data={chartData} options={options} width={400} height={250} />
                </Paper>
            </Box>
        </ThemeProvider>
    );
}