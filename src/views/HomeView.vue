<template>
  <div>
    <h1>🎮 Velkommen til Spillet</h1>

    <router-link to="/new">Start nyt spil</router-link>
    <br />
    <router-link to="/active">Gå til igangværende spil</router-link>
    <br />
    <router-link to="/scoreboard">Se scoreboard</router-link>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
};
</script>
