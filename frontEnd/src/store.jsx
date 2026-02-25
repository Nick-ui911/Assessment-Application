import { configureStore } from '@reduxjs/toolkit'
import userReducer from './ReduxSlices/userSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
})