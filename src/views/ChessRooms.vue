<template lang="pug">
h1 Chess rooms
template(v-if="invitation")
  p you have an invitatio to play from {{ invitation }}
  button(@click="initGame(invitation)") Aceptar desafio
h2 Active players
.online-players()
  table
    tr
      th User name
      th Invitar a jugar
    template(v-for="player in onlinePlayers")
      tr
        template(v-if="!player.isPlaying")
          td {{ player.username }}
          td.invite-to-play(@click="sendInvitation(player.id)") Invitar a jugar
          
            
          
p {{ username }}
button(@click="startNewGame") NewGame
template(v-if="provideLink")
  router-link(:to="{ name: 'Board', params: { gameId: gameId }}") Game in progress..
</template>

<script>
import { mapState, mapActions , mapGetters} from 'vuex'
export default {
  name: 'ChessRooms',
  data(){
    return{
      username: this.$route.params.username,
      invitation: null,
      isAvailable: true,
      provideLink: false,
      //gameId: null
    }
  },
  computed:{
    ...mapState(['games','onlinePlayers', 'gameId'])
  },
  watch:{
    onlinePlayers:{
      immediate: true,
      handler( value ){
        this.checkInvitations()
        this.checkUserLink()
        //this.checkUser()
      }
    },
    games:{
      immediate: true,
      handler( value ){
        //this.setupGame()
        //this.$store.dispatch('fetchPlayers')
        //this.checkUserLink()
      }
    }
  },
  methods:{
    startNewGame(){
      this.$store.dispatch('initNewGame')
      let lastOne = this.games[this.games.length -1 ]
      this.$router.push({ name: 'Board', params: { gameId: lastOne }} )
    },
    sendInvitation( id ){
      let data = {
        id,
        message: this.username
      }
      this.$store.dispatch('inviteToPlay', data)
    },
  
    checkUserLink(){
      console.log('checking...')
      //this.$store.dispatch('fetchPlayers')
      for ( let i =0; i< this.onlinePlayers.length; i++){
        console.log("ENTREEE", this.onlinePlayers[i].username)
        console.log("online-players",this.onlinePlayers)
        if ( this.onlinePlayers[i].username === this.username && this.onlinePlayers[i].gameId ){
          console.log("entre", this.onlinePlayers[i].username)
          console.log("gameId", this.onlinePlayers[i].gameId)
          this.isAvailable = false
          this.provideLink = true
          this.gameId = this.onlinePlayers[i].gameId
          this.$router.push({ name: 'Board', params: { gameId: this.onlinePlayers[i].gameId}} )
          
        }
      }
    },


    checkUser(){
      console.log('Arrayyy',this.onlinePlayers)
      for ( let i =0; i< this.onlinePlayers.length; i++){
        console.log("ENTREEE", this.onlinePlayers[i].username)
        if ( this.onlinePlayers[i].username === this.username && this.onlinePlayers[i].gameId ){
          console.log("entre", this.onlinePlayers[i].username)
          console.log("gameId", this.onlinePlayers[i].gameId)
          this.isAvailable = false
          this.$router.push({ name: 'Board', params: { gameId: this.onlinePlayers[i].gameId}} )
        }
      }       
    },
    goToBoard(){
      for ( let i =0; i< this.onlinePlayers.length; i++){
        console.log("ENTREEE", this.onlinePlayers[i].username)
        if ( this.onlinePlayers[i].username === this.username && this.onlinePlayers[i].gameId ){
          console.log("entre", this.onlinePlayers[i].username)
          console.log("gameId", this.onlinePlayers[i].gameId)
          this.isAvailable = false
          this.$router.push({ name: 'Board', params: { gameId: this.onlinePlayers[i].gameId}} )
        }
      }
    },
    checkInvitations(){
      
      let player = this.onlinePlayers.find( player => player.username === this.username)
      
      if ( player ){
        this.invitation = player.invitations
      }else{
        return
      }
    },

    setupGame(){
      console.log('setted')
      for( game in this.games ){
        
        if ( game.player1 === this.username || game.player2 === this.username ){
          console.log('yes game', game )
          let lastOne = game.gameId
          this.$router.push({ name: 'Board', params: { gameId: lastOne }} )
        }
      }
    },


    initGame(invitation){
      let idPlayers = []
      this.onlinePlayers.forEach(element => {
        if ( element.username === this.username ){
          idPlayers.push( element.id )
        } else if ( element.username === invitation ){
          idPlayers.push( element.id )
        }
      });
      // this.$store.dispatch('goToPlay',{ id: idPlayers[0]})
      // this.$store.dispatch('goToPlay',{ id : idPlayers[1]})
      this.$store.dispatch('initNewGame',{ player1: idPlayers[0], player2: idPlayers[1]})

      // this.$store.dispatch('updateUserGame', { id1: idPlayers[0], id2: idPlayers[0], gameId: this.gameId })
     //dispatch('updateUserGame', { id: player2, gameId: gameRef.id })
      //this.$store.dispatch('connectOnlineUsers')
      //this.$store.dispatch('fetchPlayers')
      //this.checkUserLink()
      //this.$router.push({ name: 'Board', params: { gameId: this.gameId}} )


    }
  },
  mounted(){
    //this.$store.dispatch('getGames')
    //this.$store.dispatch('fetchPlayers')
    //this.$store.dispatch('connectOnlineUsers')
  }
  
}
</script>

<style>
  .online-players{

  }
  .invite-to-play{
    color: green;
    cursor: pointer;
  }
</style>