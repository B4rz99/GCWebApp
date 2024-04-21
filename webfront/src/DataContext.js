import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from './auth/constants';

const DataContext = createContext();

export const useDataContext = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [lastAlertTimestamp, setLastAlertTimestamp] = useState(null);
  const [hasAlertShown, setHasAlertShown] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/realTime`);
        setData(response.data);
        
        // Verificar si algún dato es "extraño" y mostrar una alerta
        const newAlerts = [];
        response.data.forEach(deviceData => {
          deviceData.data.forEach(item => {
            if (
              item.HeartRate < 60 || item.HeartRate > 100 ||
              item.Oxygen < 80 || item.Oxygen > 100 ||
              item.Temperature < 35 || item.Temperature > 38
            ) {
              const timestamp = new Date(deviceData.Timestamp).getTime();
              if (timestamp !== lastAlertTimestamp) {
                let message = `¡Alerta! El dispositivo ${deviceData.DeviceId} tiene valores inusuales: `;
                if (item.HeartRate < 50 || item.HeartRate > 120) {
                  message += `El ritmo cardíaco es ${item.HeartRate}. `;
                }
                if (item.Oxygen < 70 || item.Oxygen > 100) {
                  message += `El nivel de oxígeno es ${item.Oxygen}. `;
                }
                if (item.Temperature < 30 || item.Temperature > 38) {
                  message += `La temperatura es ${item.Temperature}. `;
                }
                // Verifica si el mensaje de alerta es nuevo comparándolo con el último mensaje almacenado
                if (!alerts.includes(message)) {
                  newAlerts.push(message);
                  setLastAlertTimestamp(timestamp);
                  setHasAlertShown(true);
                }
              }
            }
          });
        });
        // Actualiza alerts solo si hay nuevos mensajes de alerta
        if (newAlerts.length > 0) {
          setAlerts(prevAlerts => [...prevAlerts, ...newAlerts]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Llamar a fetchData al montar el componente y luego cada 60 segundos (60000 milisegundos)
    fetchData();
    const intervalId = setInterval(fetchData, 10000); // Cambia el intervalo según sea necesario

    // Limpiar el intervalo al desmontar el componente para evitar fugas de memoria
    return () => clearInterval(intervalId);
  }, [lastAlertTimestamp, alerts]); // Agrega alerts como dependencia para detectar cambios en el estado de alertas

  return (
    <DataContext.Provider value={{ data, alerts, hasAlertShown, setHasAlertShown }}>
      {children}
    </DataContext.Provider>
  );
};
