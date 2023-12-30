// Import the functions you need from the SDKs you need
import {getApp,getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD8SXPsK2acxr0ZJZtDKyVVoLWzj5pv0wQ",
  authDomain: "dropbox-clone-1f94a.firebaseapp.com",
  projectId: "dropbox-clone-1f94a",
  storageBucket: "dropbox-clone-1f94a.appspot.com",
  messagingSenderId: "981749157952",
  appId: "1:981749157952:web:ee83f4affb1988ef5a8fa5"
};


const app =getApps().length ? getApp() :initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);

export {db,storage};