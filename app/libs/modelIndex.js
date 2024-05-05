const LowModel = require("./LowModel");
const NoModel = require("./NoModel");

const modelNames = {
  NO_MODEL: 'no_model',
  LOW_MODEL: 'low_model',
}

module.exports = {
  models: {
    [modelNames.NO_MODEL]: NoModel,
    [modelNames.LOW_MODEL]: LowModel
  },
  modelNames
}
