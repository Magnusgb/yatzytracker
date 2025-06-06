import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

// Funktion til at oprette spil
export async function createGame(gameData) {
  try {
    const formattedPlayers = gameData.players.map(name => ({
      name, // Gemmer spillernes navne her
      sets: 0
    }));

    const newGame = {
      players: formattedPlayers,
      bestOf: gameData.bestOf,
      currentSet: 1,
      gameStatus: "ongoing",
      createdAt: new Date()
    };

    const docRef = await addDoc(collection(db, "games"), newGame);
    return docRef.id;
  } catch (error) {
    console.error("Fejl ved oprettelse af spil:", error);
    throw error;
  }
}

// Funktion til at hente et spil
export async function getGame(gameId) {
  try {
    const docRef = doc(db, "games", gameId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data(); // Returner spillet data
    } else {
      throw new Error("Spillet findes ikke.");
    }
  } catch (error) {
    console.error("Fejl ved hentning af spil:", error);
    throw error;
  }
}
