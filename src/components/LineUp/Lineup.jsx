import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { database, ref, get, set } from '../../firebaseConfig';
import './Lineup.css';

const Lineup = ({ addModalOpen, setAddModalOpen }) => {
    const [selectedDay, setSelectedDay] = useState('mon');
    const [schedule, setSchedule] = useState({});
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentDay, setCurrentDay] = useState('');
    const [currentIndex, setCurrentIndex] = useState(null);
    const [currentCard, setCurrentCard] = useState({ title: '', time: '', description: '' });
    const [newShow, setNewShow] = useState({ title: '', time: '', description: '' });

    useEffect(() => {
        const scheduleRef = ref(database, 'weeklySchedule');

        const fetchData = async () => {
            try {
                const snapshot = await get(scheduleRef);
                if (snapshot.exists()) {
                    setSchedule(snapshot.val());
                } else {
                    console.log("No data available");
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const handleTabClick = (day) => {
        setSelectedDay(day);
    };

    const daysOfWeek = {
        mon: "Monday",
        tue: "Tuesday",
        wed: "Wednesday",
        thu: "Thursday",
        fri: "Friday",
        sat: "Saturday",
        sun: "Sunday"
    };

    const openEditModal = (day, index) => {
        setCurrentDay(day);
        setCurrentIndex(index);
        setCurrentCard(schedule[day][index]);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setCurrentCard({ title: '', time: '', description: '' });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setCurrentCard((prevCard) => ({ ...prevCard, [name]: value }));
    };

    const handleEditSave = () => {
        const updatedSchedule = { ...schedule };
        updatedSchedule[currentDay][currentIndex] = currentCard;
        set(ref(database, `weeklySchedule/${currentDay}`), updatedSchedule[currentDay])
            .then(() => {
                setSchedule(updatedSchedule);
                closeEditModal();
            })
            .catch((error) => {
                console.error("Error updating data: ", error);
            });
    };

    const openDeleteModal = (day, index) => {
        setCurrentDay(day);
        setCurrentIndex(index);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const handleDelete = () => {
        const updatedSchedule = { ...schedule };
        updatedSchedule[currentDay].splice(currentIndex, 1);
        set(ref(database, `weeklySchedule/${currentDay}`), updatedSchedule[currentDay])
            .then(() => {
                setSchedule(updatedSchedule);
                closeDeleteModal();
            })
            .catch((error) => {
                console.error("Error deleting data: ", error);
            });
    };

    const handleAddChange = (e) => {
        const { name, value } = e.target;
        setNewShow((prevShow) => ({ ...prevShow, [name]: value }));
    };

    const handleAddSave = () => {
        const updatedSchedule = { ...schedule };
        if (!updatedSchedule[selectedDay]) {
            updatedSchedule[selectedDay] = [];
        }
        updatedSchedule[selectedDay].push(newShow);
        set(ref(database, `weeklySchedule/${selectedDay}`), updatedSchedule[selectedDay])
            .then(() => {
                setSchedule(updatedSchedule);
                setAddModalOpen(false);
                setNewShow({ title: '', time: '', description: '' });
            })
            .catch((error) => {
                console.error("Error adding data: ", error);
            });
    };

    const closeAddModal = () => {
        setAddModalOpen(false);
        setNewShow({ title: '', time: '', description: '' });
    };


    return (
        <div className="lineup-container">
            <div className="lineup-tabs">
                {Object.keys(daysOfWeek).map((day) => (
                    <div
                        key={day}
                        className={`lineup-tab-button ${selectedDay === day ? 'active' : ''}`}
                        onClick={() => handleTabClick(day)}
                    >
                        {daysOfWeek[day]}
                    </div>
                ))}
            </div>
            <div className="lineup-content">
                {Object.keys(schedule).map((day) => (
                    <div
                        key={day}
                        id={day}
                        className={`lineup-day-content ${selectedDay === day ? 'active' : ''}`}
                    >
                        {selectedDay === day && schedule[day].map((show, index) => (
                            <div key={index} className="lineup-card">
                                <p>{show.time}</p>
                                <p className="title">{show.title}</p>
                                <p>{show.description}</p>
                                <div className="lineup-card-actions">
                                    <FaEdit onClick={() => openEditModal(day, index)} className="lineup-card-icon" />
                                    <FaTrash onClick={() => openDeleteModal(day, index)} className="lineup-card-icon" />
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {isEditModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeEditModal}>&times;</span>
                        <h2>Edit Show</h2>
                        <form>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="title"
                                    value={currentCard.title}
                                    onChange={handleEditChange}
                                    placeholder=" "
                                />
                                <label>Title</label>
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="time"
                                    value={currentCard.time}
                                    onChange={handleEditChange}
                                    placeholder=" "
                                />
                                <label>Time</label>
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="description"
                                    value={currentCard.description}
                                    onChange={handleEditChange}
                                    placeholder=" "
                                />
                                <label>Description</label>
                            </div>
                            <div className="buttons">
                                <button type="button" onClick={handleEditSave}>Save Changes</button>
                                <button type="button" onClick={closeEditModal}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeDeleteModal}>&times;</span>
                        <h2>Confirm Delete</h2>
                        <p>Are you sure you want to delete this show?</p>
                        <div className="buttons">
                            <button type="button" onClick={handleDelete}>Yes</button>
                            <button type="button" onClick={closeDeleteModal}>No</button>
                        </div>
                    </div>
                </div>
            )}

{addModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeAddModal}>&times;</span>
                        <h2>Add New Show</h2>
                        <form>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="title"
                                    value={newShow.title}
                                    onChange={handleAddChange}
                                    placeholder=" "
                                />
                                <label>Title</label>
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="time"
                                    value={newShow.time}
                                    onChange={handleAddChange}
                                    placeholder=" "
                                />
                                <label>Time</label>
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="description"
                                    value={newShow.description}
                                    onChange={handleAddChange}
                                    placeholder=" "
                                />
                                <label>Description</label>
                            </div>
                            <div className="buttons">
                                <button type="button" onClick={handleAddSave}>Add Show</button>
                                <button type="button" onClick={closeAddModal}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Lineup;
