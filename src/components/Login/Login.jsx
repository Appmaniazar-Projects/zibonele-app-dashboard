import React, { useState } from 'react';
import './Login.css'; // Import the CSS file for styling
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, username, password);
            // alert("Login successful!!");
            onLogin();
        } catch (error) {
            alert('Login failed: \n' + error.message);
            console.log(error);
        }
    };

    return (
        <div className="admin-login-container">
            <img src="https://zibonelefm.co.za/wp-content/uploads/2023/03/Web-logo-.png" alt="Logo" className="admin-login-logo" /> {/* Replace with your logo path */}
            <h1 className="admin-login-title">Admin Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    required
                    className="admin-login-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                    className="admin-login-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input type="submit" value="Login" className="admin-login-button" />
            </form>
        </div>
    );
}

export default Login;
