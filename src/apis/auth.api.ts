import axios from '@/config/axios'
import { BackendResponse, LoginResponse, UserResponse } from '@/types'
export const LoginApi = (data: { email: string; password: string }) => {
  return axios.post<void, BackendResponse<LoginResponse>>('/auth/login', data)
}
export const RegisterApi = (data: { fullName: string; password: string; email: string; confirmPassword: string }) => {
  return axios.post<void, BackendResponse<unknown>>('/auth/register', data)
}
export const LogoutApi = () => {
  return axios.post<void, void>('/auth/logout')
}
export const GetUser = () => {
  return axios.get<void, BackendResponse<UserResponse>>('/auth/get/user')
}
export const RefreshToken = () => {
  return axios.post('/auth/refreshToken')
}
export const sendOtpApi = (data: { email: string }) => {
  return axios.post<void, BackendResponse<unknown>>('/auth/send-otp', data)
}
export const verifyOtpApi = (data: { email: string; otp: string }) => {
  return axios.post<void, BackendResponse<unknown>>('/auth/send-otp', data)
}
export const resetPasswordApi = (data: { email: string; password: string }) => {
  return axios.post<void, BackendResponse<unknown>>('/auth/reset-password', data)
}
