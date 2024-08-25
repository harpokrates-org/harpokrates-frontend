const NoModel = require("./NoModel");
const Model = require("./Model");

const MAIN_PATH = 'model'

const modelNames = {
  NO_MODEL: 'no_model',
  LOW_MODEL: 'low_model',
  EFFICIENTNETV2B0_MODEL: 'efficientnetv2b0',
  MOBILENETV3L_MODEL: 'mobilenetv3l',
  INCEPTIONV3_MODEL: 'inceptionv3',
  VGG16_MODEL: 'vgg16',
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
  EEFFICIENTNETV2B0_MODEL: {
    name: modelNames.EFFICIENTNETV2B0_MODEL,
    imgSize: 512,
    path: MAIN_PATH + '/efficientnetv2b0/model.json',
    threshold: 0.776584
  },
  MOBILENETV3L_MODEL: {
    name: modelNames.MOBILENETV3L_MODEL,
    imgSize: 512,
    path: MAIN_PATH + '/mobilenetv3l/model.json',
    threshold: 0.747543
  },
  INCEPTIONV3_MODEL: {
    name: modelNames.INCEPTIONV3_MODEL,
    imgSize: 512,
    path: MAIN_PATH + '/inceptionv3/model.json',
    threshold: 0.752816
  },
  VGG16_MODEL: {
    name: modelNames.VGG16_MODEL,
    imgSize: 512,
    path: MAIN_PATH + '/vgg16/model.json',
    threshold: 0.756955
  },
}

module.exports = {
  models: {
    [modelsData.NO_MODEL.name]: NoModel,
    [modelsData.LOW_MODEL.name]: new Model(modelsData.LOW_MODEL.imgSize, modelsData.LOW_MODEL.path, modelsData.LOW_MODEL.threshold),
    [modelsData.EEFFICIENTNETV2B0_MODEL.name]: new Model(modelsData.EEFFICIENTNETV2B0_MODEL.imgSize, modelsData.EEFFICIENTNETV2B0_MODEL.path, modelsData.EEFFICIENTNETV2B0_MODEL.threshold),
    [modelsData.MOBILENETV3L_MODEL.name]: new Model(modelsData.MOBILENETV3L_MODEL.imgSize, modelsData.MOBILENETV3L_MODEL.path, modelsData.MOBILENETV3L_MODEL.threshold),
    [modelsData.INCEPTIONV3_MODEL.name]: new Model(modelsData.INCEPTIONV3_MODEL.imgSize, modelsData.INCEPTIONV3_MODEL.path, modelsData.INCEPTIONV3_MODEL.threshold),
    [modelsData.VGG16_MODEL.name]: new Model(modelsData.VGG16_MODEL.imgSize, modelsData.VGG16_MODEL.path, modelsData.VGG16_MODEL.threshold),
  },
  modelNames
}
