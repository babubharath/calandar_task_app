import React from 'react';

const EventList = ({ events }) => {
  return (
    <div className="event-list">
      <h3>All Events</h3>
      <ul>
        {events.map((event, idx) => (
          <li key={idx}>
            <strong>{event.title}</strong> on <em>{event.date}</em> from {event.startTime} to {event.endTime}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;