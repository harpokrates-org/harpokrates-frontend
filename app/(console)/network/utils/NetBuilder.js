import { appModelNames } from "@/app/libs/AppModelIndex";
import { predict } from "@/app/libs/utils";
import chroma from "chroma-js";
const R = require("ramda");
import toast from "react-hot-toast";

const COLOR_KEY = "group";
const SIZE_KEY = "val";
const COVER_COLOR_IN_HEXA = 0x00FF00; // green
export class NetBuilder {
  _matchPositivesToColors(positives) {
    const positiveValues = Object.entries(positives).map((entry) => {
      const value = entry[1];
      return value;
    });
    const maxPositiveValue = R.apply(Math.max, positiveValues);
    const scale = chroma.scale(["pink", "red"]);

    const userColors = Object.entries(positives).map((entry) => {
      const key = entry[0];
      const value = entry[1];
      const res = {};


      if (value == 0) {
        res[key] = COVER_COLOR_IN_HEXA
        return res;
      }

      res[key] = Number(
        scale(value / maxPositiveValue)
          .hex()
          .replace("#", "0x")
      );
      return res;
    });
    return Object.assign({}, ...userColors);
  }

  _setNodeWeights(net, weightKey, weights) {
    for (let node of net.nodes) {
      if (Object.keys(weights).includes(node.id)) {
        node[weightKey] = weights[node.id];
      }
    }
    return net;
  }

  _countPositives(model, predictions) {
    const count = R.sum(
      predictions.map((p) => {
        if (model.threshold < p.prediction) {
          return 1;
        } else {
          return 0;
        }
      })
    );
    return count;
  }

  async _countPositivesInNetwork(model, networkPhotos, pastPredictions) {
    const positives = await toast.promise(Promise.all(
      networkPhotos.map(async (userPhotos) => {
        const predictions = await predict(
          model,
          model.threshold,
          userPhotos.photoSizes,
          pastPredictions
        );
        const positives = this._countPositives(model, predictions);
        const res = {};
        res[userPhotos.flickrUserName] = positives;
        return res;
      })
    ), {
      loading: "Aplicando el modelo a las imagenes",
      success: "Predicciones completas",
      error: "Error al predecir las imagenes",
    }
  
  );
    const positiveUsers = Object.assign({}, ...positives);
    return positiveUsers;
  }

  async _addPositivesAsignedToKey(net, model, networkPhotos, key, pastPredictions) {
    const positives = await this._countPositivesInNetwork(model, networkPhotos, pastPredictions);
    return this._setNodeWeights(net, key, positives);
  }

  async _updateSizesByStegoCount(net, model, networkPhotos, pastPredictions) {
    return this._addPositivesAsignedToKey(net, model, networkPhotos, SIZE_KEY, pastPredictions);
  }

  async _updateColorsByStegoCount(net, model, networkPhotos, pastPredictions) {
    const positives = await this._countPositivesInNetwork(model, networkPhotos, pastPredictions);
    const colorsPerUser = this._matchPositivesToColors(positives);
    return this._setNodeWeights(net, COLOR_KEY, colorsPerUser);
  }

  async build(socialNetwork, size, color, spanningTreeK, model, networkPhotos, pastPredictions) {
    const config = JSON.stringify({
      color: color,
      size: size,
      spanning_tree_k: spanningTreeK,
    });
    let net = JSON.parse(socialNetwork.get_net(config));
    if (model == appModelNames.NO_MODEL) {
      return net;
    }

    if (size == "stego-count") {
      net = await this._updateSizesByStegoCount(net, model, networkPhotos, pastPredictions);
    } else if (color == "stego-count") {
      net = await this._updateColorsByStegoCount(net, model, networkPhotos, pastPredictions);
    }
    return net;
  }
}
