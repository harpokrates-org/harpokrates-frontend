import { configureStore } from '@reduxjs/toolkit'
import flickrUserReducer from "./FlickrUserSlice";
import searchAlertReducer from "./SearchAlertSlice";

export default configureStore({
  reducer: {
    flickrUser: flickrUserReducer,
    searchAlert: searchAlertReducer,
  },
})
