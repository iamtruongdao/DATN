import { OrderState, PAYMENT, PaymentStatus } from '@/utils/constant'

export interface OrderAddress {
  address: string
  street: string
  district: string
  city: string
  fullName: string
  phoneNumber: string
}

export interface OrderItem {
  productId: string
  productName: string
  avatar: string
  price: number
  discount: number
  quantity: number
}

export interface OrderProduct {
  totalPrice: number
  totalApplyDiscount: number
  item: OrderItem
}

export interface OrderCheckout {
  totalPrice: number
  totalApplyDiscount: number
  feeShip: number
  voucherDiscount: number
}

export interface Order {
  id: string
  userId: string
  orderCheckout: OrderCheckout
  orderAddress: OrderAddress
  orderItem: OrderProduct[]
  orderStatus: OrderState
  orderPayment: PAYMENT
  paymentStatus?: PaymentStatus
  orderCode: string
  trackingNumber?: string
  linkPayment: string
  createdAt: Date
  deleveredAt: Date
}
export interface ItemCheckout {
  productId: string
  discount: number
  price: number
  quantity: number
}
export interface Checkout {
  cartId: string
  userId: string
  vouchers: string[]
  items: ItemCheckout[]
}
export interface OrderStatisticResponse {
  year: number
  month: number
  totalOrders: number
  totalRevenue: number
}
