import { createStore } from 'vuex';
import { collection, onSnapshot, query, doc, updateDoc, deleteDoc, writeBatch, Timestamp,getDocs } from 'firebase/firestore'

import db from '@/services/firebase'

import initialPositions from '../helpers/initialPositions.json';
let unsubscribe

//const db = getFirestore(app)

export default createStore({

  state:{
    onlinePlayers:[],
    games:[],
    gameId: null,
    pieces:[]
  },

  mutations:{

    // onlinePlayers( state )

    activeGames( state, gameId ){
      if ( state.games.length > 0 ){
        console.log('games',gameId)
        let game = state.games.find( game => game === gameId )
        if ( !game ){
          state.games.push( gameId )
        }else{
          return
        }
      }else{
        state.games.push( gameId )
      }
    },

    startGame( state, gameId ){
      state.pieces = []
      state.gameId = gameId
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
    }
  },

  actions:{
    async fetchGame({ commit, dispatch}, idGame){
      commit('startGame', idGame)
      dispatch('connect')
    },
    async initNewGame( {commit, dispatch} ){
      const batch = writeBatch(db)
      const gameRef = doc(collection(db, 'games'))
      batch.set(gameRef, {
       date: Timestamp.now()
      })

     const pieces = JSON.parse(JSON.stringify(initialPositions))
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
    },

    async connectOnlineUsers({ commit, state, dispatch }){

      if (unsubscribe) {
        unsubscribe()
      }

      const q = query(collection(db, "players", state.gameId, 'pieces'));
      unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const data = change.doc.data()
          data.id = change.doc.id
          if (change.type === "added") {
            console.log( change.doc.data())
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
            console.log( change.doc.data())
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

    async saveUser({ state }, user ){
      console.log( 'called' )
      const batch = writeBatch(db)
      const gameRef = doc(collection(db, 'players', 'P7fvewsEb8HVtkm6lDk0', 'online'))
      batch.set(gameRef, {
       date: Timestamp.now()
      })

      const playerRef = doc(collection(gameRef, 'player'))
      batch.set(gameRef, user )

      await batch.commit()     
      state.onlinePlayers.push( user )
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

    }
  }
})
