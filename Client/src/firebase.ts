
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage'; 

const firebaseConfig = {
  apiKey: "AIzaSyAgFXr50VH33OiT-AzhVgXGtlZKPkzz718",
  authDomain: "redux---user.firebaseapp.com",
  projectId: "redux---user",
  storageBucket: "redux---user.appspot.com",
  messagingSenderId: "1008964123976",
  appId: "1:1008964123976:web:0d6e9eda71be1dc517477d"
};


const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };