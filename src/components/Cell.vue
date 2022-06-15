<template lang="pug">
div(:class="(color === 'w') ? 'tile white-tile img-container' : 'tile black-tile img-container'"  
  @dragover.prevent
  @drop.prevent="drop"
  @drop="onDrop")  
  div(v-if="pieceExists")         
    img(:id="String(pieceSelected.id)" 
      :src="require(`@/${image}`)" 
      alt="hola"
      :draggable="draggable"
      @dragstart="dragStart($event,pieceSelected.id)"
      @dragover.stop)   
  
</template>

<script>

import { mapState, mapActions , mapGetters} from 'vuex'

export default {
  data(){
    return{     
      pieceExists: false,
      pieceSelected:{}
    }
  },
  props:{
    id:{
      type: Number
    },
    color:{
      type: String
    },
   
    draggable:{
      type: Boolean
    },

    posX:{
      type: Number
    },

    posY:{
      type: Number
    }
    
  },  

  computed:{
    ...mapState(['squares', 'pieces']),
    image(){
      if( this.pieceSelected.type === 'pawn' && this.pieceSelected.color ==='w' ){
        return 'assets/images/pawn_w.png'
      } else if( this.pieceSelected.type === 'pawn' && this.pieceSelected.color==='b'){
        return 'assets/images/pawn_b.png'
      }  else if( this.pieceSelected.type === 'rook' && this.pieceSelected.color === 'b'){
        return 'assets/images/rook_b.png'
      }else if( this.pieceSelected.type === 'rook' && this.pieceSelected.color === 'w'){
        return 'assets/images/rook_w.png'
      }else if( this.pieceSelected.type === 'knight' && this.pieceSelected.color === 'w'){
        return 'assets/images/knight_w.png'
      }else if( this.pieceSelected.type === 'knight' && this.pieceSelected.color === 'b'){
        return 'assets/images/knight_b.png'
      } else if( this.pieceSelected.type === 'bishop' && this.pieceSelected.color === 'b'){
        return 'assets/images/bishop_b.png'
      }else if( this.pieceSelected.type === 'bishop' && this.pieceSelected.color === 'w'){
        return 'assets/images/bishop_w.png'
      }else if( this.pieceSelected.type === 'king' && this.pieceSelected.color === 'b'){
        return 'assets/images/king_b.png'
      }else if( this.pieceSelected.type === 'king' && this.pieceSelected.color === 'w'){
        return 'assets/images/king_w.png'
      }else if( this.pieceSelected.type === 'queen' && this.pieceSelected.color === 'b'){
        return 'assets/images/queen_b.png'
      }
      else if( this.pieceSelected.type === 'queen' && this.pieceSelected.color === 'w'){
        return 'assets/images/queen_w.png'
      }
      
    }
  },

  methods:{

    isThereAPiece(){
      this.pieces.map( p => {        
        if( p.posX === this.posX && p.posY === this.posY ){          
          this.pieceExists = true
          this.pieceSelected = p
        }
      })
    },    


    dragStart(e){

      e.dataTransfer.dropEffect ='move'
      e.dataTransfer.effectAllowed ='move'
      const target = e.target;
      e.dataTransfer.setData('piece_id', target.id); 
    },

     drop(e){
        const piece_id = e.dataTransfer.getData('piece_id');        
        const card = document.getElementById(piece_id);        
        e.target.appendChild(card);        

        this.$store.dispatch("updatePieces",[this.posX, this.posY, Number(piece_id)])

      },    
  },

  mounted(){
    this.isThereAPiece()
  }
 
}
</script>

<style lang="less">

  .img-container{
    height: inherit;    
  }

  .tile{
    display: grid;
    place-content: center;
    width: 75px;
    height: 75px;
  }

  .black-tile{
    background-color: #779556 ;
  }

  .white-tile{
    background-color: #ebecd0;
  }

  
  img{
    width: 67px;

  }

</style>