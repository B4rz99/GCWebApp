import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from './auth/constants';

const DataContext = createContext();

export const useDataContext = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [sos, setSos] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/realTime`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Llamar a fetchData al montar el componente y luego cada 60 segundos (60000 milisegundos)
    fetchData();
    const intervalId = setInterval(fetchData, 5000); // Cambia el intervalo según sea necesario

    // Limpiar el intervalo al desmontar el componente para evitar fugas de memoria
    return () => clearInterval(intervalId);

  },[]);

  return (
    <DataContext.Provider value={{ data }}>
      {children}
    </DataContext.Provider>
  );
};
