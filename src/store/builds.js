import * as Grass from '@/model/box/grassBox'
import * as Soil from '@/model/box/soilBox'

import * as Berries from '@/model/object/berries'

export default {
  box: [{
    code: 'Grass',
    asset: Grass.asset,
    getModel: Grass.getGrassBox,
    count: 1,
  }, {
    code: 'Soil',
    asset: Soil.asset,
    getModel: Soil.getSoilBox,
    count: 2,
  }],
  object: [{
    asset: Berries.asset,
    getModel: Berries.getBerries,
    count: 1,
  }]
}