import { createStore } from 'vuex';
import { collection, onSnapshot, query, doc, updateDoc, deleteDoc, writeBatch, Timestamp,getDocs, FieldValue } from 'firebase/firestore'

import { auth, db } from '@/services/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'

import initialPositions from '../helpers/initialPositions.json';
let unsubscribe

//const db = getFirestore(app)

export default createStore({

  state:{
    onlinePlayers:[],    
    games:[],
    gameId: null,
    pieces:[],
    rooms:[]   
  },

  mutations:{

    removeRoom( state, { gameId }){
      state.rooms = state.rooms.filter( room => room.gameId !== gameId) 
    },

    setPlayers( state, { gameId, player1, player2 } ){
      state.games.push({
        gameId,
        player1,
        player2
      })
    },


    activeGames( state, gameId ){
      if ( state.games.length > 0 ){        
        let game = state.games.find( game => game.id === gameId )
        if ( !game ){
          state.games.push( gameId )
        }else{
          return
        }
      }else{
        state.games.push( gameId )
      }
    },

    updatePlayers( state ){
      state.onlinePlayers = []
    },

    startGame( state, gameId ){      
      state.pieces = []
      state.gameId = gameId
    },

    startPlayers( state ){
      state.onlinePlayers = []
    },

    startRooms( state ){
      state.rooms = []
    },

    upsertPlayer( state, { id, username, isPlaying, invitations, gameId, status }){
      
      const player = state.onlinePlayers.find( player => player.id === id )
      if (!player){
        state.onlinePlayers.push({id, username, isPlaying, invitations, gameId, status })
      }else{
        player.username = username
        player.isPlaying = isPlaying
        player.invitations = invitations
        player.gameId = gameId
        player.status = status
        state.onlinePlayers = state.onlinePlayers.map( item => {
          if ( item.id === id ){
            return {
              id: item.id,
              ...player
            } 
          }else{
            return item
          }
        })        
      }
    },

    upsertRoom(state, { id, gameId, black, white, userB, userW, status }){
      
      let userBlack = state.onlinePlayers.find( player => player.id === black)
      let userWhite = state.onlinePlayers.find( player => player.id === white)

      const roomsPlaying = state.rooms.find( room => room.gameId === gameId )
      
      if (!roomsPlaying){
        state.rooms.push({
          id,
          gameId,
          black,
          white,
          userB : userBlack.username,
          userW: userWhite.username,
          status
        })
      }else{
        roomsPlaying.gameId = gameId
        roomsPlaying.black = black
        roomsPlaying.white = white
        roomsPlaying.userB = userBlack.username
        roomsPlaying.userW = userWhite.username
        roomsPlaying.status = status
        
        state.rooms = state.rooms.map( item => {
          if ( item.gameId === gameId ){
            return {
              id,
              ...roomsPlaying
            } 
          }else{
            return item
          }
        })        
      }
    },

    upsertPiece( state, { id, xpos, ypos, type, color, status } ){
      const piece = state.pieces.find(item => item.id === id)
      
      if (!piece) {
        state.pieces.push({ id, xpos, ypos, type, color,status })
      } else {
        piece.id = id 
        piece.xpos = xpos 
        piece.ypos = ypos 
        piece.type = type 
        piece.color = color,
        piece.status = status 
      }
    },

    deletePiece(state, { id }) {
      const piece = state.pieces.find(item => item.id === id)
      
      if (!piece) return
      state.pieces.splice(state.pieces.indexOf(piece), 1)
    },
    
  },

  actions:{

    // FINISH GAME
    async finishUserGame({ commit, dispatch }, {id1,id2 } ){
      
      await updateDoc(doc(db,"players", 'P7fvewsEb8HVtkm6lDk0', 'online', String(id1)),{
        gameId: null,
        isPlaying: false,
        invitations: null
      }, { merge: true })
      dispatch('connectOnlineUsers')
      await updateDoc(doc(db,"players", 'P7fvewsEb8HVtkm6lDk0', 'online', String(id2)),{
        gameId: null,
        isPlaying: false,
        invitations: null
      }, { merge: true })      
    },

    async removingUsersPlaying({ commit, dispatch }, { id }){
      
      await updateDoc(doc(db,"rooms", 'vkuR1EmCBLWTOZw07arF', 'online', String(id)),{        
        status: false
      }, { merge: true })
    },

    async logoutUser({ commit, dispatch }, { id }){
      
      await updateDoc(doc(db,"players", 'P7fvewsEb8HVtkm6lDk0', 'online', String(id)),{        
        status: false
      }, { merge: true })
      dispatch('connectOnlineUsers')
    },

    async creatingRoom({ commit, dispatch }, room){
      
      const batch = writeBatch(db)
      const gameRef = doc(collection(db, 'rooms', 'vkuR1EmCBLWTOZw07arF', 'online'))
      batch.set(gameRef, {
       date: Timestamp.now()
      })

      batch.set(gameRef, room )

      await batch.commit()
      commit('startRooms')
      dispatch('connectRooms') 
    },

    async fetchPlayers({ commit, dispatch}){
      commit('updatePlayers')
      commit('startPlayers')
      dispatch('connectOnlineUsers')
    },

    async fetchGame({ commit, dispatch}, idGame){
      
      commit('startGame', idGame)
      dispatch('connect')
    },

    async finishGame({ commit, dispatch }, { id1, id2 }){
      dispatch('finishUserGame', { id1, id2 })
      dispatch('connectOnlineUsers')
    },
    

    async initNewGame( {commit, dispatch}, { player1, player2 } ){
      const batch = writeBatch(db)
      const gameRef = doc(collection(db, 'games'))
      batch.set(gameRef, {
       date: Timestamp.now()
      })

     const pieces = JSON.parse(JSON.stringify(initialPositions))
   
     for (let data of pieces) {
       const pieceRef = doc(collection(gameRef, 'pieces'))
       
       batch.set(pieceRef, data)
     }

     await batch.commit()
    

     commit('startGame', gameRef.id)
     commit('activeGames', gameRef.id)
     
     // commit('startGame', idGame)
     dispatch('connect')
     //commit('setRoom',{ gameId: gameRef.id, player1, player2})
     dispatch('updateUserGame',{id1:player1, id2:player2, gameId: gameRef.id})
     
     let randomNumber = Math.random()
      let black = ''
      let white = ''
      let room ={}
      let userB = null
      let userW = null
      

      if ( randomNumber <= 0.5 ){
        black = player1
        white = player2
      }else{
        black = player2
        white = player1        
      }

      room = {
        id: (new Date().getTime()).toString(36),
        gameId: gameRef.id,
        black,
        white,
        userB,
        userW,
        status: true
      }      
      dispatch('creatingRoom', room)
      dispatch('connectOnlineUsers')
   
    },

    async connectOnlineUsers({ commit, state, dispatch }){

      const q = query(collection(db, "players", 'P7fvewsEb8HVtkm6lDk0', 'online'));
      unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const data = change.doc.data()
          data.id = change.doc.id
          if (change.type === "added") {
            
            commit("upsertPlayer", data)             
          }
          if (change.type === "modified") {
            
            commit("upsertPlayer", data)
          }
          if (change.type === "removed") {
            
          }
        });
      });

    },

    async connectRooms({ commit, state, dispatch }){
      const q = query(collection(db, "rooms", 'vkuR1EmCBLWTOZw07arF', 'online'));
      unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const data = change.doc.data()
          data.id = change.doc.id
          if (change.type === "added") {
            
            commit("upsertRoom", data)             
          }
          if (change.type === "modified") {
            commit("upsertRoom", data)
          }
          if (change.type === "removed") {
            //commit("deletePiece", data)
            
          }
        });
      });
    },

    async getUsersConnected({ commit, state, dispatch }){
      const playersRef = doc(collection(db, 'players'))
     
      playersRef.on('value', (snapshot) => {
        
      }, (errorObject) => {
        
      }); 
    },


    async connect({ commit, state, dispatch}){
      if (unsubscribe) {
        unsubscribe()
      }

      const q = query(collection(db, "games", state.gameId, 'pieces'));
      unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const data = change.doc.data()
          data.id = change.doc.id
          if (change.type === "added") {
            
            commit("upsertPiece", data)             
          }
          if (change.type === "modified") {
            commit("upsertPiece", data)
          }
          if (change.type === "removed") {
            commit("deletePiece", data)
            
          }
        });
      });
    },
    
    async inviteToPlay({ state }, { id, message }){
      await updateDoc(doc(db,"players", 'P7fvewsEb8HVtkm6lDk0', 'online', String(id)),{
        invitations: message
      }, { merge: true })
    },

    async updateUserGame({ state, dispatch}, { id1,id2, gameId }){
      
      await updateDoc(doc(db,"players", 'P7fvewsEb8HVtkm6lDk0', 'online', String(id1)),{
        gameId,
        isPlaying:true,        
      }, { merge: true })
      await updateDoc(doc(db,"players", 'P7fvewsEb8HVtkm6lDk0', 'online', String(id2)),{
        gameId,
        isPlaying:true,        
      }, { merge: true })
      //dispatch('connectOnlineUsers')
    },

    async goToPlay({state, dispatch}, { id }){
      
      await updateDoc(doc(db,"players", 'P7fvewsEb8HVtkm6lDk0', 'online', String(id)),{
        isPlaying: true
      }, { merge: true })
      dispatch('connectOnlineUsers')
    },
    
    async movePiece({ state }, {id, xpos, ypos}){ 
      await updateDoc(doc(db, 'games', state.gameId, 'pieces', String(id)), {
        xpos,
        ypos
      }, { merge: true })
    },

    async removePiece({ state }, { id }){
      
      
      await updateDoc(doc(db,'games', state.gameId, 'pieces', String(id)),{
        status: false
      },{ merge: true })
    },

    async saveUser({ state, dispatch, commit }, user ){
      
      const batch = writeBatch(db)
      const gameRef = doc(collection(db, 'players', 'P7fvewsEb8HVtkm6lDk0', 'online'))
      batch.set(gameRef, {
       date: Timestamp.now()
      })

      batch.set(gameRef, user )

      await batch.commit()
      commit('startPlayers')
      dispatch('connectOnlineUsers')      
    },   

    async getPlayersGame({ state, commit }){     
      try {
        const querySnapshot = await getDocs(collection(db,'games','hCpVk86Kuv55blgCeVcB','pieces'));        
        querySnapshot.forEach((doc) =>{
          
        })
      } catch (error) {
        console.log( error )
      }
    },

    async getGames({ state, commit }){
      try {
        const querySnapshot = await getDocs(collection(db, "games"));
        querySnapshot.forEach((doc) => {
          
          commit('activeGames', doc.id)
        });
        
      } catch (error) {
        console.log( error )
      }

    },
    async deleteGame({ state, commit }, idGame){      
      await deleteDoc(doc(db,"games", idGame))
    }
  }
})
