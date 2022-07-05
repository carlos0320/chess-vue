<template lang="pug">
h1 Chess rooms
h2 Active players
.online-players()
  table
    tr
      th User name
      th Invitar a jugar
    template(v-for="player in onlinePlayers")
    tr
      td {{ player.username }}
      td jugar    
p {{ username }}
button(@click="startNewGame") NewGame
.active-games(v-for="game in games" :key="game")
  router-link(:to="{ name: 'Board', params: { gameId: game }}") Game in progress..
</template>

<script>
import { mapState, mapActions , mapGetters} from 'vuex'
export default {
  name: 'ChessRooms',
  data(){
    return{
      username: this.$route.params.username
    }
  },
  computed:{
    ...mapState(['games','onlinePlayers'])
  },
  methods:{
    startNewGame(){
      this.$store.dispatch('initNewGame')
      let lastOne = this.games[this.games.length -1 ]
      this.$router.push({ name: 'Board', params: { gameId: lastOne }} )
    }
  },
  mounted(){
    this.$store.dispatch('getGames')

  }
  
}
</script>

<style>
  .online-players{

  }
</style>