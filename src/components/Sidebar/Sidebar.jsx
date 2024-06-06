import React from 'react';
import './Sidebar.css';

function Sidebar({ setActiveSection, onLogout }) {

  return (
    <div className="sidebar">
      <div className="logo">
        <img src="https://zibonelefm.co.za/wp-content/uploads/2023/03/Web-logo-.png" alt="Zibonele Radio Logo" />
        <h4 className="active-button">Manage App</h4>
      </div>
      <nav>
        <ul>
          <li onClick={() => setActiveSection('Shows Line Up')}><i className="fas fa-list"></i> Shows Line Up</li>
          <li onClick={() => setActiveSection('Events')}><i className="fas fa-calendar-alt"></i> Events</li>
          <li onClick={() => setActiveSection('Dj Profiles')}><i className="fas fa-user"></i> Dj Profiles</li>
          <li onClick={() => setActiveSection('Social Media')}><i className="fas fa-share-alt"></i> Social Media</li>
          <li onClick={() => setActiveSection('Settings')}><i className="fas fa-cog"></i> Settings</li>
          <li  onClick={onLogout}><i className="fas fa-sign-out-alt"></i> Logout</li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
