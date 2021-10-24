import Object3d from '@/core/Object3d'

export default class Box extends Object3d {
  constructor(option) {
    super(option)
    this.buildType = 'object'
  }
}