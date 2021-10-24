import THREE from '@/common/libs/Three'
import NetWork from './NetWork'
import { getTransparent } from '@/common/utils/canvas'
import Game from '@/core/Game'

const uiMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load(getTransparent()),
  transparent: true
}))

export default class Cube extends THREE.Group {
  constructor(option = {}) {
    super()
    this.viewType = option.viewType || '2d' || '2.5d' || '3d'
    this.option = option
    this.createMesh()
    this.updateMesh()
    option.children && option.children.forEach(item => this.add(item))
  }
  createMesh() {
    if (this.viewType === '2d') {
      this.mesh = uiMesh.clone()
      this.mesh.material = this.mesh.material.clone()
      if (this.option.material) {
        this.mesh.material = this.option.material
      } else if (this.option.texture) {
        this.mesh.material.map = texture
        this.mesh.material.needsUpdate = true
      } else if (this.option.imgUrl) {
        NetWork.loadTexture(this.option.imgUrl).then(texture => {
          this.mesh.material.map = texture
          this.mesh.material.needsUpdate = true
        })
      }
      this.add(this.mesh)
    } else if (this.viewType === '3d' || this.viewType === '2.5d') {
      const geometry = new THREE.BoxGeometry(1, 1, 1)
      const material = new THREE.MeshNormalMaterial({ depthWrite: false })
      const mesh = new THREE.Mesh(geometry, material)
      this.mesh = mesh
      this.add(this.mesh)
    }
  }
  updateMesh() {
    const { top, right, bottom, left, zIndex } = this.option
    const width = this.option.width
    const height = this.option.height 
    const depth = this.option.depth
    switch (this.viewType) {
      case '2d':
        this.updateUiMeshPosition(top, right, bottom, left, zIndex)
        if (this.mesh) {
          this.mesh.scale.x = this.getPixelRatio(width)
          this.mesh.scale.y = this.getPixelRatio(height)
          this.mesh.renderOrder = this.option.renderOrder || Game.uiRenderOrder
          this.renderOrder = this.mesh.renderOrder
        }
        break
      case '2.5d':
        if (this.mesh) {
          const box = new THREE.Box3()
          this.mesh.geometry.computeBoundingBox()
          box.copy(this.mesh.geometry.boundingBox).applyMatrix4(this.mesh.matrixWorld)
          this.mesh.scale.x = this.getPixelRatio(width / (box.max.x - box.min.x))
          this.mesh.scale.y = this.getPixelRatio(height / (box.max.y - box.min.y))
          if (depth) {
            this.mesh.scale.z = this.getPixelRatio(depth / (box.max.z - box.min.z))
          } else {
            this.mesh.scale.z = this.getPixelRatio(((width + height) / 2) / (box.max.z - box.min.z))
          }
          this.mesh.renderOrder = this.option.renderOrder || Game.uiObjRenderOrder
          this.renderOrder = this.mesh.renderOrder
        }
        break
      case '3d':
          this.mesh.renderOrder = this.option.renderOrder || Game.objRenderOrder
          this.renderOrder = this.mesh.renderOrder
        break
    }
  }

  updateUiMeshPosition(top, right, bottom, left, zIndex) {
    const { width, height, depth } = this.option
    let W = window.innerWidth
    let H = window.innerHeight
    if (this.parent && (this.parent.viewType === '2d' || this.parent.viewType === '2.5d')) {
      W = this.parent.option.width || window.innerWidth
      H = this.parent.option.height || window.innerHeight
    }
    if (top !== undefined) {
      this.position.y = H / 2 - this.getPixelRatio(height) / 2 - this.getPixelRatio(top)
    }
    if (bottom !== undefined) {
      this.position.y = this.getPixelRatio(height) / 2 - H / 2 + this.getPixelRatio(bottom)
    }
    if (left !== undefined) {
      this.position.x = this.getPixelRatio(width) / 2 - W / 2 + this.getPixelRatio(left)
    }
    if (right !== undefined) {
      this.position.x = W / 2 - this.getPixelRatio(width) / 2 - this.getPixelRatio(right)
    }
    if (zIndex !== undefined) {
      this.position.z = zIndex
    }
  }

  update() {
  }

  add(mesh) {
    super.add(mesh)
    mesh.updateMesh && mesh.updateMesh()
  }

  getPixelRatio(size) {
    return size * window.innerWidth / 375
  }

  destroy() {
    this.children.forEach(item => {
      item.destroy && item.destroy()
      this.remove(item)
    })
  }
}