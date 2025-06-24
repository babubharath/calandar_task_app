// App.jsx
import React, { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import EventModal from './components/EventModal';
import AuthModal from './components/AuthModal';
import './index.css';
import dayjs from 'dayjs';

// 🎨 Preset color palette
const EVENT_COLORS = ['#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8', '#6610f2', '#6f42c1'];

const App = () => {
  const [allEvents, setAllEvents] = useState(() => {
    const stored = localStorage.getItem('events');
    return stored ? JSON.parse(stored) : [];
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('loggedInUser');
    return stored ? JSON.parse(stored) : null;
  });
  const [viewDate, setViewDate] = useState(dayjs());
  const [showEventList, setShowEventList] = useState(false);
  const [filteredDate, setFilteredDate] = useState(null);

  const userEvents = user ? allEvents.filter(e => e.userEmail === user.email) : [];

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(allEvents));
  }, [allEvents]);

  // ✅ Add event with random color from the palette
  const handleAddEvent = (event) => {
    const withUser = {
      ...event,
      userEmail: user.email,
      color: EVENT_COLORS[Math.floor(Math.random() * EVENT_COLORS.length)],
    };
    setAllEvents([...allEvents, withUser]);
    setShowEventModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setUser(null);
  };

  const handleEditEvent = (eventObj) => {
    const { idx, delete: isDelete, userEmail } = eventObj;

    if (userEmail !== user?.email) {
      alert('You can only manage your own events.');
      return;
    }

    const updatedEvents = [...allEvents];

    if (isDelete) {
      updatedEvents.splice(idx, 1);
    } else {
      const newTitle = prompt('Edit title:', eventObj.title);
      const newStart = prompt('Edit start time (HH:mm):', eventObj.startTime);
      const newEnd = prompt('Edit end time (HH:mm):', eventObj.endTime);

      updatedEvents[idx] = {
        ...eventObj,
        title: newTitle || eventObj.title,
        startTime: newStart || eventObj.startTime,
        endTime: newEnd || eventObj.endTime,
      };
    }

    setAllEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
  };

  const filteredEvents = filteredDate
    ? userEvents.filter(ev => ev.date === filteredDate)
    : userEvents;

  return (
    <div className="app">
      <header>
        <h1>Event Calendar</h1>
        <div className="header-actions">
          {user ? (
            <>
              <span>Welcome, {user.name}</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <button onClick={() => setShowAuthModal(true)}>Sign In / Sign Up</button>
          )}
          {user && (
            <button onClick={() => {
              setFilteredDate(null);
              setShowEventList(!showEventList);
            }}>
              {showEventList ? 'Hide Events' : 'Show Events'}
            </button>
          )}
        </div>
      </header>

      <div className="calendar-nav">
        <button onClick={() => setViewDate(viewDate.subtract(1, 'month'))}>{'<'}</button>
        <h2>{viewDate.format('MMMM YYYY')}</h2>
        <button onClick={() => setViewDate(viewDate.add(1, 'month'))}>{'>'}</button>
      </div>

      <div className="main">
        <Calendar
          events={userEvents}
          viewDate={viewDate}
          onDateClick={(date) => {
            setSelectedDate(date);
            setShowEventModal(true);
            setFilteredDate(date);
            setShowEventList(true);
          }}
          onEditEvent={handleEditEvent}
        />
      </div>

      {showEventList && (
        <div className="event-list-popup">
          <h3>{filteredDate ? `Events on ${filteredDate}` : 'My Events'}</h3>
          <ul>
            {filteredEvents.length === 0 ? (
              <li>No events to show.</li>
            ) : (
              filteredEvents.map((event, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: event.color || '#007bff',
                      borderRadius: '50%',
                    }}
                  ></div>
                  <span>
                    <strong>{event.title}</strong> on <em>{event.date}</em> from {event.startTime} to {event.endTime}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      {showEventModal && (
        <EventModal
          date={selectedDate}
          onClose={() => setShowEventModal(false)}
          onSave={handleAddEvent}
        />
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLogin={(u) => setUser(u)}
        />
      )}
    </div>
  );
};

export default App;
