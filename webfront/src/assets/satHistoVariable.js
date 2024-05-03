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
    '#B7EB1D', // Grey
    '#00A651', // Green
    // Add more colors as needed
];

export default function SatHistoVariable({ startTime, endTime, selectedDevice }) {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [highlightedIndex, setHighlightedIndex] = useState(null);
    const [usedColors, setUsedColors] = useState(new Set());

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedDevice || selectedDevice.length === 0) return;

            try {
                // Array to hold datasets for each device
                const datasets = [];
                
                // Array to hold labels (time points) for each device
                let labels = [];

                // Iterate through each selected device
                for (let i = 0; i < selectedDevice.length; i++) {
                    const deviceId = selectedDevice[i];
                    
                    // Fetch data for the current device
                    const response = await axios.get(`${API_URL}/api/oxygen`, {
                        params: {
                            deviceId,
                            startDate: startTime,
                            endDate: endTime,
                        },
                    });

                    // Check if response data is valid
                    if (response && response.data && Array.isArray(response.data.oxygenData)) {
                        // Extract `oxygenData` and `deviceName` from the response
                        const { oxygenData, deviceName } = response.data;

                        const transformedData = transformData(oxygenData);

                        // Set labels based on the transformed data's x-values
                        if (labels.length === 0 && transformedData.length > 0) {
                            labels = transformedData.map((entry) => entry.x);
                        }

                        // Choose a unique color for the dataset
                        const color = getUniqueColor();

                        // Push a dataset object for the current device
                        datasets.push({
                            label: `${deviceName}`, // Use deviceName as the label
                            data: transformedData.map((entry) => entry.y),
                            borderColor: color,
                            borderWidth: 1,
                            fill: false,
                            pointBackgroundColor: color, // Consistent point color
                        });
                    }
                }

                // Set the chart data state
                setChartData({ labels, datasets });
                // Clear the set of used colors after processing all datasets
                setUsedColors(new Set());
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, [startTime, endTime, selectedDevice]);

    // Utility function to format date to "HH/DD/MM" format
    const formatDate = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so add 1
        return `${hours}/${day}/${month}`;
    };

    // Function to transform chart data and calculate the average oxygen saturation
    const transformData = (data) => {
        // Group data by "HH/DD/MM" and calculate the average oxygen saturation
        const groupedData = data.reduce((acc, entry) => {
            const date = new Date(entry.TimeStamp);
            const formattedDate = formatDate(date);
            
            if (!acc[formattedDate]) {
                acc[formattedDate] = { sum: entry.Oxygen, count: 1 };
            } else {
                acc[formattedDate].sum += entry.Oxygen;
                acc[formattedDate].count++;
            }
            return acc;
        }, {});

        // Calculate the average oxygen saturation for each group and return as an array
        return Object.keys(groupedData).map((key) => {
            const avgOxygen = groupedData[key].sum / groupedData[key].count;
            return { x: key, y: avgOxygen };
        });
    };

    // Function to get a unique color that hasn't been used yet
    const getUniqueColor = () => {
        for (let color of predefinedColors) {
            if (!usedColors.has(color)) {
                usedColors.add(color);
                return color;
            }
        }
        // If all colors are used, reset the set and start over
        usedColors.clear();
        const color = predefinedColors[0];
        usedColors.add(color);
        return color;
    };

    // Event handler for chart click events
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
            const yValues = chartData.datasets.map(dataset => dataset.data.slice(startIndex, endIndex + 1)).flat();
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

    // Define chart options
    const options = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Hr/Día/Mes',
                },
            },
            y: {
                title: {
                    display: true,
                    text: '%',
                },
                suggestedMin: 90,
                suggestedMax: 100,
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context) => `${context.parsed.y.toFixed(0)}%`,
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
                        SpO2
                    </Typography>
                    <Line data={chartData} options={options} width={400} height={250} />
                </Paper>
            </Box>
        </ThemeProvider>
    );
}
