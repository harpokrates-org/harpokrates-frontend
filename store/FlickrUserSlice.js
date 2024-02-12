import { createSlice } from '@reduxjs/toolkit'

export const flickrUserSlice = createSlice({
  name: 'flickrUser',
  initialState: {
    name: 'hola mundo',
  },
  reducers: {
    changeName: (state, action) => {
      state.name = action.payload
    },
  },
})

export const { changeName } = flickrUserSlice.actions

export const selectName = (state) => state.flickrUser.name

export default flickrUserSlice.reducer
