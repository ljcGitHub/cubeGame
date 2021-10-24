import THREE from '@/common/libs/Three'
import Game from '@/core/Game'
import Ui from '@/core/Ui'
import NetWork from '@/core/NetWork'
import Animation from '@/core/Animation'
import { getPixelRatio } from '@/core/modules/shared'
import { getText, getTransparent, getBgTransparent } from '@/common/utils/canvas'
import { material } from '@/common/material/uiMesh'
import { state } from '@/store/store'

const geometry = new THREE.PlaneGeometry(100000, 100000)
geometry.rotateX(- Math.PI / 2)
const plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ visible: false }))
const mouse = new THREE.Vector2() // 鼠标坐标值
const raycaster = new THREE.Raycaster() // 射线
let build = {}

const touchstart = function (e) {
  build.startX = e.pageX
  build.startY = e.pageY
  build.moveX = e.pageX
  build.moveY = e.pageY
}
const touchmove = function (e) {
  let deltaX = e.pageX - build.moveX
  let deltaY = e.pageY - build.moveY
  build.deltaX = deltaX
  build.deltaY = deltaY
  build.moveX = e.pageX
  build.moveY = e.pageY
  build.content.position.y -= deltaY
}
const touchend = function (e) {
  build.newAddObject3d = null
}

const intersecMesh = function (e, ui) {
  ui.mesh.position.y -= build.deltaY
  mouse.x = (e.pageX / window.innerWidth) * 2 - 1
  mouse.y = - (e.pageY / window.innerHeight) * 2 + 1
  raycaster.setFromCamera(mouse, Game.obejctCamera)
  const intersects = raycaster.intersectObjects([plane])
  if (intersects && intersects.length) {
    const intersect = intersects[0]
    const boxSize = 20
    const x = Math.floor(intersect.point.x / boxSize) * boxSize + boxSize * 0.5
    const z = Math.floor(intersect.point.z / boxSize) * boxSize + boxSize * 0.5
    ui.mesh.visible = false
    if (!build.newAddObject3d) {
      build.selectItem.getModel().then(obj => {
        build.newAddObject3d = obj
        Game.objectScene.add(build.newAddObject3d)
        build.newAddObject3d.position.x = x
        build.newAddObject3d.position.z = z
      })
    } else {
      build.newAddObject3d.position.x = x
      build.newAddObject3d.position.z = z
    }
    if (build.selectItem.buildType === 'box') {

    } else {
      
    }
  }
}

export const createBuildItem = function (item, top) {
  const ui = new Ui({
    display: '2.5d',
    top: top,
    size: 30,
    material,
    meshUrl: item.asset,
  })
  const n = getText({ fontSize: 64, text: `x${item.count}`, color: '#fff' })
  const count = new Ui({
    width: n.width / 4,
    height: n.height / 4,
    top: top + 22,
    right: 0,
    zIndex: 100,
    imgUrl: n.imgUrl,
  })
  ui.touchstart = function (e) {
    touchstart(e)
    build.selectItem = item
    build.selectUi = ui
    build.isSelectMode = false
  }
  ui.touchmove = function (e) {
    const contentY = build.content.position.y
    touchmove(e)
    const absX = Math.abs(build.moveX - build.startX)
    if (build.isSelectMode) {
      build.content.position.y = contentY
      if (e.pageX < 70) {
        ui.mesh.position.y -= build.deltaY
        build.selectUi.mesh.visible = true
      } else {
        intersecMesh(e, ui)
        build.selectUi.mesh.visible = false
      }
    } else {
      if (e.pageX > 70) {
        build.isSelectMode = true
        intersecMesh(e, ui)
      }
    }
    if (absX > 4 && build.selectUi.mesh.visible) {
      ui.mesh.position.x += build.deltaX
    }
  }
  ui.touchend = function (e) {
    build.selectUi.mesh.position.set(0, 0, 0)
    build.selectUi.mesh.visible = true
    touchend(e)
  }

  ui.position.set(0, 0, 0)
  return { ui, count }
}

export const createBuild = function () {
  const initProps = { left: 0, width: 70, height: Math.max(window.innerHeight, 667) }

  build.content = new Ui({
    ...initProps,
    zIndex: 20,
    name: 'content',
    imgUrl: getTransparent()
  })
  build.bg = new Ui({
    ...initProps,
    name: 'bg',
    zIndex: 10,
    imgUrl: getBgTransparent()
  })
  let top = 10
  for (let buildType in state.builds) {
    for (let i = 0; i < state.builds[buildType].length; i++) {
      const item = state.builds[buildType][i]
      const mesh = createBuildItem({ ...item, buildType }, top)
      build.content.add(mesh.ui)
      build.content.add(mesh.count)
      top += 60
    }
  }
  build.content.touchstart = build.bg.touchstart = touchstart
  build.content.touchmove = build.bg.touchmove = touchmove
  build.content.touchend = build.bg.touchend = touchend
  Game.objectScene.add(plane)
}

export const showBuildPopup = function (scene) {
  if (!build.content) createBuild()
  scene.add(build.content)
  scene.add(build.bg)
}