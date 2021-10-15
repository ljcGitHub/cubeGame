import THREE from '@/common/libs/Three'
import Scene from '@/core/Scene'
import Game from '@/core/Game'

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
      ]
    }
    const geometry = new THREE.BoxGeometry(20, 20, 20);
    const material = new THREE.MeshNormalMaterial( { color: 0xffff00 } );
    const mesh = new THREE.Mesh(geometry, material);
    Game.scene.add(mesh)
    Game.scene.background = new THREE.Color(0x5896f7)
  }
}