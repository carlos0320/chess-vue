<template lang="pug">
.chessboard
  Cell(v-for="square in squares" :key="square.id"
    :color="square.color"
    :xpos="square.xpos"
    :ypos="square.ypos"    
    :draggable="true"
  )   
</template>

<script>
import Cell from './Cell.vue'
import { mapState, mapActions , mapGetters} from 'vuex'

export default {
  components:{ Cell },
  data(){
    return{
      squares: [],
      gameId: this.$route.params.gameId,
    }
  },
  computed:{
    ...mapState(['pieces'])
  },
  mounted(){
    for( let i =0; i<8; i++){
      for ( let j =0; j<8; j++){

        let color = 'w';

        if ( (i+j) % 2 === 0){
          color= 'w'
        } else{
          color='b'
        }

        this.squares.push({
          xpos: String(i),
          ypos: String(j),
          color,            
        })
      }
    }
    this.newGame();
  },
  
  methods:{
    newGame(){
     
      this.$store.dispatch('fetchGame',this.gameId)
      this.$store.dispatch('connectRooms')      
    }
  }
}
</script>

<style lang="less" scoped>
.chessboard{
  margin: 10px 10%;
  display: grid;
  grid-template-columns: repeat(8,75px) ;
  grid-template-rows: repeat(8,75px) ;
  width: 600px;
  height: 600px;
  background-color: blue ;
}
button{
  margin-top: 20px;
  width: 200px;
  height: 100px;
}
</style>