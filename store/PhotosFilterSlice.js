import { modelNames } from '@/app/libs/modelIndex'
import { createSlice } from '@reduxjs/toolkit'

const today = new Date()
const initialState = {
  minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6).toISOString(),
  maxDate: today.toISOString(),
  modelName: modelNames.NO_MODEL,
  shouldUpdatePhotos: true
}

export const photosFilterSlice = createSlice({
  name: 'photosFilter',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      const modifiedState = {
        minDate: action.payload.minDate,
        maxDate: action.payload.maxDate,
        modelName: action.payload.modelName,
      }
      if (action.payload.minDate != state.minDate || action.payload.maxDate != state.maxDate) {
        modifiedState.shouldUpdatePhotos = true
      }
      return modifiedState
    },
    photosUpdated(state) {
      state.shouldUpdatePhotos = false
    }
  },
})

export const {
  setFilters,
  photosUpdated,
} = photosFilterSlice.actions

export const selectFilters = (state) => state.photosFilter

export default photosFilterSlice.reducer
