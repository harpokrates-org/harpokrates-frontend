import { configureStore } from '@reduxjs/toolkit'
import flickrUserReducer from "./FlickrUserSlice";

export default configureStore({
  reducer: {
    flickrUser: flickrUserReducer,
  },
})
