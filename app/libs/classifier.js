const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-backend-wasm');

export const classify = async (model, pix) => {
    // PREDICCIÓN
    // Uint8Array -> Tensor 3D RGBA [x,y,4]
    const rgbaTens3d = tf.tensor3d(pix.data, [pix.width, pix.height, 4]);
    // Tensor 3D RGBA [x,y,4] -> Tensor 3D RGB [x,y,3]
    const rgbTens3d = tf.slice3d(rgbaTens3d, [0, 0, 0], [-1, -1, 3])
    // Tensor 3D RGB [x,y,3] -> Tensor 3D RGB [100,100,3]
    const smallImg = tf.image.resizeBilinear(rgbTens3d, [128, 128]);
    // Tensor 3D RGB [100,100,3] -> Tensor 4D RGB [1,100,100,3]
    const tensor = smallImg.reshape([1, 128, 128, 3])
    const prediction = model.predict(tensor).dataSync()[0];
    return prediction;
}

export const loadLowModel = async () => {
    await tf.ready();
    return await tf.loadLayersModel('model/low/model.json')
}

