import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: '',
  id: '',
  photos: [],
  network: { nodes:[], edges:[] },
  favorites: {},
  photosAreUpdated: true,
  networkIsUpdated: true,
  
  // Esquema de ejemplo de las predicciones
  //  
  // { 
  //     'efficientnet: [
  //          { source: ..., prediction: 0.9 }, 
  //          { source: ..., prediction: 0.8 }
  //     ],
  //     'mobilenet': [],
  //     'sin modelo': []
  // }  
  photoPredictions: {}
}

export const flickrUserSlice = createSlice({
  name: 'flickrUser',
  initialState,
  reducers: {
    userFound: (state, action) => {
      return {
        ...initialState,
        name: action.payload.name,
        id: action.payload.id,
        photosAreUpdated: false,
        networkIsUpdated: false,
      }
    },
    setPhotos: (state, action) => {
      state.photos = action.payload
      state.photosAreUpdated = true
    },
    setNetwork: (state, action) => {
      state.network = action.payload
      state.networkIsUpdated = true
    },
    setFavorites: (state, action) => {
      state.favorites = action.payload
    },
    resetFavorites: (state, action) => {
      state.favorites = initialState.favorites
    },
    mustUpdatePhotos: (state, action) => {
      state.photosAreUpdated = false
    },
    mustUpdateNetwork: (state, action) => {
      state.networkIsUpdated = false
    },
    reset: (state, action) => {
      return initialState
    },
    setPhotoPredictions: (state, action) => {
      state.photoPredictions = action.payload
    },
  },
})

export const {
  userFound,
  setPhotos,
  setNetwork,
  setFavorites,
  resetFavorites,
  mustUpdatePhotos,
  mustUpdateNetwork,
  reset,
  setPhotoPredictions
} = flickrUserSlice.actions

export const selectName = (state) => state.flickrUser.name
export const selectId = (state) => state.flickrUser.id
export const selectPhotos = (state) => state.flickrUser.photos
export const selectNetwork = (state) => state.flickrUser.network
export const selectFavorites = (state) => state.flickrUser.favorites
export const selectPhotosAreUpdated = (state) => state.flickrUser.photosAreUpdated
export const selectNetworkIsUpdated = (state) => state.flickrUser.networkIsUpdated
export const selectPhotoPredictions = (state) => state.flickrUser.photoPredictions


export default flickrUserSlice.reducer
