import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: '',
  email: '',
  graphDepth: 2
}

export const harpokratesUserSlice = createSlice({
  name: 'harpokratesUser',
  initialState,
  reducers: {
    changeEmail: (state, action) => {
      state.email = action.payload
    },
    changeGraphDepth: (state, action) => {
      state.graphDepth = action.payload
    },
    reset: (state, action) => {
      return initialState
    },
  },
})

export const {
  changeEmail,
  changeGraphDepth,
  reset
} = harpokratesUserSlice.actions

export const selectEmail = (state) => state.harpokratesUser.email
export const selectGraphDepth = (state) => state.harpokratesUser.graphDepth

export default harpokratesUserSlice.reducer
