import { createSlice } from '@reduxjs/toolkit'

export const flickrUserSlice = createSlice({
  name: 'flickrUser',
  initialState: {
    name: '',
    id: '',
    found: null
  },
  reducers: {
    changeName: (state, action) => {
      state.name = action.payload
    },
    changeId: (state, action) => {
      state.id = action.payload
    },
    wasFound: (state) => {
      state.found = true
    },
    wasNotFound: (state, action) => {
      state.found = false
    },
  },
})

export const {
  changeName,
  changeId,
  wasFound,
  wasNotFound,
} = flickrUserSlice.actions

export const selectName = (state) => state.flickrUser.name
export const selectId = (state) => state.flickrUser.id

export default flickrUserSlice.reducer
