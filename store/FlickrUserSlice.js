import { createSlice } from '@reduxjs/toolkit'

export const flickrUserSlice = createSlice({
  name: 'flickrUser',
  initialState: {
    name: '',
    id: '',
    found: null,
    photos: [],
  },
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
  },
})

export const {
  changeName,
  changeId,
  setPhotos,
} = flickrUserSlice.actions

export const selectName = (state) => state.flickrUser.name
export const selectId = (state) => state.flickrUser.id
export const selectPhotos = (state) => state.flickrUser.photos

export default flickrUserSlice.reducer
