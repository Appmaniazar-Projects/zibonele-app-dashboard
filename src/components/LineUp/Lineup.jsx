import React, { useState } from 'react';
import './Lineup.css';

const Lineup = ({ schedule }) => {
    const [selectedDay, setSelectedDay] = useState('mon');

    const handleTabClick = (day) => {
        setSelectedDay(day);
    };

    const daysOfWeek = {
        mon: "Mon",
        tue: "Tue",
        wed: "Wed",
        thu: "Thu",
        fri: "Fri",
        sat: "Sat",
        sun: "Sun"
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
                        {/* Render content only if the selected day matches the current iteration day */}
                        {selectedDay === day && schedule[day].map((show, index) => (
                            <div key={index} className="lineup-card">
                                <p>{show.time}</p>
                                <p>{show.title}</p>
                                <p>{show.description}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Lineup;
