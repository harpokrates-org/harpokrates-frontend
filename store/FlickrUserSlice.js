import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: '',
  id: '',
  photos: [],
  network: { nodes:[], edges:[] },
  photosAreUpdated: true,
  networkIsUpdated: true,
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
    mustUpdatePhotos: (state, action) => {
      state.photosAreUpdated = false
    },
    mustUpdateNetwork: (state, action) => {
      state.networkIsUpdated = false
    },
    reset: (state, action) => {
      return initialState
    },
  },
})

export const {
  userFound,
  setPhotos,
  setNetwork,
  mustUpdatePhotos,
  mustUpdateNetwork,
  reset,
} = flickrUserSlice.actions

export const selectName = (state) => state.flickrUser.name
export const selectId = (state) => state.flickrUser.id
export const selectPhotos = (state) => state.flickrUser.photos
export const selectNetwork = (state) => state.flickrUser.network
export const selectPhotosAreUpdated = (state) => state.flickrUser.photosAreUpdated
export const selectNetworkIsUpdated = (state) => state.flickrUser.networkIsUpdated

export default flickrUserSlice.reducer
