import {GamePlace,snakeBodySizePX,GameDivMaxHeight,calcDistance} from './Config.js'


export default class Food {
  constructor(snake){
    this.snake = snake
    this.dom = document.createElement('div')
    this.dom.classList.add('food')
    this.position = {};
    this.getRandomPos()
    this.draw()
  }

  draw(){
    let {x,y} = this.position
    GamePlace.append(this.dom)
    this.dom.style.top = y+'px'
    this.dom.style.left = x+'px'   
  }

  redraw(){
    this.dom.style.display = 'none'
    this.getRandomPos()
    this.dom.style.display = 'inline-block'
    this.draw()
  }

  update(){
    let distance = calcDistance(this.position,this.snake.position )
    if(  distance < 25 ){
      this.redraw()
      this.snake.grow()
      this.increaseScore(1)
    }
  }

  getRandomPos(){
    let positionAlreadyFilled = false 
    let MaxPos = GameDivMaxHeight/snakeBodySizePX;
    let randX;
    let randY;
    do {
      randX = Math.floor(  Math.random()* MaxPos ) * snakeBodySizePX
      randY = Math.floor(  Math.random()* MaxPos ) * snakeBodySizePX

      positionAlreadyFilled = this.snake.parts.some(({position} )=>
        (position.x == randX && position.y == randY) 
      )

    }while(positionAlreadyFilled)
    this.position = {x:randX,y:randY}
  }

}
