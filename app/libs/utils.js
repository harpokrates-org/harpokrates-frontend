import { models } from "@/app/libs/modelIndex";
import { getUserPhotoSizes } from "../api/UserAPI";

export const fetchModel = async (modelName) => {
  const model = models[modelName];
  await model.load();
  return model;
};

export const getFilter = async (prediction, modelThreshold) => {
  const stegoFilter =
    "grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(600%) contrast(0.8)";
  const filter = prediction >= modelThreshold ? stegoFilter : "";
  return filter;
};
export const fetchUserPhotoSizes = async (userID, minDate, maxDate) => {
  if (!userID) return;
  const count = 12;
  const res = await getUserPhotoSizes(
    userID,
    count,
    Date.parse(minDate),
    Date.parse(maxDate)
  );
  if (res.status != "200") {
    toast.error("Error al cargar las fotos");
    return;
  }

  const _photos = await Promise.all(
    res.data.photos.map(async (p) => {
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
