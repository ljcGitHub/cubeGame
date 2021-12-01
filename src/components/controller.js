import THREE from '@/common/libs/Three'
import Game from '@/core/Game'
import { getVector3Dot, getVectorNormalize } from '@/common/utils/vector'

const global = {}
let theta = 0
let radious = 800
let phi = 60
let onTouchmoveTheta = 0
let onTouchmovePhi = 60
let deg = Math.PI / 360
const minZoom = 0.4
const maxZoom = 4

// 获取坐标之间的举例
const getDistance = function (start, stop) {
  return Math.hypot(stop.x - start.x, stop.y - start.y)
}

const touchstart = function (e, intersectObjects) {
  if (e.ctrlKey) return false
  if (!intersectObjects.length) {
    if (e.touches.length === 2) {
      // 双指操作
      const touche = e.touches[0]
      const touche2 = e.touches[1]
      global.startX = touche.pageX
      global.startY = touche.pageY
      global.startX2 = touche2.pageX
      global.startY2 = touche2.pageY
      onTouchmoveTheta = theta
      onTouchmovePhi = phi
    } else if (e.touches.length === 1) {
      // 单指操作
      const touche = e.touches[0]
      global.startX = touche.pageX
      global.startY = touche.pageY
    }
  }
}
const touchmove = function (e, intersectObjects) {
  if (e.ctrlKey) return false
  if (!intersectObjects.length) {
    if (e.touches.length === 2) {
      // 双指操作
      const touche = e.touches[0]
      const touche2 = e.touches[1]
      const direction = getVector3Dot({
        x: global.startX - touche.pageX,
        y: global.startY - touche.pageY,
        z: 0
      }, {
        x: global.startX2 - touche2.pageX,
        y: global.startY2 - touche2.pageY,
        z: 0
      })
      if (direction > 0) {
        theta = - (touche.pageX - global.startX) + onTouchmoveTheta
        phi = (touche.pageY - global.startY) + onTouchmovePhi
        phi = Math.min(180, Math.max(0, phi))
        cameraUpdate()
      } else {
        const d1 = getDistance({ x: touche.pageX, y: touche.pageY }, { x: touche2.pageX, y: touche2.pageY })
        const d2 = getDistance({ x: global.startX, y: global.startY }, { x: global.startX2, y: global.startY2 })
        const zoom = d1 / d2 < 1 ? Game.obejctCamera.zoom * 0.9 : Game.obejctCamera.zoom / 0.9
        Game.obejctCamera.zoom = Math.max(minZoom, Math.min(maxZoom, zoom))
        Game.obejctCamera.updateProjectionMatrix()
        global.startX = touche.pageX
        global.startY = touche.pageY
        global.startX2 = touche2.pageX
        global.startY2 = touche2.pageY
      }
    } else if (e.touches.length === 1) {
      const touche = e.touches[0]
      global.moveX = -touche.pageX + global.startX
      global.moveY = -touche.pageY + global.startY
      const distance = getVectorNormalize({ x: global.moveX, y: 0, z: global.moveY })
      const vecNormalize = getCameraDirection(distance)
      const speed = Math.hypot(global.moveX, global.moveY) * (0.95 / Game.obejctCamera.zoom)
      Game.target.x += vecNormalize.x * speed
      Game.target.y += vecNormalize.y * speed
      Game.target.z += vecNormalize.z * speed
      cameraUpdate()
      global.startX = touche.pageX
      global.startY = touche.pageY
    }
  }
}
const touchend = function (e, intersectObjects) {
  global.moveLoop && clearTimeout(global.moveLoop)
  if (!intersectObjects.length) {
  }
}

// const move = function (vecNormalize) {
//   global.moveLoop && clearTimeout(global.moveLoop)
//   const speed = 4.0
//   Game.target.x += vecNormalize.x * speed
//   Game.target.y += vecNormalize.y * speed
//   Game.target.z += vecNormalize.z * speed
//   Game.obejctCamera.position.x += vecNormalize.x * speed
//   Game.obejctCamera.position.y += vecNormalize.y * speed
//   Game.obejctCamera.position.z += vecNormalize.z * speed
//   global.moveLoop = setTimeout(() => {
//     move(vecNormalize)
//   }, 10)
// }

const devHlep = function () {
  const body = document.body
  body.addEventListener('wheel', function (e) {
    if (e.deltaY < 0 ) {
      Game.obejctCamera.zoom = Math.max(minZoom, Math.min(maxZoom, Game.obejctCamera.zoom / 0.9))
      Game.obejctCamera.updateProjectionMatrix()
    } else if (e.deltaY > 0 ) {
      Game.obejctCamera.zoom = Math.max(minZoom, Math.min(maxZoom, Game.obejctCamera.zoom * 0.9))
      Game.obejctCamera.updateProjectionMatrix()
    }
  })
  body.addEventListener('keydown', function (e) {
    if (e.code === 'ArrowUp') {
      Game.obejctCamera.zoom = Math.max(minZoom, Math.min(maxZoom, Game.obejctCamera.zoom / 0.9))
      Game.obejctCamera.updateProjectionMatrix()
    } else if (e.code === 'ArrowDown') {
      Game.obejctCamera.zoom = Math.max(minZoom, Math.min(maxZoom, Game.obejctCamera.zoom * 0.9))
      Game.obejctCamera.updateProjectionMatrix()
    }
  })
  body.addEventListener('touchstart', function (e) {
    if (e.ctrlKey) {
      const touche = e.touches[0]
      global.startX = touche.pageX
      global.startY = touche.pageY
      onTouchmoveTheta = theta
      onTouchmovePhi = phi
    }
  })
  body.addEventListener('touchmove', function (e) {
    if (e.ctrlKey) {
      const touche = e.touches[0]
      theta = - (touche.pageX - global.startX) + onTouchmoveTheta
      phi = (touche.pageY - global.startY) + onTouchmovePhi
      phi = Math.min(180, Math.max(0, phi))
      cameraUpdate()
    }
  })
  body.addEventListener('touchend', function (e) {
    if (e.ctrlKey) {
    }
  })
}
devHlep()

const cameraUpdate = function () {
  Game.obejctCamera.position.x = Game.target.x + radious * Math.sin(theta * deg) * Math.cos(phi * deg)
  Game.obejctCamera.position.y = Game.target.y + radious * Math.sin(phi * deg)
  Game.obejctCamera.position.z = Game.target.z + radious * Math.cos(theta * deg) * Math.cos(phi * deg)
  Game.obejctCamera.lookAt(Game.target)
  Game.obejctCamera.updateMatrix()
}

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
  Game.objectScene.add(new THREE.AxesHelper(500))
  scene.event.touchstartExtens.push(touchstart)
  scene.event.touchmoveExtens.push(touchmove)
  scene.event.touchendExtens.push(touchend)
  cameraUpdate()
}

export const deleteController = function () {
  const event = scene.event
  event.touchstartExtens.splice(event.touchstartExtens.indexOf(touchstart), 1)
  event.touchmoveExtens.splice(event.touchmoveExtens.indexOf(touchmove), 1)
  event.touchendExtens.splice(event.touchendExtens.indexOf(touchend), 1)
}
