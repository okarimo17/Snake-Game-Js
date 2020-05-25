const GamePlace = document.getElementById('game')
const padding = 0;
const snakeBodySizePX = 25;
const GameDivMaxHeight = 500 - snakeBodySizePX;
const GameDivMaxWidth  = 500 - snakeBodySizePX;
const FramesPerSecond = 20;


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


class Snake {
  
  constructor(x,y){
    this.parts = []
    this.move  = this.position = {x:0,y:0}
    this.blocked = {x:0,y:0}
    this.head = new SnakePart(this.position);

    this.parts = [ this.head ]

    this.snake= document.createElement('div')
    this.snake.classList.add('snake')

    this.parts.map( ({dom}) => {
      this.snake.append(dom)
    })

    GamePlace.append(this.snake)

    this.input()

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

    this.position = {x,y}

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

class Food {
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


function calcDistance(p1,p2){
  
  let {x:x1,y:y1} = p1;
  let {x:x2,y:y2} = p2;
  
  let a = x1 - x2;
  let b = y1 - y2;
  let distance = Math.sqrt( a*a + b*b );
  return distance;
}



class Game {

  constructor(){
    this.MenuButtons = [
      {btnText:"New Game",className:"new-game",btnAction:(ev)=>{ this.initNewGame()}},
      {btnText:"High Scores",className:"high-scores",btnAction:(ev)=>{ console.log('high scores') } }
    ]
    this.initMainMenu()
    
  }
  setScore(val){
    this.score = val
    if(this.scoreDom){
      this.scoreDom.innerText = val
    }
  }
  increaseScore(inc){
    this.setScore(this.score + inc)
  }

  initMainMenu(){
    this.stopLoop();
    GamePlace.innerHTML = ""
    //this.setGameStateBar()
    if(!this.menu){
      let menu = document.createElement("div")
      menu.classList.add('main-menu')
      this.MenuButtons.map(btn =>{
        let btnDom = document.createElement("div")
        let btnText = document.createTextNode(btn.btnText)
        btnDom.classList.add("btn")
        btnDom.classList.add(btn.className)
        btnDom.append(btnText)
        btnDom.addEventListener("click",btn.btnAction)
        menu.append(btnDom)
      })
      this.menu = menu;
    }
    GamePlace.append(this.menu)
  }

  
  initNewGame(){
    GamePlace.innerHTML = ""
    this.setGameStateBar() ;
    this.setScore(0)
    this.snake = new Snake(0,0)
    this.food = new Food(this.snake);
    this.food.increaseScore = (inc) => this.increaseScore(inc)
    requestAnimationFrame(
      this.update.bind(this)
    )
  }

  restartGame(){
    this.stopLoop();
    GamePlace.innerHTML = ""
    this.setGameStateBar() ;
    this.setScore(0)
    this.snake = new Snake(0,0)
    this.food = new Food(this.snake);
    this.food.increaseScore = (inc) => this.increaseScore(inc)
    requestAnimationFrame(
      this.update.bind(this)
    )
  }

  setGameStateBar(){

    if(!this.gameStates){
      let buttons = [ {btntext:"R",class:"restart",btnAction:()=>{this.restartGame()}},
                      {btntext:"X",class:"leave",btnAction:()=>{this.initMainMenu()}}
                    ]

      let gameSt = document.createElement("div")
      gameSt.classList.add("game-stats")
      gameSt.innerHTML = `<div class="part"><div class="score">score : <span id="score">0</span></div></div>`

      let part = document.createElement("div")
      part.classList.add("part")

      buttons.map(btn =>{
        let btndom = document.createElement("div")
        btndom.classList.add("btn")
        btndom.classList.add(btn.class)
        let txt = document.createTextNode(btn.btntext)
        btndom.append(txt)
        btndom.addEventListener("click",btn.btnAction )
        part.append(btndom)
      })
      gameSt.append(part)

      this.gameStates = gameSt;
    }
    GamePlace.append(this.gameStates);
    this.scoreDom = document.getElementById("score")
  }

  update(){
    console.log('Updateing')
    this.snake.update()
    this.food.update()
    clearTimeout(this.timout)
    this.timout = setTimeout(()=>{
      requestAnimationFrame(
        this.update.bind(this)
      )
    },1000/FramesPerSecond)
  
  
  }


  stopLoop(){
    clearTimeout(this.timout)
  }

}

let game = new Game()

