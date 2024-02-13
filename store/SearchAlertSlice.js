import { createSlice } from '@reduxjs/toolkit'

export const searchAlertSlice = createSlice({
  name: 'searchAlert',
  initialState: {
    open: false
  },
  reducers: {
    open: (state, action) => {
      state.open = true
    },
    close: (state, action) => {
      state.open = false
    },
  },
})

export const {
  open,
  close,
} = searchAlertSlice.actions

export default searchAlertSlice.reducer
