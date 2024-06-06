import React, { useState, useEffect} from 'react';
import { database, ref, get } from './firebaseConfig';
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
    const [schedule, setSchedule] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Reference to the 'weeklySchedule' node in your Realtime Database
        const scheduleRef = ref(database, 'weeklySchedule');

        // Listen for changes to the data
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

        // Cleanup function to unsubscribe from the listener when component unmounts
        return () => {
            // You don't need to unsubscribe for Realtime Database
        };
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

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
                return <Lineup schedule={schedule} />;
            case 'Events':
                return <Events />;
            case 'Dj Profiles':
                return <DjProfiles isAddModalOpen={isAddModalOpen} setAddModalOpen={setAddModalOpen} />;
            case 'Social Media':
                return <Media />;
            case 'Settings':
                return <Settings />;
            default:
                return <div className="text-container"> Dashboard Content </div>;
        }
    };

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
        </div>
    );
}

export default App;
