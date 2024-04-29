import * as React from 'react';
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
import { API_URL } from '../auth/constants';
import { useEffect, useState } from 'react';
import TableSortLabel from '@mui/material/TableSortLabel';

const columns = [
  { id: 'variable', label: 'Variable', minWidth: 100, sortable: true },
  { id: 'data', label: 'Dato', minWidth: 100, sortable: true },
  { id: 'date', label: 'Fecha', minWidth: 100, sortable: true },
  { id: 'time', label: 'Hora', minWidth: 100, sortable: true },
];

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

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
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedDevice) return;

      try {
        // Fetch data from all three APIs concurrently
        const [oxygenResponse, heartRateResponse, temperatureResponse] = await Promise.all([
          axios.get(`${API_URL}/api/atypicalOxygen`, {
            params: {
              deviceId: selectedDevice,
              startDate: startTime,
              endDate: endTime,
            },
          }),
          axios.get(`${API_URL}/api/atypicalHeartRate`, {
            params: {
              deviceId: selectedDevice,
              startDate: startTime,
              endDate: endTime,
            },
          }),
          axios.get(`${API_URL}/api/atypicalTemperature`, {
            params: {
              deviceId: selectedDevice,
              startDate: startTime,
              endDate: endTime,
            },
          }),
        ]);

        // Combine data and transform it for the table
        const combinedData = [
          ...oxygenResponse.data.map((item) => ({
            variable: 'Oxígeno',
            data: item.Oxygen,
            date: formatDate(item.TimeStamp),
            time: item.TimeStamp.split('T')[1].split('.')[0],
          })),
          ...heartRateResponse.data.map((item) => ({
            variable: 'Frec. Cardiaca',
            data: item.HeartRate,
            date: formatDate(item.TimeStamp),
            time: item.TimeStamp.split('T')[1].split('.')[0],
          })),
          ...temperatureResponse.data.map((item) => ({
            variable: 'Temperatura',
            data: item.Temperature,
            date: formatDate(item.TimeStamp),
            time: item.TimeStamp.split('T')[1].split('.')[0],
          })),
        ];

        // Update the table data state
        setTableData(combinedData);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, [startTime, endTime, selectedDevice]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSort = (columnId) => {
    const isAsc = orderBy === columnId && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(columnId);
  };

  // Function to filter data based on selected types
  const filterDataByType = (data) => {
    return data.filter((row) => {
      if (row.variable === 'Oxígeno' && !selectedTypes.Oxygen) return false;
      if (row.variable === 'Frec. Cardiaca' && !selectedTypes.HeartRate) return false;
      if (row.variable === 'Temperatura' && !selectedTypes.Temperature) return false;
      return true;
    });
  };

  // Function to handle checkbox change for data types
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedTypes((prevSelectedTypes) => ({
      ...prevSelectedTypes,
      [name]: checked,
    }));
  };

  // Sort data based on the order and orderBy states
  const sortedData = React.useMemo(() => {
    if (orderBy) {
      return [...tableData].sort((a, b) => {
        const aValue = a[orderBy];
        const bValue = b[orderBy];

        if (aValue < bValue) {
          return order === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return order === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return tableData;
  }, [tableData, orderBy, order]);

  // Filter data based on the selected types
  const filteredData = React.useMemo(() => {
    return filterDataByType(sortedData);
  }, [sortedData, selectedTypes]);

  return (
    <Paper sx={{ width: '50%', overflow: 'hidden' }}>
      <Typography variant="h6" gutterBottom sx={{ padding: '5px 20px' }}>
        Datos Atípicos
      </Typography>
      <div style={{ padding: '0px 20px' }}>
        <FormControlLabel
          control={<Checkbox
            checked={selectedTypes.Oxygen}
            onChange={handleCheckboxChange}
            name="Oxygen"
          />}
          label="Oxígeno"
        />
        <FormControlLabel
          control={<Checkbox
            checked={selectedTypes.HeartRate}
            onChange={handleCheckboxChange}
            name="HeartRate"
          />}
          label="Frec. Cardiaca"
        />
        <FormControlLabel
          control={<Checkbox
            checked={selectedTypes.Temperature}
            onChange={handleCheckboxChange}
            name="Temperature"
          />}
          label="Temperatura"
        />
      </div>

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
