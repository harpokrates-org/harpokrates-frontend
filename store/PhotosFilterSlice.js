import { modelNames } from '@/app/libs/modelIndex'
import { createSlice } from '@reduxjs/toolkit'

const today = new Date()
const initialState = {
  minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6).toISOString(),
  maxDate: today.toISOString(),
  modelName: modelNames.NO_MODEL
}

export const photosFilterSlice = createSlice({
  name: 'photosFilter',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      return {
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

export const selectFilters = (state) => state.photosFilter

export default photosFilterSlice.reducer
