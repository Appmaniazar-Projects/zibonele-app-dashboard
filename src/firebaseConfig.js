// src/firebaseConfig.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get} from "firebase/database";
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC5b1o1XFSe6y5fZBmla6Kqpg4oIsWB_mU",
    authDomain: "zibonele-fm-app.firebaseapp.com",
    databaseURL: "https://zibonele-fm-app-default-rtdb.firebaseio.com",
    projectId: "zibonele-fm-app",
    storageBucket: "zibonele-fm-app.appspot.com",
    messagingSenderId: "230511749503",
    appId: "1:230511749503:web:b3309f0c2aed66ea43924a",
    measurementId: "G-MSRZRH1914"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, database, auth, storage, ref, get };