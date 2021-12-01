import THREE from '@/common/libs/Three'
import Ui from '@/core/Ui'
import { state } from '@/store/store'
import { material } from '@/common/material/uiMesh'
import { material as selectMaterial } from '@/common/material/select'
import { getText } from '@/common/utils/canvas'
import Game from '@/core/Game'
import { getBuildsCode } from '@/store/builds'
import { buildItemCreateAnimation } from '@/common/utils/animation'

const Names = {
  box: '地面盒子',
  house: '建筑物',
  npc: 'npc人物',
  object: '物体',
  decoration: '装饰'
}

let select = null
let scene = null
const mouse = new THREE.Vector2() // 鼠标坐标值
const raycaster = new THREE.Raycaster() // 射线
const gridSize = 20
let touche = null
let isTouch = null
const geometry = new THREE.PlaneGeometry(1000, 1000)
geometry.rotateX(- Math.PI / 2)
const plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ visible: false }))

const touchstart = function (e, intersectObjects) {
  if (intersectObjects.length) {
    if (intersectObjects[0].intersects.length) {
      const item = intersectObjects[0].intersects[0]
      if (item.display === '2.5d' || item.display === '2d' || item.parent.display === '2.5d' || item.parent.display === '2d') {
        return true
      }
    }
  }
  touche = e.touches[0]
  isTouch = true
}
const touchmove = function (e, intersectObjects) {
  if (isTouch) {
    const _touche = e.touches[0]
    if (Math.abs(touche.pageX - _touche.pageX) > gridSize ||
      Math.abs(touche.pageY - _touche.pageY) > gridSize) {
      isTouch = false
    }
  }
}
const touchend = function (e, intersectObjects) {
  if (isTouch && state.buildSelectCode) {
    mouse.x = (touche.pageX / window.innerWidth) * 2 - 1
    mouse.y = - (touche.pageY / window.innerHeight) * 2 + 1
    const boxs = []
    Game.gameSceneInstance.object3d.children.forEach(item => {
      if (item.buildType === 'box') {
        boxs.push(item.mesh)
      }
    })
    Game.objectScene.add(plane)
    boxs.push(plane)
    raycaster.setFromCamera(mouse, Game.obejctCamera)
    const o = raycaster.intersectObjects(boxs)[0]
    Game.objectScene.remove(plane)
    if (o) {
      const point = o.point.add(o.face.normal).divideScalar(gridSize).floor().multiplyScalar(gridSize).addScalar(gridSize / 2)
      const getModel = getBuildsCode(state.buildSelectCode)
      getModel().then(mesh => {
        mesh.position.copy(point)
        Game.gameSceneInstance.add(mesh)
        buildItemCreateAnimation(mesh)
      })
    }
  }
  isTouch = false
}

export const click = function () {
  const code = this.option.code
  const content = this.parent
  state.buildSelectCode = code
  select.position.copy(this.position)
}

export const createBuild = function (global) {
  let top = 30
  material.clippingPlanes = global.clippingPlanes
  for (const x in state.builds) {
    const list = state.builds[x]
    const name = Names[x]
    const textImg = getText({ fontSize: 84, text: name, color: '#FFFFFF' })
    const text = new Ui({
      top,
      left: 20,
      width: textImg.width / 4,
      height: textImg.height / 4,
      imgUrl: textImg.imgUrl,
    })
    text.material.clippingPlanes = global.clippingPlanes
    top += textImg.height / 4 + 20
    global.content.add(text)
    const grid = 36
    const marginTop = 20
    const marginLeft = 32
    const num = 5
    let left = marginLeft
    for (let i = 0; i < list.length; i++) {
      const data = list[i]
      const item = new Ui({
        top,
        left,
        size: grid,
        display: '2.5d',
        material, meshUrl: data.asset,
        code: data.code
      })
      left += marginLeft + grid
      if (i % num === num - 1 || i === list.length - 1) {
        top += grid + marginTop
        left = marginLeft
      }
      item.touchstart = global.wrapper.touchstart
      item.touchmove = global.wrapper.touchmove
      item.touchend = global.wrapper.touchend
      item.click = click
      global.content.add(item)
    }
    top += 20
  }
  if (!select) {
    select = new Ui({
      top: 1000,
      left: 1000,
      width: 64,
      height: 64,
      imgUrl: './texture/select.png',
      material: selectMaterial,
      zIndex: 400
    })
    select.material.clippingPlanes = global.clippingPlanes
    select.update = function () {
      select.material.uniforms.u_time.value += Game.fps
    }
    global.content.add(select)
  } else {
    global.content.add(select)
  }

  global.scene.event.touchstartExtens.push(touchstart)
  global.scene.event.touchmoveExtens.push(touchmove)
  global.scene.event.touchendExtens.push(touchend)
  scene = global.scene
  global.scrollHeight = top
}

export const deleteBuild = function () {
  const event = scene.event
  event.touchstartExtens.splice(event.touchstartExtens.indexOf(touchstart), 1)
  event.touchmoveExtens.splice(event.touchmoveExtens.indexOf(touchmove), 1)
  event.touchendExtens.splice(event.touchendExtens.indexOf(touchend), 1)
}