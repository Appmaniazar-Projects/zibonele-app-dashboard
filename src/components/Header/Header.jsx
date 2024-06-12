// src/components/Header/Header.js
import React, { useContext } from 'react';
import { ProfileContext } from '../../ProfileContext'; // Import the context
import './Header.css';

function Header() {
    const { profilePictureURL, userName } = useContext(ProfileContext); // Use the context

    return (
        <header>
            <h1>Welcome , {userName}</h1>
            
            <div className="user-icon">
                <img src={profilePictureURL || "https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png"} alt="User Icon" />
            </div>
        </header>
    );
}

export default Header;
