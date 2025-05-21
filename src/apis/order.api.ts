import axios from '@/config/axios'
import {
  BackendResponse,
  Checkout,
  Order,
  OrderAddress,
  OrderCheckout,
  OrderProduct,
  OrderStatisticResponse,
  Paginate
} from '@/types'
import { OrderState } from '@/utils/constant'
export const checkOutApi = (data: Checkout) => {
  return axios.post<void, BackendResponse<{ checkout: OrderCheckout; items: OrderProduct[] }>>('/order/checkout', data)
}
export const getOrderByUserIdApi = (status?: string) => {
  return axios.get<void, BackendResponse<Order[]>>(`/order/get-order`, {
    params: status !== 'all' ? { status } : undefined
  })
}
export const getOrderByIdApi = (id: string) => {
  return axios.get<void, BackendResponse<Order>>(`/order/get-by-id/${id}`)
}
export const createOrderApi = (data: {
  address: OrderAddress
  orderPayment: string
  feeShip: number
  checkout: Checkout
}) => {
  return axios.post<void, BackendResponse<{ id: string }>>(`/order/add`, data)
}
export const getOrderFilterApi = (params: Record<string, string>) => {
  return axios.get<void, BackendResponse<Paginate<Order>>>(`/order/paginate`, {
    params
  })
}

export const confirmOrderApi = (id: string) => {
  return axios.post<void, BackendResponse<Order>>(`/order/update-status`, {
    orderId: id
  })
}
export const cancelOrderApi = (id: string) => {
  return axios.post<void, BackendResponse<Order>>(`/order/cancel-order`, {
    orderId: id
  })
}
export const getOrderStatisticApi = (year: number) => {
  return axios.get<void, BackendResponse<OrderStatisticResponse[]>>(`/order/order-statistic?year=${year}`)
}
export const dashBoardApi = () => {
  return axios.get<void, BackendResponse<{ status: OrderState; count: number }[]>>(`/order/dashboard`)
}
export const createPaymentApi = (data: {
  amount: number
  orderId: string
  description: string
  createdDate: string // ISO date string
}) => {
  return axios.post<void, BackendResponse<{ url: string }>>(`/order/create-payment`, data)
}
