
// Initialize the FirebaseUI Widget using Firebase.
import * as firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyC0fG9MKYhAfDHu3kOsJjMX8dMvgNigdqY",
    authDomain: "red-drop-e3f69.firebaseapp.com",
    projectId: "red-drop-e3f69",
    storageBucket: "red-drop-e3f69.appspot.com",
    messagingSenderId: "682741579315",
    appId: "1:682741579315:web:75305cd925d6d035e9ad46",
    measurementId: "G-LBTDY3EJ5L"
};
firebase.initializeApp(firebaseConfig);

export {firebase};