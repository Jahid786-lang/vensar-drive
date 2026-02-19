import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from './authSlice'
import { servicesSlice } from './servicesSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    services: servicesSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
