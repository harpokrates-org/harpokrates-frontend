import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: '',
  email: '',
  graphConfig: {
    depth: 2
  }
}

export const harpokratesUserSlice = createSlice({
  name: 'harpokratesUser',
  initialState,
  reducers: {
    changeEmail: (state, action) => {
      state.email = action.payload
    },
    changeGraphConfig: (state, action) => {
      state.graphConfig = action.payload
    },
    reset: (state, action) => {
      return initialState
    },
  },
})

export const {
  changeEmail,
  changeGraphConfig,
  reset
} = harpokratesUserSlice.actions

export const selectEmail = (state) => state.harpokratesUser.email
export const selectGraphConfig = (state) => state.harpokratesUser.graphConfig

export default harpokratesUserSlice.reducer
