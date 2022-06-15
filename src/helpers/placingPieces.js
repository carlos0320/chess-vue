

export const initialPos = ( s, countId ) => {

  

  // placing rooks 
  if ( (s.posX === 7 && s.posY === 0) || (s.posX === 7 && s.posY=== 7)){
    return{
      id: countId,
      type:'rook',
      color:'w',
      posX: s.posX,
      posY: s.posY
    }
  }
  

  if ( (s.posX === 0 && s.posY === 0) || (s.posX === 0 && s.posY=== 7)){
    return {
      id: countId,
      type:'rook',
      color:'b',
      posX: s.posX,
      posY: s.posY
      
    }
  } 

  // placing knights
  if ( (s.posX === 0 && s.posY === 1) || (s.posX === 0 && s.posY === 6)){
     return {
      id: countId,
      type:'knight',
      color:'b',
      posX: s.posX,
      posY: s.posY      
    }
  }

  if ( (s.posX === 7 && s.posY === 1) || (s.posX === 7 && s.posY === 6)){
     return {
      id: countId,
      type:'knight',
      color:'w',
      posX: s.posX,
      posY: s.posY
      
    }
  }

  // placing bishops
  if ( (s.posX === 0 && s.posY === 2) || (s.posX === 0 && s.posY === 5)){
     return {
      id: countId,
      type:'bishop',
      color:'b',
      posX: s.posX,
      posY: s.posY
      
    }
  }

  if ( (s.posX === 7 && s.posY === 2) || (s.posX === 7 && s.posY === 5)){
     return {
      id: countId,
      type:'bishop',
      color:'w',
      posX: s.posX,
      posY: s.posY
      
    }
  }

  // placing kings
  if ( (s.posX === 0 && s.posY === 4)){
     return {
      id: countId,
      type:'king',
      color:'b',
      posX: s.posX,
      posY: s.posY
     
    }
  }

  if ( (s.posX === 7 && s.posY === 4)){
     return {
      id: countId,
      type:'king',
      color:'w',
      posX: s.posX,
      posY: s.posY
     
    }
  }

  // placing queens
  if ( (s.posX === 0 && s.posY === 3)){
     return {
      id: countId,
      type:'queen',
      color:'b',
      posX: s.posX,
      posY: s.posY
      
    }
  }

  if ( (s.posX === 7 && s.posY === 3)){
     return {
      id: countId,
      type:'queen',
      color:'w',
      posX: s.posX,
      posY: s.posY
   
    }
  }

  if ( s.posX === 1){
    return{
      id: countId,
      type: 'pawn',
      color:'b',
      posX: s.posX,
      posY: s.posY
                
    }
   
  }
  if ( s.posX === 6){
    return {
      id: countId,
      type: 'pawn',
      color:'w',
      posX: s.posX,
      posY: s.posY
         
    }
    
  }

  return undefined

}

