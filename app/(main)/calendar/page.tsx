// app/calendar/page.tsx
import Calendar from '@/components/ui/calendar';  // Asegúrate de que la ruta sea correcta

const CalendarPage = () => {
  return (
    <div>
      <h1>Mi Calendario de Tareas</h1>
      <Calendar />  {/* Mostrar el calendario aquí */}
    </div>
  );
};

export default CalendarPage;