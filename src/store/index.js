import { createStore } from 'vuex';
import { collection, onSnapshot, query, doc, updateDoc, deleteDoc, writeBatch, Timestamp } from 'firebase/firestore'

import db from '@/services/firebase'

import initialPositions from '../helpers/initialPositions.json';
let unsubscribe

//const db = getFirestore(app)

export default createStore({

  state:{
    gameId: null,
    pieces:[]
  },

  mutations:{
    startGame( state, gameId ){
      state.pieces = []
      state.gameId = gameId
    },

    upsertPiece( state, { id, xpos, ypos, type, color } ){
      const piece = state.pieces.find(item => item.id === id)
      if (!piece) {
        state.pieces.push({ id, xpos, ypos, type, color })
      } else {
        piece.id = id 
        piece.xpos = xpos 
        piece.ypos = ypos 
        piece.type = type 
        piece.color = color 
      }
    },

    deletePiece(state, { id }) {
      const piece = state.pieces.find(item => item.id === id)
      if (!piece) return
      state.pieces.splice(state.pieces.indexOf(piece), 1)
    }
  },

  actions:{
    async initNewGame( {commit, dispatch} ){
      // const batch = writeBatch(db)
      // const gameRef = doc(collection(db, 'games'))
      // batch.set(gameRef, {
      //   date: Timestamp.now()
      // })

      // const pieces = JSON.parse(JSON.stringify(initialPositions))
      // for (let data of pieces) {
      //   const pieceRef = doc(collection(gameRef, 'pieces'))
      //   batch.set(pieceRef, data)
      // }

      // await batch.commit()

      // commit('startGame', gameRef.id)
      commit('startGame', 'KUAFwu4jIn6bKgu2NdhC')
      dispatch('connect')
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
    
    async movePiece({ state }, {id, xpos, ypos}){ 
      await updateDoc(doc(db, 'games', state.gameId, 'pieces', String(id)), {
        xpos,
        ypos
      }, { merge: true })
    }
  }
})
