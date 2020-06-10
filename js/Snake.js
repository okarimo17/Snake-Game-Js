import {GamePlace,snakeBodySizePX,GameDivMaxHeight,GameDivMaxWidth,calcDistance} from './Config.js'




class SnakePart  {
  
  constructor(position){
    this.dom = document.createElement('div')
    this.dom.classList.add('part')
    this.position = position
  }

  update(position){
    this.position = position
  }

  draw(){
    let {x,y} = this.position
    this.dom.style.left = (x)+'px'
    this.dom.style.top = (y)+'px'
  }

}


export default class Snake {
  
  constructor(x,y){
    this.parts = []
    this.move  = this.position = {x:0,y:0}
    this.blocked = {x:0,y:0}
    this.head = new SnakePart(this.position);

    this.parts = [ this.head ]

    this.snake = document.createElement('div')
    this.snake.classList.add('snake')

    this.parts.map( ({dom}) => {
      this.snake.append(dom)
    })

    GamePlace.append(this.snake)

    this.input()
    let options = {
      root: this.head.dom,
      rootMargin: '0px',
      threshold: 1.0
    }



  }

  update(){
    this.changePosition()
    this.draw()
  }

  changePosition(){

    let {x,y} = this.position
    x += this.move.x * snakeBodySizePX;
    y += this.move.y * snakeBodySizePX;


    if( x>GameDivMaxHeight || y>GameDivMaxWidth || x<0  ||  y < 0  ){
      let {x:mx,y:my} = this.move
      if(Math.abs(mx) == 1 ){
        x = x - mx *(500)
      }else if (Math.abs(my) == 1){
        y = y - my *(500)
      }
    }
    this.dieOnIntersection()
    this.position = {x,y}

  }

  dieOnIntersection(callback){
    for(let i = 1;i< this.parts.length;i++){
      if( calcDistance( this.head.position , this.parts[i].position ) === 0 ){
        callback()
      }
    }
  }

  draw(){
    
    let size = this.parts.length
    for(let i=size-1;i>0;i--){
      let pos = (this.parts[i-1]).position
      this.parts[i].update(pos)
    }
    if(size>1){
      let   x =  -1*(this.position.x - this.parts[1].position.x  )/snakeBodySizePX,
            y =  -1*(this.position.y - this.parts[1].position.y  )/snakeBodySizePX;
      this.blocked = {
          x,y
      }
    }
    this.head.update(this.position)

    this.parts.map(part =>{
      part.draw()
    })
  }

  input(){
    document.onkeypress = ev=>{
      switch (ev.key){
        case ('z'):
          if(this.blocked.y != -1)
            this.move = {y:-1,x:0}
          break;
        case ('s'):
          if(this.blocked.y != 1)
            this.move = {y:1,x:0}
          break;
        case ('d'):
          if(this.blocked.x != 1)
            this.move = {y:0,x:1}
          break;
        case ('q'):
          if(this.blocked.x != -1)
            this.move = {y:0,x:-1}
          break;      
        case ('+'):
          this.grow()
          this.grow()
          this.grow()
          break;   
      }
    }
  }

  grow(){
    let {x,y} = this.position
    let pos = {
      x: x + snakeBodySizePX*this.move.x ,
      y: y + snakeBodySizePX*this.move.y ,
    }
    let newPart = new SnakePart(pos)

    this.parts.push(newPart)
    this.snake.append(newPart.dom)
  }

}