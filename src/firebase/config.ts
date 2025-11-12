import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth/react-native";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBfmQARnPqjDnMMobGWOMJWYk5NpCTH5Oc",
  authDomain: "ferryflow-71d96.firebaseapp.com",
  projectId: "ferryflow-71d96",
  storageBucket: "ferryflow-71d96.appspot.com",
  messagingSenderId: "422882231621",
  appId: "1:422882231621:web:240c8abf5c2e4b02be2a2c",
  measurementId: "G-PGV8V0VGMT",
};

// Evita inicialização duplicada
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Inicializa o Auth com persistência local
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

export default app;
