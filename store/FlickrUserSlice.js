import { createSlice } from '@reduxjs/toolkit'

export const flickrUserSlice = createSlice({
  name: 'flickrUser',
  initialState: {
    name: '',
    found: null
  },
  reducers: {
    changeName: (state, action) => {
      state.name = action.payload
    },
    wasFound: (state, action) => {
      state.found = true
    },
    wasNotFound: (state, action) => {
      state.found = false
    },
  },
})

export const {
  changeName,
  wasFound,
  wasNotFound,
} = flickrUserSlice.actions

export const selectName = (state) => state.flickrUser.name

export default flickrUserSlice.reducer
