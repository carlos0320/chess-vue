<template lang="pug">
p Sign up view
  .signup-container
    .signup-form
      h2 Sign up form
      form
        label(for="email") Email
        input( v-model.trim="signup.email" name="email" type="email")
        label(for="username") Username
        input( v-model.trim="signup.username" name="username" type="text")
        label(for="password") Password
        input( v-model.trim="signup.password" name="password" type="password")
        button(@click="onSubmit") send        
</template>

<script>
import router from '../router'
export default {
  name: 'signup',
  data(){
    return{
      signup:{
          email:'',
          username:'',
          password:''
      }
    }
  },
  methods:{
     onSubmit (evt){
        console.log('called')
        evt.preventDefault()
        let user = {
          email: this.signup.email,
          password: this.signup.password
        }
        this.$store.dispatch('signup', user)
        // router.push({
        //   name: '/',
        //   params: { username: this.login.username }
        // })
      }
  }
}
</script>

<style>

</style>