import THREE from '@/common/libs/Three'
import Scene from '@/core/Scene'
import Game from '@/core/Game'
import { createTabs } from '@/components/tabs'
import { createController } from '@/components/controller'

export default class Home extends Scene{
  constructor() {
    super()
    this.preload = {
      objs: ['./obj/box.obj'],
      gltfs: [],
      textures: [
      ]
    }
    createTabs(this)
    createController(this)
    Game.objectScene.background = new THREE.Color(0x5896f7)
  }
}