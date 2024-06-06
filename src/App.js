import React, { useState, useEffect } from 'react';
import { database, ref, set } from './firebaseConfig';

import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import DjProfiles from './components/DjProfiles/DjProfiles';
import Lineup from './components/LineUp/Lineup';
import Events from './components/Events/Events';
import Media from './components/Media/Media';
import Settings from './components/Settings/Settings';
import Login from './components/Login/Login';

function App() {
    const [activeSection, setActiveSection] = useState('');
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setActiveSection('');
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'Shows Line Up':
                return <Lineup addModalOpen={isAddModalOpen} setAddModalOpen={setAddModalOpen} />;
            case 'Events':
                return <Events />;
            case 'Dj Profiles':
                return <DjProfiles isAddModalOpen={isAddModalOpen} setAddModalOpen={setAddModalOpen} />;
            case 'Social Media':
                return <Media />;
            case 'Settings':
                return <Settings />;
            default:
                return <Lineup addModalOpen={isAddModalOpen} setAddModalOpen={setAddModalOpen} />;
        }
    };

// Empty dependency array ensures this effect runs only once, when the component mounts

    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <div className="container">
            <Sidebar setActiveSection={setActiveSection} onLogout={handleLogout} />
            <Header className="header" />
            {renderContent()}
            {activeSection === 'Dj Profiles' && (
                <div className="add-button" onClick={() => setAddModalOpen(true)}>
                    <i className="fas fa-plus"></i>
                </div>
            )}

            {activeSection === 'Events' && (
                <div className="add-button" >
                    <i className="fas fa-plus"></i>
                </div>
            )}

            {activeSection === 'Shows Line Up' && (
                <div className="add-button" onClick={() => setAddModalOpen(true)}>
                    <i className="fas fa-plus"></i>
                </div>
            )}
        </div>
    );
}

export default App;
