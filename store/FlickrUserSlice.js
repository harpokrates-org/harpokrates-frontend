import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: '',
  id: '',
  found: null,
  photos: [],
}

export const flickrUserSlice = createSlice({
  name: 'flickrUser',
  initialState,
  reducers: {
    changeName: (state, action) => {
      state.name = action.payload
    },
    changeId: (state, action) => {
      state.id = action.payload
    },
    setPhotos: (state, action) => {
      state.photos = action.payload
    },
    reset: (state, action) => {
      return initialState
    },
  },
})

export const {
  changeName,
  changeId,
  setPhotos,
  reset,
} = flickrUserSlice.actions

export const selectName = (state) => state.flickrUser.name
export const selectId = (state) => state.flickrUser.id
export const selectPhotos = (state) => state.flickrUser.photos

export default flickrUserSlice.reducer
