class ModelLoadError extends Error {
  constructor() {
    super('Error al cargar el modelo');
  }
}

module.exports = ModelLoadError;
