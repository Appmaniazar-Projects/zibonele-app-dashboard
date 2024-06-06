import React, { useState, useEffect } from 'react';
import { updateProfile, updateEmail, updatePassword } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import { auth, storage, database, get } from '../../firebaseConfig'; // Import the Firebase database module
import './Settings.css';

const Settings = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('********');
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePictureURL, setProfilePictureURL] = useState('');

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            alert(`User ` + user)
        }

        // console.log('Error fetching user data:', user.email);

    }, []);
    
    

    const handleProfilePictureChange = (e) => {
        if (e.target.files[0]) {
            setProfilePicture(e.target.files[0]);
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfilePictureURL(e.target.result);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        try {
            const user = auth.currentUser;

            if (profilePicture) {
                const profilePicRef = ref(storage, `profilePictures/${user.uid}`);
                await uploadBytes(profilePicRef, profilePicture);
                const downloadURL = await getDownloadURL(profilePicRef);
                setProfilePictureURL(downloadURL);
                await updateProfile(user, { photoURL: downloadURL });
                await database.ref(`users/${user.uid}`).update({ profilePictureURL: downloadURL });
            }

            if (name) {
                await updateProfile(user, { displayName: name });
                await database.ref(`users/${user.uid}`).update({ displayName: name });
            }

            if (email) {
                await updateEmail(user, email);
                await database.ref(`users/${user.uid}`).update({ email: email });
            }

            if (password) {
                await updatePassword(user, password);
            }

            alert('Profile updated successfully');
        } catch (error) {
            alert('Error updating profile: ' + error.message);
        }
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        const newPassword = prompt('Enter your new password:');
        if (newPassword) {
            setPassword(newPassword);
        }
    };

    const handleChangeEmail = (e) => {
        e.preventDefault();
        const newEmail = prompt('Enter your new email address:');
        if (newEmail) {
            setEmail(newEmail);
        }
    };

    const handleDeleteAccount = (e) => {
        e.preventDefault();
        // Implement account deletion logic
    };

    const handleCancel = () => {
        window.location.reload();
    };

    return (
        <div className="account-settings">
            <h1>Account Settings</h1>
            <p>Edit your name, avatar etc.</p>
            <div className="form-container">
                <form onSubmit={handleSaveChanges}>
                    <div className="form-group">
                        <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <input type="password" id="password" name="password" value={password} readOnly />
                    </div>
                    <div className="form-group">
                        <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <div className="avatar-container">
                            <div className="avatar-placeholder" style={{ backgroundImage: `url(${profilePictureURL})` }}></div>
                            <input type="file" id="upload-input" style={{ display: 'none' }} onChange={handleProfilePictureChange} />
                            <div type="button" className="upload-button" onClick={() => document.getElementById('upload-input').click()}>Upload a picture</div>
                        </div>
                    </div>

                    <div className="form-buttons">
                        <div type="button" className="cancel-button" onClick={handleCancel}>Cancel</div>
                        <button type="submit" className="save-button">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;
