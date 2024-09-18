import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyDEZQ_paJYpVCrDpdyUzpOgswhdAKBHu00",
    authDomain: "digital-dining-solutions.firebaseapp.com",
    projectId: "digital-dining-solutions",
    storageBucket: "digital-dining-solutions.appspot.com",
    messagingSenderId: "500080739577",
    appId: "1:500080739577:web:4b9696ac7696866981ce28"
};

const app = initializeApp(firebaseConfig);
export default app;