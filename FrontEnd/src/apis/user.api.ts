import axios from '@/config/axios'
import { BackendResponse, Paginate, UserResponse } from '@/types'

export const updateInfoApi = (data: { email: string; phoneNumber: string; fullName: string; address: string }) => {
  return axios.post<void, BackendResponse<unknown>>('/auth/update-info', data)
}
export const getAllUserApi = (params: Record<string, string>) => {
  return axios.get<void, BackendResponse<Paginate<UserResponse>>>(`/auth/get/all-user`, { params })
}
export const lockAccountAPi = (data: { isLock: boolean; userId: string }) => {
  return axios.post<void, BackendResponse<UserResponse>>(`/auth/lock`, data)
}
