const tf = require("@tensorflow/tfjs");
const pixels = require("image-pixels");

// Elimina los mensajes de log de tensorflow
// https://discuss.tensorflow.org/t/removing-the-standard-hi-there-you-are-using-tensorflow-js/13718/3
tf.env().set("PROD", true);

const IMG_SIZE = 512;
const THRESHOLD = 0.731941;

class Efficientnetv2s {
  constructor() {
    this.model = null
    this.threshold = THRESHOLD
  }
  
  async load() {
    if (this.model) return this.model
    await tf.ready();
    this.model = await tf.loadGraphModel("model/efficientnetv2s/model.json");
    return this.model
  };
  
  async getPrediction(src) {
    const pix = await pixels(src);
    const prediction = await this._classify(pix);
    return prediction;
  };

  async _classify(pix) {
    // PREDICCIÓN
    // Uint8Array -> Tensor 3D RGBA [x,y,4]
    const rgbaTens3d = tf.tensor3d(pix.data, [pix.width, pix.height, 4]);
    // Tensor 3D RGBA [x,y,4] -> Tensor 3D RGB [x,y,3]
    const rgbTens3d = tf.slice3d(rgbaTens3d, [0, 0, 0], [-1, -1, 3]);
    // Tensor 3D RGB [x,y,3] -> Tensor 3D RGB [100,100,3]
    const smallImg = tf.image.resizeBilinear(rgbTens3d, [IMG_SIZE, IMG_SIZE]);
    // Tensor 3D RGB [100,100,3] -> Tensor 4D RGB [1,100,100,3]
    const tensor = smallImg.reshape([1, IMG_SIZE, IMG_SIZE, 3]);
    const prediction = this.model.predict(tensor).dataSync()[0];
    return prediction;
  };
}

module.exports = new Efficientnetv2s()
