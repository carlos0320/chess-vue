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
  display: grid;
  place-content: center;
  height: 100vh;
  background-color:#202020;
}

</style>
