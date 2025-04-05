"use client";
import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const Calendar = () => {
  const events = useQuery(api.events.getUserEvents);
  const createEvent = useMutation(api.events.createEvent);
  const toggleComplete = useMutation(api.events.toggleEventCompletion);

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
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        backgroundColor: "#f3f4f6", // Fondo gris claro
        padding: "4px 8px",
        borderRadius: "4px",
        border: "none", // Sin bordes
      }}>
        <div
          onClick={(e) => {
            e.stopPropagation();
            toggleComplete({ id: eventId });
          }}
          style={{
            cursor: "pointer",
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            border: isCompleted ? "none" : "2px solid #000",
            backgroundColor: isCompleted ? "#000" : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
        <span
          style={{
            textDecoration: isCompleted ? "line-through" : "none",
            color: "#000", // Texto siempre negro
            fontSize: "14px",
          }}
        >
          {eventInfo.event.title}
        </span>
      </div>
    );
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2
        style={{
          textAlign: "center",
          color: "#2C3E50",
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "20px",
          textTransform: "uppercase",
        }}
      >
        Calendario de Tareas
      </h2>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
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
        titleFormat={{
          month: "long",
          year: "numeric",
        }}
        eventBackgroundColor="transparent" // Fondo transparente
        eventBorderColor="transparent" // Sin bordes
        eventTextColor="#2C3E50"
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
        }}
      />
    </div>
  );
};

export default Calendar;