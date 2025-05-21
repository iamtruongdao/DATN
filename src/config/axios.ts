import { BackendResponse } from '@/types/BackendResponse'
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'
import { RefreshToken } from '../apis/auth.api'
import { Store } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from '@/redux'
import { logoutAction } from '@/redux/slice/userSlice'
let store: Store<RootState> | null = null

export const injectStore = (_store: Store<RootState>) => {
  store = _store
}
const apiUrl = import.meta.env.VITE_API_URL
const instance: AxiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  timeout: 1000 * 60 * 10
})
instance.interceptors.request.use(
  function (config) {
    const token = Cookies.get('act')
    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    }
    // Do something before request is sent
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)
let refreshTokenPromise: Promise<AxiosResponse> | null = null
// Add a response interceptor
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    return response?.data
  },
  async (error: AxiosError<BackendResponse<unknown>>) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response?.status === 400 || error.response?.status === 404) {
      toast.error(error.response?.data?.message)
      return Promise.reject(error)
    }
    if (error.response?.status === 401) {
      await (store?.dispatch as AppDispatch)(logoutAction('1'))
      window.location.href = '/login'
      return Promise.reject(error)
    }
    const originalRequest = error.config as AxiosRequestConfig
    if (error.response?.status === 410 && originalRequest) {
      if (!refreshTokenPromise) {
        refreshTokenPromise = RefreshToken()
          .catch(async (error) => {
            await (store?.dispatch as AppDispatch)(logoutAction('1'))
            window.location.href = '/login'
            return Promise.reject(error)
          })
          .finally(() => {
            refreshTokenPromise = null
          })
      }
      return refreshTokenPromise.then(() => {
        return instance(originalRequest)
      })
    }

    return Promise.reject(error)
  }
)
export default instance
