"use client";
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const Calendar = () => {
  const events = useQuery(api.events.getUserEvents);
  const createEvent = useMutation(api.events.createEvent);
  const toggleComplete = useMutation(api.events.toggleEventCompletion);
  const deleteEvent = useMutation(api.events.deleteEvent);
  const updateEventDate = useMutation(api.events.updateEventDate);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleEventDrop = async (info: any) => {
    const { event } = info;
    const id = event.extendedProps._id;
    const start = event.startStr;
    const end = event.endStr ?? event.startStr;

    try {
      await updateEventDate({ id, start, end });
    } catch (error) {
      alert("No se pudo actualizar la fecha del evento.");
      info.revert();
    }
  };

  const handleDateClick = async (info: any) => {
    const title = prompt("Agrega una tarea");
    if (title) {
      await createEvent({
        title,
        start: info.dateStr,
        end: info.dateStr,
        allDay: true,
      });
    }
  };

  const renderEventContent = (eventInfo: any) => {
    const isCompleted = eventInfo.event.extendedProps.completed;
    const eventId = eventInfo.event.extendedProps._id;

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "2px",
          backgroundColor: "#f3f4f6",
          padding: "1px 2px",
          borderRadius: "3px",
          border: "none",
          justifyContent: "space-between",
          width: "100%",
          minHeight: "20px",
          boxSizing: "border-box",
        }}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            toggleComplete({ id: eventId });
          }}
          style={{
            cursor: "pointer",
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            border: isCompleted ? "none" : "2px solid #000",
            backgroundColor: isCompleted ? "#000" : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            textDecoration: isCompleted ? "line-through" : "none",
            color: "#000",
            fontSize: isMobile ? "10px" : "12px",
            flex: "1 1 auto",
            minWidth: "0",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            lineHeight: "1.2",
            padding: "0 2px",
          }}
        >
          {eventInfo.event.title}
        </span>
        <img
          src="/eliminar.png"
          alt="Eliminar"
          onClick={(e) => {
            e.stopPropagation();
            if (confirm("¿Estás seguro que deseas eliminar esta tarea?")) {
              deleteEvent({ id: eventId });
            }
          }}
          style={{
            width: "7px",
            height: "7px",
            cursor: "pointer",
            flexShrink: 0,
          }}
        />
      </div>
    );
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "100%",
        overflowX: "auto",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#2C3E50",
          fontSize: "clamp(18px, 5vw, 24px)",
          fontWeight: "bold",
          marginBottom: "20px",
          textTransform: "uppercase",
        }}
      >
        Calendario de Tareas
      </h2>

      <div style={{ 
        width: "100%", 
        minWidth: "320px",
        fontSize: isMobile ? "10px" : "14px",
      }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          eventDrop={handleEventDrop}
          locale={esLocale}
          buttonText={{
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
          }}
          initialView="dayGridMonth"
          dateClick={handleDateClick}
          editable={true}
          events={
            events?.map((e) => ({
              id: e._id,
              title: e.title,
              start: e.start,
              end: e.end,
              allDay: e.allDay,
              completed: e.completed,
              _id: e._id,
            })) || []
          }
          eventContent={renderEventContent}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          titleFormat={(date) => {
            const month = date.date.month + 1;
            const year = date.date.year;
            const monthNames = [
              "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
              "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
            ];
            return `${monthNames[month - 1]} ${year}`;
          }}
          eventBackgroundColor="transparent"
          eventBorderColor="transparent"
          eventTextColor="#2C3E50"
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
          }}
          height="auto"
          dayMaxEventRows={3}
          eventDisplay="block"
          dayCellContent={(args) => ({
            html: `<div style="font-size: ${isMobile ? '10px' : '14px'}; text-align: center">${args.dayNumberText}</div>`
          })}
        />
      </div>
    </div>
  );
};

export default Calendar;