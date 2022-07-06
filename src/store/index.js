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
    //registeredPlayers:[],
    games:[],
    gameId: null,
    pieces:[],
    
    //user: null
  },

  mutations:{

    // setUser(state, payload) {
    //   // state.user = payload
    //   // //Log out the user state
    //   // console.log(state.user)
    //   state.user = payload;
    //   state.registeredPlayers.push( state.user )
    //   console.log( state.user )
    // },

    // onlinePlayers( state )

    setPlayers( state, { gameId, player1, player2 } ){
      state.games.push({
        gameId,
        player1,
        player2
      })
    },


    activeGames( state, gameId ){
      if ( state.games.length > 0 ){
        console.log('games',gameId)
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
      console.log("ID GAME", gameId)
      state.pieces = []
      state.gameId = gameId
    },

    startPlayers( state ){
      state.onlinePlayers = []
    },

    upsertPlayer( state, { id, username, isPlaying, invitations, gameId }){
      console.log('UPSERTING', username)
      const player = state.onlinePlayers.find( player => player.id === id )

      if (!player){
        state.onlinePlayers.push({id, username, isPlaying, invitations, gameId })
      }else{
        player.username = username
        player.isPlaying = isPlaying
        player.invitations = invitations
        player.gameId = gameId
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
      console.log("deleting...")
      if (!piece) return
      state.pieces.splice(state.pieces.indexOf(piece), 1)
    },

    // finishUserGame( state,{gameId}){
    //   state.onlinePlayers = state.onlinePlayers.map( player => {
    //     if ( player.gameId === gameId ){
    //       return{
    //         ...player,
    //         gameId: null,
    //         isPlaying: false
    //       }
    //     }else{
    //       return player
    //     }
    //   })
    //   state.onlinePlayers.forEach( player => {
    //     if ( player.gameId === gameId ){

    //     }
    //   })
    // }
  },

  actions:{

    // sign up action
    // async signup({ commit }, { email, password }){
    //   const response = await createUserWithEmailAndPassword(auth, email, password)
    //   if (response) {
    //       commit('setUser', response.user)
    //   } else {
    //       throw new Error('signup failed')
    //   }
    //  },

    // FINISH GAME
    async finishUserGame({ commit, dispatch }, {id1,id2 } ){
      //console.log("deleting usergame", id1,id2 )
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

    async fetchPlayers({ commit, dispatch}){
      commit('updatePlayers')
      commit('startPlayers')
      dispatch('connectOnlineUsers')
    },


    async fetchGame({ commit, dispatch}, idGame){
      console.log('CAAALEEED')
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
    //  let players = {
    //   player1,
    //   player2
    //  }

    //  let playersGame = doc(collection(gameRef, 'players'))

    //  batch.set(playersGame, players)

     //console.log( pieces )
     for (let data of pieces) {
       const pieceRef = doc(collection(gameRef, 'pieces'))
       //console.log( pieceRef )
       batch.set(pieceRef, data)
     }

     await batch.commit()
     console.log( gameRef.id )

     commit('startGame', gameRef.id)
     commit('activeGames', gameRef.id)
     
     // commit('startGame', idGame)
     dispatch('connect')
     dispatch('updateUserGame',{id1:player1, id2:player2, gameId: gameRef.id})
     dispatch('connectOnlineUsers')
    //  commit('setPlayers',{ gameId: gameRef.id, player1,player2})
    //  //commit('activeGames', gameRef.id)
    //   // commit('startGame', idGame)
    //   dispatch('connect')
    },

    async connectOnlineUsers({ commit, state, dispatch }){

      // if (unsubscribe) {
      //   unsubscribe()
      // }

      const q = query(collection(db, "players", 'P7fvewsEb8HVtkm6lDk0', 'online'));
      unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const data = change.doc.data()
          data.id = change.doc.id
          if (change.type === "added") {
            console.log( change.doc.data())
            commit("upsertPlayer", data)             
          }
          if (change.type === "modified") {
            console.log(change.doc.data())
            commit("upsertPlayer", data)
          }
          if (change.type === "removed") {
            
          }
        });
      });

    },
    async getUsersConnected({ commit, state, dispatch }){
      const playersRef = doc(collection(db, 'players'))
            // Retrieve new posts as they are added to our database
      // Attach an asynchronous callback to read the data at our posts reference
      playersRef.on('value', (snapshot) => {
        console.log(snapshot.val());
      }, (errorObject) => {
        console.log('The read failed: ' + errorObject.name);
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
            console.log('UOOOPPSERTING')
            commit("upsertPiece", data)             
          }
          if (change.type === "modified") {
            commit("upsertPiece", data)
          }
          if (change.type === "removed") {
            commit("deletePiece", data)
            console.log('deleting...')
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
      //console.log('called', id1)
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
      console.log('called', id)
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
      console.log(id)
      console.log("called")
      
      await updateDoc(doc(db,'games', state.gameId, 'pieces', String(id)),{
        status: false
      },{ merge: true })
    },

    async saveUser({ state, dispatch, commit }, user ){
      console.log( 'called' )
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
    
    // async getOnlineUsers({ state, commit }){
    //   try {
    //     const querySnapshot = await getDocs(collection(db, "players"));
    //     querySnapshot.forEach((doc) => {
    //       // doc.data() is never undefined for query doc snapshots
    //       // console.log(doc.id, " => ", doc.data());

    //       // if ( state.games.length > 0 ){
    //       //   console.log( state.games )
    //       //   // state.games.forEach( game => {
    //       //   //   if ( game != doc.id){
    //       //   //     commit('activeGames', doc.id)
    //       //   //   }
    //       //   // })
    //       // }
    //       commit('activeGames', doc.id)
        
    //   } catch (error) {
        
    //   }
    // }

    async getPlayersGame({ state, commit }){
      console.log('hello')
      try {
        const querySnapshot = await getDocs(collection(db,'games','hCpVk86Kuv55blgCeVcB','pieces'));
        console.log('snapshot', querySnapshot )
        querySnapshot.forEach((doc) =>{
          console.log('players', doc.data())
        })
      } catch (error) {
        console.log( error )
      }
    },

    async getGames({ state, commit }){
      try {
        const querySnapshot = await getDocs(collection(db, "games"));
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());

          // if ( state.games.length > 0 ){
          //   console.log( state.games )
          //   // state.games.forEach( game => {
          //   //   if ( game != doc.id){
          //   //     commit('activeGames', doc.id)
          //   //   }
          //   // })
          // }
          commit('activeGames', doc.id)
        });
        
      } catch (error) {
        
      }

    },
    async deleteGame({ state, commit }, idGame){
      console.log( 'deleting',doc(db,"games", idGame))
      await deleteDoc(doc(db,"games", idGame))
    }
  }
})
