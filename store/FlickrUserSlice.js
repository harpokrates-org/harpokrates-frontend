import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: '',
  id: '',
  photos: [],
  userChanged: false,
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
        userChanged: true,
      }
    },
    setPhotos: (state, action) => {
      state.photos = action.payload
    },
    userWasEstablished: (state, action) => {
      state.userChanged = false
    },
    reset: (state, action) => {
      return initialState
    },
  },
})

export const {
  userFound,
  setPhotos,
  userWasEstablished,
  reset,
} = flickrUserSlice.actions

export const selectName = (state) => state.flickrUser.name
export const selectId = (state) => state.flickrUser.id
export const selectPhotos = (state) => state.flickrUser.photos
export const selectUserChanged = (state) => state.flickrUser.userChanged

export default flickrUserSlice.reducer
