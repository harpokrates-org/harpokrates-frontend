const LowModel = require("./LowModel");
const NoModel = require("./NoModel");
const Efficientnetv2s = require("./Efficientnetv2sModel");


const modelNames = {
  NO_MODEL: 'no_model',
  LOW_MODEL: 'low_model',
  EFFICIENTNETV2S_MODEL: 'efficientnetv2s',
}

module.exports = {
  models: {
    [modelNames.NO_MODEL]: NoModel,
    [modelNames.LOW_MODEL]: LowModel,
    [modelNames.EFFICIENTNETV2S_MODEL]: Efficientnetv2s
  },
  modelNames
}
