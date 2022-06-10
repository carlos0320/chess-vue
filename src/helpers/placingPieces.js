

export const initialPos = ( s, countId ) => {

  

  // placing rooks 
  if ( (s.posX === 7 && s.posY === 0) || (s.posX === 7 && s.posY=== 7)){
    return{
      id: countId,
      type:'rook',
      color:'w'
    }
  }
  

  if ( (s.posX === 0 && s.posY === 0) || (s.posX === 0 && s.posY=== 7)){
    return {
      id: countId,
      type:'rook',
      color:'b'
    }
  } 

  // placing knights
  if ( (s.posX === 0 && s.posY === 1) || (s.posX === 0 && s.posY === 6)){
     return {
      id: countId,
      type:'knight',
      color:'b'
    }
  }

  if ( (s.posX === 7 && s.posY === 1) || (s.posX === 7 && s.posY === 6)){
     return {
      id: countId,
      type:'knight',
      color:'w'
    }
  }

  // placing bishops
  if ( (s.posX === 0 && s.posY === 2) || (s.posX === 0 && s.posY === 5)){
     return {
      id: countId,
      type:'bishop',
      color:'b'
    }
  }

  if ( (s.posX === 7 && s.posY === 2) || (s.posX === 7 && s.posY === 5)){
     return {
      id: countId,
      type:'bishop',
      color:'w'
    }
  }

  // placing kings
  if ( (s.posX === 0 && s.posY === 4)){
     return {
      id: countId,
      type:'king',
      color:'b'
    }
  }

  if ( (s.posX === 7 && s.posY === 4)){
     return {
      id: countId,
      type:'king',
      color:'w'
    }
  }

  // placing queens
  if ( (s.posX === 0 && s.posY === 3)){
     return {
      id: countId,
      type:'queen',
      color:'b'
    }
  }

  if ( (s.posX === 7 && s.posY === 3)){
     return {
      id: countId,
      type:'queen',
      color:'w'
    }
  }

  if ( s.posX === 1){
    return{
      id: countId,
      type: 'pawn',
      color:'b'            
    }
    countId++;
  }
  if ( s.posX === 6){
    return {
      id: countId,
      type: 'pawn',
      color:'w'            
    }
    countId++
  }

  return undefined

}

