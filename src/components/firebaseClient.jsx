import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDHo11NvSMotMkiXRRWpePbBbDA3wmcgIk",

    authDomain: "fir-89e73.firebaseapp.com",

    databaseURL: "https://fir-89e73-default-rtdb.asia-southeast1.firebasedatabase.app/",
  
    projectId: "fir-89e73",
  
    storageBucket: "fir-89e73.firebasestorage.app",
  
    messagingSenderId: "561411070778",
  
    appId: "1:561411070778:web:c89d456075e839f5d80e03",
  
    measurementId: "G-MSGQM6FTVE",

    databaseURL: "https://fir-89e73-default-rtdb.asia-southeast1.firebasedatabase.app"
  
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

export { auth, db, storage };