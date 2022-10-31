import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDTJQrA5Yw2jVfn6VBuPg54_PwrruyBsQs",
  authDomain: "netchilzz.firebaseapp.com",
  projectId: "netchilzz",
  storageBucket: "netchilzz.appspot.com",
  messagingSenderId: "684776956621",
  appId: "1:684776956621:web:c34237e7c9f467a277bf84"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);