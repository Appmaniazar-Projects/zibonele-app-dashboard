import React, { useState, useEffect } from 'react';
import { database, storage } from '../../firebaseConfig';
import { ref, get, set, update, remove } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import './Events.css';

function Events({ addModalOpen, setAddModalOpen }) {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState(null);

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

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setEditModalOpen(true);
  };

  const handleDelete = (event) => {
    setSelectedEvent(event);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedEvent) {
      remove(ref(database, `events/${selectedEvent.id}`));
      setDeleteModalOpen(false);
      setSelectedEvent(null);
    }
  };

  const handleSave = async () => {
    if (selectedEvent) {
      if (imageFile) {
        const imageUrl = await handleImageUpload(imageFile);
        selectedEvent.imageUrl = imageUrl;
      }
      update(ref(database, `events/${selectedEvent.id}`), selectedEvent);
      setEditModalOpen(false);
      setSelectedEvent(null);
      setImageFile(null);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imageUrl' && files && files[0]) {
      setImageFile(files[0]);
    } else {
      setSelectedEvent((prev) => ({ ...prev, [name]: value }));
      setNewEvent((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (file) => {
    const storageReference = storageRef(storage, `eventPictures/${file.name}`);
    await uploadBytes(storageReference, file);
    const url = await getDownloadURL(storageReference);
    return url;
  };

  const handleAddEvent = async () => {
    const eventsRef = ref(database, 'events');
    const snapshot = await get(eventsRef);
    const data = snapshot.val();
  
    // Check if there are any events in the database
    const eventIds = data ? Object.keys(data) : [];
    
    // Check if the new event title already exists
    const eventExists = eventIds.some(key => data[key].title === newEvent.title);
  
    // If the event already exists, handle it accordingly
    if (eventExists) {
      // Handle error, show message or take appropriate action
      console.log('Event with the same title already exists!');
      return;
    }
  
    // If the event does not exist, proceed to add it
    const newId = newEvent.title;
  
    let imageUrl = '';
    if (imageFile) {
      imageUrl = await handleImageUpload(imageFile);
    }
  
    const eventToAdd = {
      ...newEvent,
      imageUrl
    };
  
    set(ref(database, `events/${newId}`), eventToAdd);
  
    setAddModalOpen(false);
    setNewEvent({
      title: '',
      date: '',
      location: '',
      description: '',
      imageUrl: ''
    });
    setImageFile(null);
  };
  

  return (
    <div className="event-grid">
      {events.map(event => (
        <div className="event-card" key={event.id}>
          <img src={event.imageUrl} alt="Event" className="event-image" />
          <div className="event-details">
            <div className="event-card-controls">
              <span className="event-edit-button" onClick={() => handleEdit(event)}>✏️</span>
              <span className="event-delete-button" onClick={() => handleDelete(event)}>🗑️</span>
            </div>
            <h3 className="event-title">{event.title}</h3>
            <p className="event-info">{event.date}</p>
            <p className="event-info">{event.location}</p>
            <p className="event-description">{event.description}</p>
          </div>
        </div>
      ))}

      {isEditModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Event</h2>
            <form>
              <div className="form-group">
                <input
                  type="text"
                  name="title"
                  value={selectedEvent.title}
                  onChange={handleChange}
                  placeholder=" "
                />
                <label>Title:</label>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="date"
                  value={selectedEvent.date}
                  onChange={handleChange}
                  placeholder=" "
                />
                <label>Date:</label>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="location"
                  value={selectedEvent.location}
                  onChange={handleChange}
                  placeholder=" "
                />
                <label>Location:</label>
              </div>
              <div className="form-group">
                <textarea
                  name="description"
                  value={selectedEvent.description}
                  onChange={handleChange}
                  placeholder=" "
                />
                <label>Description:</label>
              </div>
              <div className="form-group">
                <input
                  type="file"
                  name="imageUrl"
                  onChange={handleChange}
                  placeholder=" "
                />
                <label>Upload Image:</label>
              </div>
              <div className="buttons">
                <button type="button" onClick={handleSave}>Save</button>
                <button type="button" onClick={() => setEditModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this event?</p>
            <button onClick={confirmDelete}>Yes</button>
            <button onClick={() => setDeleteModalOpen(false)}>No</button>
          </div>
        </div>
      )}

      {addModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Event</h2>
            <form>
              <div className="form-group">
                <input
                  type="text"
                  name="title"
                  value={newEvent.title}
                  onChange={handleChange}
                  placeholder=" "
                />
                <label>Title:</label>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="date"
                  value={newEvent.date}
                  onChange={handleChange}
                  placeholder=" "
                />
                <label>Date:</label>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="location"
                  value={newEvent.location}
                  onChange={handleChange}
                  placeholder=" "
                />
                <label>Location:</label>
              </div>
              <div className="form-group">
                <textarea
                  name="description"
                  value={newEvent.description}
                  onChange={handleChange}
                  placeholder=" "
                />
                <label>Description:</label>
              </div>
              <div className="form-group">
                <input
                  type="file"
                  name="imageUrl"
                  onChange={handleChange}
                  placeholder=" "
                />
                <label>Upload Image:</label>
              </div>
              <div className="buttons">
                <button type="button" onClick={handleAddEvent}>Add</button>
                <button type="button" onClick={() => setAddModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Events;
