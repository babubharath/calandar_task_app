// components/EventModal.jsx
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';

const EventModal = ({ date, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [color, setColor] = useState('#f6501e');

  useEffect(() => {
    const now = dayjs();
    const current = now.format('HH:mm');
    setStartTime(current);
    setEndTime(current);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, date, startTime, endTime, color });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Add Event - {date}</h3>
        <form onSubmit={handleSubmit}>
          <input required placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <input required type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
          <input required type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
          <input type="color" value={color} onChange={e => setColor(e.target.value)} />
          <button type="submit">Add Event</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
