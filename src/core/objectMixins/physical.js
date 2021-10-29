
import THREE from '@/common/libs/Three'
import { clone, getPixelRatio } from '@/core/modules/shared'

// 物理盒子
const physical = {
  type: 'static', // 刚体类型 static静态 / dynamic动态
  trigger: false, // 是否触发器
  width: 20, // 刚体盒子宽度
  height: 20, // 刚体盒子高度
  depth: 20, // 刚体盒子深度
  force: { x: 0, y: 0, z: 0 }, // 受力值
  isOnGround: true, // 是否地面
}

const _offser = { x: 0, y: 0, z: 0 }

export default class Physical extends THREE.Group {
  constructor(option = {}, attribute = {}) {
    super(option, attribute)
    this.physical = { ...clone(physical), ...(attribute.physical || {}) }
  }

  // 更新物理 获取盒子的最大和最小边界
  updatePhysical() {
    const size = { x: this.physical.width / 2, y: this.physical.height / 2, z: this.physical.depth / 2 }
    this.physical.min = {
      x: this.position.x - size.x,
      y: this.position.y - size.y,
      z: this.position.z - size.z
    }
    this.physical.max = {
      x: this.position.x + size.x,
      y: this.position.y + size.y,
      z: this.position.z + size.z
    }
  }

  // 创建调试的物理盒子
  createPhysicalBox() {
    const box = new THREE.Box3()
    const size = { x: this.physical.width, y: this.physical.height, z: this.physical.depth }
    box.setFromCenterAndSize(this.position, new THREE.Vector3(size.x, size.y, size.z))
    this.helper = new THREE.Box3Helper(box, 0xffffff)
    this.add(this.helper)
  }

  // 移除调试的物理盒子
  deletePhysicalBox() {
    if (this.helper) {
      this.remove(this.helper)
      this.helper = null
    }
  }

  // 盒子是否相交
  intersectsBox(obj, offser = _offser) {
    const a = this.physical
    const b = obj.physical
    let overlapX = Math.min(a.max.x, b.max.x) - Math.max(a.min.x, b.min.x) + offser.x
    if (overlapX < 0) return false
    let overlapY = Math.min(a.max.y, b.max.y) - Math.max(a.min.y, b.min.y) + offser.y
    if (overlapY < 0) return false
    let overlapZ = Math.min(a.max.z, b.max.z) - Math.max(a.min.z, b.min.z) + offser.z
    if (overlapZ < 0) return false
    let minOverlap = Math.min(overlapX, overlapY, overlapZ)
    let axis
    if (minOverlap === overlapX) {
      axis = 'x'
    } else if (minOverlap === overlapY) {
      axis = 'y';
    } else if (minOverlap === overlapZ) {
      axis = 'z'
    }
    return { minOverlap, axis }
  }

  // 是否需要碰撞响应
  hasCollisionResponse() {
    if (this.physical.trigger) return false // 触发器
    if (this.physical.type === 'static') return false // 静态物体
    return true
  }

  // 碰撞算法
  aabbBoxCollided(obj) {
    const intersection = intersectsBox(obj)
    if (intersection) {
      if (this.hasCollisionResponse(a)) {
        this.collisionResponse(this, obj, intersection)
      }
      if (hasCollisionResponse(b)) {
        this.collisionResponse(obj, this, intersection)
      }
      return true
    }
    return false
  }

  // 碰撞响应
  collisionResponse(a, b, intersection) {
    switch (intersection.axis) {
      case 'x':
        a.position.x += Math.sign(a.position.x - b.position.x) * intersection.minOverlap
        a.physical.force.x = 0
        break
      case 'y':
        var dir = Math.sign(a.position.y - b.position.y)
        if (dir === 1 && a.velY <= 0) {
          a.physical.isOnGround = true
        }
        a.position.y = dir * intersection.minOverlap
        a.physical.force.y = 0
        break
      case 'z':
        a.position.z += Math.sign(a.position.z - b.position.z) * intersection.minOverlap
        a.physical.force.z = 0
        break
    }
  }
}