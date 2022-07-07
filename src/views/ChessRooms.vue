<template lang="pug">
.chess-rooms_wrapper
  .chess-rooms_container
    .logout-rooms_container
      p.logout-icon(@click="logout") Logout
    p.title Chess rooms
    p.subtitle Welcome!  {{ username }}
    template(v-if="invitation")
      p.challenge-messaging You have an invitation to play from {{ invitation }}
      button.accept-challenge(@click="initGame(invitation)") Accept
    .online-players-container
      .online-players-active
        .dashboard-title Available players
        table
          tr
            th User name
            th Invite to play
          template(v-if="onlinePlayers.length > 1")
            template(v-for="player in onlinePlayers")
              template()
              template(v-if="!player.isPlaying && (player.username !== username) && (player.status)" )
                tr
                  td {{ player.username }}
                  td.invite-to-play(@click="sendInvitation(player.id)") Invite

          template(v-else)
            p.noplayers_message Sorry, currently there are no online players to play with
      .online-players-playing
        .dashboard-title Currently playing
        table
          tr
            th Black Pieces
            th White Pieces
          template(v-for="room in rooms ")
            tr(v-if="room.status")
              td {{ room.userB }}
              td {{ room.userW }}
//- button(@click="startNewGame") NewGame
//- template(v-if="provideLink")
//-   router-link(:to="{ name: 'Board', params: { gameId: gameId }}") Game in progress..
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'ChessRooms',
  data () {
    return {
      username: this.$route.params.username,
      invitation: null,
      isAvailable: true,
      provideLink: false
      // invitationInProgress: false
      // gameId: null
    }
  },
  computed: {
    ...mapState(['games', 'onlinePlayers', 'gameId', 'rooms'])
  },
  watch: {
    onlinePlayers: {
      immediate: true,
      handler (value) {
        this.checkInvitations()
        this.checkUserLink()
        // this.checkUser()
      }
    }
  },
  methods: {
    logout () {
      const user = this.onlinePlayers.find(
        (player) => player.username === this.username
      )
      this.$store.dispatch('logoutUser', { id: user.id })
      this.$router.push('/')
    },
    startNewGame () {
      this.$store.dispatch('initNewGame')
      const lastOne = this.games[this.games.length - 1]
      this.$router.push({ name: 'BoardView', params: { gameId: lastOne } })
    },
    sendInvitation (id) {
      const data = {
        id,
        message: this.username
      }
      // this.invitationInProgress = true
      this.$store.dispatch('inviteToPlay', data)
    },

    checkUserLink () {
      // this.$store.dispatch('fetchPlayers')
      for (let i = 0; i < this.onlinePlayers.length; i++) {
        if (
          this.onlinePlayers[i].username === this.username &&
          this.onlinePlayers[i].gameId
        ) {
          this.isAvailable = false
          this.provideLink = true
          this.gameId = this.onlinePlayers[i].gameId
          this.$router.push({
            name: 'BoardView',
            params: { gameId: this.onlinePlayers[i].gameId }
          })
        }
      }
    },

    checkUser () {
      for (let i = 0; i < this.onlinePlayers.length; i++) {
        if (
          this.onlinePlayers[i].username === this.username &&
          this.onlinePlayers[i].gameId
        ) {
          this.isAvailable = false
          this.$router.push({
            name: 'BoardView',
            params: { gameId: this.onlinePlayers[i].gameId }
          })
        }
      }
    },
    goToBoard () {
      for (let i = 0; i < this.onlinePlayers.length; i++) {
        if (
          this.onlinePlayers[i].username === this.username &&
          this.onlinePlayers[i].gameId
        ) {
          this.isAvailable = false
          this.$router.push({
            name: 'BoardView',
            params: { gameId: this.onlinePlayers[i].gameId }
          })
        }
      }
    },
    checkInvitations () {
      const player = this.onlinePlayers.find(
        (player) => player.username === this.username
      )

      if (player) {
        this.invitation = player.invitations
        // this.invitationInProgress = player.invitations
      }
    },

    initGame (invitation) {
      const idPlayers = []
      this.onlinePlayers.forEach((element) => {
        if (element.username === this.username) {
          idPlayers.push(element.id)
        } else if (element.username === invitation) {
          idPlayers.push(element.id)
        }
      })

      this.$store.dispatch('initNewGame', {
        player1: idPlayers[0],
        player2: idPlayers[1]
      })
    }
  },
  created () {},
  mounted () {
    this.$store.dispatch('connectOnlineUsers')
    this.$store.dispatch('connectRooms')
  }
}
</script>

<style lang="less" scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  background-color: #312e2b;
}

p {
  color: #ebecd0;
  &.title {
    font-size: 60px;
    font-weight: bold;
  }
  &.subtitle {
    font-size: 35px;
    font-weight: bold;
    color: #77a556;
    margin-right: 25px;
  }
  &.challenge-messaging {
    font-size: 20px;
    color: #ffff;
  }
  &.noplayers_message{
    padding: 10px;
    font-size: 17px;
    color: #acf777;

  }
}

.dashboard-title{
  color: #ffff;
  background: transparent;
  font-weight: bold;
  font-size: 23px;
}

.chess-rooms_container {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  background-color: #312e2b;
}
.accept-challenge {
  width: 90px;
  padding: 10px;
  background: rgb(246, 89, 32);
  color: #fff;
  font-size: 15px;
  border: none;
  border-radius: 2px;
  margin-top: 10px;
  cursor: pointer;
}
.chess-rooms_container {
  width: 80%;
  margin: 0px auto;
  padding-top: 50px;
}

.logout-rooms_container {
  width: 100%;
  padding-left: 90%;
}

.logout-icon {
  display: flex;
  align-content: center;
  justify-content: center;
  padding: 7px;
  width: 100px;
  background: #77a556;
  cursor: pointer;
  font-weight: bold;
  border-radius: 3px;
}

.online-players-container {
  width: 80%;
  margin: 40px auto;
  display: flex;
  justify-content: space-between;
  background-color: #100f0f;
  border-radius: 5px;
}
.online-players-active {
  padding: 10px;
  width: 40%;
  background: transparent;
}
.online-players-playing {
  padding: 10px;
  width: 40%;
  background: transparent;
}
table {
  padding-top: 10px;
  background-color: #100f0f;
  width: 100%;
}
tr,
td,
th {
  background-color: #100f0f;
  color: #fff;
}
tr {
  border: 1px solid #312e2b;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  margin: 5px;
}
.invite-to-play {
  color: #ffff;
  width: 120px;
  text-align: center;
  background: #7fa650;
  cursor: pointer;
  padding: 3px;
  border-radius: 2px;
}
</style>
