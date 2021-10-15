import THREE from '@/common/libs/Three'

export default class Cube extends THREE.Mesh {
  constructor(option = {}) {
    super()
    this.type = option.type || '2d' || '2D' || '3d'
  }
  update() {
  }
}