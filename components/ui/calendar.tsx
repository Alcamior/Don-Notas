"use client"; // Esto debe ir al principio del archivo
// components/Calendar.tsx
import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';   // Para el calendario en vista mensual
import timeGridPlugin from '@fullcalendar/timegrid'; // Para la vista en horario
import interactionPlugin from '@fullcalendar/interaction'; // Para la interactividad (clics, drag-and-drop)

const Calendar = () => {
  const [events, setEvents] = useState<any[]>([]); // Estado para los eventos

  // Función que maneja el clic sobre una fecha
  const handleDateClick = (info: any) => {
    const title = prompt("Agrega una tarea");
    if (title) {
      const newEvent = {
        title,
        start: info.dateStr,
        end: info.dateStr,  // Puedes ajustar la fecha final si lo deseas
        allDay: true,
      };
      setEvents([...events, newEvent]);  // Agregar el evento al estado
    }
  };

  // Configuración de FullCalendar
  return (
    <div>
      <h2>Calendario de Tareas</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}  // Agregamos los plugins que usaremos
        initialView="dayGridMonth"  // Vista inicial (mensual)
        events={events}  // Eventos que se mostrarán en el calendario
        dateClick={handleDateClick}  // Llamamos a handleDateClick cuando se hace clic en una fecha
        editable={true}  // Permite editar eventos
      />
    </div>
  );
};

export default Calendar;