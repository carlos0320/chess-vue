<template lang="pug">
.login-container
  .login-wrapper
    .login-title
      h1 Welcome to CHESS 1DOC3
      h3 Have Fun!      
    .login-form  
      p Please, create your user name      
      form
        div
          input( v-model.trim="login.username" type="text" placeholder="username")
        button(type="submit" @click="submit") Join
</template>

<script>
import router from '../router'
export default {
  name: 'home',
  data(){
      return {
        login: { username : ''}
      }
    },
    methods: {      
      submit (evt){
        console.log('called')
        evt.preventDefault()
        let user = {
          id: (new Date().getTime()).toString(36),
          username: this.login.username,
          isPlaying: false,
          invitations:null,
          gameId:null,
          status: true
        }
        this.$store.dispatch('saveUser', user)
        this.$router.push({
          name: 'ChessRooms',
          params: { username: this.login.username }
        })
      }
    },
    mounted(){
      //this.$store.dispatch('getPlayersGame')
      this.$store.dispatch('connectOnlineUsers')
    }
}
</script>

<style lang="less" scoped>

  *{
    box-sizing: border-box;   
    margin: 0;
    padding: 0;
  }

  .login-wrapper{
    width: 80%;
    height: 20%;
    margin:0 auto;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
  }

  .login-title{
    display: block;
    width: 80%;
    margin:10px auto;
    margin-bottom: 20px;
    h1{
      font-weight: 800;
    }
  }

  .login-container{
    width: 100vw;    
    height: 100vh;
    color: #ebecd0;
    display: flex;
    justify-content: center;
    align-items: center;    
    background: #312E2B;  
    font-family:  'Montserrat', sans-serif;
  }
  
  form{
    margin: 10px auto;
    display: block;    
    align-content: center;
  }

  input{
    width: 200px;
    padding: 7px;
    border: none;
    border-radius: 5px;    
  }

  button{
    width: 120px;
    padding: 10px;
    background: #77a556;
    border: none;
    cursor: pointer;
    font-size: 18px;
    border-radius: 6px;
    color: #ffff;
    margin-top: 20px
  }


</style>