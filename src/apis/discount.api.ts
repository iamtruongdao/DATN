import axios from '@/config/axios'
import { BackendResponse, Discount, ItemCheckout, Paginate } from '@/types'

export const getDiscountFilter = (params: Record<string, string>) => {
  return axios.get<void, BackendResponse<Paginate<Discount>>>(`discount/get-all`, { params })
}
export const getDiscountAmount = (data: { codeId: string; userId: string; items: ItemCheckout[] }) => {
  return axios.post<void, BackendResponse<{ amount: number; totalPrice: number; finalPrice: number }>>(
    `discount/get-amount`,
    data
  )
}
export const createDiscount = (discount: Discount) => {
  return axios.post<void, BackendResponse<Discount>>(`discount/create`, discount)
}
export const updateDiscount = (discount: Discount) => {
  return axios.put<void, BackendResponse<Discount>>(`discount/update-discount`, discount)
}
export const deleteDiscount = (id: string) => {
  return axios.delete<void, BackendResponse<Discount>>(`discount/delete/${id}`)
}
