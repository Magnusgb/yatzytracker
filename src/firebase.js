import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, setDoc, updateDoc, getDoc } from "firebase/firestore";

// Din Firebase-konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyD9H4ufivw4D3p49I8Le6FmzeXXHmJX1cQ",
  authDomain: "yatzy-tracker-7ba53.firebaseapp.com",
  projectId: "yatzy-tracker-7ba53",
  storageBucket: "yatzy-tracker-7ba53.firebasestorage.app",
  messagingSenderId: "738487933199",
  appId: "1:738487933199:web:0a2b5640678de00a45467a"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Eksporter Firestore
const db = getFirestore(app);

// Funktion til at oprette et nyt spil
export const createGame = async (gameData) => {
  try {
    const docRef = await addDoc(collection(db, "games"), gameData);
    console.log("Spil oprettet med ID:", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Fejl ved oprettelse af spil:", e);
    throw e;
  }
};

// Funktion til at hente et spil
export const getGame = async (gameId) => {
  try {
    const gameRef = doc(db, "games", gameId);
    const gameSnap = await getDoc(gameRef);
    
    if (gameSnap.exists()) {
      console.log("Game data:", gameSnap.data());
      return gameSnap.data();
    } else {
      console.log("No such game!");
      return null;
    }
  } catch (e) {
    console.error("Fejl ved hentning af spil:", e);
    throw e;
  }
};

// 💾 Opdaterer spillet løbende
export const updateGame = async (gameId, data) => {
  try {
    const gameRef = doc(db, 'games', gameId);
    await updateDoc(gameRef, {
      ...data,
      lastUpdated: new Date()  // Add a timestamp for the last update
    });
    console.log("Spil opdateret i Firebase");
  } catch (e) {
    console.error("Fejl ved opdatering af spil:", e);
    throw e;
  }
};

