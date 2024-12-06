const NoModel = require("./NoModel");
const Model = require("./Model");

const MAIN_PATH = 'model'

const appModelNames = {
  NO_MODEL: 'Sin Modelo',
  EFFICIENTNETV2B0_MODEL: 'EfficientNet',
  MOBILENETV3L_MODEL: 'MobileNet',
  INCEPTIONV3_MODEL: 'InceptionNet',
  VGG16_MODEL: 'VGG16',
  RESNET_MODEL: 'ResNet',
}

const modelsData = {
  NO_MODEL: {
    name: appModelNames.NO_MODEL,
    imgSize: 0,
    path: null,
    threshold: 1
  },
  EFFICIENTNETV2B0_MODEL: {
    name: appModelNames.EFFICIENTNETV2B0_MODEL,
    imgSize: 512,
    path: MAIN_PATH + '/efficientnetv2b0/model.json',
    threshold: 0.776584
  },
  MOBILENETV3L_MODEL: {
    name: appModelNames.MOBILENETV3L_MODEL,
    imgSize: 512,
    path: MAIN_PATH + '/mobilenetv3l/model.json',
    threshold: 0.747543
  },
  INCEPTIONV3_MODEL: {
    name: appModelNames.INCEPTIONV3_MODEL,
    imgSize: 512,
    path: MAIN_PATH + '/inceptionv3/model.json',
    threshold: 0.752816
  },
  VGG16_MODEL: {
    name: appModelNames.VGG16_MODEL,
    imgSize: 512,
    path: MAIN_PATH + '/vgg16/model.json',
    threshold: 0.756955
  },
  RESNET_MODEL: {
    name: appModelNames.RESNET_MODEL,
    imgSize: 512,
    path: MAIN_PATH + '/resnet/model.json',
    threshold: 0.724572
  },
}

module.exports = {
  appModels: {
    [modelsData.NO_MODEL.name]: NoModel,
    [modelsData.EFFICIENTNETV2B0_MODEL.name]: new Model(modelsData.EFFICIENTNETV2B0_MODEL.imgSize, modelsData.EFFICIENTNETV2B0_MODEL.path, modelsData.EFFICIENTNETV2B0_MODEL.threshold),
    [modelsData.MOBILENETV3L_MODEL.name]: new Model(modelsData.MOBILENETV3L_MODEL.imgSize, modelsData.MOBILENETV3L_MODEL.path, modelsData.MOBILENETV3L_MODEL.threshold),
    [modelsData.INCEPTIONV3_MODEL.name]: new Model(modelsData.INCEPTIONV3_MODEL.imgSize, modelsData.INCEPTIONV3_MODEL.path, modelsData.INCEPTIONV3_MODEL.threshold),
    [modelsData.VGG16_MODEL.name]: new Model(modelsData.VGG16_MODEL.imgSize, modelsData.VGG16_MODEL.path, modelsData.VGG16_MODEL.threshold),
    [modelsData.RESNET_MODEL.name]: new Model(modelsData.RESNET_MODEL.imgSize, modelsData.RESNET_MODEL.path, modelsData.RESNET_MODEL.threshold),
  },
  appModelNames
}
