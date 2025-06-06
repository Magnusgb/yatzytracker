<template>
  <div>
    <h1 v-if="players.length">Spil – {{ players[0].name }} vs {{ players[1].name }}</h1>

    <div v-if="players.length && !gameOver">
      <label>{{ players[0].name }}'s point</label>
      <input type="number" v-model.number="playerInput[0]" />

      <label>{{ players[1].name }}'s point</label>
      <input type="number" v-model.number="playerInput[1]" />

      <button @click="addRound">➕ Tilføj point</button>
    </div>

    <div v-if="gameOver">
      <h2>🎉 Spillet er slut! {{ winnerName }} har vundet 🎉</h2>
    </div>

    <h2 v-if="rounds.length">📊 Scoreboard</h2>
    <table v-if="rounds.length">
      <thead>
        <tr>
          <th>Runde</th>
          <th>{{ players[0].name }}</th>
          <th>{{ players[1].name }}</th>
          <th>Total</th>
          <th>Resultat</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(round, index) in rounds" :key="index">
          <td>#{{ index + 1 }}</td>
          <td>{{ round[players[0].name] }}</td>
          <td>{{ round[players[1].name] }}</td>
          <td>{{ round.totalAfterRound[players[0].name] }} – {{ round.totalAfterRound[players[1].name] }}</td>
          <td>
            <span v-if="round.winner === 'Uafgjort'">Uafgjort</span>
            <span v-else>{{ round.winner }} vinder</span>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="finishedSets.length">
      <h3>🎯 Afsluttede sæt:</h3>
      <ul>
        <li v-for="(set, index) in finishedSets" :key="index">
          Sæt #{{ index + 1 }} – {{ set[players[0].name] }} – {{ set[players[1].name] }}: {{ set.winner }} vinder sættet
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getGame, updateGame } from '../firebase.js'

export default {
  data() {
    return {
      players: [],
      gameId: null,
      gameData: null,
      bestOf: 3,
      playerInput: [0, 0],
      rounds: [],
      finishedSets: [],
      gameOver: false,
      winnerName: ''
    };
  },

  async created() {
    try {
      this.gameId = this.$route.params.gameId || this.$route.params.id;
      const game = await getGame(this.gameId);

      this.gameData = game;
      this.bestOf = parseInt(game.bestOf);

      this.players = game.players.map(p => ({
        name: p.name,
        sets: p.sets || 0,
      }));

      this.rounds = game.rounds || [];
      this.finishedSets = game.finishedSets || [];
    } catch (error) {
      console.error("Fejl ved hentning af spil:", error);
    }
  },

  methods: {
    async addRound() {
      const p0 = this.players[0].name;
      const p1 = this.players[1].name;

      const p0Points = this.playerInput[0];
      const p1Points = this.playerInput[1];

      const newRound = {
        [p0]: p0Points,
        [p1]: p1Points,
        totalAfterRound: {
          [p0]: this.getTotalPoints(p0) + p0Points,
          [p1]: this.getTotalPoints(p1) + p1Points,
        },
        winner: p0Points > p1Points ? p0 : p1Points > p0Points ? p1 : "Uafgjort"
      };

      this.rounds.push(newRound);
      this.playerInput = [0, 0];

      const totalP0 = newRound.totalAfterRound[p0];
      const totalP1 = newRound.totalAfterRound[p1];

      if ((totalP0 >= 1000 || totalP1 >= 1000) && totalP0 !== totalP1) {
        const winner = totalP0 > totalP1 ? p0 : p1;
        this.finishedSets.push({ [p0]: totalP0, [p1]: totalP1, winner });

        const winnerObj = this.players.find(p => p.name === winner);
        if (winnerObj) winnerObj.sets++;

        this.rounds = [];
      }

      const maxSets = Math.ceil(this.bestOf / 2);
      const winner = this.players.find(p => p.sets >= maxSets);

      if (winner) {
        this.gameOver = true;
        this.winnerName = winner.name;

        await this.moveGameToHistory();
      }

      try {
        await updateGame(this.gameId, {
          players: this.players,
          rounds: this.rounds,
          finishedSets: this.finishedSets,
        });
      } catch (err) {
        console.error("Kunne ikke opdatere spil i Firebase:", err);
      }
    },

    getTotalPoints(player) {
      return this.rounds.reduce((sum, round) => sum + (round[player] || 0), 0);
    },

    async moveGameToHistory() {
      const activeGames = JSON.parse(localStorage.getItem("activeGames") || "[]");
      const updatedActiveGames = activeGames.filter(game => game.id !== this.gameId);
      localStorage.setItem("activeGames", JSON.stringify(updatedActiveGames));

      const finishedGames = JSON.parse(localStorage.getItem("finishedGames") || "[]");
      const gameToStore = {
        id: this.gameId,
        players: this.players,
        finishedSets: this.finishedSets,
        winner: this.winnerName,
        endedAt: new Date().toISOString()
      };
      finishedGames.push(gameToStore);
      localStorage.setItem("finishedGames", JSON.stringify(finishedGames));
    },
  }
};
</script>
