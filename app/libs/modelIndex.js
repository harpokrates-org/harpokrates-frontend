const NoModel = require("./NoModel");
const Model = require("./Model");

const MAIN_PATH = 'model'

const modelNames = {
  NO_MODEL: 'no_model',
  LOW_MODEL: 'low_model',
  EFFICIENTNETV2S_MODEL: 'efficientnetv2s',
  MOBILENETV3S_MODEL: 'mobilenetv3s',
}

const modelsData = {
  NO_MODEL: {
    name: modelNames.NO_MODEL,
    imgSize: 0,
    path: null,
    threshold: 1
  },
  LOW_MODEL: {
    name: modelNames.LOW_MODEL,
    imgSize: 128,
    path: MAIN_PATH + '/low/model.json',
    threshold: 0.7
  },
  EFFICIENTNETV2S_MODEL: {
    name: modelNames.EFFICIENTNETV2S_MODEL,
    imgSize: 512,
    path: MAIN_PATH + '/efficientnetv2s/model.json',
    threshold: 0.731941
  },
  MOBILENETV3S_MODEL: {
    name: modelNames.MOBILENETV3S_MODEL,
    imgSize: 512,
    path: MAIN_PATH + '/mobilenetv3s/model.json',
    threshold: 0.724572
  },
}

module.exports = {
  models: {
    [modelsData.NO_MODEL.name]: NoModel,
    [modelsData.LOW_MODEL.name]: new Model(modelsData.LOW_MODEL.imgSize, modelsData.LOW_MODEL.path, modelsData.LOW_MODEL.threshold),
    [modelsData.EFFICIENTNETV2S_MODEL.name]: new Model(modelsData.EFFICIENTNETV2S_MODEL.imgSize, modelsData.EFFICIENTNETV2S_MODEL.path, modelsData.EFFICIENTNETV2S_MODEL.threshold),
    [modelsData.MOBILENETV3S_MODEL.name]: new Model(modelsData.MOBILENETV3S_MODEL.imgSize, modelsData.MOBILENETV3S_MODEL.path, modelsData.MOBILENETV3S_MODEL.threshold),
  },
  modelNames
}
