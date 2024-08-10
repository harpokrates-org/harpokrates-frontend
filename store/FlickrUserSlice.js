import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: '',
  id: '',
  photos: [],
  photosAreUpdated: true,
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
      }
    },
    setPhotos: (state, action) => {
      state.photos = action.payload
      state.photosAreUpdated = true
    },
    mustUpdatePhotos: (state, action) => {
      state.photosAreUpdated = false
    },
    reset: (state, action) => {
      return initialState
    },
  },
})

export const {
  userFound,
  setPhotos,
  mustUpdatePhotos,
  reset,
} = flickrUserSlice.actions

export const selectName = (state) => state.flickrUser.name
export const selectId = (state) => state.flickrUser.id
export const selectPhotos = (state) => state.flickrUser.photos
export const selectNetwork = (state) => state.flickrUser.network
export const selectPhotosAreUpdated = (state) => state.flickrUser.photosAreUpdated

export default flickrUserSlice.reducer
