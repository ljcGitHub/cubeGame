import THREE from '@/common/libs/Three'
import Scene from '@/core/Scene'
import Game from '@/core/Game'
import { showButtonsPopup } from './ui/buttons'
import { showBuildPopup } from './ui/buildList'

export default class Home extends Scene{
  constructor() {
    super()
    this.preload = {
      objs: ['./obj/box.obj'],
      gltfs: [],
      textures: [
        './texture/button0.png',
        './texture/button1.png',
        './texture/button2.png',
        './texture/list.png',
        './texture/listItem.png',
      ]
    }
    showButtonsPopup(this)
    showBuildPopup(this)
    Game.objectScene.background = new THREE.Color(0x5896f7)
  }
}