import React, { useState, useEffect } from 'react';
import { database } from '../../firebaseConfig';
import { ref, onValue, update, remove, set } from 'firebase/database';
import './DjProfiles.css'; // Your existing CSS

const DjProfiles = ({ isAddModalOpen, setAddModalOpen }) => {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  // const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [newProfile, setNewProfile] = useState({
    name: '',
    schedule: '',
    author: '',
    imageUrl: ''
  });

  useEffect(() => {
    const fetchProfiles = async () => {
      const profilesRef = ref(database, 'profiles');
      onValue(profilesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const profilesArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setProfiles(profilesArray);
        }
      });
    };

    fetchProfiles();
  }, []);

  const handleEdit = (profile) => {
    setSelectedProfile(profile);
    setEditModalOpen(true);
  };

  const handleDelete = (profile) => {
    setSelectedProfile(profile);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedProfile) {
      remove(ref(database, `profiles/${selectedProfile.id}`));
      setDeleteModalOpen(false);
      setSelectedProfile(null);
    }
  };

  const handleSave = () => {
    if (selectedProfile) {
      update(ref(database, `profiles/${selectedProfile.id}`), selectedProfile);
      setEditModalOpen(false);
      setSelectedProfile(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedProfile((prev) => ({ ...prev, [name]: value }));
    setNewProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProfile = () => {
    const profilesRef = ref(database, 'profiles');
    onValue(profilesRef, (snapshot) => {
      const data = snapshot.val();
      const profileIds = data ? Object.keys(data).map(key => parseInt(key)) : [0];
      const newId = Math.max(...profileIds) + 1;

      const profileToAdd = {
        ...newProfile,
        id: newId
      };

      set(ref(database, `profiles/${newId}`), profileToAdd);

      setAddModalOpen(false);
      setNewProfile({
        id: '',
        name: '',
        schedule: '',
        author: '',
        imageUrl: ''
      });
    }, { onlyOnce: true });
  };

  return (
    <section className="dj-profiles">
      {profiles.map((profile) => (
        <div className="profile-card" key={profile.id}>

          <div className="card">
                      <div className="card-controls">
            <span className="edit-button" onClick={() => handleEdit(profile)}>✏️</span>
            <span className="delete-button" onClick={() => handleDelete(profile)}>🗑️</span>
          </div>
            <img src={profile.imageUrl} alt={profile.author} className="profile-pic" />
            <div className="info">
              <h1 className="name">{profile.name}</h1>
              <p className="schedule">{profile.schedule}</p>
              <p className="author">{profile.author}</p>
            </div>
          </div>
        </div>
      ))}

      {isEditModalOpen && (
        <div className="modal">
          <div className="modal-content">
          <h2>Edit Profile</h2>
      <form>
        <div className="form-group">
          <input
            type="text"
            name="name"
            value={selectedProfile.name}
            onChange={handleChange}
            placeholder=" "
          />
          <label>Name of the show:</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="schedule"
            value={selectedProfile.schedule}
            onChange={handleChange}
            placeholder=" "
          />
          <label>Schedule:</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="author"
            value={selectedProfile.author}
            onChange={handleChange}
            placeholder=" "
          />
          <label>Presenter(s):</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="imageUrl"
            value={selectedProfile.imageUrl}
            onChange={handleChange}
            placeholder=" "
          />
          <label>Image URL:</label>
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
            <p>Are you sure you want to delete this profile?</p>
            <button onClick={confirmDelete}>Yes</button>
            <button onClick={() => setDeleteModalOpen(false)}>No</button>
          </div>
        </div>
      )}

{isAddModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Profile</h2>
            <form>
        <div className="form-group">
          <input
            type="text"
            name="name"
            value={newProfile.name}
            onChange={handleChange}
            placeholder=" "
          />
          <label>Name of the show:</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="schedule"
            value={newProfile.schedule}
            onChange={handleChange}
            placeholder=" "
          />
          <label>Schedule:</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="author"
            value={newProfile.author}
            onChange={handleChange}
            placeholder=" "
          />
          <label>Presenter(s)</label>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="imageUrl"
            value={newProfile.imageUrl}
            onChange={handleChange}
            placeholder=" "
          />
          <label>Image URL:</label>
        </div>
        <div className="buttons">
          <button type="button" onClick={handleAddProfile}>Add</button>
          <button type="button" onClick={() => setAddModalOpen(false)}>Cancel</button>
        </div>
      </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default DjProfiles;
