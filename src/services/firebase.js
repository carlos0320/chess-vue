//import { initializeApp } from "firebase/app"
import { initializeApp } from 'firebase/app'
import "firebase/firestore"
import { getFirestore, collection } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANvi0RigIV4412BIIDgfzgxCUQJGRYYGQ",
  authDomain: "chess-game-vue.firebaseapp.com",
  projectId: "chess-game-vue",
  storageBucket: "chess-game-vue.appspot.com",
  messagingSenderId: "769272546869",
  appId: "1:769272546869:web:220f5bd49a08cd0d17137c"
};
const firebaseApp = initializeApp(firebaseConfig)

console.log('firebase', firebaseApp)

const db = getFirestore( firebaseApp )

export default db