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

const buildNetStegoCount = async (socialNetwork, model, config) => {
  console.log("socialNetwork:", socialNetwork);
  const topUsers = JSON.parse(socialNetwork.get_top_users("degree", 10));
  console.log("top users: ", topUsers);
  const positives = await Promise.all(
    topUsers.map(async (flickrUserName) => {
      const resUserName = await getUserName(flickrUserName);
      const userID = resUserName.data.id;
      const today = new Date().toJSON();
      const photoSizes = await fetchUserPhotoSizes(
        userID,
        "1970-01-01",
        today,
        "Medium"
      );
      const predictions = await predict(model, model.threshold, photoSizes);
      const positives = countPositives(model, predictions);
      const res = {};
      res[flickrUserName] = positives;
      return res;
    })
  );

  //  Mergea todos los { user: id, val: } en un unico objecto
  const positiveUsers = Object.assign({}, ...positives);
  let net = JSON.parse(socialNetwork.get_net(config));
  net = setNewVals(net, positiveUsers);
  return net
};

export const buildNet = async (socialNetwork, size, color, model) => {
  let net;
  const config = JSON.stringify({ color: color, size: size });

  if (size == "stego-count" && model != modelNames.NO_MODEL) {
    net = await buildNetStegoCount(socialNetwork, model, config);
  } else {
    net = JSON.parse(socialNetwork.get_net(config));
  }
  return net;
};
