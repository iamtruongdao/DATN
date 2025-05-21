'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
import { Package, Clock, CreditCard } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { Order } from '@/types'
import { OrderState, PaymentStatus, statusMap } from '@/utils/constant'
import { formatDate, formatMoney } from '@/utils'
import { getOrderByUserIdApi } from '@/apis/order.api'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const OrderHistory: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<string>('all')
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const productName = 'Áo Thun Cao Cấp'

  const fetchOrder = async () => {
    const res = await getOrderByUserIdApi()
    if (res.code === 0) {
      setOrders(res.data)
      setFilteredOrders(res.data)
    }
  }

  useEffect(() => {
    fetchOrder()
  }, [])

  useEffect(() => {
    if (selectedTab === 'all') {
      setFilteredOrders(orders)
    } else if (selectedTab === 'waiting_payment') {
      // Filter orders that are waiting for payment
      setFilteredOrders(orders.filter((order) => order.paymentStatus === PaymentStatus.WaitingPaid))
    } else {
      // Filter by order status
      setFilteredOrders(orders.filter((order) => order.orderStatus === selectedTab))
    }
  }, [selectedTab, orders])

  // Helper function to determine if an order needs payment
  const needsPayment = (order: Order) => {
    return order.paymentStatus === PaymentStatus.WaitingPaid
  }

  // Helper function to get payment status badge color
  const getPaymentStatusBadge = (status?: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.Paid:
        return 'bg-green-50 text-green-600'
      case PaymentStatus.WaitingPaid:
        return 'bg-yellow-50 text-yellow-600'
      case PaymentStatus.Refund:
        return 'bg-blue-50 text-blue-600'
      case PaymentStatus.Failed:
        return 'bg-red-50 text-red-600'
      default:
        return 'bg-gray-50 text-gray-600'
    }
  }

  // Helper function to get payment status text
  const getPaymentStatusText = (status?: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.Paid:
        return 'Đã thanh toán'
      case PaymentStatus.WaitingPaid:
        return 'Chờ thanh toán'
      case PaymentStatus.Refund:
        return 'Đã hoàn tiền'
      case PaymentStatus.Failed:
        return 'Thanh toán thất bại'
      default:
        return 'Chờ thanh toán'
    }
  }

  return (
    <main className='bg-gray-50 min-h-screen'>
      <section className='container mx-auto px-4 py-6'>
        <div className='flex justify-between items-center mb-6'>
          <Tabs defaultValue='all' className='flex-1' onValueChange={setSelectedTab}>
            <div className='flex justify-between items-center'>
              <TabsList
                className='bg-white rounded-lg shadow-sm grid grid-cols-6 h-auto w-auto'
                aria-label='Trạng thái đơn hàng'
              >
                <TabsTrigger
                  value='all'
                  className='px-2 text-sm rounded-l-lg data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 data-[state=active]:font-medium'
                  aria-label='Hiển thị tất cả đơn hàng'
                >
                  Tất cả
                </TabsTrigger>
                <TabsTrigger
                  value='waiting_payment'
                  className='px-2 text-sm data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 data-[state=active]:font-medium'
                  aria-label='Hiển thị đơn hàng chờ thanh toán'
                >
                  Chờ thanh toán
                </TabsTrigger>
                <TabsTrigger
                  value={OrderState.Pending}
                  className='px-2 text-sm data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 data-[state=active]:font-medium'
                  aria-label='Hiển thị đơn hàng chờ xác nhận'
                >
                  Chờ xác nhận
                </TabsTrigger>
                <TabsTrigger
                  value={OrderState.WaitingPickup}
                  className='px-2 text-sm data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 data-[state=active]:font-medium'
                  aria-label='Hiển thị đơn hàng chờ lấy hàng'
                >
                  Chờ lấy hàng
                </TabsTrigger>
                <TabsTrigger
                  value={OrderState.Shipping}
                  className='px-2 text-sm data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 data-[state=active]:font-medium'
                  aria-label='Hiển thị đơn hàng đang giao'
                >
                  Đang giao
                </TabsTrigger>
                <TabsTrigger
                  value={OrderState.Delivered}
                  className='px-2 text-sm rounded-r-lg data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 data-[state=active]:font-medium'
                  aria-label='Hiển thị đơn hàng đã giao'
                >
                  Đã giao
                </TabsTrigger>
              </TabsList>
              <h1 className='text-xl font-bold text-gray-800 ml-4'>Đơn hàng của tôi</h1>
            </div>

            {/* Order list with AnimatePresence for smooth transitions */}
            <div className='relative min-h-[200px]'>
              <AnimatePresence mode='wait'>
                <motion.div
                  key={selectedTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className='mt-6 space-y-6 w-full'
                >
                  {filteredOrders.length > 0 ? (
                    <>
                      {filteredOrders.map((order) => (
                        <article key={order.id} className='order-item'>
                          <Card className='border-none gap-0 py-0 shadow-sm overflow-hidden'>
                            <CardHeader className='bg-white p-5 pb-3'>
                              <div className='flex justify-between items-center'>
                                <div className='flex items-center'>
                                  <h2 className='text-gray-800 font-medium'>Mã đơn hàng: {order.orderCode}</h2>
                                </div>
                                <div className='flex items-center gap-2'>
                                  {/* Payment status badge */}
                                  {order.paymentStatus && (
                                    <Badge
                                      className={`${getPaymentStatusBadge(order.paymentStatus)} font-normal px-3 py-1 rounded-full`}
                                    >
                                      {getPaymentStatusText(order.paymentStatus)}
                                    </Badge>
                                  )}
                                  {/* Order status badge */}
                                  <Badge
                                    className={`${statusMap[order.orderStatus].color} font-normal px-3 py-1 rounded-full`}
                                  >
                                    {statusMap[order.orderStatus].text}
                                  </Badge>
                                </div>
                              </div>
                            </CardHeader>
                            <Separator className='bg-gray-100' />
                            <CardContent className='bg-white p-5'>
                              <div className='mb-3'>
                                <h3 className='font-medium text-gray-800'>{productName}</h3>
                              </div>

                              {order.orderItem.map((variation, index) => (
                                <div key={index} className='flex py-3 border-b border-gray-100 last:border-b-0'>
                                  <div className='h-20 w-20 flex-shrink-0'>
                                    <img
                                      src={variation.item.avatar || '/api/placeholder/80/80'}
                                      alt={`Sản phẩm ${variation.item.productName}`}
                                      className='h-full w-full object-cover rounded-lg'
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement
                                        target.src = '/api/placeholder/80/80'
                                        target.alt = variation.item.productName
                                      }}
                                    />
                                  </div>
                                  <div className='ml-4 flex-1'>
                                    <p className='text-gray-800 font-medium mb-2'>{variation.item.productName}</p>
                                    <div className='flex justify-between items-center'>
                                      <span className='text-orange-600 font-medium'>
                                        {formatMoney(variation.item.price - variation.item.discount)}
                                      </span>
                                      <span className='text-gray-600 bg-gray-50 px-3 py-1 rounded-full text-sm'>
                                        x{variation.item.quantity}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}

                              <div className='mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg'>
                                <address className='flex items-start not-italic'>
                                  <span className='font-medium text-gray-700 mr-2'>Địa chỉ:</span>
                                  <span>{order.orderAddress.address}</span>
                                </address>
                              </div>
                            </CardContent>
                            <Separator className='bg-gray-100' />
                            <CardFooter className='bg-white p-5'>
                              <div className='flex items-center text-gray-600'>
                                <Clock className='h-4 w-4 mr-2' aria-hidden='true' />
                                <time
                                  dateTime={order.createdAt.toString().split('/').reverse().join('-')}
                                  className='text-sm'
                                >
                                  {formatDate(order.createdAt.toString())}
                                </time>
                              </div>
                              <div className='flex-1 ml-4'>
                                <div className='flex justify-end text-sm text-gray-600'>
                                  <div className='flex flex-col items-end'>
                                    <div className='flex items-center justify-between w-56'>
                                      <span>Tạm tính:</span>
                                      <span>{formatMoney(order.orderCheckout.totalApplyDiscount)}</span>
                                    </div>
                                    {/* <div className='flex items-center justify-between w-56 mt-1'>
                                      <span>Giảm giá:</span>
                                      <span>-{formatMoney(order.orderCheckout.totalApplyDiscount)}</span>
                                    </div> */}
                                    <div className='flex items-center justify-between w-56 mt-1'>
                                      <span>Phí vận chuyển:</span>
                                      <span>{formatMoney(order.orderCheckout.feeShip || 0)}</span>
                                    </div>
                                    <div className='flex items-center justify-between w-56 mt-2 pt-2 border-t border-gray-100'>
                                      <span className='font-medium'>Tổng cộng:</span>
                                      <span className='font-medium text-orange-600'>
                                        {formatMoney(
                                          order.orderCheckout.totalApplyDiscount + (order.orderCheckout.feeShip || 0)
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardFooter>
                            <Separator className='bg-gray-100' />
                            <div className='bg-white p-5 flex justify-end space-x-3'>
                              <Link to={`/order/${order.id}`}>
                                <Button
                                  variant='outline'
                                  size='sm'
                                  className='rounded-full px-4 border-gray-200 text-gray-700'
                                >
                                  Chi tiết
                                </Button>
                              </Link>

                              {/* Payment button for unpaid orders */}
                              {needsPayment(order) && (
                                <Link to={order.linkPayment}>
                                  <Button
                                    size='sm'
                                    className='bg-orange-500 hover:bg-orange-600 rounded-full px-4 flex items-center'
                                  >
                                    <CreditCard className='h-4 w-4 mr-2' />
                                    Thanh toán
                                  </Button>
                                </Link>
                              )}

                              {order.orderStatus === OrderState.Delivered && (
                                <Button
                                  variant='outline'
                                  size='sm'
                                  className='rounded-full px-4 border-gray-200 text-gray-700'
                                >
                                  Mua lại
                                </Button>
                              )}
                              {order.orderStatus === OrderState.Delivered && (
                                <Button size='sm' className='bg-orange-500 hover:bg-orange-600 rounded-full px-4'>
                                  Đánh giá
                                </Button>
                              )}
                              {order.orderStatus === OrderState.Pending &&
                                order.paymentStatus === PaymentStatus.WaitingPaid && (
                                  <Button size='sm' variant='destructive' className='rounded-full bg-black px-4'>
                                    Hủy đơn
                                  </Button>
                                )}
                            </div>
                          </Card>
                        </article>
                      ))}
                    </>
                  ) : (
                    <div className='no-orders'>
                      <Card className='border-none shadow-sm overflow-hidden'>
                        <CardContent className='p-8 text-center'>
                          <Package className='mx-auto h-16 w-16 text-gray-300' aria-hidden='true' />
                          <h2 className='mt-5 text-lg font-medium text-gray-800'>Chưa có đơn hàng nào</h2>
                          <p className='mt-2 text-gray-500 max-w-md mx-auto'>Bạn chưa có đơn hàng nào trong mục này</p>
                          <Button className='mt-6 bg-orange-500 hover:bg-orange-600 rounded-full px-6 py-2 shadow-md'>
                            Tiếp tục mua sắm
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </Tabs>
        </div>
      </section>
    </main>
  )
}

export default OrderHistory
