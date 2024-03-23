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
      state.name = action.payload
    }
  },
})

export const {
  changeEmail,
} = harpokratesUserSlice.actions

export const selectEmail = (state) => state.harpokratesUser.email

export default harpokratesUserSlice.reducer
