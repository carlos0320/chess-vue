<template lang="pug">
div(:class="(color === 'w') ? 'tile white-tile img-container' : 'tile black-tile img-container'"
  @dragover.prevent
  @drop.prevent="drop"
  @drop="onDrop")
  .image-container(v-if="currentPiece && currentPiece.status" @drop.prevent="drop" @drop="onDrop")
    img(
      :src="require(`@/${image}`)"
      :draggable="draggable"

      @dragover.prevent
      @dragstart="dragStart($event)"
      @dragover.stop
      )

</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    color: {
      type: String
    },

    draggable: {
      type: Boolean
    },

    xpos: {
      type: String
    },

    ypos: {
      type: String
    }
  },

  computed: {
    ...mapState(['pieces']),
    image () {
      if (!this.currentPiece) return null
      if (
        this.currentPiece.type === 'pawn' &&
        this.currentPiece.color === 'w'
      ) {
        return 'assets/images/pawn_w.png'
      } else if (
        this.currentPiece.type === 'pawn' &&
        this.currentPiece.color === 'b'
      ) {
        return 'assets/images/pawn_b.png'
      } else if (
        this.currentPiece.type === 'rook' &&
        this.currentPiece.color === 'b'
      ) {
        return 'assets/images/rook_b.png'
      } else if (
        this.currentPiece.type === 'rook' &&
        this.currentPiece.color === 'w'
      ) {
        return 'assets/images/rook_w.png'
      } else if (
        this.currentPiece.type === 'knight' &&
        this.currentPiece.color === 'w'
      ) {
        return 'assets/images/knight_w.png'
      } else if (
        this.currentPiece.type === 'knight' &&
        this.currentPiece.color === 'b'
      ) {
        return 'assets/images/knight_b.png'
      } else if (
        this.currentPiece.type === 'bishop' &&
        this.currentPiece.color === 'b'
      ) {
        return 'assets/images/bishop_b.png'
      } else if (
        this.currentPiece.type === 'bishop' &&
        this.currentPiece.color === 'w'
      ) {
        return 'assets/images/bishop_w.png'
      } else if (
        this.currentPiece.type === 'king' &&
        this.currentPiece.color === 'b'
      ) {
        return 'assets/images/king_b.png'
      } else if (
        this.currentPiece.type === 'king' &&
        this.currentPiece.color === 'w'
      ) {
        return 'assets/images/king_w.png'
      } else if (
        this.currentPiece.type === 'queen' &&
        this.currentPiece.color === 'b'
      ) {
        return 'assets/images/queen_b.png'
      } else if (
        this.currentPiece.type === 'queen' &&
        this.currentPiece.color === 'w'
      ) {
        return 'assets/images/queen_w.png'
      } else {
        return false
      }
    },

    currentPiece () {
      return this.pieces.find(
        (item) =>
          item.xpos === this.xpos && this.ypos === item.ypos && item.status
      )
    }
  },

  methods: {
    dragStart (e) {
      e.dataTransfer.dropEffect = 'move'
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('piece_id', this.currentPiece.id)
    },

    drop (e) {
      const pieceId = e.dataTransfer.getData('piece_id')

      const captPiece = this.pieces.find((item) => {
        if (
          item.xpos === this.xpos &&
          item.ypos === this.ypos &&
          item.status &&
          item.id !== pieceId
        ) {
          return item
        } else {
          return null
        }
      })

      if (captPiece) {
        this.$store.dispatch('removePiece', captPiece)
        this.$store.dispatch('movePiece', {
          xpos: this.xpos,
          ypos: this.ypos,
          id: pieceId
        })
      } else {
        this.$store.dispatch('movePiece', {
          xpos: this.xpos,
          ypos: this.ypos,
          id: pieceId
        })
      }
    }
  }
}
</script>

<style lang="less">
.img-container {
  height: inherit;
}

.tile {
  display: grid;
  place-content: center;
  width: 75px;
  height: 75px;
}

.black-tile {
  background-color: #779556;
}

.white-tile {
  background-color: #ebecd0;
}

.image-container {
  height: inherit;
  width: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}

img {
  width: 60px;
}
</style>
