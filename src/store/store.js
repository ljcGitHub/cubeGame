import Bus from './bus'
import { builds } from './builds'

export const state = {
  // 建造方块
  builds,
  buildSelectCode: '', // 建造的选中的对象code
  tabValue: '', // 弹窗的选中内容
}

export const mutations = {
  closeDialog() {
    Bus.off('closeBuildDialog')
  }
}
