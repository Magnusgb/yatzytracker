<template>
  <div>
    <h1>📋 Scoreboard</h1>

    <div v-if="finishedGames.length === 0">
      <p>Ingen afsluttede spil endnu.</p>
    </div>

    <div v-else>
      <h2>📅 Afsluttede spil</h2>
      <ul>
        <li v-for="game in finishedGames" :key="game.id">
          <strong>{{ game.players[0].name }} vs {{ game.players[1].name }}</strong> –
          Vinder: <strong>{{ game.winner }}</strong> –
          Afsluttet: {{ formatDate(game.endedAt) }}
        </li>
      </ul>

      <h2>🏆 Spillere med flest sejre</h2>
      <ul>
        <li v-for="(wins, name) in sortedWinners" :key="name">
          {{ name }}: {{ wins }} {{ wins === 1 ? 'sejr' : 'sejre' }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      finishedGames: [],
      winnerCounts: {}
    };
  },

  computed: {
    sortedWinners() {
      return Object.fromEntries(
        Object.entries(this.winnerCounts).sort((a, b) => b[1] - a[1])
      );
    }
  },

  created() {
    const games = JSON.parse(localStorage.getItem('finishedGames') || '[]');
    this.finishedGames = games;

    const counts = {};
    for (const game of games) {
      if (game.winner) {
        counts[game.winner] = (counts[game.winner] || 0) + 1;
      }
    }
    this.winnerCounts = counts;
  },

  methods: {
    formatDate(iso) {
      const date = new Date(iso);
      return date.toLocaleString('da-DK', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  }
};
</script>
