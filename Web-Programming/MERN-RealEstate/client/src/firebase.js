// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "webproject-mern-realestate.firebaseapp.com",
  projectId: "webproject-mern-realestate",
  storageBucket: "webproject-mern-realestate.appspot.com",
  messagingSenderId: "220334827569",
  appId: "1:220334827569:web:9613e40a1eba657be70d10",
  measurementId: "G-ZYZZWQ93N5"
};

export const app = initializeApp(firebaseConfig);