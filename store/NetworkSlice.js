import { modelNames } from '@/app/libs/modelIndex';
import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  depth: 2,
  size: "degree",
  color: "community",
  spanningTreeK: 10,
  modelName: modelNames.NO_MODEL
};

export const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    changeDepth: (state, action) => {
      state.depth = action.payload;
    },
    changeSize: (state, action) => {
      state.size = action.payload;
    },
    changeColor: (state, action) => {
      state.color = action.payload;
    },
    changeSpanningTreeK: (state, action) => {
      state.spanningTreeK = action.payload;
    },
    changeModelName: (state, action) => {
      state.modelName = action.payload;
    },
    reset: (state, action) => {
      return initialState;
    },
  },
});

export const { changeDepth, changeSize, changeColor, changeModelName, changeSpanningTreeK, reset } = networkSlice.actions;

export const selectDepth = (state) => state.network.depth;
export const selectSize = (state) => state.network.size;
export const selectColor = (state) => state.network.color;
export const selectSpanningTreeK = (state) => state.network.spanningTreeK;
export const selectModelName = (state) => state.network.modelName;

export default networkSlice.reducer;
