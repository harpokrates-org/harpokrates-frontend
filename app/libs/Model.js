const tf = require("@tensorflow/tfjs");
const pixels = require("image-pixels");
const ModelLoadError = require("./ModelError");

// Elimina los mensajes de log de tensorflow
// https://discuss.tensorflow.org/t/removing-the-standard-hi-there-you-are-using-tensorflow-js/13718/3
tf.env().set("PROD", true);

class Model {
  constructor(imgSize, path, threshold, fromTFHub) {
    this.model = null;
    this.imgSize = imgSize;
    this.path = path;
    this.threshold = threshold;
    this.fromTFHub = fromTFHub;
  }

  async load() {
    if (this.model) return this.model;
    await tf.ready();
    try {
      this.model = await tf.loadGraphModel(this.path, {
        fromTFHub: this.fromTFHub,
      });
    } catch (error) {
      throw new ModelLoadError()
    }
    return this.model;
  }

  async getPrediction(src) {
    const pix = await pixels(src);
    const tensor = this._tensor(pix);
    const prediction = await this._classify(tensor);
    return prediction;
  }

  _tensor(pix) {
    // Uint8Array -> Tensor 3D RGBA [x,y,4]
    const rgbaTens3d = tf.tensor3d(pix.data, [pix.width, pix.height, 4]);
    // Tensor 3D RGBA [x,y,4] -> Tensor 3D RGB [x,y,3]
    const rgbTens3d = tf.slice3d(rgbaTens3d, [0, 0, 0], [-1, -1, 3]);
    // Tensor 3D RGB [x,y,3] -> Tensor 3D RGB [100,100,3]
    const smallImg = tf.image.resizeBilinear(rgbTens3d, [
      this.imgSize,
      this.imgSize,
    ]);
    // Tensor 3D RGB [100,100,3] -> Tensor 4D RGB [1,100,100,3]
    return smallImg.reshape([1, this.imgSize, this.imgSize, 3]);
  }

  async _classify(tensor) {
    const prediction = this.model.predict(tensor).dataSync()[0];
    return prediction;
  }
}

module.exports = Model;
