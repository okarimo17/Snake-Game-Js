export const GamePlace = document.getElementById('game')
//const padding = 0;
export const snakeBodySizePX = 25; // High==Width of the Snake parts 
export const GameDivMaxHeight = 500 - snakeBodySizePX;  //heigh of the game board it have to equal the width
export const GameDivMaxWidth  = 500 - snakeBodySizePX;  //heigh of the game board it have to equal the width
// 10 <= val <= 25
/*
const SpeedPercentage = window.localStorage.getItem('GameSpeed')/100 || 0.5
const Frames = 10 + ( SpeedPercentage * (25-10) );
console.log(Frames)
*/

export const minFrames       = 10;
export const maxFrames       = 30;


export function calcDistance(p1,p2){
  
  let {x:x1,y:y1} = p1;
  let {x:x2,y:y2} = p2;
  
  let a = x1 - x2;
  let b = y1 - y2;
  let distance = Math.sqrt( a*a + b*b );
  return distance;
}

