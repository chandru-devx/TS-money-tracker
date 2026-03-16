 import { initializeApp } from "firebase/app";
 import { getAuth } from "firebase/auth";
 import { getFirestore } from "firebase/firestore";

 const firebaseConfig = {
  apiKey: "AIzaSyDo46ETDA2drS5GWJNhOsBHuPov6PZnR_8",
  authDomain: "money-tracker-54f24.firebaseapp.com",
  projectId: "money-tracker-54f24",
  storageBucket: "money-tracker-54f24.firebasestorage.app",
  messagingSenderId: "985944888274",
  appId: "1:985944888274:web:6ee020d45d228be9b26e0b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)


export const db=getFirestore(app)

export default app