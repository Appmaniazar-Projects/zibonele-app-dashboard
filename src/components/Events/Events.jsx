import React, { useState, useEffect } from 'react';
import { database, ref, get } from '../../firebaseConfig';
import './Events.css';

function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const eventsRef = ref(database, 'events');
      const snapshot = await get(eventsRef);
      if (snapshot.exists()) {
        const eventData = snapshot.val();
        const eventsArray = Object.keys(eventData).map(key => ({
          id: key,
          ...eventData[key]
        }));
        setEvents(eventsArray);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="event-grid">
      {events.map(event => (
        <div className="event-card" key={event.id}>
          <img src={event.imageUrl} alt="Event" className="event-image" />
          <div className="event-details">
            <div className="card-controls">
              <span className="edit-button">✏️</span>
              <span className="delete-button">🗑️</span>
            </div>
            <h3 className="event-title">{event.title}</h3>
            <p className="event-info">{event.date}</p>
            <p className="event-info">{event.location}</p>
            <p className="event-description">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Events;
