import { GetUser, LoginApi, LogoutApi } from '@/apis/auth.api'
import { UserResponse } from '@/types'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
export const loginAction = createAsyncThunk('user/login', async (data: { email: string; password: string }) => {
  return await LoginApi(data)
})
export const logoutAction = createAsyncThunk('user/logout', async () => {
  await LogoutApi()
})
export const getUserAction = createAsyncThunk('user/get-user', async () => {
  return (await GetUser()).data
})
interface UserState {
  userInfo: UserResponse
  isLogin: boolean
}
const initialState: UserState = {
  userInfo: { address: '', email: '', fullName: '', isLocked: false, phoneNumber: '', roles: [], id: '' },
  isLogin: false
}
const userSlide = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(loginAction.pending, (state) => {
      state.isLogin = false
    })
    builder.addCase(loginAction.fulfilled, (state, action) => {
      state.isLogin = true
      state.userInfo = action.payload.data.userAccount
    })
    builder.addCase(loginAction.rejected, (state) => {
      state.isLogin = false
    })
    builder.addCase(logoutAction.fulfilled, (state) => {
      state.isLogin = false
      state.userInfo = { address: '', email: '', fullName: '', isLocked: false, phoneNumber: '', roles: [], id: '' }
    })
    builder.addCase(getUserAction.fulfilled, (state, { payload }) => {
      state.isLogin = true
      state.userInfo = payload
    })
    builder.addCase(getUserAction.rejected, (state) => {
      state.userInfo = { address: '', email: '', fullName: '', isLocked: false, phoneNumber: '', roles: [], id: '' }
    })
  }
})
export default userSlide.reducer
