import { models } from "@/app/libs/AppModelIndex";
import { getUserFavorites, getUserPhotoSizes } from "../api/UserAPI";
import { collectModels } from "./ModelCollection";
const R = require("ramda");

export const fetchModel = async (modelCollection, modelName) => {
  const model = modelCollection[modelName];
  await model.load();
  return model;
};

export const getFilter = async (prediction, modelThreshold) => {
  const stegoFilter =
    "grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(600%) contrast(0.8)";
  const filter = prediction >= modelThreshold ? stegoFilter : "";
  return filter;
};
export const fetchUserPhotoSizes = async (userID, minDate, maxDate, label) => {
  if (!userID) return;
  const count = 12;
  try {
    const data = await getUserPhotoSizes(
      userID,
      count,
      Date.parse(minDate),
      Date.parse(maxDate)
    );

    const _photos = await Promise.all(
      data.photos.map(async (p) => {
        const size = R.filter((e) => e.label == label, p.sizes)[0];
        const filter = await getFilter(0);
        return {
          id: p.id,
          title: p.title,
          source: size.source,
          height: size.height,
          width: size.width,
          filter,
        };
      })
    );
    return _photos;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const fetchUserFavorites = async (username, photoIDs) => {
  if (!username) return;
  const photosPerFavorite = 0;
  const depth = 1;
  const originIndex = 0;
  try {
    const response = await getUserFavorites(
      username,
      photoIDs,
      photosPerFavorite,
      depth
    );

    const favorites = response.data.edges.reduce(
      (accumulator, currentValue) => {
        accumulator[currentValue[originIndex]] = (accumulator[currentValue[originIndex]] || 0) + 1
        return accumulator
      },
      {},
    );

    return favorites;
  } catch (err) {
    console.log(err);
    return {};
  }
};

export const predict = async (model, modelThreshold, photos) => {
  if (!model) return;
  const _photos = await Promise.all(
    photos.map(async (p) => {
      const prediction = await model.getPrediction(p.source);
      const filter = await getFilter(prediction, modelThreshold);
      return {
        ...p,
        filter: filter,
        prediction: prediction,
      };
    })
  );
  return _photos;
};
