// components/Calendar.jsx
import React from 'react';
import dayjs from 'dayjs';

const Calendar = ({ events, onDateClick, viewDate, onEditEvent }) => {
  const startOfMonth = viewDate.startOf('month');
  const daysInMonth = viewDate.daysInMonth();
  const today = dayjs().format('YYYY-MM-DD');

  const renderDays = () => {
    const blanks = Array.from({ length: startOfMonth.day() }, (_, i) => (
      <div className="day empty" key={`b-${i}`}></div>
    ));

    const days = Array.from({ length: daysInMonth }, (_, i) => {
      const date = startOfMonth.date(i + 1);
      const dateStr = date.format('YYYY-MM-DD');
      const dayEvents = events.filter(e => e.date === dateStr);
      const isToday = dateStr === today;

      const renderEvent = (ev, idx) => {
        const overlap = dayEvents.filter(e => e.startTime === ev.startTime && e.endTime === ev.endTime).length > 1;
        const style = {
          backgroundColor: ev.color || '#007bff',
          border: overlap ? '2px solid red' : 'none',
          padding: '2px',
          marginBottom: '2px',
          borderRadius: '4px',
          cursor: 'pointer',
        };

        const handleEventClick = (e) => {
          e.stopPropagation();
          const action = prompt(`Edit or Delete this event? Type "edit" or "delete"`, "edit");
          if (action === 'edit') {
            onEditEvent({ ...ev, idx });
          } else if (action === 'delete') {
            onEditEvent({ ...ev, idx, delete: true });
          }
        };

        return (
          <div
            className="event-item"
            key={idx}
            style={style}
            onClick={handleEventClick}
            title={`${ev.title} | ${ev.startTime} - ${ev.endTime}`}
          >
            <div style={{ fontSize: '0.8em', fontWeight: 'bold' }}>{ev.title}</div>
            <div style={{ fontSize: '0.75em' }}>{ev.startTime} - {ev.endTime}</div>
            <div
              style={{
                marginTop: '2px',
                width: '100%',
                height: '6px',
                borderRadius: '3px',
                backgroundColor: ev.color || '#007bff',
              }}
            ></div>
          </div>
        );
      };

      const handleDayClick = () => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (!loggedInUser) {
          alert('Please log in to add events.');
          return;
        }
        onDateClick(dateStr);
      };

      return (
        <div
          className={`day${isToday ? ' today-highlight' : ''}`}
          key={i}
          onClick={handleDayClick}
        >
          <div className="date-label">{i + 1}</div>
          {dayEvents.map((ev, idx) => renderEvent(ev, idx))}
        </div>
      );
    });

    return [...blanks, ...days];
  };

  const renderWeekDays = () => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return weekDays.map((day, idx) => (
      <div className="day-label" key={`wd-${idx}`}>{day}</div>
    ));
  };

  return (
    <>
      <div className="calendar-grid week-labels">
        {renderWeekDays()}
      </div>
      <div className="calendar-grid">
        {renderDays()}
      </div>
    </>
  );
};

export default Calendar;
