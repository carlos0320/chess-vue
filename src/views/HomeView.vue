<template lang="pug">
.login-container
  .login-wrapper
    .login-title
      h1 Welcome to CHESS 1DOC3
      h3 Have Fun!
    .login-form
      p Please, create your user name
      template(v-if="invalidUser")
        p.error-user__message Your username must contain one character or more

      form
        div
          input( v-model.trim="login.username" type="text" placeholder="Username")
        button(type="submit" @click="submit") Join
</template>

<script>

export default {
  name: 'home-view',
  data () {
    return {
      login: { username: '' },
      invalidUser: false
    }
  },
  methods: {
    submit (evt) {
      evt.preventDefault()
      if (this.login.username.length > 0) {
        this.invalidUser = false
        const user = {
          id: new Date().getTime().toString(36),
          username: this.login.username,
          isPlaying: false,
          invitations: null,
          gameId: null,
          status: true
        }
        this.$store.dispatch('saveUser', user)
        this.$router.push({
          name: 'ChessRooms',
          params: { username: this.login.username }
        })
      } else {
        this.invalidUser = true
      }
    }
  },
  mounted () {
    // this.$store.dispatch('getPlayersGame')
    this.$store.dispatch('connectOnlineUsers')
  }
}
</script>

<style lang="less" scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.login-wrapper {
  width: 80%;
  height: 20%;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
}

.login-title {
  display: block;
  width: 80%;
  margin: 10px auto;
  margin-bottom: 20px;
  h1 {
    font-weight: 800;
  }
}

.login-container {
  width: 100vw;
  height: 100vh;
  color: #ebecd0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #312e2b;
  font-family: "Montserrat", sans-serif;
}

.error-user__message {
  color: rgb(212, 106, 106);
  font-size: 15px;
}

form {
  margin: 10px auto;
  display: block;
  align-content: center;
}

input {
  width: 250px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background: #52514f;
  color: #ffff;
  font-weight: bold;
  font-size: 15px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  outline: none;
}

button {
  width: 120px;
  padding: 10px;
  background: #77a556;
  border: none;
  cursor: pointer;
  font-size: 18px;
  border-radius: 6px;
  color: #ffff;
  margin-top: 20px;
}
</style>
