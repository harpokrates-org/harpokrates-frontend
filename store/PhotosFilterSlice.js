import { modelNames } from '@/app/libs/modelIndex'
import { createSlice } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'

const today = new Date()
const initialState = {
  minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6).toISOString(),
  maxDate: today.toISOString(),
  modelName: modelNames.NO_MODEL,
  modelThreshold: 1,
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
        modelThreshold: action.payload.modelThreshold,
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
