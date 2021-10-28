import Object3d from '@/core/Object3d'
import { material } from '@/common/material/box'

export default class Box extends Object3d {
  constructor(option, attribute) {
    super({ ...option, material }, attribute)
    this.buildType = 'box'
  }
}