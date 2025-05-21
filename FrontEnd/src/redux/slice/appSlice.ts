import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AppState {
  isGlobalLoading: boolean
}
const initialState: AppState = {
  isGlobalLoading: false
}
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isGlobalLoading = action.payload
    }
  }
})
export const { setLoading } = appSlice.actions
export default appSlice.reducer
