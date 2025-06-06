<template>
  <div>
    <h2>Opsæt Yatzy Spil</h2>

    <!-- Vælg spiltype -->
    <label for="gameType">Vælg spiltype:</label>
    <select id="gameType" v-model="selectedBestOf">
      <option disabled value="">-- Vælg --</option>
      <option value="3">Bedst af 3</option>
      <option value="5">Bedst af 5</option>
    </select>
    <p v-if="showErrors && !selectedBestOf" style="color: red;">Du skal vælge en spiltype.</p>

    <!-- Tilføj spillere -->
    <div style="margin-top: 1rem;">
      <input v-model="newPlayerName" placeholder="Indtast navn" @keyup.enter="addPlayer" />
      <button @click="addPlayer">Tilføj spiller</button>
    </div>
    <p v-if="showErrors && players.length < 2" style="color: red;">Du skal tilføje mindst 2 spillere.</p>

    <!-- Liste over spillere -->
    <h3 v-if="selectedBestOf">Bedst ud af {{ selectedBestOf }} – Spillere:</h3>
    <ul>
      <li v-for="(player, index) in players" :key="index">
        <span v-if="!player.editing">{{ index + 1 }}. {{ player.name }}</span>
        <input v-else v-model="player.name" @keyup.enter="stopEditing(player)" />

        <button v-if="!player.editing" @click="editPlayer(player)">Rediger</button>
        <button v-if="player.editing" @click="stopEditing(player)">Gem</button>
        <button @click="removePlayer(index)">Slet</button>
      </li>
    </ul>

    <!-- Start spil -->
    <button style="margin-top: 1rem;" @click="startGame">Start spil</button>
    <p v-if="errorMessage" style="color: red; margin-top: 0.5rem;">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createGame } from '../firebase'

// Brug router først
const router = useRouter()

// Definer refs og state
const selectedBestOf = ref('')
const newPlayerName = ref('')
const players = ref([])
const showErrors = ref(false)
const errorMessage = ref('')

function addPlayer() {
  const name = newPlayerName.value.trim()
  if (name) {
    players.value.push({ name, editing: false })
    newPlayerName.value = ''
  }
}

function removePlayer(index) {
  players.value.splice(index, 1)
}

function editPlayer(player) {
  player.editing = true
}

function stopEditing(player) {
  player.editing = false
}

// Den asynkrone funktion til at starte spillet
async function startGame() {
  showErrors.value = true
  errorMessage.value = ''

  if (!selectedBestOf.value || players.value.length < 2) {
    errorMessage.value = "Udfyld begge felter før du starter spillet."
    return
  }

  try {
    // Opret et gameData objekt med den nødvendige information
    const gameData = {
      bestOf: selectedBestOf.value,
players: players.value.map(player => ({
  name: player.name,
  sets: 0
})),      createdAt: new Date()
    }

    // Opret spillet i Firebase
    const gameId = await createGame(gameData)

    // Naviger til GameView med det oprettede gameId
    router.push(`/game/${gameId}`)
  } catch (err) {
    console.error("Fejl ved oprettelse af spil:", err)
    errorMessage.value = "Kunne ikke starte spil. Prøv igen."
  }
}


</script>
