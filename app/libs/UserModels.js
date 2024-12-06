import { useSelector } from "react-redux";
import Model from "./Model";

export default function loadUserModels(userModels) {
  const modelsByName = {};
  for (const model of userModels) {
    const fromTFHub = true;
    modelsByName[model.name] = new Model(
      model.imageSize,
      model.url,
      model.threshold,
      fromTFHub
    );
  }
  return modelsByName;
}

