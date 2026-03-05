import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCjT3x1zu7H3tegLsjEtiodqD2WXoAYTxM",
    authDomain: "interviewtask-dd48d.firebaseapp.com",
    projectId: "interviewtask-dd48d",
    storageBucket: "interviewtask-dd48d.firebasestorage.app",
    messagingSenderId: "700240835351",
    appId: "1:700240835351:web:470190d157529a7719bd52",
    measurementId: "G-4QH1R6R9M1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
