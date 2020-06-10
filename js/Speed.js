

export default function (game){

  const slider = document.getElementById("slider")

  const output = document.querySelector('.selecter-value')
  
  const defaultPercentage = window.localStorage.getItem('GameSpeed') || 50
  
  slider.value = defaultPercentage;
  output.innerText = defaultPercentage;
  
  document.querySelector('.back-menu').addEventListener('click',()=>{
    document.querySelector('.speed-selecter').classList.remove('show')
  })
  
  slider.oninput = function() {
    output.innerText = this.value;
    let speed = (this.value <= 100 && this.value>0) ? this.value : 50 ;
    window.localStorage.setItem('GameSpeed',speed)
    game.setFrames()
  }

}