// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";

 // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDg-UHtl4aaf7E2dM1-I_LyrVVDpbi6eL0",
    authDomain: "mounts-5d92b.firebaseapp.com",
    databaseURL: "https://mounts-5d92b-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "mounts-5d92b",
    storageBucket: "mounts-5d92b.firebasestorage.app",
    messagingSenderId: "6237887046",
    appId: "1:6237887046:web:d887e1b4e4b5d56fb94847"
  };

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 匯出實例供其他檔案使用
export const auth = getAuth(app);
export const db = getDatabase(app);