import THREE from '@/common/libs/Three'
import Game from '@/core/Game'
import Ui from '@/core/Ui'
import NetWork from '@/core/NetWork'
import Animation from '@/core/Animation'
import { getPixelRatio } from '@/core/modules/shared'
import { getText, getTransparent, getBgTransparent } from '@/common/utils/canvas'
import { material } from '@/common/material/uiMesh'
import { state } from '@/store/store'
import Bus from '@/store/bus'

const geometry = new THREE.PlaneGeometry(100000, 100000)
geometry.rotateX(- Math.PI / 2)
const plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ visible: false }))
const mouse = new THREE.Vector2() // 鼠标坐标值
const raycaster = new THREE.Raycaster() // 射线
let build = {}

// 开始动画
build.createdStartValue = 0
build.createdEndValue = 0
build.createdAnimation = new Animation('Elastic.easeOut', 800, v => {
  build.content.position.x = build.createdStartValue + v * (build.createdEndValue - build.createdStartValue)
}, () => {
  build.content.position.x = build.createdEndValue
})

// 滚动动画
build.scrollStartValue = 0
build.scrollEndValue = 0
build.scrollAnimation = new Animation('Quart.easeOut', 800, v => {
  build.content.position.y = build.scrollStartValue + v * (build.scrollEndValue - build.scrollStartValue)
}, () => {
  build.content.position.y = build.scrollEndValue
})

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
  if (build.newAddObject3d && !build.newAddObject3d.buildStatus) {
    Game.gameSceneInstance.remove(build.newAddObject3d)
  }
  build.newAddObject3d = null
  build.scrollStartValue = build.content.position.y
  build.scrollEndValue = -300
  build.scrollAnimation.reset().play()
}

// 检查并更新位置，是否能放置
const updateObjectPosition = function (intersect) {
  const boxs = Game.gameSceneInstance.object3d.children.filter(obj => obj.buildType === 'box' && obj.uuid !== build.newAddObject3d.uuid)
  if (build.selectItem.buildType === 'box') {
    const boxSize = 20
    const x = Math.floor(intersect.point.x / boxSize) * boxSize + boxSize * 0.5
    const z = Math.floor(intersect.point.z / boxSize) * boxSize + boxSize * 0.5
    build.newAddObject3d.position.x = x
    build.newAddObject3d.position.z = z
    build.newAddObject3d.position.y = build.newAddObject3d.physical.height * 0.5
    build.newAddObject3d.updatePhysical()
    for (const box of boxs) {
      const intersection = build.newAddObject3d.intersectsBox(box, { x: -2, y: 0, z: -2 })
      if (intersection) {
        build.newAddObject3d.setBuildStatus(false)
        return false
      }
    }
    build.newAddObject3d.setBuildStatus(true)
  } else {
    build.newAddObject3d.position.x = intersect.point.x
    build.newAddObject3d.position.z = intersect.point.z
    build.newAddObject3d.position.y = build.newAddObject3d.physical.height * 0.5 + 20
    build.newAddObject3d.updatePhysical()
    for (const box of boxs) {
      const intersection = build.newAddObject3d.intersectsBox(box, { x: -5, y: 0, z: -5 })
      if (intersection) {
        // 在box上面
        const objs = Game.gameSceneInstance.object3d.children.filter(obj => obj.buildType !== 'box' && obj.uuid !== build.newAddObject3d.uuid)
        for (const obj of objs) {
          const intersection2 = build.newAddObject3d.intersectsBox(obj, { x: -2, y: 0, z: -2 })
          if (intersection2) {
            build.newAddObject3d.setBuildStatus(false)
            return false
          }
        }
        build.newAddObject3d.setBuildStatus(true)
        return false
      }
    }
    build.newAddObject3d.setBuildStatus(false)
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
  ui.touchstart = touchstart
  ui.touchmove = touchmove
  ui.touchend = touchend
  ui.click = function (e) {
    debugger
  }
  return { ui, count }
}

export const createBuild = function () {
  const initProps = { left: 0, width: 70, height: Math.max(window.innerHeight, 667) }
  // 内容
  build.content = new Ui({
    ...initProps,
    zIndex: 20,
    name: 'content',
    imgUrl: getTransparent()
  })
  // 内容背景
  build.bg = new Ui({ ...initProps, name: 'bg', zIndex: 10, imgUrl: getBgTransparent() })
  let top = 20
  for (let buildType in state.builds) {
    for (let i = 0; i < state.builds[buildType].length; i++) {
      const item = state.builds[buildType][i]
      const mesh = createBuildItem({ ...item, buildType }, top)
      build.content.add(mesh.ui)
      build.content.add(mesh.count)
      top += 60
    }
  }
  build.content.update = function () {
    material.uniforms.utime.value += Game.fps
  }
  build.content.touchstart = build.bg.touchstart = touchstart
  build.content.touchmove = build.bg.touchmove = touchmove
  build.content.touchend = build.bg.touchend = touchend

  // 交互
  Game.objectScene.add(plane)
  build.interaction = new Ui({
    ...initProps,
    width: 375,
    name: 'interaction',
    zIndex: 5,
    imgUrl: getBgTransparent()
  })
  build.interaction.click = function (e) {
    mouse.x = (e.pageX / window.innerWidth) * 2 - 1
    mouse.y = - (e.pageY / window.innerHeight) * 2 + 1
    raycaster.setFromCamera(mouse, Game.obejctCamera)
    const intersects = raycaster.intersectObjects([plane])
    if (intersects && intersects.length) {
      const intersect = intersects[0]
      if (!build.newAddObject3d) {
        build.selectItem.getModel().then(obj => {
          build.newAddObject3d = obj
          Game.gameSceneInstance.add(build.newAddObject3d)
          updateObjectPosition(intersect)
        })
      } else {        
        updateObjectPosition(intersect)
      }
    }
  }

  build.cancel = new Ui({
    bottom: 20,
    size: 50,
    zIndex: 100,
    imgUrl: './texture/util-cancel.png',
  })
  build.cancel.click = function () {
    Bus.emit('showButtons')
  }
}

export const showBuildPopup = function (scene) {
  if (!build.content) createBuild()
  scene.add(build.content)
  scene.add(build.bg)
  scene.add(build.cancel)
  scene.add(build.interaction)
  build.createdStartValue = build.content.position.x - 60
  build.createdEndValue = build.content.position.x 
  build.createdAnimation.reset().play()
}


export const hideBuildPopup = function (scene) {
  scene.remove(build.content)
  scene.remove(build.bg)
  scene.remove(build.cancel)
  scene.remove(build.interaction)
  Game.objectScene.remove(plane)
}