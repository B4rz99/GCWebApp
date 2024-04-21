import React from 'react';
import { useDataContext } from '../DataContext';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const Popup = () => {
  const { hasAlertShown, setHasAlertShown, alerts } = useDataContext();

  // Función para cerrar el popup
  const handleClosePopup = () => {
    setHasAlertShown(false);
  };

  return (
    <Dialog open={hasAlertShown} onClose={handleClosePopup}>
      <DialogTitle>¡Alerta!</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {alerts.map((alert, index) => (
            <p key={index}>{alert}</p>
          ))}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClosePopup} color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Popup;
