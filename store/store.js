import { configureStore } from '@reduxjs/toolkit'
import flickrUserReducer from "./FlickrUserSlice";
import harpokratesUserReducer from "./HarpokratesUserSlice";
import photosFilterReducer from "./PhotosFilterSlice";
import networkReducer from "./NetworkSlice";
import storage from 'redux-persist/lib/storage';
import { persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import persistCombineReducers from "redux-persist/es/persistCombineReducers";

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistCombineReducers(persistConfig, {
  flickrUser: flickrUserReducer,
  harpokratesUser: harpokratesUserReducer,
  photosFilter: photosFilterReducer,
  network: networkReducer,
});

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
  }),
})

export const persistor = persistStore(store)
