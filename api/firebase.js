import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPhoneNumber } from 'firebase/auth';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBgZYbxQAL7vlonCoHgmONJti7W5mCLm88",
  authDomain: "faite-1234d.firebaseapp.com",
  projectId: "faite-1234d",
  storageBucket: "faite-1234d.appspot.com",
  messagingSenderId: "603146930628",
  appId: "1:603146930628:web:a6ef48dbaf4a90d5607c91"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

