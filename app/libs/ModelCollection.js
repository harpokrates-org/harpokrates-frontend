import { appModels } from "./AppModelIndex";
import loadUserModels from "./UserModels";

export function collectModels(userModels) {
  const loadedUserModels = loadUserModels(userModels);
  return {...appModels, ...loadedUserModels}
}

export function collectModelNames(userModels) {
  const models = collectModels(userModels);
  const modelNames = Object.keys(models); 
  return modelNames
}