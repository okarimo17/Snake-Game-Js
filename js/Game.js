import {GamePlace,FramesPerSecond} from './Config.js'


import Snake from './Snake.js'
import Food from './Food.js'


export default class Game {

  constructor(){
    this.MenuButtons = [
      {btnText:"New Game",className:"new-game",btnAction:(ev)=>{ this.initNewGame()}},
      {btnText:"High Scores",className:"high-scores",btnAction:(ev)=>{ alert(`High Score : ${window.localStorage.getItem('HighScore')}`) } }
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
      let buttons = [ {btntext:"&#x27F3;",class:"restart",btnAction:()=>{this.restartGame()}},
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
        //let txt = document.createTextNode(btn.btntext)
        let txt = document.createElement('p')
        txt.innerHTML = btn.btntext;
      
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
    this.snake.update()
    this.food.update()
    clearTimeout(this.timout)

    this.timout = setTimeout(()=>{
      requestAnimationFrame(
        this.update.bind(this)
      )
    },1000/FramesPerSecond)

    this.snake.dieOnIntersection(()=> this.endGame())
  
  }

  endGame(){
    this.stopLoop()
    this.snake.snake.classList.add('dead')
    let oldHighScore = window.localStorage.getItem('HighScore')

    if(oldHighScore && oldHighScore<this.score){
      window.localStorage.setItem('HighScore',this.score)
    }else if (!oldHighScore) {
      window.localStorage.setItem('HighScore',this.score)
    }

  }

  stopLoop(){
    clearTimeout(this.timout)
  }

}
