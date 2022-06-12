<template lang="pug">
div(:class="(color === 'w') ? 'tile white-tile img-container' : 'tile black-tile img-container'"
  
  @dragover.prevent
  @drop.prevent="drop"
  @drop="onDrop")
  
  div(v-if="Object.keys(piece).length > 0" :id="piece.id")         
    img(:id="String(piece.id)" 
      :src="require(`@/${image}`)" 
      alt="hola"
      :draggable="draggable"
      @dragstart="dragStart($event,piece.id)"
      @dragover.stop)   
  
</template>

<script>

export default {
  data(){
    return{ 
      idCellSelected:0

    }
  },
  props:{
    id:{
      type: Number
    },
    color:{
      type: String
    },
    piece:{
      type: Object,
      default:{}
    },
    draggable:{
      type: Boolean
    },
    method:{
      type: Function
    },
    
    
  },
  methods:{
    startDrag (evt, pieceId) {
      console.log("drag", pieceId)
      evt.dataTransfer.dropEffect = 'move'
      evt.dataTransfer.effectAllowed = 'move'
      evt.dataTransfer.setData('itemID', pieceId)
  	},

  	onDrop (evt) {
  		const itemID = evt.dataTransfer.getData('itemID')
      const card = document.getElementById(itemID);
  		console.log("ItemID", card )
  	},


    dragStart(e){

      e.dataTransfer.dropEffect ='move'
      e.dataTransfer.effectAllowed ='move'

      e.dataTransfer.setData('piece_id', target.id);
      
      //console.log(this.piece)
        //const target = e.target;
        //console.log(target)
        //this.method( target.id, this.piece )
        //this.idCellSelected = this.id
        //console.log(this.idCellSelected)
        //setTimeout(() => {
          //target.style.display="none"
        //},0)
    },
     drop(e, id, update){
        const piece_id = e.dataTransfer.getData('piece_id');
        
        //console.log("drop", piece_id)
        const card = document.getElementById(piece_id);
        //card.style.display = "block";
        //console.log("element", card)
        //console.log("target", e.target)
        //e.target.appendChild(card);
        console.log("drop")

        console.log( this.piece, this.id )
        
        
        console.log("dop", this.idCellSelected)
        //console.log(e.target)
        this.method(piece_id, this.id, this.idCellSelected)
        //console.log(e.target)

        //console.log( this.pieces )


         
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