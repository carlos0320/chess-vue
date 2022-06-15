<template lang="pug">
div#app
  ChessBoard  
</template>

<script>

import ChessBoard from './components/ChessBoard.vue'

export default {
  name: 'Board',
  components: {
    ChessBoard
  },
  mounted(){
     this.$store.dispatch('connect2')
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

</style>
