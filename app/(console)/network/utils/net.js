import { getUserName } from "@/app/api/UserAPI";
import modelIndex, { modelNames } from "@/app/libs/modelIndex";
import { fetchUserPhotoSizes, predict } from "@/app/libs/utils";
const R = require("ramda");

const setNewVals = (net, newVals) => {
  for (let node of net.nodes) {
    if (Object.keys(newVals).includes(node.id)) {
      node.val = newVals[node.id]
    }
  }
  return net
} 

const countPositives = (model, predictions) => {
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
};

const buildNetStegoCount = async (socialNetwork, model, config, networkPhotos) => {
  const positives = await Promise.all(networkPhotos.map(async userPhotos => {
    const predictions = await predict(model, model.threshold, userPhotos.photoSizes);
    const positives = countPositives(model, predictions);
    const res = {};
    res[userPhotos.flickrUserName] = positives;
    return res;
  }));

  //  Mergea todos los { user: id, val: } en un unico objecto
  const positiveUsers = Object.assign({}, ...positives);
  let net = JSON.parse(socialNetwork.get_net(config));
  net = setNewVals(net, positiveUsers);
  return net
};

export const buildNet = async (socialNetwork, size, color, model, networkPhotos) => {
  let net;
  const config = JSON.stringify({ color: color, size: size });

  if (size == "stego-count" && model != modelNames.NO_MODEL) {
    net = await buildNetStegoCount(socialNetwork, model, config, networkPhotos);
  } else {
    net = JSON.parse(socialNetwork.get_net(config));
  }
  return net;
};
