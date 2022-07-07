<template lang="pug">
div#app
   ChessBoard
   template(v-for="room in rooms")
    .players-container(v-if="room.gameId === gameId")        
      p.black {{ room.userB }}
      p.white {{ room.userW }}
   button(@click="finishGame").finish-game Finish Game
</template>
<script>
import { mapState, mapActions , mapGetters} from 'vuex'
import ChessBoard from '../components/ChessBoard.vue'
import router from '../router'
export default {
  name: 'Board',
  data(){
    return{
      gameId: this.$route.params.gameId,
      username: this.$route.params.username,
      players:[]
    }
  },
  components: {
    ChessBoard
  },
  computed:{
    ...mapState(['games','onlinePlayers', 'rooms'])
  },
  watch:{    
    onlinePlayers:{
      immediate: true,
      handler( value ){        
        this.checkFinishGame()
      }
    }
  },  
  methods:{
    finishGame(){
      
      let room = this.rooms.find( room => room.gameId === this.gameId )
      let idRoom = room.id
      this.$store.dispatch('removingUsersPlaying', { id: idRoom})
      let idPlayers = []
      this.onlinePlayers.forEach(element => {
        if ( element.gameId === this.gameId ){
          idPlayers.push( element.id )
        }
      });
      
      this.$store.dispatch('finishGame', {id1:idPlayers[0], id2:idPlayers[1]})
    },
    checkFinishGame(){
      //this.$store.dispatch('connectOnlineUsers')
      this.$store.dispatch('connectRooms')
      
      this.onlinePlayers.forEach(element => {
        if ( (element.username === this.username) && !element.gameId ){
          
          router.push({
            name: 'ChessRooms',
            params: { username: this.username }
          })
        }
      });
      
    }
  },  

  mounted(){    
    this.$store.dispatch('connectRooms')
  }
}
</script>

<style lang="less" scoped>
*{
  box-sizing: border-box;   
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
#app {
  display: flex;  
  height: 100vh;
  background-color:#202020;
}
.players-container{
  height: 100%;
  
  width: 160px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-right: 30px;
}
.black{
  color: white;
  font-size: 30px;
  font-weight: bold;
  width: 80%;
  height: 30%;
  padding-top:60px;
}
.white{
  color: white;
  font-size: 30px;
  font-weight: bold;
  width: 80%;
  height: 30%;
  padding-top:60px;
}
.finish-game{
  width: 120px;
  height:70px;
  color: #fff;
  background:#77a556;
  border-radius: 3px;
  border: none;
  margin-top: 15%;
  font-size: 18px;
  cursor: pointer;
}

</style>
