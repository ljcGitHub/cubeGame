import THREE from '@/common/libs/Three'
import Game from '@/core/Game'

const getRange = (min, max) => min + Math.random() * (max - min)
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xffffff })
)

export default class ParticleSystem {
  constructor(option = {}) {
    this.position = option.position || { x: 0, y: 0, z: 0 }
    this.duration = option.duration || 2000 // 播放时间
    this.looping = option.looping || false // 是否循环
    this.size = option.size || 100 // 粒子大小
    this.gravity = option.gravity || false // 是否受重力影响
    this.rate = option.rate || 2 // 发射的个数
    this.rateTime = option.rateTime || 200 // 发射间距时间 ms
    this.lifeTime = option.lifeTime || 1000 // 粒子存活时间
    this.velocity = option.velocity || { x: 0, y: 8, z: 0 } // 粒子速度
    this.positionRange = option.positionRange || { x: 0, y: 0, z: 0 } // 粒子位置随机区间范围
    this.velocityRange = option.velocityRange || { x: 0, y: 0, z: 0 } // 粒子速度随机区间范围
    this.particles = []
    this.createParticles()
  }

  createParticles() {
    const step = Math.floor(this.duration / this.rateTime)
    for (let i = 0; i < step; i++) {
      for (let j = 0; j < this.rate; j++) {
        const verticeIndex = i * this.rate + j
        const positions = {
          x: this.position.x + getRange(-this.positionRange.x, this.positionRange.x),
          y: this.position.y + getRange(-this.positionRange.y, this.positionRange.y),
          z: this.position.z + getRange(-this.positionRange.z, this.positionRange.z),
        }
        const velocity = {
          x: this.position.x + getRange(-this.velocity.x, this.velocityRange.x),
          y: this.position.y + getRange(-this.velocity.y, this.velocityRange.y),
          z: this.position.z + getRange(-this.velocity.z, this.velocityRange.z),
        }
        this.particles[verticeIndex] = {
          positions,
          velocity,
          lifeTime: this.lifeTime * i + this.rateTime * i
        }
      }
    }
  }

  reset() {
  }

  update() {
  }

  destroy() {
  }
}