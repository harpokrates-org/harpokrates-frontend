import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: '',
  email: '',
}

export const harpokratesUserSlice = createSlice({
  name: 'harpokratesUser',
  initialState,
  reducers: {
    changeEmail: (state, action) => {
      state.email = action.payload
    },
    reset: (state, action) => {
      return initialState
    },
  },
})

export const {
  changeEmail,
  reset
} = harpokratesUserSlice.actions

export const selectEmail = (state) => state.harpokratesUser.email

export default harpokratesUserSlice.reducer
