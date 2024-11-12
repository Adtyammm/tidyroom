import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCSHt1PsXwEIfZZMeys5z8WwF0VGBZzoQo",
  authDomain: "tidyroom-94645.firebaseapp.com",
  projectId: "tidyroom-94645",
  storageBucket: "tidyroom-94645.firebasestorage.app",
  messagingSenderId: "592424503798",
  appId: "1:592424503798:web:33b26cf566637af4d95fd7",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting persistence:", error);
});

export { auth, db };
