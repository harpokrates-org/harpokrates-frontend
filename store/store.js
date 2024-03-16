import { configureStore } from '@reduxjs/toolkit'
import flickrUserReducer from "./FlickrUserSlice";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import persistCombineReducers from "redux-persist/es/persistCombineReducers";

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistCombineReducers(persistConfig, {
  flickrUser: flickrUserReducer,
});

export const store = configureStore({
  reducer: persistedReducer,
})

export const persistor = persistStore(store)
