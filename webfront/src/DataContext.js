import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from './auth/constants';

const DataContext = createContext();

export const useDataContext = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [sosData, setSosData] = useState([]);
  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/realTime`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchSosData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/sos`);
        setSosData(response.data);
      } catch (error) {
        console.error('Error fetching SOS data:', error);
      }
    };

    // Llamar a fetchData al montar el componente y luego cada 60 segundos (60000 milisegundos)
    fetchSosData();
    fetchRealTimeData();

    const intervalId = setInterval(() => {
      fetchRealTimeData();
      fetchSosData();
    }, 2000); // Cambia el intervalo según sea necesario

    // Limpiar el intervalo al desmontar el componente para evitar fugas de memoria
    return () => clearInterval(intervalId);

  },[]);

  return (
    <DataContext.Provider value={{ data, sosData, setSosData}}>
      {children}
    </DataContext.Provider>
  );
};
