import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDKTfWXC_eZyZcBF5xBiY3lFhp3Q877QT8",
  authDomain: "collab-messenger-telerik-final.firebaseapp.com",
  projectId: "collab-messenger-telerik-final",
  storageBucket: "collab-messenger-telerik-final.appspot.com",
  messagingSenderId: "176315817340",
  appId: "1:176315817340:web:7b59f1a2d4e9aca93598f9",
  databaseURL: 'https://collab-messenger-telerik-final-default-rtdb.europe-west1.firebasedatabase.app/'
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getDatabase(app);

export const storage = getStorage(app);