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
import { API_URL } from '../auth/constants';
import { useEffect, useState } from 'react';

const columns = [
  { id: 'variable', label: 'Variable', minWidth: 100 },
  { id: 'data', label: 'Dato', minWidth: 100 },
  { id: 'date', label: 'Fecha', minWidth: 100 },
  { id: 'time', label: 'Hora', minWidth: 100 },
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

  return (
    <Paper sx={{ width: '50%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align="left"
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
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
        count={tableData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
