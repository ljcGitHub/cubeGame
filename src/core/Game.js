import THREE from '@/common/libs/Three'
import { OrbitControls } from '@/common/libs/OrbitControls'
import { Stats } from '@/common/libs/Stats'
import NetWork from './NetWork'

const innerWidth = window.innerWidth
const innerHeight = window.innerHeight
const timestamp = () => new Date().getTime()

export default {
  // 帧数频率
  fps: Math.ceil(1000 / 60),
  // 场景
  objectScene: new THREE.Scene(),
  obejctCamera: new THREE.OrthographicCamera(-innerWidth / 2, innerWidth / 2, innerHeight / 2, -innerHeight / 2, 1, 2000),
  uiScene: new THREE.Scene(),
  uiCamera: new THREE.OrthographicCamera(-innerWidth / 2, innerWidth / 2, innerHeight / 2, -innerHeight / 2, 1, 2000),
  // 灯光
  light: new THREE.DirectionalLight(0xffffff, 0.2),
  // 渲染器
  renderer: new THREE.WebGLRenderer({ antialias: true, canvas: window.canvas }),
  // 鼠标坐标值
  mouse: new THREE.Vector2(),
  // 射线
  raycaster: new THREE.Raycaster(),
  // 游戏场景
  gameScene: [],
  // 任务队列
  task: [],
  // 任务队列
  uiRenderOrder: 300,
  uiObjRenderOrder: 200,
  objRenderOrder: 400,

  // 开始游戏
  start() {
    // 场景设置
    this.objectScene.add(this.obejctCamera)
    this.objectScene.add(this.light)
    this.obejctCamera.position.set(0, 800, 400)
    this.obejctCamera.zoom = 1.2
		this.obejctCamera.updateProjectionMatrix()
    this.obejctCamera.lookAt(new THREE.Vector3(0, 0, 0))
    this.objectScene.add(new THREE.AmbientLight(0xdcdcdc))

    this.uiScene.add(this.uiCamera)
    this.uiCamera.position.set(0, 0, 1400)

    // 渲染器设置
    this.renderer.autoClear = false
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.setSize(innerWidth, innerHeight)
    this.renderer.setPixelRatio(window.devicePixelRatio)

    // 灯光，阴影设置
    this.light.castShadow = true
    this.light.shadow.mapSize.width = 1024
    this.light.shadow.mapSize.height = 1024
    this.light.shadow.camera.near = 0.5
    this.light.shadow.camera.far = 2000
    this.light.shadow.camera.left = -16
    this.light.shadow.camera.right = 16
    this.light.shadow.camera.top = -16
    this.light.shadow.camera.bottom = 16
    this.light.position.set(-300, 300, 300)

    // this.controls = new OrbitControls(this.obejctCamera, window.canvas)
    Stats()
    
    this.loop()
    window.game = this
  },
  
  loop() {
    // 主循环
    this.now = timestamp()
    this.dt = this.dt + Math.min(1000, this.now - this.last)
    this.runTime = this.dt

    this.update()
    this.last = this.now
    requestAnimationFrame(() => this.loop())
  },
  
  // 实时更新
  update() {
    // 更新-逻辑帧
    this.updateLogic()
    // 更新-渲染帧
    this.updateRender()

    this.renderer.clear()
    this.renderer.render(this.objectScene, this.obejctCamera)
    this.renderer.clearDepth()
    this.renderer.render(this.uiScene, this.uiCamera)
  },

  // 逻辑帧
  updateLogic() {
    // 接受逻辑包，更新帧包，记录帧
  },

  // 渲染帧
  updateRender() {
    // 解析帧
    // 更新队列函数
    const task = [...this.task]
    this.task = []
    while (task.length) {
      task.shift()()
    }
    // 更新物体内容
    this.gameSceneInstance && this.gameSceneInstance.update()
  },

  // 新增场景
  addGameScene(name, Scene) {
    this.gameScene.push({ name, Scene })
  },

  // 跳转场景
  goGameScene(name) {
    if (this.time) return false
    for (const item of this.gameScene) {
      if (item.name === name) {
        this.time = new Date().getTime() // 获取开始时间
        this.pageStartTransition() // 设置过渡页面效果
        if (this.gameSceneInstance) {
          this.lastGameSceneInstance = this.gameSceneInstance
        }
        this.gameSceneInstance = new item.Scene()
        this.gameSceneInstance.visible = false
        this.loadingAssets(this.gameSceneInstance.preload, () => {
          // 过渡需要300毫秒变黑
          const t = Math.max(new Date().getTime() - this.time, 300)
          setTimeout(() => {
            if (this.lastGameSceneInstance) {
              this.lastGameSceneInstance.destroy()
              this.lastGameSceneInstance = null
            }
            this.gameSceneInstance.visible = true
            this.time = null
            this.pageEndTransition()
          }, t)
        })
        return false
      }
    }
  },

  // 设置过渡开始页面效果
  pageStartTransition() {

  },
  // 设置过渡结束页面效果
  pageEndTransition() {
  },

  loadingAssets(assets, callback) {
    const rqs = []
    assets.objs && assets.objs.forEach(item => rqs.push(NetWork.loadObjects(item)))
    assets.gltfs && assets.gltfs.forEach(item => rqs.push(NetWork.loadGltf(item)))
    assets.textures && assets.textures.forEach(item => rqs.push(NetWork.loadTexture(item)))
    Promise.all(rqs).then(posts => {
      callback()
    })
  },

  nextTick(cb) {
    this.task.push(cb)
  }
}