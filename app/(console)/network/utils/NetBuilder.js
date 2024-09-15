import { modelNames } from "@/app/libs/modelIndex";
import { predict } from "@/app/libs/utils";
const R = require("ramda");

const COLOR_KEY = "group";
const SIZE_KEY = "vals";
export class NetBuilder {
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

  async _countPositivesInNetwork(model, networkPhotos) {
    console.log('networkPhotos', networkPhotos)
    const positives = await Promise.all(
      networkPhotos.map(async (userPhotos) => {
        const predictions = await predict(
          model,
          model.threshold,
          userPhotos.photoSizes
        );
        const positives = this._countPositives(model, predictions);
        const res = {};
        res[userPhotos.flickrUserName] = positives;
        return res;
      })
    );
    const positiveUsers = Object.assign({}, ...positives);
    return positiveUsers;
  }

  async _AddPositivesAsignedToKey(net, model, networkPhotos, key) {
    const positives = await this._countPositivesInNetwork(model, networkPhotos);
    return this._setNodeWeights(net, key, positives);
  }

  async _updateSizesByStegoCount(net, model, networkPhotos) {
    return this._AddPositivesAsignedToKey(net, model, networkPhotos, SIZE_KEY);
  }

  async _updateColorsByStegoCount(net, model, networkPhotos) {
    return this._AddPositivesAsignedToKey(net, model, networkPhotos, COLOR_KEY);
  }

  async build(socialNetwork, size, color, spanningTreeK, model, networkPhotos) {
    const config = JSON.stringify({
      color: color,
      size: size,
      spanning_tree_k: spanningTreeK,
    });
    let net = JSON.parse(socialNetwork.get_net(config));
    if (model == modelNames.NO_MODEL) {
      return net;
    }

    if (size == "stego-count") {
      net = await this._updateSizesByStegoCount(
        net,
        model,
        networkPhotos
      );
    } else if (color == "stego-count") {
      net = await this._updateColorsByStegoCount(
        net,
        model,
        networkPhotos
      );
    }
    return net;
  }
}
