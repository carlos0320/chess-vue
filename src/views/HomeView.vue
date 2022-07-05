<template lang="pug">
p Home view
  .login-container
    .login-form
      h2 Enter a user name
      form(@submit="onSubmit")
        input( v-model.trim="login.username" type="text")  
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
      onSubmit (evt){
        evt.preventDefault()
        router.push({
          name: 'ChessRooms',
          params: { username: this.login.username }
        })
      }
    }
}
</script>

<style>
  .login-container{
    width: 100%;    
    display: flex;
    justify-content: center;
    align-items: center;  
  }
  
</style>