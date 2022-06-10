<template lang="pug">
div#chessboard
  Cell(v-for="square in squares" :key="square.id" 
    :color="square.color"
    :piece="square.piece"
    :draggable="true") 
    
</template>

<script>
import Cell from './Cell.vue'
import {initialPos}  from '../helpers/placingPieces'

export default {

  data(){
    return{
      square:{
        id:0,
        posX:0,
        posY:0,
        color:'',
        piece:{}
      },
      squares:[]
    }
  },
  methods:{
    drawBoard(){
      for( let i =0; i<8; i++){
        for ( let j =0; j<8; j++){
          let color = 'w';
          let count = 0;

          if ( (i+j) % 2 === 0){
            color= 'w'
          } else{
            color='b'
          }
          this.squares.push({
            id: count,
            posX: i,
            posY: j,
            color,
            piece:{}
          })
        }
      }      
    },
   
    
    initialPositions(){
      let countId = 0;
      if ( this.squares.length > 0 ){
        this.squares.forEach( s => {
          let piece = initialPos( s, countId )
          if ( piece ){
            countId++
            s.piece = piece 
          }
          
          
        })
      }
      
    },

    init(){
      this.drawBoard();
      this.initialPositions();
      
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
    display: grid;
    grid-template-columns: repeat(8,75px) ;
    grid-template-rows: repeat(8,75px) ;
    width: 600px;
    height: 600px;
    background-color: blue ;
  }
</style>