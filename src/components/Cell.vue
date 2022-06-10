<template lang="pug">
div(:class="(color === 'w') ? 'tile white-tile' : 'tile black-tile'"
  @dragover.prevent
  @drop.prevent="drop")
  div(v-if="Object.keys(piece).length > 0" :id="piece.id")         
    img(:id="String(piece.id)" 
      :src="require(`@/${image}`)" 
      alt="hola"
      :draggable="draggable"
      @dragstart="dragStart"
      @dragover.stop)   
  
</template>

<script>

export default {
  data(){
    return{
      
    }
  },
  props:{
    color:{
      type: String
    },
    piece:{
      type: Object,
      default:{}
    },
    draggable:{
      type: Boolean
    }
  },
  methods:{
    dragStart(e){
      //console.log(this.piece)
        const target = e.target;
        //console.log(target)
        e.dataTransfer.setData('piece_id', target.id);
        //setTimeout(() => {
          //target.style.display="none"
        //},0)
    },
     drop: e => {
        const piece_id = e.dataTransfer.getData('piece_id');
        //console.log("drop", piece_id)
        const card = document.getElementById(piece_id);
        //card.style.display = "block";
        //console.log("element", card)
        //console.log("target", e.target)
        e.target.appendChild(card);
      },
    
  },
  computed:{
    image(){
      if( this.piece.type === 'pawn' && this.piece.color ==='w' ){
        return 'assets/images/pawn_w.png'
      } else if( this.piece.type === 'pawn' && this.piece.color==='b'){
        return 'assets/images/pawn_b.png'
      }  else if( this.piece.type === 'rook' && this.piece.color === 'b'){
        return 'assets/images/rook_b.png'
      }else if( this.piece.type === 'rook' && this.piece.color === 'w'){
        return 'assets/images/rook_w.png'
      }else if( this.piece.type === 'knight' && this.piece.color === 'w'){
        return 'assets/images/knight_w.png'
      }else if( this.piece.type === 'knight' && this.piece.color === 'b'){
        return 'assets/images/knight_b.png'
      } else if( this.piece.type === 'bishop' && this.piece.color === 'b'){
        return 'assets/images/bishop_b.png'
      }else if( this.piece.type === 'bishop' && this.piece.color === 'w'){
        return 'assets/images/bishop_w.png'
      }else if( this.piece.type === 'king' && this.piece.color === 'b'){
        return 'assets/images/king_b.png'
      }else if( this.piece.type === 'king' && this.piece.color === 'w'){
        return 'assets/images/king_w.png'
      }else if( this.piece.type === 'queen' && this.piece.color === 'b'){
        return 'assets/images/queen_b.png'
      }
      else if( this.piece.type === 'queen' && this.piece.color === 'w'){
        return 'assets/images/queen_w.png'
      }
      
    }
  }
}
</script>

<style lang="less">

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