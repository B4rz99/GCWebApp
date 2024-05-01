import React, { useState, useEffect } from 'react';
import { useDataContext } from '../DataContext';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const Popup = () => {
  const { sosData } = useDataContext();
  const [alertData, setAlertData] = useState([]); // Variable para almacenar los datos de la alerta
  const [open, setOpen] = useState(false);
  const [alertConfirmed, setAlertConfirmed] = useState(false);
  
  
  useEffect(() => {
    if (sosData.length > 0) {
      setAlertData(sosData); // Almacenar los datos de sosData en alertData
      setOpen(true);
    }
  }, [sosData]);

  // Función para cerrar el popup y limpiar los datos de sosData solo si el usuario confirma la alerta
  const handleClosePopup = () => {
      setAlertData([]);
      setOpen(false);
  };


  return (
    <Dialog open={open} onClose={handleClosePopup}>
      <DialogTitle>¡Alerta!</DialogTitle>
      <DialogContent>
        <DialogContentText>
          { alertData.map((data, index) => (
            <p key={index}>
              Alerta activada del dispositivo {data.DeviceId} a las {new Date(data.TimeStamp).toLocaleString()}
            </p>
          ))}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClosePopup} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Popup;
