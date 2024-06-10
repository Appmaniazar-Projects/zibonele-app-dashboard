// src/ProfileContext.js
import React, { createContext, useState } from 'react';

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const [profilePictureURL, setProfilePictureURL] = useState('');
    const [userName, setUserName] = useState('');

    return (
        <ProfileContext.Provider value={{ profilePictureURL, setProfilePictureURL, userName, setUserName }}>
            {children}
        </ProfileContext.Provider>
    );
};
