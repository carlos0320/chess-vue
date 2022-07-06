<template lang="pug">
.chess-rooms_wrapper
  .chess-rooms_container
    p.title Chess rooms
    template(v-if="invitation")
      p you have an invitatio to play from {{ invitation }}
      button(@click="initGame(invitation)") Aceptar desafio
    p.subtitle Welcome! 
      span {{ username }}
    .online-players-container
      .online-players-active
        h3 Available players
        table
          tr
            th User name
            th Invite to play
          template(v-for="player in onlinePlayers")
            tr
              template(v-if="!player.isPlaying && (player.username !== username)")
                td {{ player.username }}
                td.invite-to-play(@click="sendInvitation(player.id)") Invite
      .online-players-playing
        h3 Currently playing
        table
          tr
            th Player 1
            th Player 2            
          template(v-for="player in onlinePlayers")
            tr
              template(v-if="player.isPlaying")
                td {{ player.username || player.invitations }}
                td {{ player.username || player.invitations }}               
            
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

<style lang="less" scoped>
  
  *{
    box-sizing: border-box;   
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color:#312E2B
  }

  p{
    color: #ebecd0;
    &.title{
      font-size: 60px;
      font-weight: bold      
    }
    &.subtitle{
      font-size: 35px;
      font-weight: bold;
      color: #77a556;
    }
  }

  h3{
    color: #ffff;
    background:transparent ;
  }

  .chess-rooms_container{
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    background-color:#312E2B
  }

  .chess-rooms_container{
    width: 80%;
    margin: 0px auto;
    padding-top: 50px;
  }

  .online-players-container{    
    width: 80%;
    margin: 70px auto;
    display: flex;
    justify-content: space-between;
    background-color: #100f0f;
  }
  .online-players-active{
    padding: 10px;
    width: 40%;    
    background: transparent;
  }
  .online-players-playing{
    padding: 10px;
    width: 40%;    
    background: transparent;
  }
  table{
    padding-top: 10px;
    background-color: #100f0f;
    width: 100%;        
  }
  tr,td,th{
    background-color: #100f0f;
    color: #fff;
  }
  tr{
    border: 1px solid #312E2B;  
    display: flex;
    justify-content: space-between;
    padding: 10px;
    margin: 5px;
  }
  .online-players{

  }
  .invite-to-play{
    color: #ffff;
    width: 120px;
    text-align: center;
    background: #7fa650;
    cursor: pointer;
    padding: 3px;
    border-radius: 2px;
  }
</style>