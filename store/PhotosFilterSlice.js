import { createSlice } from '@reduxjs/toolkit'

const today = new Date()
const initialState = {
  minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6).toISOString(),
  maxDate: today.toISOString(),
  modelName: ''
}

export const photosFilterSlice = createSlice({
  name: 'photosFilter',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      return {
        ...initialState,
        minDate: action.payload.minDate,
        maxDate: action.payload.maxDate,
        modelName: action.payload.modelName
      }
    },
  },
})

export const {
  setFilters,
} = photosFilterSlice.actions

export const selectMinDate = (state) => state.photosFilter.minDate
export const selectMaxDate = (state) => state.photosFilter.maxDate

export default photosFilterSlice.reducer
