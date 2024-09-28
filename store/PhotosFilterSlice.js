import { appModelNames } from "@/app/libs/AppModelIndex";
import { createSlice } from "@reduxjs/toolkit";

const today = new Date();
const initialState = {
  minDate: new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 6
  ).toISOString(),
  maxDate: today.toISOString(),
  modelName: appModelNames.NO_MODEL,
  modelThreshold: 1,
};

export const photosFilterSlice = createSlice({
  name: "photosFilter",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      const modifiedState = {
        minDate: action.payload.minDate,
        maxDate: action.payload.maxDate,
        modelName: action.payload.modelName,
        modelThreshold: action.payload.modelThreshold,
      };
      return modifiedState;
    },
    photosUpdated(state) {
      state.shouldUpdatePhotos = false;
    },
    changePreferencies(state, action) {
      state.modelName = action.payload.modelName
    }
  },
});

export const {
  setFilters,
  photosUpdated,
  changePreferencies,
} = photosFilterSlice.actions

export const selectFilters = (state) => state.photosFilter;

export default photosFilterSlice.reducer;
