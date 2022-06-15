import { createStore } from 'vuex';
import { getFirestore, collection, onSnapshot, query, addDoc, doc, updateDoc, deleteDoc, writeBatch, getDoc, getDocs, setDoc } from 'firebase/firestore'


import db from '@/services/firebase'

import {initialPos}  from '../helpers/placingPieces';

//const db = getFirestore(app)

export default createStore({

  state:{
    squares:[],
    pieces:[],
    isloaded: false
  },

  mutations:{

    drawBoard( state ){
      console.log('board called')
      let count = 0;
      for( let i =0; i<8; i++){
        for ( let j =0; j<8; j++){

          let color = 'w';
          let properties = {}

          if ( (i+j) % 2 === 0){
            color= 'w'
          } else{
            color='b'
          }

          properties = {
            id: count,
            posX: i,
            posY: j,
            color,            
          }

          state.squares.push( properties )
          //this.storePositions( properties );
          count++
        }
      }
      console.log(state.squares)      
    },

    initialPosition( state ){
      console.log('called')
      let countId = 0;
      
      console.log("initial", state.squares.length)
          
      if ( state.squares.length > 0 ){
        console.log('si')
        state.squares.forEach( s => {
          let piece = initialPos( s, countId )
          if ( piece ){
            countId++           
            state.pieces.push( piece ) 
          }     
        })
      }
      console.log( state.pieces )
      console.log( state.pieces )
    },
    

    restartPieces( state ){
      state.pieces = []
    },

    getPieces( state, data ){
      
      state.pieces = [...state.pieces, data]
      if ( state.pieces.length === 32 ) state.isloaded = true
      //state.pieces.push(data)
      //console.log( state.pieces )
    },

    updatePositions( state, data ){
        state.pieces = state.pieces.map( p => {
          if ( p.id === Number(data.id)) return data 
          return p 
        })
    }



  },

  actions:{

    async connect2({ commit, state, dispatch}){
      const q = query(collection(db, "positions"));
      onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
              commit("getPieces", change.doc.data())             
          }
          if (change.type === "modified") {
            console.log("modified", change.doc.data())
            commit("updatePositions", change.doc.data())
            
          }
          if (change.type === "removed") {
             
          }
        });
      });

    }, 
    

    async updatePieces({ commit, state, dispatch}, data){
      let [ newX, newY, pieceId ] = data
      
      let piece = state.pieces.find( p => p.id === pieceId)

      piece.posX = newX,
      piece.posY = newY     
      
      await updateDoc(doc(db, 'positions', String(pieceId)), piece)
      
    },
    

    async fetchPieces({ commit, state, dispatch }){

      const docRef = doc(db, "positions", "0");
      const docSnap = await getDoc(docRef);
      const positionsRef = collection(db,'positions')
      
      if ( docSnap.exists() ){
        console.log('the document already exists!')
        commit('drawBoard')
        commit('restartPieces')
        //await dispatch('connect')    

      } else{
        commit('drawBoard')
        commit('initialPosition')
        state.pieces.forEach( async p => {          
          await setDoc(doc(positionsRef, String(p.id)),{...p})
        })
        console.log("created")
      }
    }

  }


})