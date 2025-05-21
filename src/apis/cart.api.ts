import axios from '@/config/axios'
import { BackendResponse, Cart } from '@/types'
export const getCartApi = (userId: string) => {
  return axios.get<void, BackendResponse<Cart>>(`cart/user?user_id=${userId}`)
}
export const updateQuantityApi = (data: {
  productId: string
  oldQuantity: number
  quantity: number
  userId: string
}) => {
  return axios.post<void, BackendResponse<Cart>>(`cart/update-quantity`, data)
}
export const deleteCartApi = (data: { productId: string; userId: string }) => {
  return axios.delete<void, BackendResponse<Cart>>(`cart/delete`, { data })
}
export const addToCartApi = (data: { userId: string; cartItem: { productId: string; quantity: number } }) => {
  return axios.post<void, BackendResponse<Cart>>(`cart/add`, data)
}
