// Import necessary modules and components
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TableSortLabel from '@mui/material/TableSortLabel';
import { API_URL } from '../auth/constants';

// Columns definition for the table
const columns = [
    { id: 'patient', label: 'Paciente', minWidth: 100, sortable: true },
    { id: 'variable', label: 'Variable', minWidth: 100, sortable: true },
    { id: 'data', label: 'Dato', minWidth: 100, sortable: true },
    { id: 'dateTime', label: 'Fecha/Hora', minWidth: 100, sortable: true },
];

// Function to format date and time from timestamp
function formatDate(timestamp) {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const time = date.toISOString().split('T')[1].split('.')[0]; // Extract time component
    return `${day}/${month}/${year} ${time}`;
}

// The main StickyHeadTable component
export default function StickyHeadTable({ startTime, endTime, selectedDevice }) {
    const [tableData, setTableData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('');
    const [selectedTypes, setSelectedTypes] = useState({
        Oxygen: true,
        HeartRate: true,
        Temperature: true,
        Pressure: true,
    });

    // Function to fetch data for all selected devices
    const fetchData = async () => {
        if (!selectedDevice || selectedDevice.length === 0) return;

        try {
            // Array to hold all fetched data
            let allData = [];

            // Iterate through each device ID in the array
            for (let deviceId of selectedDevice) {
                // Fetch data from all APIs concurrently for the current device ID
                const [oxygenResponse, heartRateResponse, temperatureResponse, pressureResponse] = await Promise.all([
                    axios.get(`${API_URL}/api/atypicalOxygen`, {
                        params: {
                            deviceId,
                            startDate: startTime,
                            endDate: endTime,
                        },
                    }),
                    axios.get(`${API_URL}/api/atypicalHeartRate`, {
                        params: {
                            deviceId,
                            startDate: startTime,
                            endDate: endTime,
                        },
                    }),
                    axios.get(`${API_URL}/api/atypicalTemperature`, {
                        params: {
                            deviceId,
                            startDate: startTime,
                            endDate: endTime,
                        },
                    }),
                    axios.get(`${API_URL}/api/atypicalPressure`, {
                        params: {
                            deviceId,
                            startDate: startTime,
                            endDate: endTime,
                        },
                    }),
                ]);

                // Combine data from the current device ID
                const combinedData = [
                    ...oxygenResponse.data.oxygenData.map((item) => ({
                        deviceId: oxygenResponse.data.deviceId,
                        patient: oxygenResponse.data.deviceName,
                        variable: 'Oxígeno',
                        data: item.Oxygen,
                        dateTime: `${formatDate(item.TimeStamp)}`,
                    })),
                    ...heartRateResponse.data.heartRateData.map((item) => ({
                        deviceId: heartRateResponse.data.deviceId,
                        patient: heartRateResponse.data.deviceName,
                        variable: 'Frec. Cardiaca',
                        data: item.HeartRate,
                        dateTime: `${formatDate(item.TimeStamp)}`,
                    })),
                    ...temperatureResponse.data.temperatureData.map((item) => ({
                        deviceId: temperatureResponse.data.deviceId,
                        patient: temperatureResponse.data.deviceName,
                        variable: 'Temperatura',
                        data: item.Temperature,
                        dateTime: `${formatDate(item.TimeStamp)}`,
                    })),
                    ...pressureResponse.data.pressureData.map((item) => ({
                        deviceId: pressureResponse.data.deviceId,
                        patient: pressureResponse.data.deviceName,
                        variable: 'Tensión Arterial',
                        data: `${item.Sistolic}/${item.Diastolic}`,
                        dateTime: `${formatDate(item.TimeStamp)}`,
                    })),
                ];

                // Add combined data to the allData array
                allData.push(...combinedData);
            }

            // Update the table data state with all fetched data
            setTableData(allData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Use effect hook to fetch data when the component mounts or dependencies change
    useEffect(() => {
        fetchData();
    }, [startTime, endTime, selectedDevice]);

    // Event handler for changing pages
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Event handler for changing rows per page
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    // Event handler for sorting columns
    const handleSort = (columnId) => {
        const isAsc = orderBy === columnId && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(columnId);
    };

    // Event handler for checkbox changes
    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setSelectedTypes((prevSelectedTypes) => ({
            ...prevSelectedTypes,
            [name]: checked,
        }));
    };

    // Filter data based on selected types
    const filterDataByType = (data) => {
        return data.filter((row) => {
            if (row.variable === 'Oxígeno' && !selectedTypes.Oxygen) return false;
            if (row.variable === 'Frec. Cardiaca' && !selectedTypes.HeartRate) return false;
            if (row.variable === 'Temperatura' && !selectedTypes.Temperature) return false;
            if (row.variable === 'Tensión Arterial' && !selectedTypes.Pressure) return false;
            return true;
        });
    };

    // Memoized function to sort data based on order and orderBy states
    const sortedData = useMemo(() => {
        if (orderBy) {
            return [...tableData].sort((a, b) => {
                const aValue = a.dateTime;
                const bValue = b.dateTime;

                // Compare timestamps based on the `dateTime` property
                return order === 'desc' ? (aValue > bValue ? -1 : 1) : (aValue > bValue ? 1 : -1);
            });
        }
        return tableData;
    }, [tableData, orderBy, order]);

    // Memoized function to filter data based on selected types
    const filteredData = useMemo(() => filterDataByType(sortedData), [sortedData, selectedTypes]);

    // Render the table and UI components
    return (
        <Paper sx={{ width: '50%', overflow: 'hidden' }}>
            <Typography variant="h6" gutterBottom sx={{ padding: '5px 20px' }}>
                Datos Atípicos
            </Typography>

            {/* Checkboxes for filtering by types */}
            <div style={{ padding: '0px 20px' }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={selectedTypes.Oxygen}
                            onChange={handleCheckboxChange}
                            name="Oxygen"
                        />
                    }
                    label="Oxígeno"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={selectedTypes.HeartRate}
                            onChange={handleCheckboxChange}
                            name="HeartRate"
                        />
                    }
                    label="Frec. Cardiaca"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={selectedTypes.Temperature}
                            onChange={handleCheckboxChange}
                            name="Temperature"
                        />
                    }
                    label="Temperatura"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={selectedTypes.Pressure}
                            onChange={handleCheckboxChange}
                            name="Pressure"
                        />
                    }
                    label="Tensión Arterial"
                />
            </div>

            {/* Table and pagination */}
            <TableContainer sx={{ maxHeight: 350 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align="left"
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.sortable ? (
                                        <TableSortLabel
                                            active={orderBy === column.id}
                                            direction={orderBy === column.id ? order : 'asc'}
                                            onClick={() => handleSort(column.id)}
                                        >
                                            {column.label}
                                        </TableSortLabel>
                                    ) : (
                                        column.label
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                            <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                {columns.map((column) => {
                                    const value = row[column.id];
                                    return (
                                        <TableCell key={column.id} align="left">
                                            {column.format && typeof value === 'number'
                                                ? column.format(value)
                                                : value}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={filteredData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}
