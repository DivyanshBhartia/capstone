import { initializeApp,getApp,getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCrP9tRZD_eek8IfTN2kwBW-oDgurHv1GM",
  authDomain: "capstone-project-sem2.firebaseapp.com",
  projectId: "capstone-project-sem2",
  storageBucket: "capstone-project-sem2.firebasestorage.app",
  messagingSenderId: "984818206990",
  appId: "1:984818206990:web:e8f8e56528f227f8ca2f5f",
  measurementId: "G-0N53BGDJNT"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const auth = getAuth(app)


export {app,auth}