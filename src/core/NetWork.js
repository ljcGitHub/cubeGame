import THREE from '@/common/libs/Three'
import { OBJLoader } from '@/common/libs/OBJLoader'
import { GLTFLoader } from '@/common/libs/gltfLoader'

class NetWork {
  constructor(type, url) {
    this.loadingCount = 0
    this.url = url
    this.type = type
    this.textureLoader = new THREE.TextureLoader()
    this.objLoader = new OBJLoader()
    this.modelLoader = new GLTFLoader()
    this.textures = {}
    this.gltfs = {}
    this.objects = {}
  }
  loadTexture(url) {
    return new Promise((resolve, reject) => {
      if (this.textures[url]) {
        resolve(this.textures[url])
      } else {
        this.textureLoader.load(url, (e) => {
          if (url.indexOf('base64') === -1) {
            this.textures[url] = e
          }
          resolve(e)
        })
      }
    })
  }
  loadGltf(url) {
    return new Promise((resolve, reject) => {
      if (this.gltfs[url]) {
        resolve(this.gltfs[url])
      } else {
        this.modelLoader.load(url, (e) => {
          this.gltfs[url] = e
          resolve(e)
        })
      }
    })
  }
  loadObjects(url, name) {
    return new Promise((resolve, reject) => {
      const key = name ? url + '?' + name : url
      if (this.objects[url]) {
        if (name) {
          if (this.objects[key]) {
            resolve(this.objects[key])
          } else {
            const obj = this.getObject(this.objects[url], name)
            this.objects[key] = obj
            resolve(this.objects[key])
          }
        } else {
          resolve(this.objects[url])
        }
      } else {
        this.objLoader.load(url, (e) => {
          if (name) {
            const obj = this.getObject(e, name)
            this.objects[url] = e
            this.objects[key] = obj
            resolve(this.objects[key])
          } else {
            this.objects[url] = e
            resolve(e)
          }
        })
      }
    })
  }
  getObject(objs, name) {
    if (objs.name === name) return objs
    for (let i = 0; i < objs.children.length; i++) {
      if (objs.children[i].name === name) return objs.children[i]
    }
    return objs
  }
  getQueryVariable(url, key) {
    var paramStr = url.split('?')
    if (paramStr[1]) {
      var query = paramStr[1]
      var vars = query.split('&')
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=')
        if (pair[0] == key) return pair[1]
      }
    }
    return false
  }
}

export default new NetWork()