import React from 'react';
import './Header.css';

function Header() {
  return (
    <header>
      <h1>Welcome Back, </h1>
      <div className="user-icon">
        <img src="https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png" alt="User Icon" />
      </div>
    </header>
  );
}

export default Header;