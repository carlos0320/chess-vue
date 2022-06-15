<template lang="pug">
div#chessboard
  template( v-if="isloaded")
    Cell(v-for="square in squares" :key="square.id"
      :id="square.id"
      :color="square.color"
      :posX="square.posX"
      :posY="square.posY"    
      :draggable="true"
    )
  p(v-else) Loading game...
button(@click="newGame") nuevo juego
p {{ $store.state.pieces[0]}} 
    
</template>

<script>
import Cell from './Cell.vue'
import { mapState, mapActions , mapGetters} from 'vuex'

export default {

  data(){
    return{
    }
  },

  computed:{
    ...mapState(['squares', 'pieces', 'isloaded'])
  },
  
  methods:{

    newGame(){
      console.log( this.pieces )
    },

    drawBoard(){
      this.$store.commit('drawBoard')
    },

    initialPosition(){
      this.$store.commit('initialPosition')
    },  
   

    init(){
      this.$store.dispatch('fetchPieces')
      ;      
    }
  },

  mounted(){
     this.init()
  },

  components:{
    Cell
  }

}
</script>

<style lang="less" scoped>
#chessboard{
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