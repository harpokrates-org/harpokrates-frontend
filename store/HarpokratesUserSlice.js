import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: '',
  email: '',
  models: []
}

export const harpokratesUserSlice = createSlice({
  name: 'harpokratesUser',
  initialState,
  reducers: {
    changeEmail: (state, action) => {
      state.email = action.payload
    },
    changeModels: (state, action) => {
      state.models = action.payload
    },
    reset: (state, action) => {
      return initialState
    },
  },
})

export const {
  changeEmail,
  changeModels,
  reset
} = harpokratesUserSlice.actions

export const selectEmail = (state) => state.harpokratesUser.email
export const selectModels = (state) => state.harpokratesUser.models


export default harpokratesUserSlice.reducer
