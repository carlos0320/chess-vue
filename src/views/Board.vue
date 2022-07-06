<template lang="pug">
div#app
   ChessBoard
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
    ...mapState(['games','onlinePlayers'])
  },
  watch:{
    
    onlinePlayers:{
      immediate: true,
      handler( value ){
        //this.finishGame()
        //this.checkUserLink()
        //this.checkUser()
        this.checkFinishGame()
      }
    }
  },  
  methods:{
    finishGame(){
      console.log( this.username )
      console.log(this.onlinePlayers)
      let idPlayers = []
      this.onlinePlayers.forEach(element => {
        if ( element.gameId === this.gameId ){
          idPlayers.push( element.id )
        }
      });
      console.log( 'playersssss', idPlayers)
      //this.$store.dispatch('deleteGame', this.gameId)
      // this.$store.dispatch('finishUserGame', {id:idPlayers[0]})
      
      // this.$store.dispatch('finishUserGame', {id:idPlayers[1]})

      this.$store.dispatch('finishGame', {id1:idPlayers[0], id2:idPlayers[1]})
      
      
      //this.$store.dispatch('finishUserGame', {id:idPlayers[1]})
      
      //this.$router.go(-2)
      // this.$router.push({
      //     name: 'home',
          
      //   })
    },
    checkFinishGame(){
      //this.$store.dispatch('connectOnlineUsers')
      console.log("Call mEEEEEE", this.username, this.onlinePlayers)
      console.log("Call mEEEEEE22222", this.username, this.$store.state.onlinePlayers)
      this.onlinePlayers.forEach(element => {
        if ( (element.username === this.username) && !element.gameId ){
          console.log( 'FINISHING', element.username)
          router.push({
            name: 'ChessRooms',
            params: { username: this.username }
          })
        }
      });
      
    }
  },
  created(){
    //this.$store.dispatch('fetchGame',this.gameId)
    //this.$store.dispatch('connectOnlineUsers')
  },

  mounted(){
    console.log('eso')
    //this.$store.dispatch('fetchGame',this.gameId)
    //this.$store.dispatch('connectOnlineUsers')
    console.log('eso2')
  }
}
</script>

<style lang="less" scoped>
*{
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
#app {
  display: flex;  
  height: 100vh;
  background-color:#202020;
}

.finish-game{

  width: 100px;
  height:100px;
  margin-top: 15%
}

</style>
