import './adapter/index'
import Game from '@/core/Game'
import Home from '@/scene/home/home'
import Login from '@/scene/login/login'

Game.addGameScene('Home', Home)
Game.addGameScene('Login', Login)
Game.goGameScene('Home')

// setTimeout(() => {
//   console.log('Login')
//   Game.goGameScene('Login')
// }, 5000)
Game.start()
