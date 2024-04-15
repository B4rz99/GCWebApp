import * as React from 'react';
import DatePicker from 'react-datepicker';
import { useState } from 'react';

import "react-datepicker/dist/react-datepicker.css";
 
// CSS Modules, react-datepicker-cssmodules.css// 
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

export default function Calendar({onDateChange}) {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    
    const today = new Date();
    const thisYear = new Date().getFullYear();


    const handleDateChange = (start, end) => {
      setStartDate(start);
      setEndDate(end);
      onDateChange(start, end); // Llama a la función de devolución de llamada con las fechas seleccionadas
    };

    return (
      <>
          <DatePicker
              selected={startDate}
              onChange={(date) => handleDateChange(date, endDate)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              minDate={new Date(thisYear, 0, 1)} // Primer día del año actual
              maxDate={today} // Fecha de hoy
          />
          <DatePicker
              selected={endDate}
              onChange={(date) => handleDateChange(startDate, date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate} // La fecha mínima debe ser la fecha de inicio
              maxDate={today} // Fecha de hoy
          />
      </>
  );
}
