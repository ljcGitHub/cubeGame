import THREE from '@/common/libs/Three'
import Game from '@/core/Game'
import { getVectorNormalize } from '@/common/utils/vector'

const global = {}
let theta = 45
let radious = 800
let phi = 60
let onTouchmoveTheta = 45
let onTouchmovePhi = 60
let deg = Math.PI / 360
const minZoom = 0.1
const maxZoom = 10

const mesh = new THREE.Mesh(
  new THREE.BoxBufferGeometry(40, 40, 40),
  new THREE.MeshLambertMaterial({ color: 0xea4d10 })
)
Game.objectScene.add(mesh)

// 获取坐标之间的举例
const getDistance = function (start, stop) {
  return Math.hypot(stop.x - start.x, stop.y - start.y)
}

const touchstart = function (e, intersectObjects) {
  if (!intersectObjects.length) {
    if (e.touches.length === 2) {
      // 双指操作
      const touche = e.touches[0]
      const touche2 = e.touches[1]
      global.startX = touche.pageX
      global.startY = touche.pageY
      global.startX2 = touche2.pageX
      global.startY2 = touche2.pageY
    } else if (e.touches.length === 1) {
      // 单指操作
      const touche = e.touches[0]
      global.startX = touche.pageX
      global.startY = touche.pageY
      onTouchmoveTheta = theta
      onTouchmovePhi = phi
    }
  }
}
const touchmove = function (e, intersectObjects) {
  if (!intersectObjects.length) {
    if (e.touches.length === 2) {
      // 双指操作
      const touche = e.touches[0]
      const touche2 = e.touches[1]
      const d1 = getDistance({ x: touche.pageX, y: touche.pageY }, { x: touche2.pageX, y: touche2.pageY }) 
      const d2 = getDistance({ x: global.startX, y: global.startY }, { x: global.startX2, y: global.startY2 }) 
      global.startX = touche.pageX
      global.startY = touche.pageY
      global.startX2 = touche2.pageX
      global.startY2 = touche2.pageY
      if (d1 / d2 < 1) {
        // 缩小
        Game.obejctCamera.zoom = Math.max(minZoom, Math.min(maxZoom, Game.obejctCamera.zoom * 0.9))
      } else {
        // 放大
        Game.obejctCamera.zoom = Math.max(minZoom, Math.min(maxZoom, Game.obejctCamera.zoom / 0.9))
      }
      Game.obejctCamera.updateProjectionMatrix()
    } else if (e.touches.length === 1) {
      // 单指操作
      const touche = e.touches[0]
      theta = - (touche.pageX - global.startX) + onTouchmoveTheta
      phi = (touche.pageY - global.startY) + onTouchmovePhi
      phi = Math.min(180, Math.max(0, phi))
      cameraUpdate()
    }
  }
}
const touchend = function (e, intersectObjects) {
  if (!intersectObjects.length) {
  }
}

const cameraUpdate = function() {
  Game.obejctCamera.position.x = radious * Math.sin(theta * deg) * Math.cos(phi * deg)
  Game.obejctCamera.position.y = radious * Math.sin(phi * deg)
  Game.obejctCamera.position.z = radious * Math.cos(theta * deg) * Math.cos(phi * deg)
  Game.obejctCamera.lookAt(new THREE.Vector3(0, 0, 0))
  Game.obejctCamera.updateMatrix()
}

// const touche = e.touches[0]
// global.moveX = touche.pageX - global.startX
// global.moveY = touche.pageY - global.startY
// const distance = getVectorNormalize({ x: global.moveX, y:0, z: global.moveY })
// const vecNormalize = getCameraDirection(distance)
// mesh.position.x += vecNormalize.x * speed
// mesh.position.y += vecNormalize.y * speed
// mesh.position.z += vecNormalize.z * speed

const getCameraDirection = function (distance) {
  // 获取摄像机的屏幕下投影方向
  const Right = new THREE.Vector3(1, 0, 0)
  const Up = new THREE.Vector3(0, 0, 1)
  const worldXDirection = Right.transformDirection(Game.obejctCamera.matrixWorld)
  const groundXDirection = new THREE.Vector3(worldXDirection.x, 0, worldXDirection.z).normalize().multiplyScalar(distance.x)
  const worldYDirection = Up.transformDirection(Game.obejctCamera.matrixWorld)
  const groundYDirection = new THREE.Vector3(worldYDirection.x, 0, worldYDirection.z).normalize().multiplyScalar(distance.z)
  const direction = new THREE.Vector3(groundXDirection.x + groundYDirection.x, 0, groundXDirection.z + groundYDirection.z)
  return direction
}

export const createController = function (scene) {
  cameraUpdate()
  Game.objectScene.add(new THREE.AxesHelper(500))
  scene.event.touchstartExtens = touchstart
  scene.event.touchmoveExtens = touchmove
  scene.event.touchendExtens = touchend
}

export const deleteController = function () {
}
